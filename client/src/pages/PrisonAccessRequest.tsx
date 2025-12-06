import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Shield, Users, FileCheck, CreditCard, CheckCircle2 } from "lucide-react";
import type { InsertPrisonAccessRequest, PrisonFacility } from "@shared/schema";

const accessRequestSchema = z.object({
  memorialId: z.string().min(1, "Please select a memorial"),
  facilityId: z.string().min(1, "Please select a facility"),
  inmateFirstName: z.string().min(1, "First name is required"),
  inmateLastName: z.string().min(1, "Last name is required"),
  inmateDocNumber: z.string().min(1, "DOC number is required"),
  relationshipToDeceased: z.string().min(1, "Relationship is required"),
  requestedByName: z.string().min(1, "Your name is required"),
  requestedByEmail: z.string().email("Valid email is required"),
  requestedByPhone: z.string().optional(),
  relationshipProofUrl: z.string().url().optional().or(z.literal("")),
  additionalNotes: z.string().optional(),
});

type AccessRequestForm = z.infer<typeof accessRequestSchema>;

export default function PrisonAccessRequest() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const { data: facilities, isLoading: facilitiesLoading } = useQuery<PrisonFacility[]>({
    queryKey: ["/api/prison-facilities"],
  });

  const { data: memorials, isLoading: memorialsLoading } = useQuery<any[]>({
    queryKey: ["/api/memorials"],
  });

  const form = useForm<AccessRequestForm>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      memorialId: "",
      facilityId: "",
      inmateFirstName: "",
      inmateLastName: "",
      inmateDocNumber: "",
      relationshipToDeceased: "",
      requestedByName: "",
      requestedByEmail: "",
      requestedByPhone: "",
      relationshipProofUrl: "",
      additionalNotes: "",
    },
  });

  const createRequest = useMutation({
    mutationFn: async (data: AccessRequestForm) => {
      const res = await apiRequest("POST", "/api/prison-access-requests", data);
      return await res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/prison-access-requests"] });
      setSubmittedRequestId(data.id);
      setStep(5);
      toast({
        title: "Request Submitted",
        description: "Your prison access request has been submitted for review.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AccessRequestForm) => {
    createRequest.mutate(data);
  };

  const validateAndAdvance = async (nextStep: number, fieldsToValidate: (keyof AccessRequestForm)[]) => {
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(nextStep);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              s === step
                ? "border-primary bg-primary text-primary-foreground"
                : s < step
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
          {s < 4 && (
            <div
              className={`w-16 h-0.5 ${
                s < step ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  if (submittedRequestId) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Request Submitted Successfully</CardTitle>
            <CardDescription>
              Your prison access request has been submitted and is now under review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Request ID:</span>
                <span className="text-sm font-mono text-muted-foreground" data-testid="text-request-id">{submittedRequestId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <span className="text-sm text-amber-600 font-medium" data-testid="text-request-status">Pending Review</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">What Happens Next?</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">1.</span>
                  <span>The correctional facility will verify the inmate's identity using the provided DOC number.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">2.</span>
                  <span>Your relationship to the deceased will be verified through the documentation provided.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">3.</span>
                  <span>You'll receive payment instructions for the facility access fees (typically $0.15/minute).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-semibold">4.</span>
                  <span>Once approved and paid, a secure access token will be provided to the inmate.</span>
                </li>
              </ol>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => {
                  setSubmittedRequestId(null);
                  setStep(1);
                  form.reset();
                }}
                className="w-full"
                data-testid="button-new-request"
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-serif font-bold mb-2">Prison Access Request</h1>
        <p className="text-muted-foreground">
          Request memorial access for an incarcerated loved one through a secure, verified process.
        </p>
      </div>

      {renderStepIndicator()}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Select Memorial & Facility</CardTitle>
                    <CardDescription>Choose which memorial to access and the correctional facility</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="memorialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memorial</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-memorial">
                            <SelectValue placeholder="Select a memorial" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {memorialsLoading ? (
                            <SelectItem value="loading">Loading...</SelectItem>
                          ) : (
                            memorials?.map((memorial: any) => (
                              <SelectItem key={memorial.id} value={memorial.id}>
                                {memorial.fullName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facilityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correctional Facility</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-facility">
                            <SelectValue placeholder="Select a facility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {facilitiesLoading ? (
                            <SelectItem value="loading">Loading...</SelectItem>
                          ) : (
                            facilities?.map((facility) => (
                              <SelectItem key={facility.id} value={facility.id}>
                                {facility.name} - {facility.state}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button 
                    type="button" 
                    onClick={() => validateAndAdvance(2, ["memorialId", "facilityId"])} 
                    data-testid="button-next-step-1"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Inmate Information</CardTitle>
                    <CardDescription>Provide details for identity verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="inmateFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-inmate-firstname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="inmateLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-inmate-lastname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="inmateDocNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DOC Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Department of Corrections ID number" data-testid="input-doc-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relationshipToDeceased"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Deceased</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Son, Daughter, Friend" data-testid="input-relationship" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back-step-2">
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => validateAndAdvance(3, ["inmateFirstName", "inmateLastName", "inmateDocNumber", "relationshipToDeceased"])} 
                    data-testid="button-next-step-2"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>We need your contact details to process this request</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="requestedByName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-requestor-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="requestedByEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" data-testid="input-requestor-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestedByPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" data-testid="input-requestor-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} data-testid="button-back-step-3">
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => validateAndAdvance(4, ["requestedByName", "requestedByEmail"])} 
                    data-testid="button-next-step-3"
                  >
                    Next Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Verification & Documentation</CardTitle>
                    <CardDescription>Provide relationship proof to complete the request</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="relationshipProofUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship Proof Document URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." data-testid="input-proof-url" />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Upload your document to a file sharing service and paste the link here. Accepted: birth certificates, legal documents, letters from family.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} data-testid="input-notes" />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Any additional information to help with the verification process.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">Important Information</h4>
                  <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                    <li>• Access fees are typically $0.15 per minute</li>
                    <li>• Verification can take 2-5 business days</li>
                    <li>• You'll receive payment instructions via email</li>
                    <li>• Access tokens are time-limited for security</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(3)} data-testid="button-back-step-4">
                    Back
                  </Button>
                  <Button type="submit" disabled={createRequest.isPending} data-testid="button-submit-request">
                    {createRequest.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  );
}
