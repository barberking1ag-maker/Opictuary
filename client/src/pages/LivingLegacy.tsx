import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Sparkles, Heart, BookOpen, Award, Target, MessageSquare, 
  Calendar, MapPin, Camera, Plus, Edit, Check, Lock, Globe,
  Star, Trophy, Briefcase, GraduationCap, Plane, Users,
  Gift, HandHeart, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LivingLegacy, User } from "@shared/schema";

const createLegacySchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  birthDate: z.string().optional(),
  location: z.string().optional(),
  occupation: z.string().optional(),
  biography: z.string().optional(),
  lifePhilosophy: z.string().optional(),
  favoriteQuote: z.string().optional(),
  isPublic: z.boolean().default(false),
  publishAfterPassing: z.boolean().default(true),
  designatedExecutorEmail: z.string().email().optional().or(z.literal("")),
});

type CreateLegacyFormData = z.infer<typeof createLegacySchema>;

const achievementCategories = [
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "career", label: "Career", icon: Briefcase },
  { value: "family", label: "Family", icon: Users },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "hobby", label: "Hobbies", icon: Star },
  { value: "volunteer", label: "Volunteering", icon: HandHeart },
  { value: "award", label: "Awards", icon: Trophy },
  { value: "personal", label: "Personal", icon: Heart },
];

export default function LivingLegacy() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: myLegacies, isLoading } = useQuery<LivingLegacy[]>({
    queryKey: ["/api/living-legacies/my"],
    enabled: !!user,
  });

  const form = useForm<CreateLegacyFormData>({
    resolver: zodResolver(createLegacySchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      location: "",
      occupation: "",
      biography: "",
      lifePhilosophy: "",
      favoriteQuote: "",
      isPublic: false,
      publishAfterPassing: true,
      designatedExecutorEmail: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateLegacyFormData) => {
      const result = await apiRequest("POST", "/api/living-legacies", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/living-legacies/my"] });
      setShowCreateDialog(false);
      form.reset();
      toast({
        title: "Living Legacy Created",
        description: "Your legacy has been started. Begin adding your achievements and milestones!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create living legacy",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateLegacyFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Living Legacy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Build your legacy while you live. Document your achievements, dreams, and messages 
            for loved ones. Create a meaningful record of your life's journey.
          </p>
        </div>

        {!user ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader className="text-center">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to create and manage your Living Legacy
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button asChild data-testid="button-login-for-legacy">
                <Link href="/login">Sign In to Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="button-create-legacy">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Your Legacy
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Start Your Living Legacy
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} data-testid="input-legacy-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-legacy-birthdate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="City, State" {...field} data-testid="input-legacy-location" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="Your profession or role" {...field} data-testid="input-legacy-occupation" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="biography"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biography</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share your life story..." 
                                className="min-h-[100px]"
                                {...field} 
                                data-testid="input-legacy-biography"
                              />
                            </FormControl>
                            <FormDescription>
                              You can always add more details later
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lifePhilosophy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Life Philosophy</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What principles guide your life?" 
                                {...field} 
                                data-testid="input-legacy-philosophy"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="favoriteQuote"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Favorite Quote</FormLabel>
                            <FormControl>
                              <Input placeholder="A quote that inspires you" {...field} data-testid="input-legacy-quote" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <div className="space-y-4">
                        <h4 className="font-medium">Privacy Settings</h4>
                        
                        <FormField
                          control={form.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border">
                              <div>
                                <FormLabel className="text-base">Make Public Now</FormLabel>
                                <FormDescription>
                                  Allow others to view your legacy while you're alive
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-legacy-public"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="publishAfterPassing"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between p-4 rounded-lg border">
                              <div>
                                <FormLabel className="text-base">Publish After Passing</FormLabel>
                                <FormDescription>
                                  Convert to a memorial page when the time comes
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-legacy-publish"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="designatedExecutorEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Designated Executor Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="executor@email.com" 
                                  {...field} 
                                  data-testid="input-legacy-executor"
                                />
                              </FormControl>
                              <FormDescription>
                                This person will be able to manage your legacy
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowCreateDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={createMutation.isPending}
                          data-testid="button-submit-legacy"
                        >
                          {createMutation.isPending ? "Creating..." : "Create Legacy"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myLegacies && myLegacies.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myLegacies.map((legacy) => (
                  <Card key={legacy.id} className="hover:shadow-lg transition-shadow" data-testid={`card-legacy-${legacy.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-xl">{legacy.fullName}</CardTitle>
                          {legacy.occupation && (
                            <CardDescription className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {legacy.occupation}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant={legacy.isPublic ? "default" : "secondary"}>
                          {legacy.isPublic ? (
                            <><Globe className="h-3 w-3 mr-1" /> Public</>
                          ) : (
                            <><Lock className="h-3 w-3 mr-1" /> Private</>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {legacy.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {legacy.location}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion</span>
                          <span className="font-medium">{legacy.completionPercentage || 0}%</span>
                        </div>
                        <Progress value={legacy.completionPercentage || 0} className="h-2" />
                      </div>

                      {legacy.favoriteQuote && (
                        <p className="text-sm italic text-muted-foreground border-l-2 border-purple-300 pl-3">
                          "{legacy.favoriteQuote}"
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/living-legacy/${legacy.id}`}>
                          View Legacy
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto text-center">
                <CardContent className="pt-8 pb-8">
                  <Sparkles className="h-16 w-16 mx-auto text-purple-300 mb-6" />
                  <h3 className="text-2xl font-bold mb-3">Start Building Your Legacy</h3>
                  <p className="text-muted-foreground mb-6">
                    Document your life's achievements, share your wisdom, and leave 
                    meaningful messages for those you love.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} data-testid="button-start-first-legacy">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Legacy
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">What You Can Document</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {achievementCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Card key={cat.value} className="hover-elevate">
                      <CardContent className="pt-6 text-center">
                        <Icon className="h-10 w-10 mx-auto text-purple-500 mb-3" />
                        <h3 className="font-semibold">{cat.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Track your {cat.label.toLowerCase()} milestones
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-purple-100/50 to-indigo-100/50 dark:from-purple-900/20 dark:to-indigo-900/20 border-0">
                <CardContent className="pt-6 text-center">
                  <Target className="h-10 w-10 mx-auto text-purple-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Bucket List</h3>
                  <p className="text-sm text-muted-foreground">
                    Track dreams and goals you want to accomplish
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-indigo-100/50 to-blue-100/50 dark:from-indigo-900/20 dark:to-blue-900/20 border-0">
                <CardContent className="pt-6 text-center">
                  <MessageSquare className="h-10 w-10 mx-auto text-indigo-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Future Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Write letters to be delivered to loved ones
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
                <CardContent className="pt-6 text-center">
                  <Award className="h-10 w-10 mx-auto text-blue-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">Achievements</h3>
                  <p className="text-sm text-muted-foreground">
                    Document milestones and accomplishments
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
