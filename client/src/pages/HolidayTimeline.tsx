import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Memorial } from "@shared/schema";
import { 
  Calendar, 
  Gift, 
  Heart, 
  Star, 
  Sun, 
  Moon, 
  Cake,
  Bell,
  Plus,
  ArrowLeft,
  Clock,
  CalendarDays,
  PartyPopper,
  TreePine,
  Cross,
  Flag,
  Users,
  Check,
  Edit2,
  Trash2
} from "lucide-react";
import { format, parseISO, differenceInDays, isBefore, addYears, startOfYear, endOfYear } from "date-fns";

interface HolidayEvent {
  id: string;
  memorialId: string;
  name: string;
  date: string;
  eventType: "birthday" | "anniversary" | "holiday" | "custom";
  description?: string;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  celebrationPlan?: string;
  traditions?: string[];
  isRecurring: boolean;
  createdAt: string;
}

const predefinedHolidays = [
  { name: "Memorial Day", date: "05-27", icon: Flag, type: "holiday" as const },
  { name: "Mother's Day", date: "05-12", icon: Heart, type: "holiday" as const },
  { name: "Father's Day", date: "06-16", icon: Heart, type: "holiday" as const },
  { name: "Christmas", date: "12-25", icon: TreePine, type: "holiday" as const },
  { name: "Easter", date: "04-20", icon: Cross, type: "holiday" as const },
  { name: "Thanksgiving", date: "11-28", icon: Users, type: "holiday" as const },
  { name: "All Saints Day", date: "11-01", icon: Star, type: "holiday" as const },
  { name: "Day of the Dead", date: "11-02", icon: Moon, type: "holiday" as const },
];

