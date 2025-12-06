import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Crown, Trophy, Music, Film, Heart, Briefcase, Users, Plus, X, ArrowLeft, Star, Award, Mic2, CheckCircle2 } from "lucide-react";

// Profession categories with sub-categories
const professionCategories = [
  { 
    id: "sports", 
    name: "Sports & Athletics", 
    icon: Trophy,
    subCategories: ["Basketball", "Football", "Baseball", "Soccer", "Tennis", "Boxing", "Golf", "Track & Field", "Swimming", "Other Sports"]
  },
  { 
    id: "entertainment", 
    name: "Actors & Actresses", 
    icon: Film,
    subCategories: ["Film", "Television", "Theater", "Voice Acting", "Stunt Performers"]
  },
  { 
    id: "music", 
    name: "Musicians & Artists", 
    icon: Music,
    subCategories: ["Pop", "Rock", "Hip-Hop/Rap", "R&B/Soul", "Country", "Jazz", "Classical", "Gospel", "Producers", "Songwriters"]
  },
  { 
    id: "royalty", 
    name: "Royalty & Nobility", 
    icon: Crown,
    subCategories: ["Kings", "Queens", "Princes", "Princesses", "Dukes", "Duchesses", "Other Nobility"]
  },
  { 
    id: "philanthropy", 
    name: "Philanthropists", 
    icon: Heart,
    subCategories: ["Humanitarian", "Charity Founders", "Social Activists", "Environmental"]
  },
  { 
    id: "business", 
    name: "Business Leaders", 
    icon: Briefcase,
    subCategories: ["CEOs", "Entrepreneurs", "Investors", "Innovators"]
  },
  { 
    id: "politics", 
    name: "Political Figures", 
    icon: Users,
    subCategories: ["Presidents", "Prime Ministers", "Senators", "Governors", "Ambassadors", "Activists"]
  },
  { 
    id: "arts", 
    name: "Artists & Writers", 
    icon: Award,
    subCategories: ["Painters", "Sculptors", "Novelists", "Poets", "Playwrights", "Journalists", "Critics"]
  },
  { 
    id: "comedy", 
    name: "Comedians", 
    icon: Mic2,
    subCategories: ["Stand-up", "Improv", "Sketch Comedy", "Comedy Writers"]
  },
  { 
    id: "science", 
    name: "Scientists & Educators", 
    icon: Star,
    subCategories: ["Physicists", "Biologists", "Chemists", "Astronomers", "Professors", "Researchers"]
  },
];

const celebrityMemorialSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title/profession is required"),
  biography: z.string().min(20, "Please write at least a brief biography"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  charityName: z.string().min(2, "Charity name is required"),
  donationAmount: z.string().min(1, "Donation amount is required"),
  platformPercentage: z.string().optional(),
  
  // Dates
  birthDate: z.string().optional().or(z.literal("")),
  deathDate: z.string().optional().or(z.literal("")),
  
  // Profession
  professionCategory: z.string().min(1, "Please select a profession category"),
  subProfession: z.string().optional().or(z.literal("")),
  
  // Verification
  submitterName: z.string().min(2, "Submitter name is required"),
  submitterEmail: z.string().email("Please enter a valid email"),
  submitterRelationship: z.string().min(2, "Relationship is required"),
  submitterPhone: z.string().optional().or(z.literal("")),
  
  // Customization
  memorialTemplate: z.string().optional(),
  primaryColor: z.string().optional().or(z.literal("")),
  secondaryColor: z.string().optional().or(z.literal("")),
  accentColor: z.string().optional().or(z.literal("")),
});

type CelebrityMemorialForm = z.infer<typeof celebrityMemorialSchema>;

