import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useParams } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Users, Heart, Plus, Link2, UserCheck, Baby, 
  Crown, ChevronRight, ChevronDown, Search, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Memorial, FamilyTreeConnection, User } from "@shared/schema";

const relationshipTypes = [
  { value: "parent", label: "Parent", icon: Crown },
  { value: "child", label: "Child", icon: Baby },
  { value: "sibling", label: "Sibling", icon: Users },
  { value: "spouse", label: "Spouse/Partner", icon: Heart },
  { value: "grandparent", label: "Grandparent", icon: Crown },
  { value: "grandchild", label: "Grandchild", icon: Baby },
  { value: "aunt_uncle", label: "Aunt/Uncle", icon: Users },
  { value: "niece_nephew", label: "Niece/Nephew", icon: Users },
  { value: "cousin", label: "Cousin", icon: Users },
];

const relationshipDetails: Record<string, string[]> = {
  parent: ["Mother", "Father", "Step-Mother", "Step-Father", "Adoptive Mother", "Adoptive Father"],
  child: ["Son", "Daughter", "Step-Son", "Step-Daughter", "Adopted Son", "Adopted Daughter"],
  sibling: ["Brother", "Sister", "Half-Brother", "Half-Sister", "Step-Brother", "Step-Sister"],
  spouse: ["Husband", "Wife", "Partner", "Ex-Husband", "Ex-Wife"],
  grandparent: ["Grandmother", "Grandfather", "Maternal Grandmother", "Maternal Grandfather", "Paternal Grandmother", "Paternal Grandfather"],
  grandchild: ["Grandson", "Granddaughter"],
  aunt_uncle: ["Aunt", "Uncle", "Great-Aunt", "Great-Uncle"],
  niece_nephew: ["Niece", "Nephew"],
  cousin: ["First Cousin", "Second Cousin", "Cousin Once Removed"],
};

const connectionSchema = z.object({
  relationship: z.string().min(1, "Relationship type is required"),
  relationshipDetail: z.string().optional(),
  relatedPersonName: z.string().optional(),
  relatedMemorialId: z.string().optional(),
  isBloodRelative: z.boolean().default(true),
  marriageDate: z.string().optional(),
  marriageLocation: z.string().optional(),
});

type ConnectionFormData = z.infer<typeof connectionSchema>;

