import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Settings, QrCode as QrCodeIcon, Users, Clock, Plus, FileText, Repeat, Calendar, Info, BookOpen, Music, Video, Sparkles, PlayCircle } from "lucide-react";
import { QRCodeManager } from "@/components/QRCodeManager";
import { ScheduledMessageCard } from "@/components/ScheduledMessageCard";
import { ReligiousSymbolGallery } from "@/components/ReligiousSymbolGallery";
import { MusicPlaylistManager } from "@/components/MusicPlaylistManager";
import { SlideshowCreator } from "@/components/SlideshowCreator";
import { SlideshowPlayer } from "@/components/SlideshowPlayer";
import { VideoCondolence } from "@/components/VideoCondolence";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { messageTemplates, getTemplatesByEventType, getTemplateById } from "@/lib/messageTemplates";

interface Memorial {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  inviteCode: string;
  creatorEmail: string;
  isPublic: boolean;
}

const scheduledMessageSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  eventType: z.enum(["birthday", "graduation", "wedding", "anniversary", "baby_birth", "holiday", "mother_day", "father_day", "christmas", "new_year", "custom"]),
  customEventName: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  sendTime: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  mediaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  mediaType: z.enum(["text", "video", "image", "mixed"]).optional(),
  isRecurring: z.boolean().optional(),
  recurrenceInterval: z.enum(['yearly', 'monthly', 'custom']).optional(),
  status: z.enum(['draft', 'pending', 'sent', 'failed']).optional(),
}).refine((data) => {
  // If isRecurring is true, recurrenceInterval must be set
  if (data.isRecurring && !data.recurrenceInterval) {
    return false;
  }
  return true;
}, {
  message: "Please select a recurrence frequency",
  path: ["recurrenceInterval"],
});

type ScheduledMessageFormData = z.infer<typeof scheduledMessageSchema>;

