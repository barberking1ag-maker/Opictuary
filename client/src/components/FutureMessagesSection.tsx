import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Heart, Calendar, Mail, Sparkles, Plus, MessageSquare, Repeat, User, FileText, Gift } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { messageTemplates, getTemplatesByEventType } from "@/lib/messageTemplates";
import { ScheduledMessageCard } from "@/components/ScheduledMessageCard";
import { format } from "date-fns";

const scheduledMessageSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  eventType: z.enum(["birthday", "graduation", "wedding", "anniversary", "baby_birth", "holiday", "mother_day", "father_day", "christmas", "new_year", "custom"]),
  customEventName: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  sendTime: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  mediaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z.enum(['yearly', 'monthly', 'custom']).optional(),
  status: z.enum(['draft', 'pending', 'sent', 'failed']).optional(),
}).refine((data) => {
  if (data.isRecurring && !data.recurrenceInterval) {
    return false;
  }
  return true;
}, {
  message: "Please select a recurrence frequency",
  path: ["recurrenceInterval"],
});

type ScheduledMessageFormData = z.infer<typeof scheduledMessageSchema>;

interface FutureMessagesSectionProps {
  memorialId: string;
  memorialName: string;
  canCreate?: boolean;
}

const eventTypeLabels: Record<string, { label: string; icon: any; description: string }> = {
  birthday: { label: "Birthday", icon: Gift, description: "Send wishes on their special day" },
  graduation: { label: "Graduation", icon: Sparkles, description: "Celebrate their achievement" },
  wedding: { label: "Wedding", icon: Heart, description: "Bless their union" },
  anniversary: { label: "Anniversary", icon: Heart, description: "Celebrate years together" },
  baby_birth: { label: "Baby Birth", icon: Heart, description: "Welcome a new life" },
  mother_day: { label: "Mother's Day", icon: Heart, description: "Honor mothers" },
  father_day: { label: "Father's Day", icon: Heart, description: "Appreciate fathers" },
  christmas: { label: "Christmas", icon: Sparkles, description: "Holiday blessings" },
  new_year: { label: "New Year", icon: Sparkles, description: "New beginnings" },
  holiday: { label: "Holiday", icon: Sparkles, description: "Special occasions" },
  custom: { label: "Custom Event", icon: Calendar, description: "Your own occasion" },
};

