import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarIcon, MapPin, Users, Plus, Clock, Bell, Mail, MessageSquare, Flame, Shield, Heart as HeartIcon, TreePine, Footprints, GraduationCap } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
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

interface MemorialEvent {
  id: string;
  memorialId: string;
  eventType: string;
  eventDate: string;
  location: string;
  description: string;
  sendReminders: boolean;
  createdAt: string;
}

interface EventRsvp {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  status: string;
  createdAt: string;
}

const eventSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sendReminders: z.boolean().default(true),
});

type EventFormData = z.infer<typeof eventSchema>;

const eventTypes = [
  { value: "balloon_release", label: "Balloon Release", icon: HeartIcon },
  { value: "candlelight_vigil", label: "Candlelight Vigil", icon: Flame },
  { value: "memorial_picnic", label: "Memorial Picnic", icon: Users },
  { value: "memorial_barbecue", label: "Memorial Barbecue", icon: Flame },
  { value: "tree_planting", label: "Tree Planting", icon: TreePine },
  { value: "charity_walk", label: "Charity Walk", icon: Footprints },
  { value: "scholarship_announcement", label: "Scholarship Announcement", icon: GraduationCap },
];

export default function MemorialEvents() {
  const [, params] = useRoute("/memorial/:id/events");
  const memorialId = params?.id || "";
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MemorialEvent | null>(null);
  const { toast } = useToast();

  const { data: events = [], isLoading } = useQuery<MemorialEvent[]>({
    queryKey: ["/api/memorials", memorialId, "events"],
  });

  const { data: rsvps = [] } = useQuery<EventRsvp[]>({
    queryKey: ["/api/events", selectedEvent?.id, "rsvps"],
    enabled: !!selectedEvent,
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventType: "",
      eventDate: "",
      location: "",
      description: "",
      sendReminders: true,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const res = await apiRequest("POST", `/api/memorials/${memorialId}/events`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "events"] });
      setIsCreateOpen(false);
      form.reset();
      toast({
        title: "Event Created",
        description: "Memorial event has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const getEventTypeDisplay = (type: string) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType || { value: type, label: type, icon: CalendarIcon };
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Memorial Events</h1>
          <p className="text-muted-foreground">Plan and manage memorial gatherings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-event">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Memorial Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-event-type">
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {eventTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <Icon className="w-4 h-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date & Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          data-testid="input-event-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter event location"
                          {...field}
                          data-testid="input-location"
                        />
                      </FormControl>
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
                          placeholder="Describe the event details..."
                          rows={4}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendReminders"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Send Reminders</FormLabel>
                        <FormDescription>
                          Email and text reminders will be sent to attendees
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-send-reminders"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

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
                    disabled={createEventMutation.isPending}
                    data-testid="button-submit-event"
                  >
                    {createEventMutation.isPending ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first memorial event to bring loved ones together
          </p>
          <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-first-event">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const eventType = getEventTypeDisplay(event.eventType);
            const eventDate = new Date(event.eventDate);
            const isPast = eventDate < new Date();

            return (
              <Card
                key={event.id}
                className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setSelectedEvent(event)}
                data-testid={`card-event-${event.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-2">
                        {(() => {
                          const Icon = eventType.icon;
                          return <Icon className="w-8 h-8 text-primary" />;
                        })()}
                      </div>
                      <CardTitle className="text-lg">{eventType.label}</CardTitle>
                    </div>
                    {isPast ? (
                      <Badge variant="secondary" data-testid={`badge-past-${event.id}`}>Past</Badge>
                    ) : (
                      <Badge data-testid={`badge-upcoming-${event.id}`}>Upcoming</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4" />
                    {format(eventDate, "MMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{event.location}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{event.description}</p>
                  {event.sendReminders && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Bell className="w-3 h-3" />
                      Reminders enabled
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div>
                    {(() => {
                      const Icon = getEventTypeDisplay(selectedEvent.eventType).icon;
                      return <Icon className="w-12 h-12 text-primary" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2">
                      {getEventTypeDisplay(selectedEvent.eventType).label}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="w-4 h-4" />
                      {format(new Date(selectedEvent.eventDate), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Location</h4>
                    <p className="text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-muted-foreground">{selectedEvent.description}</p>
                  </div>
                </div>

                {selectedEvent.sendReminders && (
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Reminders</h4>
                      <p className="text-muted-foreground">
                        Email and text reminders will be sent to all attendees
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Attendees ({rsvps.length})
                </h4>
                {rsvps.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No RSVPs yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {rsvps.map((rsvp) => (
                      <div
                        key={rsvp.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`rsvp-${rsvp.id}`}
                      >
                        <div>
                          <p className="font-medium">{rsvp.attendeeName}</p>
                          {rsvp.attendeeEmail && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {rsvp.attendeeEmail}
                            </p>
                          )}
                        </div>
                        <Badge variant={rsvp.status === "confirmed" ? "default" : "secondary"}>
                          {rsvp.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