export default function ManageMemorial() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showTemplateSection, setShowTemplateSection] = useState(true);

  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials", id],
    enabled: !!id,
  });

  const { data: scheduledMessages = [] } = useQuery<any[]>({
    queryKey: ["/api/memorials", id, "scheduled-messages"],
    enabled: !!id,
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
      mediaType: "text",
      isRecurring: false,
      recurrenceInterval: undefined,
      status: "pending",
    },
  });

  // Watch the eventType and isRecurring fields for conditional rendering
  const watchEventType = form.watch("eventType");
  const watchIsRecurring = form.watch("isRecurring");

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(templateId);
      form.setValue("message", template.message);
      setShowTemplateSection(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: (data: ScheduledMessageFormData) =>
      apiRequest("POST", `/api/memorials/${id}/scheduled-messages`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", id, "scheduled-messages"] });
      toast({ title: "Success", description: "Scheduled message created!" });
      setIsMessageDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error('Create mutation error:', error);
      const errorMessage = error?.message || "Failed to create message.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ScheduledMessageFormData) =>
      apiRequest("PATCH", `/api/scheduled-messages/${editingMessage?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", id, "scheduled-messages"] });
      toast({ title: "Success", description: "Message updated!" });
      setIsMessageDialogOpen(false);
      setEditingMessage(null);
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId: string) =>
      apiRequest("DELETE", `/api/scheduled-messages/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", id, "scheduled-messages"] });
      toast({ title: "Success", description: "Message deleted." });
    },
  });

  const handleEdit = (message: any) => {
    setEditingMessage(message);
    setShowTemplateSection(false);
    setSelectedTemplate("");
    form.reset({
      recipientName: message.recipientName,
      recipientEmail: message.recipientEmail || "",
      eventType: message.eventType,
      customEventName: message.customEventName || "",
      eventDate: message.eventDate || "",
      sendTime: message.sendTime || "09:00",
      message: message.message,
      mediaUrl: message.mediaUrl || "",
      mediaType: message.mediaType || "text",
      isRecurring: message.isRecurring || false,
      recurrenceInterval: message.recurrenceInterval || undefined,
      status: message.status || "pending",
    });
    setIsMessageDialogOpen(true);
  };

  const handleOpenCreateDialog = () => {
    setEditingMessage(null);
    setShowTemplateSection(true);
    setSelectedTemplate("");
    form.reset();
    setIsMessageDialogOpen(true);
  };

  const handleSubmit = (data: ScheduledMessageFormData) => {
    console.log('[FRONTEND] Form submitted with data:', JSON.stringify(data, null, 2));
    console.log('[FRONTEND] Memorial ID:', id);
    console.log('[FRONTEND] Editing message:', editingMessage ? 'yes' : 'no');
    
    if (editingMessage) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gold-400 animate-pulse mx-auto mb-4" />
          <p className="text-purple-200">Loading memorial...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-purple-900/50 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-100">Memorial Not Found</CardTitle>
            <CardDescription className="text-purple-300">
              The memorial you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/my-memorials")}
              className="w-full"
              data-testid="button-go-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Memorials
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memorialName = memorial.name || `${memorial.firstName} ${memorial.lastName}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      {/* Header */}
      <header className="border-b border-purple-700/50 bg-purple-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/my-memorials")}
              className="text-purple-200 hover:text-purple-100"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              My Memorials
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/memorial/${memorial.inviteCode}`)}
              data-testid="button-view-memorial"
            >
              View Memorial
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-purple-100 mb-2" data-testid="text-memorial-name">
            Manage Memorial: {memorialName}
          </h1>
          <p className="text-purple-300">
            Manage QR codes, settings, and permissions for this memorial
          </p>
        </div>

        <Tabs defaultValue="qr-codes" className="w-full">
          <TabsList className="bg-purple-900/50 border-purple-700/50">
            <TabsTrigger value="qr-codes" data-testid="tab-qr-codes">
              <QrCodeIcon className="w-4 h-4 mr-2" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="funeral-program" data-testid="tab-funeral-program">
              <BookOpen className="w-4 h-4 mr-2" />
              Funeral Program
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="scheduled-messages" data-testid="tab-scheduled-messages">
              <Clock className="w-4 h-4 mr-2" />
              Scheduled Messages
            </TabsTrigger>
            <TabsTrigger value="admins" data-testid="tab-admins">
              <Users className="w-4 h-4 mr-2" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="symbols" data-testid="tab-symbols">
              <Sparkles className="w-4 h-4 mr-2" />
              Symbols
            </TabsTrigger>
            <TabsTrigger value="music" data-testid="tab-music">
              <Music className="w-4 h-4 mr-2" />
              Music
            </TabsTrigger>
            <TabsTrigger value="slideshows" data-testid="tab-slideshows">
              <PlayCircle className="w-4 h-4 mr-2" />
              Slideshows
            </TabsTrigger>
            <TabsTrigger value="video-condolences" data-testid="tab-video-condolences">
              <Video className="w-4 h-4 mr-2" />
              Video Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr-codes" className="mt-6">
            <QRCodeManager
              memorialId={memorial.id}
              memorialName={memorialName}
              inviteCode={memorial.inviteCode}
            />
          </TabsContent>

          <TabsContent value="funeral-program" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Digital Funeral Program</CardTitle>
                <CardDescription className="text-purple-300">
                  Create a beautiful digital program for attendees to follow during the service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-purple-200">
                  Design a comprehensive funeral program that includes:
                </p>
                <ul className="list-disc list-inside text-purple-300 space-y-2 ml-4">
                  <li>Service date, time, and location details</li>
                  <li>Order of service with hymns, readings, and eulogies</li>
                  <li>Family information and acknowledgments</li>
                  <li>Reception details for after the service</li>
                </ul>
                <p className="text-purple-300 text-sm">
                  Attendees can view the program on their phones or desktop during the service, making it easy to follow along without printing physical copies.
                </p>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => navigate(`/memorials/${memorial.id}/program-edit`)}
                    data-testid="button-edit-program"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Create/Edit Program
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/memorial/${memorial.id}/program`)}
                    data-testid="button-preview-program"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Preview Program
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Memorial Settings</CardTitle>
                <CardDescription className="text-purple-300">
                  Configure privacy and display settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled-messages" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-purple-100">Scheduled Messages</h2>
                  <p className="text-purple-300 mt-1">
                    Schedule heartfelt messages to loved ones for future milestones
                  </p>
                </div>
                <Button
                  onClick={handleOpenCreateDialog}
                  data-testid="button-create-scheduled-message"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Message
                </Button>
              </div>

              {/* Explanatory Card */}
              <Card className="bg-gradient-to-r from-purple-900/40 to-purple-800/40 border-gold-500/30">
                <CardContent className="py-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center">
                        <Info className="w-5 h-5 text-gold-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-purple-100 mb-2">Create Future Messages for Loved Ones</h3>
                      <p className="text-sm text-purple-300 leading-relaxed">
                        Write heartfelt messages today that will be automatically delivered to your loved ones on 
                        future occasions like birthdays, graduations, weddings, and anniversaries.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {scheduledMessages.length === 0 ? (
                <Card className="bg-purple-900/50 border-purple-700/50">
                  <CardContent className="py-16 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-gold-400" />
                    <h3 className="text-xl font-semibold text-purple-100 mb-2">No Scheduled Messages</h3>
                    <p className="text-purple-300 mb-6">
                      Create your first scheduled message to send love to your family on special occasions.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {scheduledMessages.map((message: any) => (
                    <ScheduledMessageCard
                      key={message.id}
                      message={message}
                      onEdit={handleEdit}
                      onDelete={(id) => deleteMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
              <DialogContent className="bg-purple-900 border-purple-700 text-purple-100 max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-purple-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold-400" />
                    {editingMessage ? "Edit Scheduled Message" : "Create Scheduled Message"}
                  </DialogTitle>
                  <DialogDescription className="text-purple-300">
                    Schedule a heartfelt message to be sent to loved ones on special dates
                  </DialogDescription>
                </DialogHeader>

                {/* Explanatory Section - Only show when creating new */}
                {!editingMessage && (
                  <div className="bg-gradient-to-r from-purple-950/60 to-purple-800/40 border border-gold-500/20 rounded-lg p-4 mb-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
                          <Info className="w-4 h-4 text-gold-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-purple-100 mb-1">Leave Your Legacy</h4>
                        <p className="text-xs text-purple-300 leading-relaxed">
                          Create messages that will be delivered at future milestones. Whether facing a terminal 
                          illness or simply planning ahead, you can be there for your children's graduations, 
                          your daughter's wedding, your son's first job, or any special occasion. Your voice, 
                          love, and guidance will reach them when they need it most.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    
                    {/* Template Selection - Only show when creating new */}
                    {!editingMessage && showTemplateSection && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-purple-100 text-base">Start with a Template (Optional)</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTemplateSection(false)}
                            className="text-purple-300"
                          >
                            Skip Templates
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-1">
                          {getTemplatesByEventType(watchEventType).map((template) => (
                            <Card
                              key={template.id}
                              className={`cursor-pointer border-purple-700/50 hover-elevate ${
                                selectedTemplate === template.id ? 'bg-purple-800/50 border-gold-500/50' : 'bg-purple-950/30'
                              }`}
                              onClick={() => handleTemplateSelect(template.id)}
                              data-testid={`card-template-${template.id}`}
                            >
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-purple-100 mb-1">{template.name}</h4>
                                <p className="text-xs text-purple-300 line-clamp-2">{template.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recipient Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400" />
                        Recipient Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="recipientName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Recipient Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="John Doe" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-recipient-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="recipientEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Recipient Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="john@example.com" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-recipient-email" />
                            </FormControl>
                            <FormDescription className="text-xs text-purple-400">
                              Optional - for email delivery
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>

                    <Separator className="bg-purple-700/30" />

                    {/* Event Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-100">Event Details</h3>
                      <FormField control={form.control} name="eventType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">Event Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="select-event-type">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-purple-900 border-purple-700">
                              <SelectItem value="birthday">Birthday</SelectItem>
                              <SelectItem value="graduation">Graduation</SelectItem>
                              <SelectItem value="wedding">Wedding</SelectItem>
                              <SelectItem value="anniversary">Anniversary</SelectItem>
                              <SelectItem value="baby_birth">Baby Birth</SelectItem>
                              <SelectItem value="mother_day">Mother's Day</SelectItem>
                              <SelectItem value="father_day">Father's Day</SelectItem>
                              <SelectItem value="christmas">Christmas</SelectItem>
                              <SelectItem value="new_year">New Year</SelectItem>
                              <SelectItem value="holiday">Holiday</SelectItem>
                              <SelectItem value="custom">Custom Event</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      {/* Custom Event Name - shown when custom is selected */}
                      {watchEventType === 'custom' && (
                        <FormField control={form.control} name="customEventName" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Custom Event Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., First Day of College" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-custom-event-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="eventDate" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Event Date *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-event-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="sendTime" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Send Time</FormLabel>
                            <FormControl>
                              <Input {...field} type="time" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-send-time" />
                            </FormControl>
                            <FormDescription className="text-xs text-purple-400">
                              Time of day to deliver the message
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {/* Recurring Message Option */}
                      <FormField control={form.control} name="isRecurring" render={({ field }) => (
                        <FormItem className="flex items-center justify-between gap-4 p-4 rounded-lg bg-purple-950/30 border border-purple-700/30">
                          <div className="flex-1">
                            <FormLabel className="text-purple-100 font-semibold flex items-center gap-2">
                              <Repeat className="w-4 h-4 text-gold-400" />
                              Recurring Message
                            </FormLabel>
                            <FormDescription className="text-xs text-purple-400 mt-1">
                              Send this message annually on the same date
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
                      )} />

                      {watchIsRecurring && (
                        <FormField control={form.control} name="recurrenceInterval" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-100">Recurrence Frequency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="select-recurrence">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-purple-900 border-purple-700">
                                <SelectItem value="yearly">Yearly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      )}
                    </div>

                    <Separator className="bg-purple-700/30" />

                    {/* Message Content */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-100">Message Content</h3>
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">Your Message *</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={8} placeholder="Write your heartfelt message here..." className="bg-purple-950/50 border-purple-700/50 text-purple-100 resize-none" data-testid="input-message-text" />
                          </FormControl>
                          <FormDescription className="text-xs text-purple-400">
                            {field.value?.length || 0} characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="mediaUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">Media URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/video.mp4" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-media-url-message" />
                          </FormControl>
                          <FormDescription className="text-xs text-purple-400">
                            Optional - Add a video or image to your message
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <Separator className="bg-purple-700/30" />

                    {/* Advanced Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-100">Advanced Settings</h3>
                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-100">Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="select-status">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-purple-900 border-purple-700">
                              <SelectItem value="draft">📝 Draft (Save without scheduling)</SelectItem>
                              <SelectItem value="pending">⏰ Pending (Schedule for delivery)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs text-purple-400">
                            Drafts won't be sent until you change status to Pending
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <DialogFooter className="gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)} data-testid="button-cancel-message">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-message">
                        {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingMessage ? "Update Message" : "Create Message"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="admins" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100">Memorial Administrators</CardTitle>
                <CardDescription className="text-purple-300">
                  Manage who can help administer this memorial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Admin management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Religious Symbols Tab */}
          <TabsContent value="symbols" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                  Religious & Spiritual Symbols
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Add meaningful religious and spiritual symbols to honor their faith and beliefs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ReligiousSymbolGallery memorialId={memorial.id} canEdit={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Playlists Tab */}
          <TabsContent value="music" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center gap-2">
                  <Music className="w-5 h-5 text-gold-400" />
                  Music Playlists
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Create playlists of meaningful songs for slideshows and memorial pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MusicPlaylistManager memorialId={memorial.id} canEdit={true} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Slideshows Tab */}
          <TabsContent value="slideshows" className="mt-6">
            <SlideshowSection memorialId={memorial.id} />
          </TabsContent>

          {/* Video Condolences Tab */}
          <TabsContent value="video-condolences" className="mt-6">
            <Card className="bg-purple-900/50 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-purple-100 flex items-center gap-2">
                  <Video className="w-5 h-5 text-gold-400" />
                  Video Condolences
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Manage video messages from friends and family
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoCondolence memorialId={memorial.id} canApprove={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Slideshow Section Component
function SlideshowSection({ memorialId }: { memorialId: string }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSlideshow, setSelectedSlideshow] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Fetch slideshows
  const { data: slideshows = [] } = useQuery({
    queryKey: [`/api/memorials/${memorialId}/slideshows`],
  });

  // Delete slideshow
  const deleteSlideshowMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/slideshows/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/slideshows`] });
      toast({
        title: "Slideshow Deleted",
        description: "The slideshow has been removed.",
      });
    },
  });

  return (
    <>
      <Card className="bg-purple-900/50 border-purple-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-purple-100 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-gold-400" />
                Memorial Slideshows
              </CardTitle>
              <CardDescription className="text-purple-300">
                Create beautiful photo slideshows with music to celebrate their life
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              data-testid="button-create-slideshow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Slideshow
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {slideshows.length === 0 ? (
            <div className="text-center py-12">
              <PlayCircle className="w-16 h-16 mx-auto mb-4 text-gold-400 opacity-50" />
              <h3 className="text-xl font-semibold text-purple-100 mb-2">No Slideshows Yet</h3>
              <p className="text-purple-300 mb-6">
                Create your first slideshow to share cherished memories through photos and music
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slideshows.map((slideshow: any) => (
                <Card
                  key={slideshow.id}
                  className="bg-purple-950/30 border-purple-700/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-purple-100 text-lg">
                          {slideshow.title}
                        </CardTitle>
                        {slideshow.description && (
                          <CardDescription className="text-purple-300">
                            {slideshow.description}
                          </CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {slideshow.photoIds?.length || 0} photos
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-purple-300 mb-4">
                      <span>{slideshow.transitionType} transitions</span>
                      <Separator orientation="vertical" className="h-4" />
                      <span>{slideshow.photoDuration}s per photo</span>
                      {slideshow.playlistId && (
                        <>
                          <Separator orientation="vertical" className="h-4" />
                          <Music className="w-3 h-3" />
                          <span>Music</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSlideshow(slideshow);
                          setIsPlaying(true);
                        }}
                        data-testid={`button-play-${slideshow.id}`}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSlideshow(slideshow);
                          setIsCreateOpen(true);
                        }}
                        data-testid={`button-edit-slideshow-${slideshow.id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this slideshow?")) {
                            deleteSlideshowMutation.mutate(slideshow.id);
                          }
                        }}
                        data-testid={`button-delete-slideshow-${slideshow.id}`}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slideshow Creator Dialog */}
      <SlideshowCreator
        memorialId={memorialId}
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setSelectedSlideshow(null);
        }}
        editingSlideshow={selectedSlideshow && !isPlaying ? selectedSlideshow : undefined}
      />

      {/* Slideshow Player Dialog */}
      {isPlaying && selectedSlideshow && (
        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogContent className="max-w-4xl p-0 bg-black">
            <SlideshowPlayer
              slideshow={selectedSlideshow}
              memorialId={memorialId}
              onClose={() => {
                setIsPlaying(false);
                setSelectedSlideshow(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
