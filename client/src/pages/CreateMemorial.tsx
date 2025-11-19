import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Calendar, MapPin, FileText, Sparkles } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Link } from "wouter";

const createMemorialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  deathDate: z.string().min(1, "Death date is required"),
  biography: z.string().min(10, "Please write at least a brief biography"),
  epitaph: z.string().optional(),
  prefaceText: z.string().optional(),
  backgroundImage: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  religion: z.string().optional(),
  cemeteryName: z.string().optional(),
  cemeteryLocation: z.string().optional(),
  timezone: z.string().optional(),
  fontFamily: z.string().optional(),
  symbol: z.string().optional(),
  isPublic: z.boolean().default(false),
}).refine((data) => new Date(data.deathDate) >= new Date(data.birthDate), {
  message: "Death date cannot be before birth date",
  path: ["deathDate"],
});

type CreateMemorialForm = z.infer<typeof createMemorialSchema>;

export default function CreateMemorial() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);

  // Detect browser timezone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

  const form = useForm<CreateMemorialForm>({
    resolver: zodResolver(createMemorialSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      deathDate: "",
      biography: "",
      epitaph: "",
      prefaceText: "",
      backgroundImage: "",
      religion: "",
      cemeteryName: "",
      cemeteryLocation: "",
      timezone: browserTimezone,
      fontFamily: "crimson",
      symbol: "cross",
      isPublic: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateMemorialForm) => {
      console.log("CreateMemorial mutation starting with data:", data);
      console.log("User info:", { email: user?.email, isAuthenticated });
      
      // Generate a 20-character invite code (database limit)
      const inviteCode = (Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12)).substring(0, 20);
      
      const payload = {
        ...data,
        creatorEmail: user?.email,
        inviteCode,
      };
      
      console.log("Sending POST to /api/memorials with payload:", payload);
      
      const response = await apiRequest("POST", "/api/memorials", payload);
      const result = await response.json();
      
      console.log("Memorial created successfully:", result);
      return result;
    },
    onSuccess: (memorial) => {
      console.log("onSuccess called with memorial:", memorial);
      queryClient.invalidateQueries({ queryKey: ['/api/user/memorials'] });
      toast({
        title: "Memorial Created",
        description: `Memorial for ${memorial.name} has been created successfully.`,
      });
      window.location.href = `/my-memorials`;
    },
    onError: (error: any) => {
      console.error("Create memorial error:", error);
      toast({
        title: "Error Creating Memorial",
        description: error.message || "Please check all required fields and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateMemorialForm) => {
    console.log("Form onSubmit called with data:", data);
    console.log("Form validation state:", {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
    });
    createMutation.mutate(data);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to create a memorial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/api/login'} className="w-full" data-testid="button-login-required">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <OpictuaryLogo variant="classic" showTagline={false} className="mb-6" />
          <h1 className="text-4xl font-serif font-bold mb-2" data-testid="text-create-memorial-heading">
            Create a Memorial
          </h1>
          <p className="text-muted-foreground text-lg">
            Create a memorial for a loved one or start one for yourself—preserving precious memories with dignity and compassion
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Memorial Details</CardTitle>
                <CardDescription>
                  Share the story and legacy of someone special
                </CardDescription>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 w-8 rounded-full transition-colors ${
                      s <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Basic Information</h3>
                        <p className="text-sm text-muted-foreground">Who are we remembering?</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-name" />
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
                              <Input type="date" {...field} data-testid="input-birth-date" />
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
                              <Input type="date" {...field} data-testid="input-death-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="backgroundImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memorial Photo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/photo.jpg" 
                              {...field} 
                              data-testid="input-background-image" 
                            />
                          </FormControl>
                          <FormDescription>
                            Add a photo URL of your loved one to display as the memorial background
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="religion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faith Tradition</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-religion">
                                <SelectValue placeholder="Select faith tradition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="christian">Christian</SelectItem>
                              <SelectItem value="jewish">Jewish</SelectItem>
                              <SelectItem value="islamic">Islamic</SelectItem>
                              <SelectItem value="buddhist">Buddhist</SelectItem>
                              <SelectItem value="hindu">Hindu</SelectItem>
                              <SelectItem value="nonreligious">Non-religious</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps customize the memorial design
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={() => setStep(2)} data-testid="button-next-step-1">
                        Continue
                        <Calendar className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Life Story</h3>
                        <p className="text-sm text-muted-foreground">Share their legacy and impact</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="biography"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biography *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write about their life, accomplishments, passions, and the people they loved..."
                              className="min-h-[200px]"
                              {...field}
                              data-testid="input-biography"
                            />
                          </FormControl>
                          <FormDescription>
                            Share stories, memories, and what made them special
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="epitaph"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Epitaph (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="A meaningful quote or phrase"
                              {...field}
                              data-testid="input-epitaph"
                            />
                          </FormControl>
                          <FormDescription>
                            A short phrase that captures their spirit
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="prefaceText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opening Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="A welcome message for memorial visitors..."
                              className="min-h-[100px]"
                              {...field}
                              data-testid="input-preface"
                            />
                          </FormControl>
                          <FormDescription>
                            This appears at the top of the memorial page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back-step-2">
                        Back
                      </Button>
                      <Button type="button" onClick={() => setStep(3)} data-testid="button-next-step-2">
                        Continue
                        <MapPin className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/20 p-3 rounded-full">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Final Details</h3>
                        <p className="text-sm text-muted-foreground">Personalize the memorial</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cemeteryName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cemetery/Burial Location Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Peaceful Gardens Cemetery" {...field} data-testid="input-cemetery-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cemeteryLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cemetery Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Memorial Drive, City, State" {...field} data-testid="input-cemetery-location" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-timezone">
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                              <SelectItem value="America/Phoenix">Arizona (MST)</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                              <SelectItem value="America/Anchorage">Alaska (AKT)</SelectItem>
                              <SelectItem value="Pacific/Honolulu">Hawaii (HST)</SelectItem>
                              <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                              <SelectItem value="Europe/Paris">Central Europe (CET)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                              <SelectItem value="Asia/Shanghai">Beijing (CST)</SelectItem>
                              <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                              <SelectItem value="UTC">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Used for scheduling future messages and video time capsules
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fontFamily"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Design Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-font">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="crimson">Classic & Elegant</SelectItem>
                              <SelectItem value="inter">Modern & Clean</SelectItem>
                              <SelectItem value="merriweather">Traditional & Formal</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="symbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memorial Symbol</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-symbol">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cross">Cross (Christian)</SelectItem>
                              <SelectItem value="star-of-david">Star of David (Jewish)</SelectItem>
                              <SelectItem value="crescent">Crescent Moon (Islamic)</SelectItem>
                              <SelectItem value="ankh">Ankh (Kemetic/Egyptian)</SelectItem>
                              <SelectItem value="dharma-wheel">Dharma Wheel (Buddhist)</SelectItem>
                              <SelectItem value="om">Om Symbol (Hindu)</SelectItem>
                              <SelectItem value="lotus">Lotus (Buddhist/Hindu)</SelectItem>
                              <SelectItem value="hamsa">Hamsa (Protection)</SelectItem>
                              <SelectItem value="eye-horus">Eye of Horus (Egyptian)</SelectItem>
                              <SelectItem value="yin-yang">Yin Yang (Taoist)</SelectItem>
                              <SelectItem value="tree-life">Tree of Life (Universal)</SelectItem>
                              <SelectItem value="mountain">Sacred Mountain (Spiritual)</SelectItem>
                              <SelectItem value="water">Water (Life & Renewal)</SelectItem>
                              <SelectItem value="wind">Spirit Wind (Indigenous)</SelectItem>
                              <SelectItem value="flame">Eternal Flame (Memorial)</SelectItem>
                              <SelectItem value="dove">Dove (Peace)</SelectItem>
                              <SelectItem value="angel">Angel (Guardian)</SelectItem>
                              <SelectItem value="heart">Heart (Love)</SelectItem>
                              <SelectItem value="infinity">Infinity (Eternal Love)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/20 p-2 rounded-full flex-shrink-0 mt-1">
                          <Heart className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Privacy Settings</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            This memorial will be private by default. You'll receive a unique invite code to share with family and friends.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You can change privacy settings and manage access from your memorial dashboard after creation.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(2)} data-testid="button-back-step-3">
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending}
                        data-testid="button-create-memorial"
                      >
                        {createMutation.isPending ? "Creating Memorial..." : "Create Memorial"}
                        <Heart className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need to create your own obituary in advance?{" "}
            <Link href="/self-obituary" className="text-primary hover:underline" data-testid="link-self-obituary">
              Write Self-Obituary
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
