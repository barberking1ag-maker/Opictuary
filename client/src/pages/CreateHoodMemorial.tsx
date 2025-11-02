import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertHoodMemorialSchema, type InsertHoodMemorial } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Home, MapPin, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function CreateHoodMemorial() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertHoodMemorial>({
    resolver: zodResolver(insertHoodMemorialSchema),
    defaultValues: {
      name: "",
      nickname: "",
      birthDate: "",
      deathDate: "",
      biography: "",
      epitaph: "",
      imageUrl: "",
      neighborhoodName: "",
      neighborhoodLogoUrl: "",
      clubName: "",
      clubLogoUrl: "",
      city: "",
      state: "",
      role: "",
      communityImpact: "",
      legendStatus: "",
      isPublic: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertHoodMemorial) => 
      apiRequest("/api/hood-memorials", "POST", data),
    onSuccess: () => {
      toast({
        title: "Hood Memorial Created",
        description: "The memorial has been created successfully.",
      });
      navigate("/hood-memorials");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hood memorial",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertHoodMemorial) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Create Hood Memorial
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Honor a neighborhood legend, community leader, or someone who left their mark on the streets they called home.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about the deceased</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname / Street Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Big Mike, T-Mac, etc." {...field} value={field.value || ""} data-testid="input-nickname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., January 15, 1985" {...field} data-testid="input-birth-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deathDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Death Date *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., March 10, 2024" {...field} data-testid="input-death-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/photo.jpg" {...field} value={field.value || ""} data-testid="input-image-url" />
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
                <MapPin className="w-5 h-5 inline mr-2" />
                Neighborhood & Community Details
              </CardTitle>
              <CardDescription>Where they repped and what they meant to the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="neighborhoodName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Neighborhood Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., South Side, Uptown, The Heights" {...field} data-testid="input-neighborhood" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhoodLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Upload className="w-4 h-4 inline mr-1" />
                      Neighborhood Logo (Image URL)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Paste logo image URL (e.g., https://i.imgur.com/logo.png)" {...field} value={field.value || ""} data-testid="input-neighborhood-logo" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Upload your logo to imgur.com, imgbb.com, or similar and paste the URL here</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clubName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club / Crew Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Street Kings MC, Block Boys, etc." {...field} value={field.value || ""} data-testid="input-club-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clubLogoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Upload className="w-4 h-4 inline mr-1" />
                      Club Logo (Image URL - Optional)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Paste club logo image URL (e.g., https://i.imgur.com/club-logo.png)" {...field} value={field.value || ""} data-testid="input-club-logo" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Upload your logo to imgur.com, imgbb.com, or similar and paste the URL here</p>
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
                          <SelectItem value="AL">Alabama</SelectItem>
                          <SelectItem value="AK">Alaska</SelectItem>
                          <SelectItem value="AZ">Arizona</SelectItem>
                          <SelectItem value="AR">Arkansas</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CT">Connecticut</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                          <SelectItem value="GA">Georgia</SelectItem>
                          <SelectItem value="IL">Illinois</SelectItem>
                          <SelectItem value="IN">Indiana</SelectItem>
                          <SelectItem value="LA">Louisiana</SelectItem>
                          <SelectItem value="MD">Maryland</SelectItem>
                          <SelectItem value="MA">Massachusetts</SelectItem>
                          <SelectItem value="MI">Michigan</SelectItem>
                          <SelectItem value="MN">Minnesota</SelectItem>
                          <SelectItem value="MS">Mississippi</SelectItem>
                          <SelectItem value="MO">Missouri</SelectItem>
                          <SelectItem value="NV">Nevada</SelectItem>
                          <SelectItem value="NJ">New Jersey</SelectItem>
                          <SelectItem value="NM">New Mexico</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="NC">North Carolina</SelectItem>
                          <SelectItem value="OH">Ohio</SelectItem>
                          <SelectItem value="OK">Oklahoma</SelectItem>
                          <SelectItem value="OR">Oregon</SelectItem>
                          <SelectItem value="PA">Pennsylvania</SelectItem>
                          <SelectItem value="SC">South Carolina</SelectItem>
                          <SelectItem value="TN">Tennessee</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="VA">Virginia</SelectItem>
                          <SelectItem value="WA">Washington</SelectItem>
                          <SelectItem value="WI">Wisconsin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role in Community</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Community Leader, Youth Mentor, Block Captain" {...field} value={field.value || ""} data-testid="input-role" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legendStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legend Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-legend-status">
                          <SelectValue placeholder="Select status (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="Hood Legend">Hood Legend</SelectItem>
                        <SelectItem value="Community Icon">Community Icon</SelectItem>
                        <SelectItem value="Neighborhood OG">Neighborhood OG</SelectItem>
                        <SelectItem value="Street Legend">Street Legend</SelectItem>
                        <SelectItem value="Block Hero">Block Hero</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Their Story</CardTitle>
              <CardDescription>Share their life story and impact on the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share their life story, what they meant to the neighborhood, and how they impacted the community..." 
                        className="min-h-[150px]" 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="textarea-biography"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communityImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Community Impact</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how they impacted the community, what they did for others, programs they started, people they helped..." 
                        className="min-h-[100px]" 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="textarea-community-impact"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="epitaph"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Epitaph / Final Words</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="A final tribute or words to remember them by..." 
                        className="min-h-[80px]" 
                        {...field} 
                        value={field.value || ""} 
                        data-testid="textarea-epitaph"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/hood-memorials")} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              data-testid="button-create-memorial"
              className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground"
            >
              {createMutation.isPending ? "Creating..." : "Create Hood Memorial"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
