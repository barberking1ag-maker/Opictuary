import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { HandshakeIcon, CheckCircle2 } from "lucide-react";

const partnerSignupSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string()
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format")
    .min(10, "Phone must be at least 10 digits"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  commissionRate: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
});

type PartnerSignupForm = z.infer<typeof partnerSignupSchema>;

export default function PartnerSignup() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [partnerData, setPartnerData] = useState<any>(null);

  const form = useForm<PartnerSignupForm>({
    resolver: zodResolver(partnerSignupSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      commissionRate: "3.00",
      bankAccountName: "",
      bankAccountNumber: "",
      bankRoutingNumber: "",
    },
  });

  const submitPartner = useMutation({
    mutationFn: async (data: PartnerSignupForm) => {
      const res = await apiRequest("POST", "/api/funeral-home-partners", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setPartnerData(data);
      setIsSubmitted(true);
      toast({
        title: "Partnership Application Submitted",
        description: "Your funeral home partnership application has been received.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit partnership application",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PartnerSignupForm) => {
    const normalizedData = {
      ...data,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zipCode: data.zipCode || undefined,
      commissionRate: data.commissionRate || "3.00",
      bankAccountName: data.bankAccountName || undefined,
      bankAccountNumber: data.bankAccountNumber || undefined,
      bankRoutingNumber: data.bankRoutingNumber || undefined,
    };
    submitPartner.mutate(normalizedData);
  };

  if (isSubmitted && partnerData) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Card className="border-primary/20">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif">Partnership Confirmed!</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to the Opictuary Funeral Home Partner Network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-accent/10 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-foreground">Your Referral Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Referral Code:</span>
                  <span className="font-mono text-lg font-bold text-primary" data-testid="text-referral-code">
                    {partnerData.referralCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Commission Rate:</span>
                  <span className="font-semibold text-foreground" data-testid="text-commission-rate">
                    {partnerData.commissionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Business Name:</span>
                  <span className="font-semibold text-foreground" data-testid="text-business-name">
                    {partnerData.businessName}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">How to Use Your Referral Code</h4>
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                <li>• Share your referral code with families you serve</li>
                <li>• Families enter the code when creating a memorial</li>
                <li>• You earn {partnerData.commissionRate}% commission on all donations to their fundraisers</li>
                <li>• Access your dashboard to track referrals and earnings</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.href = `/partner-dashboard/${partnerData.id}`}
                className="flex-1"
                data-testid="button-go-to-dashboard"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(partnerData.referralCode);
                  toast({ title: "Copied!", description: "Referral code copied to clipboard" });
                }}
                data-testid="button-copy-code"
              >
                Copy Referral Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <HandshakeIcon className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
          Funeral Home Partnership
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our partner network and earn commissions by referring families to create digital memorials
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your funeral home</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Smith & Sons Funeral Home" data-testid="input-business-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Smith" data-testid="input-contact-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="contact@funeral home.com" data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+1 555-123-4567" data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="123 Main Street" data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Springfield" data-testid="input-city" />
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
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="IL" data-testid="input-state" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="62701" data-testid="input-zip-code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Banking Information (Optional)</CardTitle>
              <CardDescription>For commission payouts - you can add this later</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bankAccountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Smith & Sons Funeral Home" data-testid="input-bank-account-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="••••••••••" data-testid="input-bank-account-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bankRoutingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="123456789" data-testid="input-bank-routing-number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Partnership Benefits</h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• Earn 3% commission on all donations to referred memorial fundraisers</li>
              <li>• Receive monthly payout reports and statements</li>
              <li>• Access partner dashboard to track referrals and earnings</li>
              <li>• Provide additional value to the families you serve</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg" 
            disabled={submitPartner.isPending}
            data-testid="button-submit"
          >
            {submitPartner.isPending ? "Submitting..." : "Join Partner Network"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
