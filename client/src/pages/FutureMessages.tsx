import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Mail, Repeat, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";

interface FutureMessage {
  id: string;
  memorialId: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
  scheduledDate: string;
  occasion: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  mediaAttachmentUrl?: string;
  isSent: boolean;
  sentAt?: string;
  createdAt: string;
}

const messageSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Valid email is required"),
  occasion: z.string().min(1, "Occasion is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  recurrenceCount: z.number().optional(),
  recurrenceEndDate: z.string().optional(),
  mediaAttachmentUrl: z.string().optional(),
});

type MessageFormData = z.infer<typeof messageSchema>;

const occasions = [
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "holiday", label: "Holiday" },
  { value: "graduation", label: "Graduation" },
  { value: "wedding", label: "Wedding Day" },
  { value: "mothers_day", label: "Mother's Day" },
  { value: "fathers_day", label: "Father's Day" },
  { value: "custom", label: "Custom Occasion" },
];

const recurrencePatterns = [
  { value: "daily", label: "Every Day" },
  { value: "weekly", label: "Every Week" },
  { value: "monthly", label: "Every Month" },
  { value: "yearly", label: "Every Year" },
];

const messageTemplates: Record<string, string> = {
  birthday: "Happy Birthday! Though I'm not there to celebrate with you, I want you to know how proud I am of you. May your day be filled with joy and love.",
  anniversary: "Happy Anniversary! This special day reminds me of all the beautiful memories we shared. Cherish every moment.",
  holiday: "Wishing you a wonderful holiday season filled with love, warmth, and cherished memories of times we spent together.",
  mothers_day: "Happy Mother's Day! Your strength, love, and wisdom continue to inspire me every day.",
  fathers_day: "Happy Father's Day! Thank you for all the lessons, love, and guidance you've given me throughout the years.",
  graduation: "Congratulations on your graduation! This achievement makes me so proud. The future is bright ahead of you.",
  wedding: "Congratulations on your wedding! May your marriage be filled with endless love, laughter, and happiness.",
};

export default function FutureMessages() {
  const [, params] = useRoute("/memorial/:id/future-messages");
  const memorialId = params?.id || "";
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<FutureMessage[]>({
    queryKey: ["/api/memorials", memorialId, "scheduled-messages"],
  });

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      occasion: "",
      scheduledDate: "",
      message: "",
      isRecurring: false,
      recurrencePattern: "",
      recurrenceCount: undefined,
      recurrenceEndDate: "",
      mediaAttachmentUrl: "",
    },
  });

  const createMessageMutation = useMutation({
    mutationFn: async (data: MessageFormData) => {
      // Transform frontend field names to backend field names
      const backendData = {
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        eventType: data.occasion,
        eventDate: data.scheduledDate.split('T')[0], // Extract date part only
        sendTime: data.scheduledDate.split('T')[1], // Extract time part
        message: data.message,
        isRecurring: data.isRecurring,
        recurrenceInterval: data.recurrencePattern as 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined,
        recurrenceCount: data.recurrenceCount,
        recurrenceEndDate: data.recurrenceEndDate || undefined,
        attachmentUrls: data.mediaAttachmentUrl ? [data.mediaAttachmentUrl] : undefined,
        status: 'pending' as const,
      };
      const res = await apiRequest("POST", `/api/memorials/${memorialId}/scheduled-messages`, backendData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "scheduled-messages"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Message Scheduled",
        description: "Future message has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: MessageFormData) => {
    createMessageMutation.mutate(data);
  };

  const handleTemplateSelect = (occasion: string) => {
    setSelectedTemplate(occasion);
    if (messageTemplates[occasion]) {
      form.setValue("message", messageTemplates[occasion]);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Future Messages</h1>
          <p className="text-muted-foreground">Schedule heartfelt messages for future occasions</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-message">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Future Message</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full name"
                            {...field}
                            data-testid="input-recipient-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recipientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            {...field}
                            data-testid="input-recipient-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="occasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occasion</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleTemplateSelect(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-occasion">
                            <SelectValue placeholder="Select occasion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {occasions.map((occasion) => (
                            <SelectItem key={occasion.value} value={occasion.value}>
                              {occasion.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecting an occasion will auto-fill a template message
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          data-testid="input-scheduled-date"
                        />
                      </FormControl>
                      <FormDescription>
                        When should this message be sent?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your message here..."
                          rows={6}
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormDescription>
                        This message will be sent to the recipient on the scheduled date
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mediaAttachmentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Attachment URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://... (photo or video)"
                          {...field}
                          data-testid="input-media-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Include a photo or video with your message
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          Recurring Message
                        </FormLabel>
                        <FormDescription>
                          Send this message every year on this date
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-recurring"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("isRecurring") && (
                  <>
                    <FormField
                      control={form.control}
                      name="recurrencePattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurrence Pattern</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-recurrence">
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {recurrencePatterns.map((pattern) => (
                                <SelectItem key={pattern.value} value={pattern.value}>
                                  {pattern.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="recurrenceCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Occurrences</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Leave empty for forever"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                data-testid="input-recurrence-count"
                              />
                            </FormControl>
                            <FormDescription>
                              How many times to repeat
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="recurrenceEndDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                data-testid="input-recurrence-end-date"
                              />
                            </FormControl>
                            <FormDescription>
                              When to stop recurring
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMessageMutation.isPending}
                    data-testid="button-submit-message"
                  >
                    {createMessageMutation.isPending ? "Scheduling..." : "Schedule Message"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Scheduled Messages Yet</h3>
          <p className="text-muted-foreground mb-4">
            Schedule messages to be delivered to loved ones on future occasions
          </p>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-schedule-first">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Message
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {messages.map((message) => {
            const scheduledDate = new Date(message.scheduledDate);
            const isPast = scheduledDate < new Date();

            return (
              <Card key={message.id} data-testid={`card-message-${message.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{message.recipientName}</CardTitle>
                        {message.isSent ? (
                          <Badge variant="secondary" data-testid={`badge-sent-${message.id}`}>Sent</Badge>
                        ) : isPast ? (
                          <Badge variant="outline" data-testid={`badge-pending-${message.id}`}>Pending</Badge>
                        ) : (
                          <Badge data-testid={`badge-scheduled-${message.id}`}>Scheduled</Badge>
                        )}
                        {message.isRecurring && (
                          <Badge variant="secondary" data-testid={`badge-recurring-${message.id}`}>
                            <Repeat className="w-3 h-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {occasions.find(o => o.value === message.occasion)?.label || message.occasion}
                        {" • "}
                        <Clock className="w-4 h-4" />
                        {format(scheduledDate, "MMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Message</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{message.message}</p>
                  </div>

                  {message.mediaAttachmentUrl && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Attachment</h4>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Badge variant="outline">Media included</Badge>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {message.recipientEmail}
                    </div>
                    {message.isSent && message.sentAt && (
                      <span className="text-xs">Sent {format(new Date(message.sentAt), "MMM d, yyyy")}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
