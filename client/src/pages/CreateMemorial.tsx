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
  religion: z.string().optional(),
  cemeteryName: z.string().optional(),
  cemeteryLocation: z.string().optional(),
  fontFamily: z.string().optional(),
  symbol: z.string().optional(),
  isPublic: z.boolean().default(false),
});

type CreateMemorialForm = z.infer<typeof createMemorialSchema>;

export default function CreateMemorial() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);

  const form = useForm<CreateMemorialForm>({
    resolver: zodResolver(createMemorialSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      deathDate: "",
      biography: "",
      epitaph: "",
      prefaceText: "",
      religion: "",
      cemeteryName: "",
      cemeteryLocation: "",
      fontFamily: "crimson",
      symbol: "cross",
      isPublic: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateMemorialForm) => {
      const response = await apiRequest("POST", "/api/memorials", {
        ...data,
        creatorEmail: user?.email,
        inviteCode: Math.random().toString(36).substring(2, 15),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create memorial");
      }
      return await response.json();
    },
    onSuccess: (memorial) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/memorials'] });
      toast({
        title: "Memorial Created",
        description: `Memorial for ${memorial.name} has been created successfully.`,
      });
      window.location.href = `/my-memorials`;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateMemorialForm) => {
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
            Honor the memory of a loved one with a beautiful digital memorial
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
                              <SelectItem value="cross">Cross</SelectItem>
                              <SelectItem value="star-of-david">Star of David</SelectItem>
                              <SelectItem value="crescent">Crescent Moon</SelectItem>
                              <SelectItem value="lotus">Lotus Flower</SelectItem>
                              <SelectItem value="om">Om Symbol</SelectItem>
                              <SelectItem value="dove">Dove</SelectItem>
                              <SelectItem value="angel">Angel Halo</SelectItem>
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