export default function FamilyTree() {
  const params = useParams();
  const memorialId = params.memorialId;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchMemorial, setSearchMemorial] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: memorial } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${memorialId}`],
    enabled: !!memorialId,
  });

  const { data: connections, isLoading } = useQuery<FamilyTreeConnection[]>({
    queryKey: [`/api/memorials/${memorialId}/family-tree`],
    enabled: !!memorialId,
  });

  const { data: searchResults } = useQuery<Memorial[]>({
    queryKey: [`/api/memorials/search?q=${encodeURIComponent(searchMemorial)}`],
    enabled: searchMemorial.length >= 2,
  });

  const form = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      relationship: "",
      relationshipDetail: "",
      relatedPersonName: "",
      relatedMemorialId: "",
      isBloodRelative: true,
      marriageDate: "",
      marriageLocation: "",
    },
  });

  const selectedRelationship = form.watch("relationship");

  const createMutation = useMutation({
    mutationFn: async (data: ConnectionFormData) => {
      const result = await apiRequest("POST", `/api/memorials/${memorialId}/family-tree`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/family-tree`] });
      setShowAddDialog(false);
      form.reset();
      toast({
        title: "Connection Added",
        description: "Family relationship has been added to the tree.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add family connection",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConnectionFormData) => {
    if (!data.relatedMemorialId && !data.relatedPersonName) {
      toast({
        title: "Missing Information",
        description: "Please either select an existing memorial or enter a name",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(data);
  };

  const groupedConnections = connections?.reduce((acc, conn) => {
    if (!acc[conn.relationship]) {
      acc[conn.relationship] = [];
    }
    acc[conn.relationship].push(conn);
    return acc;
  }, {} as Record<string, FamilyTreeConnection[]>);

  if (!memorialId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="pt-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Memorial Selected</h3>
            <p className="text-muted-foreground">
              Please access this page from a memorial to view its family tree.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Family Tree
            </h1>
          </div>
          {memorial && (
            <p className="text-lg text-muted-foreground">
              Family connections for <span className="font-semibold">{memorial.name}</span>
            </p>
          )}
        </div>

        {user && (
          <div className="flex justify-end mb-6">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-connection">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Family Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-green-600" />
                    Add Family Connection
                  </DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-relationship">
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {relationshipTypes.map((rel) => {
                                const Icon = rel.icon;
                                return (
                                  <SelectItem key={rel.value} value={rel.value}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {rel.label}
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

                    {selectedRelationship && relationshipDetails[selectedRelationship] && (
                      <FormField
                        control={form.control}
                        name="relationshipDetail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specific Relationship</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-relationship-detail">
                                  <SelectValue placeholder="Select specific relationship" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {relationshipDetails[selectedRelationship].map((detail) => (
                                  <SelectItem key={detail} value={detail}>
                                    {detail}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="isBloodRelative"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <FormLabel className="text-base">Blood Relative</FormLabel>
                            <FormDescription>
                              Is this a biological relationship?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="switch-blood-relative"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Connect to:</Label>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search existing memorials..."
                          value={searchMemorial}
                          onChange={(e) => setSearchMemorial(e.target.value)}
                          className="pl-10"
                          data-testid="input-search-memorial"
                        />
                      </div>

                      {searchResults && searchResults.length > 0 && (
                        <div className="border rounded-lg max-h-40 overflow-y-auto">
                          {searchResults.map((m) => (
                            <div
                              key={m.id}
                              className="p-3 hover:bg-muted cursor-pointer flex items-center justify-between"
                              onClick={() => {
                                form.setValue("relatedMemorialId", m.id);
                                form.setValue("relatedPersonName", m.name);
                                setSearchMemorial("");
                              }}
                              data-testid={`search-result-${m.id}`}
                            >
                              <span>{m.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {m.birthDate} - {m.deathDate}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-center text-sm text-muted-foreground">- or -</div>

                      <FormField
                        control={form.control}
                        name="relatedPersonName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Person's Name (without memorial)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter name" 
                                {...field} 
                                data-testid="input-person-name"
                              />
                            </FormControl>
                            <FormDescription>
                              Add someone who doesn't have a memorial yet
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {selectedRelationship === "spouse" && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="marriageDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marriage Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-marriage-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="marriageLocation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marriage Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} data-testid="input-marriage-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending}
                        data-testid="button-submit-connection"
                      >
                        {createMutation.isPending ? "Adding..." : "Add Connection"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 bg-gray-200 rounded w-1/3" />
                </CardHeader>
                <CardContent>
                  <div className="h-16 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groupedConnections && Object.keys(groupedConnections).length > 0 ? (
          <div className="space-y-8">
            {relationshipTypes.map((relType) => {
              const conns = groupedConnections[relType.value];
              if (!conns || conns.length === 0) return null;
              
              const Icon = relType.icon;
              
              return (
                <Card key={relType.value}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-green-600" />
                      {relType.label}s
                      <Badge variant="secondary" className="ml-2">{conns.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {conns.map((conn) => (
                        <Card key={conn.id} className="hover-elevate" data-testid={`card-connection-${conn.id}`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  {conn.relatedPersonName || "Unknown"}
                                </h4>
                                {conn.relationshipDetail && (
                                  <p className="text-sm text-muted-foreground">
                                    {conn.relationshipDetail}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {conn.isBloodRelative ? (
                                  <Badge variant="outline" className="text-xs">
                                    Blood Relative
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    By Marriage
                                  </Badge>
                                )}
                                {conn.isVerified && (
                                  <Badge className="text-xs bg-green-500">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {conn.relatedMemorialId && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 p-0"
                                asChild
                              >
                                <a href={`/memorial/${conn.relatedMemorialId}`}>
                                  View Memorial
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </a>
                              </Button>
                            )}

                            {relType.value === "spouse" && conn.marriageDate && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Married: {conn.marriageDate}
                                {conn.marriageLocation && ` in ${conn.marriageLocation}`}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <Users className="h-16 w-16 mx-auto text-green-300 mb-6" />
              <h3 className="text-2xl font-bold mb-3">No Family Connections Yet</h3>
              <p className="text-muted-foreground mb-6">
                Build the family tree by adding parents, children, siblings, 
                and other family members to create a complete picture.
              </p>
              {user && (
                <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-first-connection">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Family Member
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-12 bg-gradient-to-r from-green-100/50 to-blue-100/50 dark:from-green-900/20 dark:to-blue-900/20 border-0">
          <CardContent className="pt-8 pb-8 text-center">
            <Heart className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Connecting Generations</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Build a family tree that connects memorials together, 
              preserving the bonds that span generations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