export default function CreateCelebrityMemorial() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [achievements, setAchievements] = useState<Array<{ title: string; year: string; description?: string }>>([]);
  const [awards, setAwards] = useState<Array<{ name: string; year: string; category?: string }>>([]);
  const [newAchievement, setNewAchievement] = useState({ title: "", year: "", description: "" });
  const [newAward, setNewAward] = useState({ name: "", year: "", category: "" });

  const form = useForm<CelebrityMemorialForm>({
    resolver: zodResolver(celebrityMemorialSchema),
    defaultValues: {
      name: "",
      title: "",
      biography: "",
      imageUrl: "",
      charityName: "",
      donationAmount: "10",
      platformPercentage: "5",
      birthDate: "",
      deathDate: "",
      professionCategory: "",
      subProfession: "",
      submitterName: "",
      submitterEmail: "",
      submitterRelationship: "",
      submitterPhone: "",
      memorialTemplate: "classic",
      primaryColor: "",
      secondaryColor: "",
      accentColor: "",
    },
  });

  const selectedCategory = form.watch("professionCategory");
  const currentProfessionCategory = professionCategories.find(c => c.id === selectedCategory);

  const createMutation = useMutation({
    mutationFn: async (data: CelebrityMemorialForm) => {
      const payload = {
        ...data,
        donationAmount: data.donationAmount,
        platformPercentage: parseInt(data.platformPercentage || "5"),
        achievements: achievements.length > 0 ? achievements : undefined,
        awards: awards.length > 0 ? awards : undefined,
        themeColors: (data.primaryColor || data.secondaryColor || data.accentColor) ? {
          primary: data.primaryColor || "#9333ea",
          secondary: data.secondaryColor || "#f59e0b",
          accent: data.accentColor || "#06b6d4",
        } : undefined,
      };
      return await apiRequest("POST", "/api/celebrity-memorials", payload);
    },
    onSuccess: () => {
      toast({
        title: "Memorial submitted successfully",
        description: "Your celebrity memorial has been submitted for verification. You'll be notified once it's approved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/celebrity-memorials"] });
      navigate("/celebrity-memorials");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create memorial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CelebrityMemorialForm) => {
    createMutation.mutate(data);
  };

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.year) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement({ title: "", year: "", description: "" });
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const addAward = () => {
    if (newAward.name && newAward.year) {
      setAwards([...awards, newAward]);
      setNewAward({ name: "", year: "", category: "" });
    }
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      form.trigger(["name", "title", "biography", "professionCategory"]).then((isValid) => {
        if (isValid) setCurrentStep(2);
      });
    } else if (currentStep === 2) {
      form.trigger(["charityName", "donationAmount"]).then((isValid) => {
        if (isValid) setCurrentStep(3);
      });
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/celebrity-memorials")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Celebrity Memorials
          </Button>
          <h1 className="text-4xl font-serif font-semibold mb-2">Create Celebrity Memorial</h1>
          <p className="text-muted-foreground">
            Submit a memorial for verification by family members, lawyers, or authorized representatives
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Basic Info</span>
            <span>Charity</span>
            <span>Achievements</span>
            <span>Verification</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the celebrity's basic details and profession</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Michael Jordan" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title/Profession *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Professional Basketball Player" {...field} data-testid="input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="professionCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-profession-category">
                              <SelectValue placeholder="Select a profession category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {professionCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {currentProfessionCategory && (
                    <FormField
                      control={form.control}
                      name="subProfession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Field</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-sub-profession">
                                <SelectValue placeholder="Select specific field" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {currentProfessionCategory.subCategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Birth Date</FormLabel>
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
                          <FormLabel>Death Date</FormLabel>
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
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/photo.jpg" {...field} data-testid="input-image-url" />
                        </FormControl>
                        <FormDescription>Enter a direct link to the celebrity's photo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write a brief biography about this person's life and contributions..."
                            className="min-h-32"
                            {...field}
                            data-testid="textarea-biography"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" onClick={nextStep} data-testid="button-next-step1">
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Charity Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Charity Information</CardTitle>
                  <CardDescription>Specify the charity and donation details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="charityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Charity Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., American Red Cross" {...field} data-testid="input-charity-name" />
                        </FormControl>
                        <FormDescription>The charity that will receive donations</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="donationAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Amount (USD) *</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" step="0.01" placeholder="10" {...field} data-testid="input-donation-amount" />
                        </FormControl>
                        <FormDescription>Minimum donation required to view the memorial</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="platformPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Fee (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="15" step="1" {...field} data-testid="input-platform-percentage" />
                        </FormControl>
                        <FormDescription>Percentage retained by the platform (default: 5%)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step2">
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep} data-testid="button-next-step2">
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Achievements & Awards */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Achievements & Awards</CardTitle>
                  <CardDescription>Add notable achievements and awards (optional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Achievements */}
                  <div>
                    <h3 className="font-semibold mb-3">Achievements</h3>
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Achievement title"
                        value={newAchievement.title}
                        onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                        data-testid="input-achievement-title"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Year"
                          value={newAchievement.year}
                          onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                          data-testid="input-achievement-year"
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={newAchievement.description}
                          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                          data-testid="input-achievement-description"
                        />
                      </div>
                      <Button type="button" size="sm" onClick={addAchievement} data-testid="button-add-achievement">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Achievement
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {achievement.title} ({achievement.year})
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeAchievement(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Awards */}
                  <div>
                    <h3 className="font-semibold mb-3">Awards</h3>
                    <div className="space-y-2 mb-3">
                      <Input
                        placeholder="Award name"
                        value={newAward.name}
                        onChange={(e) => setNewAward({ ...newAward, name: e.target.value })}
                        data-testid="input-award-name"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Year"
                          value={newAward.year}
                          onChange={(e) => setNewAward({ ...newAward, year: e.target.value })}
                          data-testid="input-award-year"
                        />
                        <Input
                          placeholder="Category (optional)"
                          value={newAward.category}
                          onChange={(e) => setNewAward({ ...newAward, category: e.target.value })}
                          data-testid="input-award-category"
                        />
                      </div>
                      <Button type="button" size="sm" onClick={addAward} data-testid="button-add-award">
                        <Plus className="w-4 h-4 mr-1" />
                        Add Award
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {awards.map((award, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {award.name} ({award.year})
                          <X
                            className="w-3 h-3 ml-1 cursor-pointer"
                            onClick={() => removeAward(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step3">
                      Back
                    </Button>
                    <Button type="button" onClick={nextStep} data-testid="button-next-step3">
                      Next Step
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Verification */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Verification Information</CardTitle>
                  <CardDescription>
                    Provide your contact information for verification. We'll review your submission and contact you if needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="submitterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., John Smith" {...field} data-testid="input-submitter-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="submitterEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} data-testid="input-submitter-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="submitterPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} data-testid="input-submitter-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="submitterRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to Deceased *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-relationship">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="family">Family Member</SelectItem>
                            <SelectItem value="lawyer">Lawyer/Attorney</SelectItem>
                            <SelectItem value="power_of_attorney">Power of Attorney</SelectItem>
                            <SelectItem value="estate_executor">Estate Executor</SelectItem>
                            <SelectItem value="publicist">Publicist/Agent</SelectItem>
                            <SelectItem value="foundation">Foundation Representative</SelectItem>
                            <SelectItem value="other">Other Authorized Representative</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          We'll verify your authorization to create this memorial
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Verification Process</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      After submission, our team will:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Review your relationship to the deceased</li>
                      <li>Verify the accuracy of the information provided</li>
                      <li>Contact you if additional documentation is needed</li>
                      <li>Approve and publish the memorial once verified</li>
                    </ul>
                  </div>

                  <div className="flex justify-between gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step4">
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      data-testid="button-submit"
                    >
                      {createMutation.isPending ? "Submitting..." : "Submit for Verification"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
