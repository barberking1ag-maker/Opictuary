import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Music, Mic, FileText, Download, Bluetooth, Upload, Trash2, MoveUp, MoveDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FuneralProgram {
  id: string;
  memorialId: string;
  title: string;
  ceremonyDate: string;
  location: string;
  coverImageUrl?: string;
  backgroundAudioUrl?: string;
  enableBluetoothAudio: boolean;
  bluetoothDeviceName?: string;
  createdAt: string;
}

interface ProgramItem {
  id: string;
  programId: string;
  orderIndex: number;
  itemType: string;
  title: string;
  description?: string;
  speaker?: string;
  duration?: number;
  audioUrl?: string;
  audioType?: string;
}

const programSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ceremonyDate: z.string().min(1, "Ceremony date is required"),
  location: z.string().min(1, "Location is required"),
  coverImageUrl: z.string().optional(),
  backgroundAudioUrl: z.string().optional(),
  enableBluetoothAudio: z.boolean().default(false),
  bluetoothDeviceName: z.string().optional(),
});

const programItemSchema = z.object({
  itemType: z.string().min(1, "Item type is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  speaker: z.string().optional(),
  duration: z.number().optional(),
  audioUrl: z.string().optional(),
  audioType: z.string().optional(),
});

type ProgramFormData = z.infer<typeof programSchema>;
type ProgramItemFormData = z.infer<typeof programItemSchema>;

const itemTypes = [
  { value: "opening", label: "Opening Remarks", icon: Mic },
  { value: "prayer", label: "Prayer", icon: FileText },
  { value: "reading", label: "Scripture Reading", icon: FileText },
  { value: "eulogy", label: "Eulogy", icon: Mic },
  { value: "musical_tribute", label: "Musical Tribute", icon: Music },
  { value: "reflection", label: "Moment of Silence", icon: FileText },
  { value: "closing", label: "Closing Remarks", icon: Mic },
];

const audioTypes = [
  { value: "background_music", label: "Background Music" },
  { value: "reading", label: "Audio Reading" },
  { value: "eulogy", label: "Recorded Eulogy" },
  { value: "musical_tribute", label: "Musical Performance" },
  { value: "prayer", label: "Spoken Prayer" },
];

export default function FuneralProgramCreator() {
  const [, params] = useRoute("/memorial/:id/funeral-program");
  const memorialId = params?.id || "";
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<FuneralProgram | null>(null);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const { toast } = useToast();

  const { data: programs = [], isLoading } = useQuery<FuneralProgram[]>({
    queryKey: ["/api/memorials", memorialId, "funeral-programs"],
  });

  const { data: programItems = [] } = useQuery<ProgramItem[]>({
    queryKey: ["/api/funeral-programs", selectedProgram?.id, "items"],
    enabled: !!selectedProgram,
  });

  const programForm = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      title: "",
      ceremonyDate: "",
      location: "",
      coverImageUrl: "",
      backgroundAudioUrl: "",
      enableBluetoothAudio: false,
      bluetoothDeviceName: "",
    },
  });

  const itemForm = useForm<ProgramItemFormData>({
    resolver: zodResolver(programItemSchema),
    defaultValues: {
      itemType: "",
      title: "",
      description: "",
      speaker: "",
      audioUrl: "",
      audioType: "",
    },
  });

  const createProgramMutation = useMutation({
    mutationFn: async (data: ProgramFormData) => {
      const res = await apiRequest("POST", `/api/memorials/${memorialId}/funeral-programs`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "funeral-programs"] });
      setIsCreateOpen(false);
      programForm.reset();
      toast({
        title: "Program Created",
        description: "Funeral program has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create program. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: ProgramItemFormData) => {
      const res = await apiRequest("POST", `/api/funeral-programs/${selectedProgram?.id}/items`, {
        ...data,
        orderIndex: programItems.length,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/funeral-programs", selectedProgram?.id, "items"] });
      setIsAddItemOpen(false);
      itemForm.reset();
      toast({
        title: "Item Added",
        description: "Program item has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProgramSubmit = (data: ProgramFormData) => {
    createProgramMutation.mutate(data);
  };

  const handleItemSubmit = (data: ProgramItemFormData) => {
    addItemMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Funeral Program Creator</h1>
          <p className="text-muted-foreground">Create a beautiful ceremony program with audio support</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-program">
              <Plus className="w-4 h-4 mr-2" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Funeral Program</DialogTitle>
            </DialogHeader>
            <Form {...programForm}>
              <form onSubmit={programForm.handleSubmit(handleProgramSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic" data-testid="tab-basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="audio" data-testid="tab-audio">Audio Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <FormField
                      control={programForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Celebration of Life"
                              {...field}
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={programForm.control}
                      name="ceremonyDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ceremony Date & Time</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              data-testid="input-ceremony-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={programForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Church, Funeral Home, etc."
                              {...field}
                              data-testid="input-location"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={programForm.control}
                      name="coverImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://..."
                              {...field}
                              data-testid="input-cover-image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4 mt-4">
                    <FormField
                      control={programForm.control}
                      name="backgroundAudioUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Music URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://... (MP3, WAV)"
                              {...field}
                              data-testid="input-background-audio"
                            />
                          </FormControl>
                          <FormDescription>
                            Background music will play throughout the ceremony
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={programForm.control}
                      name="enableBluetoothAudio"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Bluetooth className="w-4 h-4" />
                              Enable Bluetooth Audio
                            </FormLabel>
                            <FormDescription>
                              Connect to wireless speakers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-bluetooth"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {programForm.watch("enableBluetoothAudio") && (
                      <FormField
                        control={programForm.control}
                        name="bluetoothDeviceName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bluetooth Device Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Church Speaker System"
                                {...field}
                                data-testid="input-bluetooth-device"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProgramMutation.isPending}
                    data-testid="button-submit-program"
                  >
                    {createProgramMutation.isPending ? "Creating..." : "Create Program"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading programs...</p>
        </div>
      ) : programs.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Programs Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create a funeral program to organize the ceremony
          </p>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-program">
            <Plus className="w-4 h-4 mr-2" />
            Create Program
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="hover-elevate active-elevate-2 cursor-pointer transition-all"
              onClick={() => setSelectedProgram(program)}
              data-testid={`card-program-${program.id}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {new Date(program.ceremonyDate).toLocaleDateString()} • {program.location}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {program.backgroundAudioUrl && (
                      <Badge variant="secondary" data-testid={`badge-audio-${program.id}`}>
                        <Music className="w-3 h-3 mr-1" />
                        Audio
                      </Badge>
                    )}
                    {program.enableBluetoothAudio && (
                      <Badge variant="secondary" data-testid={`badge-bluetooth-${program.id}`}>
                        <Bluetooth className="w-3 h-3 mr-1" />
                        Bluetooth
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Program Builder Dialog */}
      <Dialog open={!!selectedProgram} onOpenChange={(open) => !open && setSelectedProgram(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProgram && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProgram.title}</DialogTitle>
                <p className="text-muted-foreground">
                  {new Date(selectedProgram.ceremonyDate).toLocaleString()} • {selectedProgram.location}
                </p>
              </DialogHeader>

              <Separator />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Program Items</h3>
                <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" data-testid="button-add-item">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Add Program Item</DialogTitle>
                    </DialogHeader>
                    <Form {...itemForm}>
                      <form onSubmit={itemForm.handleSubmit(handleItemSubmit)} className="space-y-4">
                        <FormField
                          control={itemForm.control}
                          name="itemType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-item-type">
                                    <SelectValue placeholder="Select item type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {itemTypes.map((type) => {
                                    const Icon = type.icon;
                                    return (
                                      <SelectItem key={type.value} value={type.value}>
                                        <div className="flex items-center gap-2">
                                          <Icon className="w-4 h-4" />
                                          {type.label}
                                        </div>
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={itemForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Item title" {...field} data-testid="input-item-title" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={itemForm.control}
                          name="speaker"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Speaker (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Speaker name" {...field} data-testid="input-speaker" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={itemForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Item description" {...field} data-testid="input-item-description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={itemForm.control}
                          name="audioUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Audio URL (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://... (MP3, WAV)" {...field} data-testid="input-audio-url" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {itemForm.watch("audioUrl") && (
                          <FormField
                            control={itemForm.control}
                            name="audioType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Audio Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-audio-type">
                                      <SelectValue placeholder="Select audio type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {audioTypes.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsAddItemOpen(false)}
                            data-testid="button-cancel-item"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={addItemMutation.isPending} data-testid="button-submit-item">
                            {addItemMutation.isPending ? "Adding..." : "Add Item"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {programItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No program items yet. Add your first item to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {programItems
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((item, index) => {
                      const itemType = itemTypes.find(t => t.value === item.itemType);
                      const Icon = itemType?.icon || FileText;
                      return (
                        <Card key={item.id} data-testid={`program-item-${item.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Icon className="w-4 h-4 text-muted-foreground" />
                                      <h4 className="font-medium">{item.title}</h4>
                                    </div>
                                    {item.speaker && (
                                      <p className="text-sm text-muted-foreground mb-1">
                                        <Mic className="w-3 h-3 inline mr-1" />
                                        {item.speaker}
                                      </p>
                                    )}
                                    {item.description && (
                                      <p className="text-sm text-muted-foreground">{item.description}</p>
                                    )}
                                  </div>
                                  {item.audioUrl && (
                                    <Badge variant="secondary">
                                      <Music className="w-3 h-3 mr-1" />
                                      Audio
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}

              <Separator />

              <div className="flex justify-end gap-3">
                <Button variant="outline" data-testid="button-download-pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