const eventTypeColors: Record<string, string> = {
  birthday: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  anniversary: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  holiday: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  custom: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

const eventTypeIcons: Record<string, any> = {
  birthday: Cake,
  anniversary: Heart,
  holiday: Calendar,
  custom: Star,
};

export default function HolidayTimeline() {
  const params = useParams();
  const memorialId = params.memorialId as string;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<HolidayEvent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    eventType: "custom" as "birthday" | "anniversary" | "holiday" | "custom",
    description: "",
    reminderEnabled: true,
    reminderDaysBefore: 7,
    celebrationPlan: "",
    traditions: [] as string[],
    isRecurring: true,
  });
  const [newTradition, setNewTradition] = useState("");
  const { toast } = useToast();

  const { data: memorial } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${memorialId}`],
    enabled: !!memorialId,
  });

  const { data: events, isLoading } = useQuery<HolidayEvent[]>({
    queryKey: [`/api/memorials/${memorialId}/holiday-events`],
    enabled: !!memorialId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<HolidayEvent, "id" | "memorialId" | "createdAt">) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/holiday-events`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/holiday-events`] });
      setShowAddDialog(false);
      resetForm();
      toast({
        title: "Event Created",
        description: "Holiday event has been added to the timeline.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HolidayEvent> }) => {
      return apiRequest("PATCH", `/api/memorials/${memorialId}/holiday-events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/holiday-events`] });
      setEditingEvent(null);
      resetForm();
      toast({
        title: "Event Updated",
        description: "Holiday event has been updated.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/memorials/${memorialId}/holiday-events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/holiday-events`] });
      toast({
        title: "Event Deleted",
        description: "Holiday event has been removed.",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      eventType: "custom",
      description: "",
      reminderEnabled: true,
      reminderDaysBefore: 7,
      celebrationPlan: "",
      traditions: [],
      isRecurring: true,
    });
    setNewTradition("");
  };

  const handleAddTradition = () => {
    if (newTradition.trim()) {
      setFormData(prev => ({
        ...prev,
        traditions: [...prev.traditions, newTradition.trim()],
      }));
      setNewTradition("");
    }
  };

  const handleRemoveTradition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      traditions: prev.traditions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please enter event name and date.",
        variant: "destructive",
      });
      return;
    }

    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEditEvent = (event: HolidayEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      date: event.date,
      eventType: event.eventType,
      description: event.description || "",
      reminderEnabled: event.reminderEnabled,
      reminderDaysBefore: event.reminderDaysBefore,
      celebrationPlan: event.celebrationPlan || "",
      traditions: event.traditions || [],
      isRecurring: event.isRecurring,
    });
    setShowAddDialog(true);
  };

  const handleAddPredefinedHoliday = (holiday: typeof predefinedHolidays[0]) => {
    const currentYear = new Date().getFullYear();
    setFormData({
      ...formData,
      name: holiday.name,
      date: `${currentYear}-${holiday.date}`,
      eventType: "holiday",
      isRecurring: true,
    });
    setShowAddDialog(true);
  };

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    
    const today = new Date();
    return events
      .map(event => {
        const eventDate = parseISO(event.date);
        let nextOccurrence = eventDate;
        
        if (event.isRecurring) {
          while (isBefore(nextOccurrence, today)) {
            nextOccurrence = addYears(nextOccurrence, 1);
          }
        }
        
        const daysUntil = differenceInDays(nextOccurrence, today);
        
        return {
          ...event,
          nextOccurrence,
          daysUntil,
        };
      })
      .filter(event => event.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);
  }, [events]);

  const eventsByMonth = useMemo(() => {
    if (!events) return {};
    
    const grouped: Record<number, HolidayEvent[]> = {};
    events.forEach(event => {
      const month = parseISO(event.date).getMonth();
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(event);
    });
    
    return grouped;
  }, [events]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (!memorialId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Memorial Selected</h2>
          <p className="text-muted-foreground">Please select a memorial to view the holiday timeline.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/memorial/${memorial?.inviteCode || memorialId}`}>
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Memorial
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-10 w-10 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
              Holiday Memorial Timeline
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan celebrations and receive reminders for special days to honor {memorial?.name || "your loved one"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Events coming up soon</CardDescription>
                </div>
                <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-event">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => {
                      const IconComponent = eventTypeIcons[event.eventType];
                      return (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-4 rounded-lg border hover-elevate"
                          data-testid={`event-${event.id}`}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${eventTypeColors[event.eventType]}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{event.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(event.nextOccurrence, "MMMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            {event.daysUntil === 0 ? (
                              <Badge className="bg-orange-500">Today!</Badge>
                            ) : event.daysUntil <= 7 ? (
                              <Badge variant="destructive">{event.daysUntil} days</Badge>
                            ) : (
                              <Badge variant="secondary">{event.daysUntil} days</Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditEvent(event)}
                              data-testid={`button-edit-${event.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteMutation.mutate(event.id)}
                              data-testid={`button-delete-${event.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No events scheduled yet.</p>
                    <Button onClick={() => setShowAddDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Annual Timeline
                </CardTitle>
                <CardDescription>All memorial events throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {months.map((month, index) => {
                    const monthEvents = eventsByMonth[index] || [];
                    return (
                      <div
                        key={month}
                        className={`p-3 rounded-lg border ${
                          monthEvents.length > 0 ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800" : ""
                        }`}
                      >
                        <h4 className="font-medium text-sm mb-2">{month}</h4>
                        {monthEvents.length > 0 ? (
                          <div className="space-y-1">
                            {monthEvents.map(event => (
                              <Badge key={event.id} variant="secondary" className="text-xs block truncate">
                                {event.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">No events</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5" />
                  Quick Add Holidays
                </CardTitle>
                <CardDescription>Add common memorial holidays</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {predefinedHolidays.map((holiday) => (
                    <Button
                      key={holiday.name}
                      variant="outline"
                      size="sm"
                      className="justify-start"
                      onClick={() => handleAddPredefinedHoliday(holiday)}
                      data-testid={`button-holiday-${holiday.name.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <holiday.icon className="mr-2 h-4 w-4" />
                      {holiday.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Bell className="h-5 w-5" />
                  Reminder Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700 dark:text-orange-300">
                <p className="text-sm">
                  Reminders will be sent based on each event's settings. You can customize
                  how many days before each event you'd like to receive a notification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setEditingEvent(null);
            resetForm();
          }
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                {editingEvent ? "Edit Event" : "Add Memorial Event"}
              </DialogTitle>
              <DialogDescription>
                Create a special day to remember and celebrate
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Event Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Dad's Birthday"
                    data-testid="input-event-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    data-testid="input-event-date"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Select
                    value={formData.eventType}
                    onValueChange={(value: any) => setFormData({ ...formData, eventType: value })}
                  >
                    <SelectTrigger data-testid="select-event-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this special day..."
                  data-testid="input-description"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Recurring Annually</Label>
                    <p className="text-xs text-muted-foreground">Repeat this event every year</p>
                  </div>
                  <Switch
                    checked={formData.isRecurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
                    data-testid="switch-recurring"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Reminders</Label>
                    <p className="text-xs text-muted-foreground">Get notified before this event</p>
                  </div>
                  <Switch
                    checked={formData.reminderEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
                    data-testid="switch-reminder"
                  />
                </div>

                {formData.reminderEnabled && (
                  <div className="space-y-2">
                    <Label>Remind me</Label>
                    <Select
                      value={formData.reminderDaysBefore.toString()}
                      onValueChange={(value) => setFormData({ ...formData, reminderDaysBefore: parseInt(value) })}
                    >
                      <SelectTrigger data-testid="select-reminder-days">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day before</SelectItem>
                        <SelectItem value="3">3 days before</SelectItem>
                        <SelectItem value="7">1 week before</SelectItem>
                        <SelectItem value="14">2 weeks before</SelectItem>
                        <SelectItem value="30">1 month before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Celebration Plan (Optional)</Label>
                <Textarea
                  value={formData.celebrationPlan}
                  onChange={(e) => setFormData({ ...formData, celebrationPlan: e.target.value })}
                  placeholder="How do you plan to honor this day? (visit cemetery, share stories, make favorite meal...)"
                  data-testid="input-celebration-plan"
                />
              </div>

              <div className="space-y-2">
                <Label>Family Traditions</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTradition}
                    onChange={(e) => setNewTradition(e.target.value)}
                    placeholder="Add a tradition..."
                    onKeyPress={(e) => e.key === "Enter" && handleAddTradition()}
                    data-testid="input-tradition"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTradition}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.traditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.traditions.map((tradition, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {tradition}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => handleRemoveTradition(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-event"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                {editingEvent ? "Update Event" : "Save Event"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
