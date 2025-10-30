import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Flame, Activity, Plus, X, Heart, ArrowLeft } from "lucide-react";

const essentialWorkerSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  profession: z.string().min(2, "Profession is required"),
  category: z.enum(["police", "fire", "medical", "military", "other"]),
  department: z.string().optional(),
  yearsOfService: z.number().int().min(0).optional().or(z.literal("")),
  biography: z.string().min(10, "Please write at least a brief biography"),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  lineOfDutyDeath: z.boolean().default(false),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),
  // Category-specific fields
  rank: z.string().optional(),
  badgeNumber: z.string().optional(),
  unit: z.string().optional(),
  serviceBranch: z.string().optional(),
  specialization: z.string().optional(),
  precinct: z.string().optional(),
  station: z.string().optional(),
});

type EssentialWorkerForm = z.infer<typeof essentialWorkerSchema>;

export default function CreateEssentialWorkerMemorial() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");
  const [honors, setHonors] = useState<Array<{ award: string; year: string; description: string }>>([]);
  const [deployments, setDeployments] = useState<Array<{ location: string; years: string; campaign?: string }>>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  const form = useForm<EssentialWorkerForm>({
    resolver: zodResolver(essentialWorkerSchema),
    defaultValues: {
      fullName: "",
      profession: "",
      category: (categoryParam as any) || "police",
      department: "",
      yearsOfService: "",
      biography: "",
      imageUrl: "",
      lineOfDutyDeath: false,
      birthDate: "",
      deathDate: "",
      rank: "",
      badgeNumber: "",
      unit: "",
      serviceBranch: "",
      specialization: "",
      precinct: "",
      station: "",
    },
  });

  const selectedCategory = form.watch("category");

  const createMutation = useMutation({
    mutationFn: async (data: EssentialWorkerForm) => {
      const payload = {
        ...data,
        yearsOfService: data.yearsOfService === "" ? undefined : Number(data.yearsOfService),
        certifications: certifications.length > 0 ? certifications : undefined,
        honors: honors.length > 0 ? honors : undefined,
        deployments: deployments.length > 0 ? deployments : undefined,
      };
      return await apiRequest("POST", "/api/essential-workers", payload);
    },
    onSuccess: () => {
      toast({
        title: "Memorial created successfully",
        description: "The essential worker memorial has been published.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/essential-workers"] });
      navigate("/essential-workers");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create memorial",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EssentialWorkerForm) => {
    createMutation.mutate(data);
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setCertifications([...certifications, newCertification.trim()]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const getCategoryIcon = () => {
    switch (selectedCategory) {
      case "police": return <Shield className="w-6 h-6 text-blue-600" />;
      case "fire": return <Flame className="w-6 h-6 text-red-600" />;
      case "medical": return <Activity className="w-6 h-6 text-green-600" />;
      case "military": return <Shield className="w-6 h-6 text-purple-600" />;
      default: return <Heart className="w-6 h-6 text-primary" />;
    }
  };

  const getCategoryColor = () => {
    switch (selectedCategory) {
      case "police": return "bg-blue-100 dark:bg-blue-900/30 border-blue-300";
      case "fire": return "bg-red-100 dark:bg-red-900/30 border-red-300";
      case "medical": return "bg-green-100 dark:bg-green-900/30 border-green-300";
      case "military": return "bg-purple-100 dark:bg-purple-900/30 border-purple-300";
      default: return "bg-muted border-border";
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/essential-workers")}
        className="mb-6"
        data-testid="button-back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Essential Workers
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor()}`}>
              {getCategoryIcon()}
            </div>
            <div>
              <CardTitle className="text-3xl">Create Essential Worker Memorial</CardTitle>
              <CardDescription>Honor a hero who served their community</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">Step 1: Basic Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us about the essential worker you're honoring
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="police">Police Officer</SelectItem>
                            <SelectItem value="fire">Firefighter</SelectItem>
                            <SelectItem value="medical">Medical Worker</SelectItem>
                            <SelectItem value="military">Military</SelectItem>
                            <SelectItem value="other">Other Essential Worker</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-fullname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession/Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Police Officer, Firefighter, ER Nurse, Army Sergeant" 
                            {...field} 
                            data-testid="input-profession" 
                          />
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
                          <FormLabel>Birth Date</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/DD/YYYY" {...field} data-testid="input-birthdate" />
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
                            <Input placeholder="MM/DD/YYYY" {...field} data-testid="input-deathdate" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="biography"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biography *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell their story, their service, and their impact on the community..."
                            className="min-h-[150px]"
                            {...field}
                            data-testid="input-biography"
                          />
                        </FormControl>
                        <FormDescription>
                          Share their dedication, sacrifices, and the lives they touched
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/photo.jpg" 
                            {...field} 
                            data-testid="input-imageurl" 
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a URL to a photo (in uniform preferred)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={() => setStep(2)} data-testid="button-next-step1">
                      Next: Professional Details
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-2">Step 2: Professional Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Add specific details about their service
                    </p>
                  </div>

                  {/* Police-specific fields */}
                  {selectedCategory === "police" && (
                    <>
                      <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rank</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Officer, Sergeant, Lieutenant, Captain" {...field} data-testid="input-rank" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="badgeNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge Number</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} data-testid="input-badge" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="precinct"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Precinct/District</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 5th Precinct" {...field} data-testid="input-precinct" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., NYPD, LAPD" {...field} data-testid="input-department" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Firefighter-specific fields */}
                  {selectedCategory === "fire" && (
                    <>
                      <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rank</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Firefighter, Lieutenant, Captain, Chief" {...field} data-testid="input-rank" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="badgeNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Badge Number</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} data-testid="input-badge" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="station"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fire Station</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Station 5, Engine Company 1" {...field} data-testid="input-station" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fire Department</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., FDNY, LA Fire Department" {...field} data-testid="input-department" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Medical-specific fields */}
                  {selectedCategory === "medical" && (
                    <>
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Emergency Medicine, ICU Nurse, Paramedic" {...field} data-testid="input-specialization" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospital/Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., St. Mary's Hospital - ER" {...field} data-testid="input-unit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medical Facility/Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Johns Hopkins Hospital" {...field} data-testid="input-department" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Military-specific fields */}
                  {selectedCategory === "military" && (
                    <>
                      <FormField
                        control={form.control}
                        name="rank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rank</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Private, Sergeant, Lieutenant Colonel, General" {...field} data-testid="input-rank" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="serviceBranch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Branch</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-branch">
                                  <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Army">U.S. Army</SelectItem>
                                <SelectItem value="Navy">U.S. Navy</SelectItem>
                                <SelectItem value="Air Force">U.S. Air Force</SelectItem>
                                <SelectItem value="Marines">U.S. Marine Corps</SelectItem>
                                <SelectItem value="Coast Guard">U.S. Coast Guard</SelectItem>
                                <SelectItem value="Space Force">U.S. Space Force</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Military Unit</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 101st Airborne Division" {...field} data-testid="input-unit" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="yearsOfService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Service</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="20" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                            data-testid="input-years"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Certifications */}
                  <div className="space-y-3">
                    <FormLabel>Professional Certifications</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        placeholder="e.g., EMT-P, CPR Instructor"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                        data-testid="input-new-certification"
                      />
                      <Button type="button" onClick={addCertification} size="icon" data-testid="button-add-certification">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="ml-2"
                              data-testid={`button-remove-cert-${index}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="lineOfDutyDeath"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-line-of-duty"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Line of Duty Death</FormLabel>
                          <FormDescription>
                            This person died while serving their community
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back-step2">
                      Back
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
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
    </div>
  );
}
