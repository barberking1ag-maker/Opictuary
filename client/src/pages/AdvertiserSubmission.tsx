import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Megaphone, CheckCircle2 } from "lucide-react";

const adSubmissionSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  productName: z.string().min(1, "Product/service name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(20, "Please provide at least 20 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string()
    .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format")
    .min(10, "Phone must be at least 10 digits")
    .optional().or(z.literal("")),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  pricing: z.string()
    .refine(val => val === "" || val.length >= 2, "Please provide pricing information")
    .optional().or(z.literal("")),
  commissionPercentage: z.string()
    .refine(val => val === "" || (Number(val) >= 0 && Number(val) <= 100), "Must be between 0 and 100")
    .optional().or(z.literal("")),
  referralCode: z.string().optional().or(z.literal("")),
  expiresAt: z.string().optional(),
});

type AdSubmissionForm = z.infer<typeof adSubmissionSchema>;

const AD_CATEGORIES = [
  { value: "caskets", label: "Caskets & Coffins" },
  { value: "urns", label: "Urns & Cremation" },
  { value: "flowers", label: "Flowers & Arrangements" },
  { value: "memorials", label: "Memorial Products" },
  { value: "services", label: "Funeral Services" },
  { value: "customization", label: "Customization Services" },
  { value: "cardboard", label: "Cardboard Cutouts" },
  { value: "photography", label: "Photography & Video" },
  { value: "transportation", label: "Transportation Services" },
  { value: "other", label: "Other Products/Services" },
];

export default function AdvertiserSubmission() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<AdSubmissionForm>({
    resolver: zodResolver(adSubmissionSchema),
    defaultValues: {
      companyName: "",
      productName: "",
      category: "",
      description: "",
      imageUrl: "",
      contactEmail: "",
      contactPhone: "",
      websiteUrl: "",
      pricing: "",
      commissionPercentage: "",
      referralCode: "",
      expiresAt: "",
    },
  });

  const submitAd = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/advertisements", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Advertisement Submitted",
        description: "Your advertisement will be reviewed and activated shortly.",
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

  const onSubmit = (data: AdSubmissionForm) => {
    const normalizedData = {
      ...data,
      imageUrl: data.imageUrl || undefined,
      websiteUrl: data.websiteUrl || undefined,
      expiresAt: data.expiresAt || undefined,
      contactPhone: data.contactPhone || undefined,
      pricing: data.pricing || undefined,
      commissionPercentage: data.commissionPercentage ? Number(data.commissionPercentage) : undefined,
      referralCode: data.referralCode || undefined,
    };
    submitAd.mutate(normalizedData);
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Advertisement Submitted</CardTitle>
            <CardDescription>
              Thank you for your submission. Your advertisement is pending review and will be activated once approved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your ad will be reviewed within 24-48 hours</li>
                <li>• You'll receive a confirmation email once approved</li>
                <li>• Your ad will appear on relevant memorial pages</li>
                <li>• Track impressions and clicks via your dashboard</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
              }}
              variant="outline"
              className="w-full"
              data-testid="button-submit-another"
            >
              Submit Another Advertisement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Advertise Your Services</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Reach families during important moments with respectful, relevant products and services for memorial needs.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your company</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-company-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" data-testid="input-contact-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." data-testid="input-website" />
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
              <CardTitle>Product/Service Details</CardTitle>
              <CardDescription>What you're offering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Premium Oak Casket" data-testid="input-product-name" />
                    </FormControl>
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AD_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={4} 
                        placeholder="Describe your product or service..."
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." data-testid="input-image-url" />
                    </FormControl>
                    <FormDescription className="text-xs">Product image</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pricing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Starting at $1,200" data-testid="input-pricing" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires On (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-expires-at" />
                      </FormControl>
                      <FormDescription className="text-xs">When ad should stop showing</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commissionPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Fee % (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="0" max="100" placeholder="e.g. 10" data-testid="input-commission-percentage" />
                      </FormControl>
                      <FormDescription className="text-xs">% Opictuary receives from your sales</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referral Code (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. PARTNER123" data-testid="input-referral-code" />
                      </FormControl>
                      <FormDescription className="text-xs">Unique code for tracking sales through Opictuary</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100">
              Advertising Guidelines
            </h4>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Maintain respectful, dignified messaging appropriate for memorial contexts</li>
              <li>• Ensure all contact information and pricing is accurate</li>
              <li>• Images should be professional and product-focused</li>
              <li>• Ads are subject to approval and may be removed if guidelines are violated</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={submitAd.isPending} data-testid="button-submit-ad">
            {submitAd.isPending ? "Submitting..." : "Submit Advertisement"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
