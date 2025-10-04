import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, Video, Heart, Lock, CheckCircle2 } from "lucide-react";
import { FontSelector } from "@/components/FontSelector";
import { SymbolSelector } from "@/components/SymbolSelector";

const selfObituarySchema = z.object({
  userEmail: z.string().email("Valid email is required"),
  fullName: z.string().min(1, "Full name is required"),
  birthDate: z.string().optional(),
  biography: z.string().min(10, "Please write at least a few sentences about yourself"),
  epitaph: z.string().optional(),
  finalWordsText: z.string().optional(),
  finalWordsVideoUrl: z.string().url().optional().or(z.literal("")),
  fontFamily: z.string().optional(),
  symbol: z.string().optional(),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactEmail: z.string().email("Valid email is required"),
  emergencyContactPhone: z.string().optional(),
  releaseInstructions: z.string().optional(),
});

type SelfObituaryForm = z.infer<typeof selfObituarySchema>;

export default function SelfObituary() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SelfObituaryForm>({
    resolver: zodResolver(selfObituarySchema),
    defaultValues: {
      userEmail: "",
      fullName: "",
      birthDate: "",
      biography: "",
      epitaph: "",
      finalWordsText: "",
      finalWordsVideoUrl: "",
      fontFamily: "",
      symbol: "",
      emergencyContactName: "",
      emergencyContactEmail: "",
      emergencyContactPhone: "",
      releaseInstructions: "",
    },
  });

  const createObituary = useMutation({
    mutationFn: async (data: SelfObituaryForm) => {
      const res = await apiRequest("POST", "/api/self-obituary", data);
      return await res.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Obituary Saved",
        description: "Your self-written obituary has been securely saved.",
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

  const onSubmit = (data: SelfObituaryForm) => {
    createObituary.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Obituary Saved Successfully</CardTitle>
            <CardDescription>
              Your self-written obituary and final words are securely stored and will be released according to your instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Your Information is Secure
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your obituary is safely encrypted and stored</li>
                <li>• Your emergency contact will be notified when appropriate</li>
                <li>• You can update this information anytime using your email</li>
                <li>• Your final words will only be shared per your instructions</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}
                variant="outline"
                className="w-full"
                data-testid="button-create-another"
              >
                Create Another
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
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Write Your Own Obituary</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create a lasting legacy by writing your own life story and recording final words for loved ones. 
          Your message will be safely stored and shared according to your wishes.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Basic details about you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="your.email@example.com" data-testid="input-email" />
                    </FormControl>
                    <FormDescription>Used to update your obituary in the future</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-fullname" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" data-testid="input-birthdate" />
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
              <CardTitle>Your Life Story</CardTitle>
              <CardDescription>Share your biography and legacy message</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={8} 
                        placeholder="Tell your life story: where you were born, your accomplishments, what mattered most to you..."
                        data-testid="input-biography"
                      />
                    </FormControl>
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
                      <Input {...field} placeholder="A brief phrase to be remembered by..." data-testid="input-epitaph" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personalization</CardTitle>
              <CardDescription>Choose how your memorial will be displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FontSelector value={field.value} onChange={field.onChange} testId="select-font" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SymbolSelector value={field.value} onChange={field.onChange} testId="select-symbol" />
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Final Words</CardTitle>
                  <CardDescription>Leave a message for your loved ones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="finalWordsText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Written Final Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={6} 
                        placeholder="Your final words, advice, or messages for family and friends..."
                        data-testid="input-final-words"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="finalWordsVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Message URL (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Video className="w-5 h-5 text-muted-foreground mt-2" />
                        <Input {...field} placeholder="https://youtube.com/watch?v=..." data-testid="input-video-url" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload your video to YouTube, Vimeo, or another platform and paste the link here
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Who should be notified to release this information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactEmail"
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

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" data-testid="input-contact-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="releaseInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3} 
                        placeholder="Special instructions for when and how to share your obituary..."
                        data-testid="input-instructions"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Privacy & Security
            </h4>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Your information is encrypted and securely stored</li>
              <li>• Only released when your emergency contact requests activation</li>
              <li>• You can update or delete this anytime using your email</li>
              <li>• Video messages remain private until release</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={createObituary.isPending} data-testid="button-save-obituary">
            {createObituary.isPending ? "Saving..." : "Save My Obituary & Final Words"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