export function FutureMessagesSection({ memorialId, memorialName, canCreate = true }: FutureMessagesSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showTemplates, setShowTemplates] = useState(true);
  const { toast } = useToast();

  const { data: scheduledMessages = [] } = useQuery<any[]>({
    queryKey: ["/api/memorials", memorialId, "scheduled-messages"],
    enabled: !!memorialId,
  });

  const form = useForm<ScheduledMessageFormData>({
    resolver: zodResolver(scheduledMessageSchema),
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      eventType: "birthday",
      customEventName: "",
      eventDate: "",
      sendTime: "09:00",
      message: "",
      mediaUrl: "",
      isRecurring: false,
      recurrenceInterval: undefined,
      status: "pending",
    },
  });

  const watchEventType = form.watch("eventType");
  const watchIsRecurring = form.watch("isRecurring");

  const createMutation = useMutation({
    mutationFn: (data: ScheduledMessageFormData) =>
      apiRequest("POST", `/api/memorials/${memorialId}/scheduled-messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "scheduled-messages"] });
      toast({ title: "Future Message Created", description: "Your message has been scheduled successfully!" });
      setIsDialogOpen(false);
      form.reset();
      setSelectedTemplate("");
      setShowTemplates(true);
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create scheduled message",
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) =>
      apiRequest("DELETE", `/api/memorials/${memorialId}/scheduled-messages/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "scheduled-messages"] });
      toast({ title: "Message Deleted", description: "The scheduled message has been removed." });
    },
  });

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      form.setValue("message", template.message);
      setShowTemplates(false);
    }
  };

  const onSubmit = (data: ScheduledMessageFormData) => {
    createMutation.mutate(data);
  };

  const availableTemplates = getTemplatesByEventType(watchEventType);

  const pendingMessages = scheduledMessages.filter(m => m.status === 'pending' || (!m.isSent && !m.status));
  const sentMessages = scheduledMessages.filter(m => m.isSent || m.status === 'sent');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 flex items-center gap-3">
            <Clock className="w-8 h-8 text-primary" />
            Future Messages
          </h2>
          <p className="text-muted-foreground">
            Send heartfelt messages to loved ones on special occasions in the future
          </p>
        </div>
        {canCreate && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-md" data-testid="button-create-future-message">
                <Plus className="w-5 h-5 mr-2" />
                Create Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Create a Future Message
                </DialogTitle>
                <DialogDescription>
                  Schedule a heartfelt message to be delivered to loved ones on special occasions
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Recipient Information
                    </h3>
                    
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., My daughter Sarah" {...field} data-testid="input-recipient-name" />
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
                          <FormLabel>Recipient Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} data-testid="input-recipient-email" />
                          </FormControl>
                          <FormDescription>
                            If provided, the message will be emailed on the scheduled date
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Event Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Event Details
                    </h3>

                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-event-type">
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(eventTypeLabels).map(([value, { label, description }]) => (
                                <SelectItem key={value} value={value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{label}</span>
                                    <span className="text-xs text-muted-foreground">{description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchEventType === "custom" && (
                      <FormField
                        control={form.control}
                        name="customEventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Event Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., First Day of College" {...field} data-testid="input-custom-event" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-event-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sendTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Send Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-send-time" />
                            </FormControl>
                            <FormDescription className="text-xs">
                              When to send on that day
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isRecurring"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4 bg-muted/20">
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

                    {watchIsRecurring && (
                      <FormField
                        control={form.control}
                        name="recurrenceInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recurrence Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-recurrence">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <Separator />

                  {/* Message Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Message Content
                      </h3>
                      {!showTemplates && availableTemplates.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowTemplates(true)}
                          data-testid="button-show-templates"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Browse Templates
                        </Button>
                      )}
                    </div>

                    {showTemplates && availableTemplates.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Choose a template to get started:</p>
                        <div className="grid gap-2">
                          {availableTemplates.map((template) => (
                            <Button
                              key={template.id}
                              type="button"
                              variant="outline"
                              className="justify-start h-auto py-3 px-4 text-left"
                              onClick={() => handleTemplateSelect(template.id)}
                              data-testid={`button-template-${template.id}`}
                            >
                              <div className="flex-1">
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                        <Separator className="my-4" />
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your heartfelt message here..."
                              className="min-h-[200px] resize-y"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormDescription>
                            Personalize the message or use it as-is
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mediaUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Media URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/video.mp4" {...field} data-testid="input-media-url" />
                          </FormControl>
                          <FormDescription>
                            Include a video or image link with your message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        form.reset();
                        setSelectedTemplate("");
                        setShowTemplates(true);
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-message">
                      {createMutation.isPending ? "Creating..." : "Create Message"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Scheduled Messages */}
      {scheduledMessages.length > 0 ? (
        <div className="space-y-8">
          {pendingMessages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Scheduled Messages ({pendingMessages.length})
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {pendingMessages.map((message) => (
                  <ScheduledMessageCard
                    key={message.id}
                    message={message}
                    onEdit={() => {}}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))}
              </div>
            </div>
          )}

          {sentMessages.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
                <Mail className="w-5 h-5" />
                Delivered Messages ({sentMessages.length})
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {sentMessages.map((message) => (
                  <ScheduledMessageCard
                    key={message.id}
                    message={message}
                    onEdit={() => {}}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-border/50 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="bg-primary/10 rounded-full p-6 mb-6">
              <Clock className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Future Messages Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create heartfelt messages to be delivered to loved ones on birthdays, anniversaries, graduations, and other special occasions in the future.
            </p>
            {canCreate && (
              <Button size="lg" onClick={() => setIsDialogOpen(true)} data-testid="button-create-first-message">
                <Plus className="w-5 h-5 mr-2" />
                Create First Message
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
