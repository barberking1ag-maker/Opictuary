import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertNeighborhoodSchema, type InsertNeighborhood } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Building2, MapPin, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function CreateNeighborhood() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertNeighborhood>({
    resolver: zodResolver(insertNeighborhoodSchema),
    defaultValues: {
      name: "",
      city: "",
      state: "",
      description: "",
      logoUrl: "",
      backgroundImage: "",
      foundedYear: "",
      population: undefined,
      landmarks: [],
      notableFeatures: "",
      isPublic: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertNeighborhood) => 
      apiRequest("POST", "/api/neighborhoods", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/neighborhoods"] });
      toast({
        title: "Neighborhood Created",
        description: "The neighborhood has been created successfully.",
      });
      navigate("/neighborhoods");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create neighborhood",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNeighborhood) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Add Neighborhood
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Add your community to the platform. Share its story, celebrate its legends, and connect with others who call it home.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about the neighborhood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neighborhood Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., South Side, Bronzeville, Harlem" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <FormControl>
                        <Input placeholder="Chicago" {...field} data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share what makes this neighborhood special - its history, culture, and community..." 
                        className="min-h-[120px]" 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Upload className="w-5 h-5 inline mr-2" />
                Visual Identity
              </CardTitle>
              <CardDescription>Logo and background image for the neighborhood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neighborhood Logo (Image URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste logo image URL (e.g., https://i.imgur.com/logo.png)" {...field} value={field.value || ""} data-testid="input-logo-url" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Upload your logo to imgur.com, imgbb.com, or similar and paste the URL here</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background Image (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Paste background image URL" {...field} value={field.value || ""} data-testid="input-background-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>Optional information about the neighborhood</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="foundedYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1920" {...field} value={field.value || ""} data-testid="input-founded-year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Population</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 25000" 
                          {...field} 
                          value={field.value ?? ""} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-population" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notableFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notable Features</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What makes this neighborhood unique? Famous spots, cultural significance, etc..." 
                        className="min-h-[100px]" 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="textarea-notable-features"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/neighborhoods")} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              data-testid="button-create-neighborhood"
              className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground"
            >
              {createMutation.isPending ? "Creating..." : "Create Neighborhood"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
