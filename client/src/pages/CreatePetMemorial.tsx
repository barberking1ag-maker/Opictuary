import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rainbow, PawPrint, Dog, Cat, Bird, Fish, Rabbit, Heart,
  Camera, Palette, TreePine, Waves, Star, Sparkles,
  ArrowLeft, ArrowRight, Save, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const petMemorialSchema = z.object({
  name: z.string().min(1, "Pet's name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  color: z.string().optional(),
  birthDate: z.string().optional(),
  passingDate: z.string().min(1, "Passing date is required"),
  age: z.string().optional(),
  personality: z.array(z.string()).optional(),
  favoriteActivities: z.array(z.string()).optional(),
  favoriteFood: z.string().optional(),
  favoriteToy: z.string().optional(),
  specialTraits: z.string().optional(),
  biography: z.string().optional(),
  epitaph: z.string().optional(),
  rainbowBridgeMessage: z.string().optional(),
  theme: z.string().default("rainbow_bridge"),
  isPublic: z.boolean().default(true),
  allowCondolences: z.boolean().default(true),
});

type PetMemorialFormData = z.infer<typeof petMemorialSchema>;

const speciesOptions = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "bird", label: "Bird", icon: Bird },
  { value: "rabbit", label: "Rabbit", icon: Rabbit },
  { value: "fish", label: "Fish", icon: Fish },
  { value: "horse", label: "Horse", icon: PawPrint },
  { value: "reptile", label: "Reptile", icon: PawPrint },
  { value: "other", label: "Other", icon: PawPrint },
];

const personalityTraits = [
  "Playful", "Loyal", "Cuddly", "Energetic", "Calm", "Protective",
  "Curious", "Gentle", "Mischievous", "Friendly", "Independent", "Loving"
];

const themeOptions = [
  { value: "rainbow_bridge", label: "Rainbow Bridge", icon: Rainbow, color: "from-purple-400 via-pink-300 to-orange-300" },
  { value: "garden", label: "Peaceful Garden", icon: TreePine, color: "from-green-400 to-emerald-300" },
  { value: "starlight", label: "Starlight", icon: Star, color: "from-indigo-500 to-purple-400" },
  { value: "forest", label: "Forest", icon: TreePine, color: "from-green-600 to-teal-400" },
  { value: "ocean", label: "Ocean", icon: Waves, color: "from-blue-400 to-cyan-300" },
];

export default function CreatePetMemorial() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<PetMemorialFormData>({
    resolver: zodResolver(petMemorialSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      passingDate: "",
      theme: "rainbow_bridge",
      isPublic: true,
      allowCondolences: true,
      personality: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PetMemorialFormData) => {
      return apiRequest("/api/pet-memorials", {
        method: "POST",
        body: JSON.stringify({ ...data, personality: selectedPersonality }),
      });
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pet-memorials"] });
      toast({
        title: "Memorial Created",
        description: `${form.getValues("name")}'s memorial has been created with love.`,
      });
      navigate(`/pet-memorial/${result.inviteCode}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PetMemorialFormData) => {
    createMutation.mutate(data);
  };

  const togglePersonality = (trait: string) => {
    setSelectedPersonality(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Rainbow className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Create Pet Memorial</h1>
          </div>
          <p className="text-muted-foreground">
            Honor your beloved companion with a lasting tribute
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step >= s ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"}
                `}>
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 ${step > s ? "bg-purple-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-purple-500" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Tell us about your beloved pet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet's Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your pet's name" {...field} data-testid="input-pet-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="species"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Species *</FormLabel>
                        <div className="grid grid-cols-4 gap-2">
                          {speciesOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                              <Button
                                key={option.value}
                                type="button"
                                variant={field.value === option.value ? "default" : "outline"}
                                className="flex flex-col h-auto py-3"
                                onClick={() => field.onChange(option.value)}
                                data-testid={`button-species-${option.value}`}
                              >
                                <Icon className="h-5 w-5 mb-1" />
                                <span className="text-xs">{option.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Golden Retriever" {...field} data-testid="input-breed" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Golden" {...field} data-testid="input-color" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

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
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="passingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passing Date *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-passing-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 12 years" {...field} data-testid="input-age" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Personality & Memories
                  </CardTitle>
                  <CardDescription>
                    Describe what made them special
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Personality Traits</Label>
                    <div className="flex flex-wrap gap-2">
                      {personalityTraits.map((trait) => (
                        <Badge
                          key={trait}
                          variant={selectedPersonality.includes(trait) ? "default" : "outline"}
                          className="cursor-pointer hover-elevate"
                          onClick={() => togglePersonality(trait)}
                          data-testid={`badge-personality-${trait.toLowerCase()}`}
                        >
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="favoriteFood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Food</FormLabel>
                        <FormControl>
                          <Input placeholder="What did they love to eat?" {...field} data-testid="input-favorite-food" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="favoriteToy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Toy</FormLabel>
                        <FormControl>
                          <Input placeholder="What was their favorite toy?" {...field} data-testid="input-favorite-toy" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialTraits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What Made Them Special</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share what made them unique and irreplaceable..." 
                            className="min-h-24"
                            {...field} 
                            data-testid="textarea-special-traits"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Life Story</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell their story - how they came into your life, adventures together, cherished moments..." 
                            className="min-h-32"
                            {...field} 
                            data-testid="textarea-biography"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-500" />
                    Memorial Theme & Settings
                  </CardTitle>
                  <CardDescription>
                    Customize how their memorial looks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Memorial Theme</FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {themeOptions.map((theme) => {
                            const Icon = theme.icon;
                            return (
                              <div
                                key={theme.value}
                                className={`
                                  relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                                  ${field.value === theme.value ? "border-purple-500 ring-2 ring-purple-200" : "border-transparent"}
                                `}
                                onClick={() => field.onChange(theme.value)}
                                data-testid={`theme-${theme.value}`}
                              >
                                <div className={`h-20 bg-gradient-to-r ${theme.color}`} />
                                <div className="p-3 bg-white dark:bg-gray-800 flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium">{theme.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="epitaph"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Epitaph</FormLabel>
                        <FormDescription>A short tribute message</FormDescription>
                        <FormControl>
                          <Input 
                            placeholder="Forever in our hearts..." 
                            {...field} 
                            data-testid="input-epitaph"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rainbowBridgeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rainbow Bridge Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A special message for your pet across the Rainbow Bridge..." 
                            className="min-h-24"
                            {...field} 
                            data-testid="textarea-rainbow-message"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Public Memorial</FormLabel>
                            <FormDescription>Allow others to find and view</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-public" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowCondolences"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Allow Condolences</FormLabel>
                            <FormDescription>Let visitors leave messages</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-condolences" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                data-testid="button-previous-step"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(s => Math.min(3, s + 1))}
                  data-testid="button-next-step"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  data-testid="button-create-memorial"
                >
                  {createMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Memorial
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
