import { useState } from "react";
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
import { Heart, ArrowLeft, Settings, QrCode as QrCodeIcon, Users, Clock, Plus } from "lucide-react";
import { QRCodeManager } from "@/components/QRCodeManager";
import { ScheduledMessageCard } from "@/components/ScheduledMessageCard";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
  eventType: z.enum(["birthday", "graduation", "wedding", "anniversary", "baby_birth", "holiday", "custom"]),
  eventDate: z.string().min(1, "Event date is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  mediaUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  mediaType: z.enum(["text", "video", "image", "mixed"]).optional(),
});

type ScheduledMessageFormData = z.infer<typeof scheduledMessageSchema>;

export default function ManageMemorial() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<any | null>(null);

  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials", id],
    enabled: !!id,
  });

  const { data: scheduledMessages = [] } = useQuery({
    queryKey: ["/api/memorials", id, "scheduled-messages"],
    enabled: !!id,
  });

  const form = useForm<ScheduledMessageFormData>({
    resolver: zodResolver(scheduledMessageSchema),
    defaultValues: {
      recipientName: "",
      recipientEmail: "",
      eventType: "birthday",
      eventDate: "",
      message: "",
      mediaUrl: "",
      mediaType: "text",
    },
  });

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
    form.reset({
      recipientName: message.recipientName,
      recipientEmail: message.recipientEmail || "",
      eventType: message.eventType,
      eventDate: message.eventDate || "",
      message: message.message,
      mediaUrl: message.mediaUrl || "",
      mediaType: message.mediaType || "text",
    });
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
          </TabsList>

          <TabsContent value="qr-codes" className="mt-6">
            <QRCodeManager
              memorialId={memorial.id}
              memorialName={memorialName}
              inviteCode={memorial.inviteCode}
            />
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
                  onClick={() => {
                    setEditingMessage(null);
                    form.reset();
                    setIsMessageDialogOpen(true);
                  }}
                  data-testid="button-create-scheduled-message"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Message
                </Button>
              </div>

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
              <DialogContent className="bg-purple-900 border-purple-700 text-purple-100 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-purple-100">
                    {editingMessage ? "Edit Scheduled Message" : "Create Scheduled Message"}
                  </DialogTitle>
                  <DialogDescription className="text-purple-300">
                    Schedule a message to be sent to a loved one on a special date
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        <FormLabel className="text-purple-100">Recipient Email (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="john@example.com" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-recipient-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
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
                            <SelectItem value="holiday">Holiday</SelectItem>
                            <SelectItem value="custom">Custom Event</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="eventDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100">Event Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-event-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100">Message *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={6} placeholder="Your heartfelt message..." className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-message-text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="mediaUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-100">Media URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/video.mp4" className="bg-purple-950/50 border-purple-700/50 text-purple-100" data-testid="input-media-url-message" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsMessageDialogOpen(false)} data-testid="button-cancel-message">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-message">
                        {editingMessage ? "Update" : "Create"} Message
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
        </Tabs>
      </main>
    </div>
  );
}
