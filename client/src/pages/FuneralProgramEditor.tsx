import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FuneralProgram, ProgramItem, Memorial } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, GripVertical, Eye, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ITEM_TYPES = [
  { value: "hymn", label: "Hymn/Song" },
  { value: "reading", label: "Scripture Reading" },
  { value: "prayer", label: "Prayer" },
  { value: "eulogy", label: "Eulogy/Tribute" },
  { value: "music", label: "Musical Selection" },
  { value: "poem", label: "Poem" },
  { value: "tribute", label: "Video Tribute" },
  { value: "other", label: "Other" },
];

// Validation helpers
function validateTimeFormat(time: string | undefined): boolean {
  if (!time) return true; // Optional field
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

function hasDuplicateItems(items: Array<Partial<ProgramItem>>): boolean {
  const titles = items.filter(item => item.title?.trim()).map(item => item.title?.trim().toLowerCase());
  return titles.length !== new Set(titles).size;
}

function validateProgramData(program: Partial<FuneralProgram>, items: Array<Partial<ProgramItem>>): string | null {
  // Validate service time format
  if (program.serviceTime && !validateTimeFormat(program.serviceTime)) {
    return "Service time must be in HH:MM format (e.g., 14:00)";
  }
  
  // Validate service date (should not be in distant past)
  if (program.serviceDate) {
    const serviceDate = new Date(program.serviceDate);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    if (serviceDate < oneYearAgo) {
      return "Service date seems unusually far in the past. Please verify.";
    }
  }
  
  // Check for duplicate items
  if (hasDuplicateItems(items)) {
    return "You have duplicate items with the same title. Please make titles unique.";
  }
  
  return null; // All validations passed
}

export default function FuneralProgramEditor() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [programData, setProgramData] = useState<Partial<FuneralProgram>>({});
  const [items, setItems] = useState<Array<Partial<ProgramItem>>>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch memorial
  const { data: memorial } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${id}`],
    enabled: !!id,
  });

  // Fetch existing program
  const { data: existingProgram, isLoading } = useQuery<FuneralProgram>({
    queryKey: [`/api/memorials/${id}/funeral-program`],
    enabled: !!id,
    retry: false,
  });

  // Fetch program items
  const { data: existingItems } = useQuery<ProgramItem[]>({
    queryKey: [`/api/funeral-programs/${existingProgram?.id}/items`],
    enabled: !!existingProgram?.id,
  });

  // Initialize program data when loaded
  useEffect(() => {
    if (existingProgram) {
      setProgramData(existingProgram);
    }
  }, [existingProgram]);

  // Initialize items when loaded
  useEffect(() => {
    if (existingItems) {
      setItems(existingItems);
    }
  }, [existingItems]);

  // Create/Update program mutation
  const saveProgramMutation = useMutation({
    mutationFn: async (data: Partial<FuneralProgram>) => {
      const response = existingProgram
        ? await apiRequest("PATCH", `/api/memorials/${id}/funeral-program`, data)
        : await apiRequest("POST", `/api/memorials/${id}/funeral-program`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${id}/funeral-program`] });
      toast({ title: "Success", description: "Funeral program saved successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save funeral program", 
        variant: "destructive" 
      });
    },
  });

  // Save program items mutation
  const saveItemsMutation = useMutation({
    mutationFn: async (programId: string) => {
      // Delete existing items (simplest approach)
      if (existingItems) {
        await Promise.all(existingItems.map(item => 
          apiRequest("DELETE", `/api/program-items/${item.id}`, {})
        ));
      }
      
      // Create new items - strip generated fields before POSTing
      const promises = items.map((item, index) => {
        // Only include fields that belong in the insert schema
        const cleanItem = {
          programId,
          itemType: item.itemType,
          title: item.title,
          performedBy: item.performedBy || null,
          duration: item.duration || null,
          content: item.content || null,
          description: item.description || null,
          orderIndex: index,
        };
        return apiRequest("POST", `/api/funeral-programs/${programId}/items`, cleanItem);
      });
      return await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/funeral-programs/${existingProgram?.id}/items`] });
      toast({ title: "Success", description: "Order of service saved successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to save order of service", 
        variant: "destructive" 
      });
    },
  });

  const handleSave = async () => {
    // Validate before saving
    const error = validateProgramData(programData, items);
    if (error) {
      setValidationError(error);
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    setValidationError(null);
    
    // Save program first
    const program = await saveProgramMutation.mutateAsync(programData);
    
    // Then save items if there are any
    if (items.length > 0 && program.id) {
      await saveItemsMutation.mutateAsync(program.id);
    }
  };

  const addItem = () => {
    setItems([...items, { itemType: "hymn", title: "", orderIndex: items.length }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<ProgramItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      setItems(newItems);
    } else if (direction === "down" && index < items.length - 1) {
      const newItems = [...items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      setItems(newItems);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">Loading program editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/memorials/${id}/manage`)}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground" data-testid="text-page-title">
                  Edit Funeral Program
                </h1>
                <p className="text-sm text-muted-foreground">{memorial?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/memorial/${id}/program`)}
                data-testid="button-preview"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSave}
                disabled={saveProgramMutation.isPending || saveItemsMutation.isPending}
                data-testid="button-save"
              >
                <Save className="w-4 h-4 mr-2" />
                {saveProgramMutation.isPending || saveItemsMutation.isPending ? "Saving..." : "Save Program"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid gap-6">
          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive" data-testid="alert-validation-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>When and where will the service be held?</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Service Type</Label>
                  <Input
                    id="service-name"
                    placeholder="Celebration of Life"
                    value={programData.serviceName || ""}
                    onChange={(e) => setProgramData({ ...programData, serviceName: e.target.value })}
                    data-testid="input-service-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-date">Date</Label>
                  <Input
                    id="service-date"
                    type="date"
                    value={programData.serviceDate || ""}
                    onChange={(e) => setProgramData({ ...programData, serviceDate: e.target.value })}
                    data-testid="input-service-date"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service-time">Time</Label>
                  <Input
                    id="service-time"
                    type="time"
                    value={programData.serviceTime || ""}
                    onChange={(e) => setProgramData({ ...programData, serviceTime: e.target.value })}
                    data-testid="input-service-time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-location">Location Name</Label>
                  <Input
                    id="service-location"
                    placeholder="First Baptist Church"
                    value={programData.serviceLocation || ""}
                    onChange={(e) => setProgramData({ ...programData, serviceLocation: e.target.value })}
                    data-testid="input-service-location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-address">Address</Label>
                <Input
                  id="service-address"
                  placeholder="123 Main Street, City, State 12345"
                  value={programData.serviceAddress || ""}
                  onChange={(e) => setProgramData({ ...programData, serviceAddress: e.target.value })}
                  data-testid="input-service-address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Welcome & Closing Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Opening and closing words for the program</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  placeholder="Thank you for joining us as we celebrate the life of..."
                  value={programData.welcomeMessage || ""}
                  onChange={(e) => setProgramData({ ...programData, welcomeMessage: e.target.value })}
                  rows={3}
                  data-testid="input-welcome-message"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing-message">Closing Message</Label>
                <Textarea
                  id="closing-message"
                  placeholder="The family would like to thank everyone for their love and support..."
                  value={programData.closingMessage || ""}
                  onChange={(e) => setProgramData({ ...programData, closingMessage: e.target.value })}
                  rows={3}
                  data-testid="input-closing-message"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order of Service */}
          <Card>
            <CardHeader>
              <CardTitle>Order of Service</CardTitle>
              <CardDescription>Plan the flow of the memorial service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(index, "up")}
                          disabled={index === 0}
                          data-testid={`button-move-up-${index}`}
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveItem(index, "down")}
                          disabled={index === items.length - 1}
                          data-testid={`button-move-down-${index}`}
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={item.itemType || "hymn"}
                            onValueChange={(value) => updateItem(index, { itemType: value })}
                          >
                            <SelectTrigger data-testid={`select-item-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ITEM_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            placeholder="Amazing Grace"
                            value={item.title || ""}
                            onChange={(e) => updateItem(index, { title: e.target.value })}
                            data-testid={`input-item-title-${index}`}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        data-testid={`button-remove-item-${index}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Performed By</Label>
                        <Input
                          placeholder="Church Choir"
                          value={item.performedBy || ""}
                          onChange={(e) => updateItem(index, { performedBy: e.target.value })}
                          data-testid={`input-performed-by-${index}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Duration</Label>
                        <Input
                          placeholder="5 minutes"
                          value={item.duration || ""}
                          onChange={(e) => updateItem(index, { duration: e.target.value })}
                          data-testid={`input-duration-${index}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description/Content</Label>
                      <Textarea
                        placeholder="Add lyrics, scripture text, or additional details..."
                        value={item.content || ""}
                        onChange={(e) => updateItem(index, { content: e.target.value })}
                        rows={2}
                        data-testid={`input-item-content-${index}`}
                      />
                    </div>
                  </div>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addItem}
                className="w-full"
                data-testid="button-add-item"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service Item
              </Button>
            </CardContent>
          </Card>

          {/* Family Information */}
          <Card>
            <CardHeader>
              <CardTitle>Family Information</CardTitle>
              <CardDescription>List family members and pallbearers</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="survived-by">Survived By</Label>
                <Textarea
                  id="survived-by"
                  placeholder="Spouse: Jane Doe&#10;Children: John Doe Jr., Sarah Smith&#10;Grandchildren: 5"
                  value={programData.survivedBy || ""}
                  onChange={(e) => setProgramData({ ...programData, survivedBy: e.target.value })}
                  rows={4}
                  data-testid="input-survived-by"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="predeceased">Predeceased By</Label>
                <Textarea
                  id="predeceased"
                  placeholder="Parents: Robert and Mary Doe"
                  value={programData.predeceased || ""}
                  onChange={(e) => setProgramData({ ...programData, predeceased: e.target.value })}
                  rows={2}
                  data-testid="input-predeceased"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pallbearers">Pallbearers</Label>
                  <Textarea
                    id="pallbearers"
                    placeholder="John Smith&#10;Michael Johnson&#10;David Williams"
                    value={programData.pallbearers || ""}
                    onChange={(e) => setProgramData({ ...programData, pallbearers: e.target.value })}
                    rows={3}
                    data-testid="input-pallbearers"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="honorary-pallbearers">Honorary Pallbearers</Label>
                  <Textarea
                    id="honorary-pallbearers"
                    placeholder="Robert Brown&#10;Thomas Davis"
                    value={programData.honoraryPallbearers || ""}
                    onChange={(e) => setProgramData({ ...programData, honoraryPallbearers: e.target.value })}
                    rows={3}
                    data-testid="input-honorary-pallbearers"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reception/Repast */}
          <Card>
            <CardHeader>
              <CardTitle>Reception Information</CardTitle>
              <CardDescription>Details about the gathering after the service</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="repast-location">Location Name</Label>
                <Input
                  id="repast-location"
                  placeholder="Church Fellowship Hall"
                  value={programData.repastLocation || ""}
                  onChange={(e) => setProgramData({ ...programData, repastLocation: e.target.value })}
                  data-testid="input-repast-location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repast-address">Address</Label>
                <Input
                  id="repast-address"
                  placeholder="123 Main Street, City, State 12345"
                  value={programData.repastAddress || ""}
                  onChange={(e) => setProgramData({ ...programData, repastAddress: e.target.value })}
                  data-testid="input-repast-address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Acknowledgments */}
          <Card>
            <CardHeader>
              <CardTitle>Acknowledgments</CardTitle>
              <CardDescription>Thank everyone who helped during this time</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="acknowledgments">General Acknowledgments</Label>
                <Textarea
                  id="acknowledgments"
                  placeholder="The family wishes to express their sincere gratitude..."
                  value={programData.acknowledgments || ""}
                  onChange={(e) => setProgramData({ ...programData, acknowledgments: e.target.value })}
                  rows={4}
                  data-testid="input-acknowledgments"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-thanks">Special Thanks</Label>
                <Textarea
                  id="special-thanks"
                  placeholder="Special thanks to Dr. Smith and the nursing staff..."
                  value={programData.specialThanks || ""}
                  onChange={(e) => setProgramData({ ...programData, specialThanks: e.target.value })}
                  rows={3}
                  data-testid="input-special-thanks"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
