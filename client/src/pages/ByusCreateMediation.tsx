import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Scale, Users, FileText, Save } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Form schema
const mediationSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.enum(["dispute", "divorce", "business", "family", "other"]),
  description: z.string().min(10, "Please provide more details about the situation"),
  party1Name: z.string().min(2, "Please enter party 1's name"),
  party1Email: z.string().email().optional().or(z.literal("")),
  party1Perspective: z.string().min(50, "Please provide at least 50 characters for party 1's perspective"),
  party2Name: z.string().min(2, "Please enter party 2's name"),
  party2Email: z.string().email().optional().or(z.literal("")),
  party2Perspective: z.string().min(50, "Please provide at least 50 characters for party 2's perspective"),
  desiredOutcome: z.string().min(10, "Please describe your desired outcome"),
  additionalContext: z.string().optional(),
  confidentialityLevel: z.enum(["standard", "confidential"]),
});

type MediationFormData = z.infer<typeof mediationSchema>;

const MEDIATION_CATEGORIES = [
  { value: "dispute", label: "General Dispute", icon: "⚖️" },
  { value: "divorce", label: "Divorce/Separation", icon: "💔" },
  { value: "business", label: "Business Conflict", icon: "💼" },
  { value: "family", label: "Family Matter", icon: "👨‍👩‍👧‍👦" },
  { value: "other", label: "Other", icon: "📋" },
];

export default function ByusCreateMediation() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MediationFormData>({
    resolver: zodResolver(mediationSchema),
    defaultValues: {
      title: "",
      category: "dispute",
      description: "",
      party1Name: "",
      party1Email: "",
      party1Perspective: "",
      party2Name: "",
      party2Email: "",
      party2Perspective: "",
      desiredOutcome: "",
      additionalContext: "",
      confidentialityLevel: "standard",
    },
  });

  const saveDraftMutation = useMutation({
    mutationFn: (data: MediationFormData) => 
      apiRequest("POST", "/api/byus/mediations", { 
        ...data, 
        status: "draft",
        creatorId: "test-user-123" // Hardcoded test user ID for now
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/byus/mediations"] });
      toast({
        title: "Draft saved",
        description: "Your mediation has been saved as a draft.",
      });
    },
  });

  const submitMediationMutation = useMutation({
    mutationFn: (data: MediationFormData) =>
      apiRequest("POST", "/api/byus/mediations", { 
        ...data, 
        status: "active", 
        aiAnalysisRequested: true,
        creatorId: "test-user-123" // Hardcoded test user ID for now
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/byus/mediations"] });
      toast({
        title: "Mediation submitted",
        description: "Your mediation is being analyzed. You'll be notified when results are ready.",
      });
      setLocation(`/byus/mediation/${data.id}`);
    },
  });

  const handleSaveDraft = async () => {
    const data = form.getValues();
    setIsSaving(true);
    try {
      await saveDraftMutation.mutateAsync(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (data: MediationFormData) => {
    await submitMediationMutation.mutateAsync(data);
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return form.getValues("title") && form.getValues("category") && form.getValues("description");
      case 2:
        return form.getValues("party1Name") && form.getValues("party1Perspective");
      case 3:
        return form.getValues("party2Name") && form.getValues("party2Perspective");
      case 4:
        return form.getValues("desiredOutcome");
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mediation Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Business Partnership Dispute"
                      data-testid="input-title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give your mediation a clear, descriptive title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MEDIATION_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Situation Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation that needs mediation..."
                      className="min-h-[120px]"
                      data-testid="textarea-description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a neutral overview of the situation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Party 1 Information</h3>
              <p className="text-sm text-muted-foreground">
                Enter details for the first party in this mediation
              </p>
            </div>

            <FormField
              control={form.control}
              name="party1Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 1 Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name or identifier"
                      data-testid="input-party1-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="party1Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 1 Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      data-testid="input-party1-email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    If provided, they'll receive the mediation results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="party1Perspective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 1's Perspective</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation from Party 1's point of view..."
                      className="min-h-[200px]"
                      data-testid="textarea-party1-perspective"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be detailed and include emotions, concerns, and desired outcomes from their perspective
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-secondary/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Party 2 Information</h3>
              <p className="text-sm text-muted-foreground">
                Enter details for the second party in this mediation
              </p>
            </div>

            <FormField
              control={form.control}
              name="party2Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 2 Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name or identifier"
                      data-testid="input-party2-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="party2Email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 2 Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      data-testid="input-party2-email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    If provided, they'll receive the mediation results
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="party2Perspective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Party 2's Perspective</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the situation from Party 2's point of view..."
                      className="min-h-[200px]"
                      data-testid="textarea-party2-perspective"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be detailed and include emotions, concerns, and desired outcomes from their perspective
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="desiredOutcome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Outcome</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to achieve through this mediation?"
                      className="min-h-[120px]"
                      data-testid="textarea-desired-outcome"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the ideal resolution for both parties
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalContext"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Context (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information that might be relevant..."
                      className="min-h-[100px]"
                      data-testid="textarea-additional-context"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any relevant history, constraints, or special considerations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confidentialityLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Confidentiality Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="standard" id="standard" data-testid="radio-standard" />
                        <Label htmlFor="standard" className="font-normal cursor-pointer">
                          Standard - Results may be used for platform improvements (anonymized)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="confidential" id="confidential" data-testid="radio-confidential" />
                        <Label htmlFor="confidential" className="font-normal cursor-pointer">
                          Confidential - Results will not be used for any other purpose
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="byus-theme min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Link href="/byus/dashboard">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Create New Mediation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`step-${step}`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      currentStep > step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">Basic Info</span>
            <span className="text-xs text-muted-foreground">Party 1</span>
            <span className="text-xs text-muted-foreground">Party 2</span>
            <span className="text-xs text-muted-foreground">Details</span>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Party 1 Details"}
              {currentStep === 3 && "Party 2 Details"}
              {currentStep === 4 && "Additional Details"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Start by providing basic information about the mediation"}
              {currentStep === 2 && "Enter information and perspective for the first party"}
              {currentStep === 3 && "Enter information and perspective for the second party"}
              {currentStep === 4 && "Provide any additional context and preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  <div className="flex gap-2">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        data-testid="button-previous"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      data-testid="button-save-draft"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save Draft"}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (canProceed(currentStep)) {
                            setCurrentStep(currentStep + 1);
                          } else {
                            toast({
                              title: "Please complete all required fields",
                              variant: "destructive",
                            });
                          }
                        }}
                        data-testid="button-next"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitMediationMutation.isPending}
                        data-testid="button-submit"
                      >
                        {submitMediationMutation.isPending ? "Submitting..." : "Submit for Analysis"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}