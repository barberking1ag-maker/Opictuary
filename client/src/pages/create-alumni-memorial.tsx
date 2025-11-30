import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { GraduationCap, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { insertAlumniMemorialSchema, type InsertAlumniMemorial } from "@shared/schema";

type AlumniMemorialFormData = InsertAlumniMemorial;

const steps = [
  { id: 1, title: "Personal Information", description: "Basic information about the alumnus" },
  { id: 2, title: "Education", description: "Academic background and achievements" },
  { id: 3, title: "Activities & Achievements", description: "Campus involvement and accomplishments" },
  { id: 4, title: "Review", description: "Review and submit" },
];

const degreeTypes = ["Associate", "Bachelor", "Master", "PhD", "Honorary", "Certificate"];

export default function CreateAlumniMemorial() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [activities, setActivities] = useState<Array<{ name: string; role: string; years: string }>>([]);
  const [achievements, setAchievements] = useState<string[]>([]);

  const form = useForm<AlumniMemorialFormData>({
    resolver: zodResolver(insertAlumniMemorialSchema),
    defaultValues: {
      fullName: "",
      preferredName: "",
      birthDate: "",
      deathDate: "",
      biography: "",
      epitaph: "",
      schoolName: "",
      campusLocation: "",
      graduationYear: "",
      degreeType: "",
      major: "",
      classNotes: "",
      isPublic: true,
      activities: [],
      notableAchievements: [],
    },
  });

  // School autocomplete
  const { data: schools = [] } = useQuery<string[]>({
    queryKey: ['/api/alumni-memorials/schools/autocomplete', schoolQuery],
    enabled: schoolQuery.length > 2,
  });

  const createMemorialMutation = useMutation({
    mutationFn: async (data: AlumniMemorialFormData) => {
      const res = await apiRequest('POST', '/api/alumni-memorials', data);
      return await res.json();
    },
    onSuccess: (memorial) => {
      queryClient.invalidateQueries({ queryKey: ['/api/alumni-memorials'] });
      toast({
        title: "Success",
        description: "Alumni memorial created successfully",
      });
      setLocation(`/alumni-memorials/${memorial.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create memorial",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AlumniMemorialFormData) => {
    createMemorialMutation.mutate({
      ...data,
      activities: activities.length > 0 ? activities : undefined,
      notableAchievements: achievements.length > 0 ? achievements : undefined,
    });
  };

  const addActivity = () => {
    setActivities([...activities, { name: "", role: "", years: "" }]);
  };

  const updateActivity = (index: number, field: keyof typeof activities[0], value: string) => {
    const newActivities = [...activities];
    newActivities[index][field] = value;
    setActivities(newActivities);
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    setAchievements([...achievements, ""]);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 text-yellow-400">
          <GraduationCap className="w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">Create Alumni Memorial</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep > step.id
                        ? "bg-yellow-400 text-blue-900"
                        : currentStep === step.id
                        ? "bg-blue-600 text-white ring-4 ring-yellow-400"
                        : "bg-blue-800 text-gray-400"
                    }`}
                    data-testid={`step-indicator-${step.id}`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-gray-400"}`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? "bg-yellow-400" : "bg-blue-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-blue-900">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      {...form.register("fullName")}
                      placeholder="John Michael Smith"
                      data-testid="input-full-name"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="preferredName">Preferred Name</Label>
                    <Input
                      id="preferredName"
                      {...form.register("preferredName")}
                      placeholder="Mike Smith"
                      data-testid="input-preferred-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthDate">Birth Date *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        {...form.register("birthDate")}
                        data-testid="input-birth-date"
                      />
                      {form.formState.errors.birthDate && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.birthDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="deathDate">Death Date *</Label>
                      <Input
                        id="deathDate"
                        type="date"
                        {...form.register("deathDate")}
                        data-testid="input-death-date"
                      />
                      {form.formState.errors.deathDate && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.deathDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="biography">Biography</Label>
                    <Textarea
                      id="biography"
                      {...form.register("biography")}
                      placeholder="Tell us about their life, accomplishments, and impact..."
                      rows={6}
                      data-testid="textarea-biography"
                    />
                  </div>

                  <div>
                    <Label htmlFor="epitaph">Epitaph</Label>
                    <Textarea
                      id="epitaph"
                      {...form.register("epitaph")}
                      placeholder="A memorable quote or message..."
                      rows={3}
                      data-testid="textarea-epitaph"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="schoolName">School/University Name *</Label>
                    <Input
                      id="schoolName"
                      {...form.register("schoolName")}
                      placeholder="Start typing to search..."
                      onChange={(e) => {
                        form.setValue("schoolName", e.target.value);
                        setSchoolQuery(e.target.value);
                      }}
                      data-testid="input-school-name"
                    />
                    {schools.length > 0 && (
                      <div className="mt-2 border rounded-md bg-white shadow-lg">
                        {schools.map((school) => (
                          <button
                            key={school}
                            type="button"
                            className="w-full text-left px-4 py-2 hover-elevate"
                            onClick={() => {
                              form.setValue("schoolName", school);
                              setSchoolQuery("");
                            }}
                            data-testid={`school-option-${school}`}
                          >
                            {school}
                          </button>
                        ))}
                      </div>
                    )}
                    {form.formState.errors.schoolName && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.schoolName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="campusLocation">Campus Location</Label>
                    <Input
                      id="campusLocation"
                      {...form.register("campusLocation")}
                      placeholder="City, State"
                      data-testid="input-campus-location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Input
                        id="graduationYear"
                        {...form.register("graduationYear")}
                        placeholder="Class of '09 or 2009"
                        data-testid="input-graduation-year"
                      />
                    </div>

                    <div>
                      <Label htmlFor="degreeType">Degree Type</Label>
                      <Select onValueChange={(value) => form.setValue("degreeType", value)}>
                        <SelectTrigger data-testid="select-degree-type">
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeTypes.map((type) => (
                            <SelectItem key={type} value={type} data-testid={`degree-option-${type}`}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="major">Major/Department</Label>
                    <Input
                      id="major"
                      {...form.register("major")}
                      placeholder="e.g., Computer Science, History, Business"
                      data-testid="input-major"
                    />
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">College Logo (Permission Required)</p>
                    <p className="text-xs text-gray-500">
                      Please ensure you have permission to use the institution's logo before uploading
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Activities & Achievements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Campus Activities</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addActivity} data-testid="button-add-activity">
                        Add Activity
                      </Button>
                    </div>
                    {activities.map((activity, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 mb-3">
                        <Input
                          placeholder="Activity name"
                          value={activity.name}
                          onChange={(e) => updateActivity(index, "name", e.target.value)}
                          className="col-span-4"
                          data-testid={`input-activity-name-${index}`}
                        />
                        <Input
                          placeholder="Role"
                          value={activity.role}
                          onChange={(e) => updateActivity(index, "role", e.target.value)}
                          className="col-span-3"
                          data-testid={`input-activity-role-${index}`}
                        />
                        <Input
                          placeholder="Years"
                          value={activity.years}
                          onChange={(e) => updateActivity(index, "years", e.target.value)}
                          className="col-span-3"
                          data-testid={`input-activity-years-${index}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(index)}
                          className="col-span-2"
                          data-testid={`button-remove-activity-${index}`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Notable Achievements</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addAchievement} data-testid="button-add-achievement">
                        Add Achievement
                      </Button>
                    </div>
                    {achievements.map((achievement, index) => (
                      <div key={index} className="flex gap-2 mb-3">
                        <Input
                          placeholder="Achievement description"
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          className="flex-1"
                          data-testid={`input-achievement-${index}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                          data-testid={`button-remove-achievement-${index}`}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="classNotes">Class Notes</Label>
                    <Textarea
                      id="classNotes"
                      {...form.register("classNotes")}
                      placeholder="Share memories, stories, or messages from classmates..."
                      rows={6}
                      data-testid="textarea-class-notes"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-blue-900 text-lg">Review Your Memorial</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Full Name</p>
                        <p className="font-medium">{form.getValues("fullName")}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">School</p>
                        <p className="font-medium">{form.getValues("schoolName")}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Graduation Year</p>
                        <p className="font-medium">{form.getValues("graduationYear") || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Degree</p>
                        <p className="font-medium">{form.getValues("degreeType") || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Major</p>
                        <p className="font-medium">{form.getValues("major") || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Activities</p>
                        <p className="font-medium">{activities.length} activities</p>
                      </div>
                    </div>
                    {form.getValues("biography") && (
                      <div>
                        <p className="text-gray-600 text-sm">Biography</p>
                        <p className="text-sm mt-1">{form.getValues("biography")}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  data-testid="button-prev-step"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-900 hover:bg-blue-800"
                    data-testid="button-next-step"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createMemorialMutation.isPending}
                    className="bg-yellow-400 text-blue-900 hover:bg-yellow-500"
                    data-testid="button-submit-memorial"
                  >
                    {createMemorialMutation.isPending ? "Creating..." : "Create Memorial"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
