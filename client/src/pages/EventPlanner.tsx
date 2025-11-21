import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, Clock, Users, MapPin, DollarSign, Video, CheckCircle, 
  Circle, AlertCircle, ChevronRight, ChevronLeft, Flower, Car, 
  Camera, Church, Music, FileText, Package, Star, Filter, Phone,
  Mail, Globe, Timer, TrendingUp, CheckSquare, Award
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Event planning schema
const eventSchema = z.object({
  eventName: z.string().min(2, "Event name is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  venue: z.string().min(2, "Venue is required"),
  venueAddress: z.string().optional(),
  expectedAttendees: z.number().min(1, "Expected attendees is required"),
  budget: z.number().min(0, "Budget must be a positive number"),
  liveStreamPlatform: z.string().optional(),
  liveStreamUrl: z.string().optional(),
  enableRsvp: z.boolean().default(true),
  rsvpDeadline: z.string().optional(),
  contactName: z.string().min(2, "Contact name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

// Event templates
const eventTemplates = [
  {
    id: "funeral",
    name: "Traditional Funeral Service",
    icon: Church,
    description: "A formal ceremony typically held at a funeral home or place of worship",
    timeline: "3-7 days after passing",
    budgetRange: "$7,000 - $15,000",
    features: ["Viewing/visitation", "Formal service", "Procession", "Burial or cremation"],
    culturalNotes: "Varies by religious and cultural traditions",
    suggestedVendors: ["Funeral Home", "Florist", "Caterer", "Musician", "Transportation"],
  },
  {
    id: "memorial",
    name: "Memorial Service",
    icon: FileText,
    description: "A service held without the body present, often weeks or months after passing",
    timeline: "2-8 weeks after passing",
    budgetRange: "$3,000 - $8,000",
    features: ["Flexible timing", "Photo displays", "Memory sharing", "Reception"],
    culturalNotes: "More flexibility in format and location",
    suggestedVendors: ["Venue", "Florist", "Caterer", "Photographer", "AV Equipment"],
  },
  {
    id: "celebration",
    name: "Celebration of Life",
    icon: Award,
    description: "An uplifting gathering focused on celebrating the person's life and legacy",
    timeline: "4-12 weeks after passing",
    budgetRange: "$2,000 - $10,000",
    features: ["Personal touches", "Music and stories", "Photo/video tributes", "Social gathering"],
    culturalNotes: "Less formal, more personalized approach",
    suggestedVendors: ["Event Venue", "Caterer", "Photographer", "Videographer", "Entertainment"],
  },
  {
    id: "military",
    name: "Military Honors Ceremony",
    icon: Award,
    description: "A service with military honors for veterans and active service members",
    timeline: "Coordinated with military",
    budgetRange: "$8,000 - $20,000",
    features: ["Honor guard", "Flag presentation", "Taps", "21-gun salute (if eligible)"],
    culturalNotes: "Follows military protocols and traditions",
    suggestedVendors: ["Military Coordinator", "Funeral Home", "Florist", "Transportation", "Caterer"],
  },
];

// Checklist categories with items
const checklistCategories = [
  {
    id: "venue",
    name: "Venue & Location",
    icon: MapPin,
    items: [
      { id: "v1", name: "Book funeral home or venue", required: true, estimatedCost: "$500-2000" },
      { id: "v2", name: "Reserve cemetery plot", required: false, estimatedCost: "$1000-5000" },
      { id: "v3", name: "Arrange viewing room", required: false, estimatedCost: "$200-500" },
      { id: "v4", name: "Setup memorial displays", required: true, estimatedCost: "$100-300" },
      { id: "v5", name: "Book reception hall", required: false, estimatedCost: "$300-1000" },
    ],
  },
  {
    id: "catering",
    name: "Catering & Hospitality",
    icon: Users,
    items: [
      { id: "c1", name: "Arrange reception catering", required: true, estimatedCost: "$20-50 per person" },
      { id: "c2", name: "Order beverages", required: true, estimatedCost: "$5-15 per person" },
      { id: "c3", name: "Arrange service staff", required: false, estimatedCost: "$200-500" },
      { id: "c4", name: "Order memorial cake", required: false, estimatedCost: "$100-300" },
      { id: "c5", name: "Setup coffee station", required: true, estimatedCost: "$50-150" },
    ],
  },
  {
    id: "flowers",
    name: "Flowers & Decorations",
    icon: Flower,
    items: [
      { id: "f1", name: "Order casket spray", required: true, estimatedCost: "$200-600" },
      { id: "f2", name: "Standing sprays", required: false, estimatedCost: "$150-300 each" },
      { id: "f3", name: "Family bouquets", required: true, estimatedCost: "$75-150 each" },
      { id: "f4", name: "Altar arrangements", required: false, estimatedCost: "$100-250" },
      { id: "f5", name: "Memorial wreaths", required: false, estimatedCost: "$100-200" },
    ],
  },
  {
    id: "transportation",
    name: "Transportation",
    icon: Car,
    items: [
      { id: "t1", name: "Book hearse", required: true, estimatedCost: "$300-500" },
      { id: "t2", name: "Arrange family limousines", required: false, estimatedCost: "$200-400 per vehicle" },
      { id: "t3", name: "Coordinate parking", required: true, estimatedCost: "$0-200" },
      { id: "t4", name: "Arrange shuttle service", required: false, estimatedCost: "$300-600" },
      { id: "t5", name: "Book flower car", required: false, estimatedCost: "$200-400" },
    ],
  },
];

// Define vendor type
interface VendorListing {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  priceRange: string;
  serviceArea: string;
  specialization: string;
  contact: { phone: string; email: string; website: string };
}

// Task timeline data
const taskTimelineData = [
  { id: "1", task: "Book venue", category: "Venue", dueDate: "2024-02-01", status: "completed", budgetAllocated: 1500, actualCost: 1450 },
  { id: "2", task: "Send invitations", category: "Communications", dueDate: "2024-02-05", status: "completed", budgetAllocated: 200, actualCost: 180 },
  { id: "3", task: "Order flowers", category: "Flowers", dueDate: "2024-02-10", status: "in-progress", budgetAllocated: 800, actualCost: 0 },
  { id: "4", task: "Confirm catering", category: "Catering", dueDate: "2024-02-12", status: "pending", budgetAllocated: 2000, actualCost: 0 },
  { id: "5", task: "Arrange transportation", category: "Transportation", dueDate: "2024-02-14", status: "pending", budgetAllocated: 600, actualCost: 0 },
  { id: "6", task: "Setup live stream", category: "Technology", dueDate: "2024-02-15", status: "pending", budgetAllocated: 300, actualCost: 0 },
];

export default function EventPlanner() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [checklistProgress, setChecklistProgress] = useState<Record<string, boolean>>({});
  const [selectedVendorCategory, setSelectedVendorCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("wizard");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorListing | null>(null);
  const [eventPlanId, setEventPlanId] = useState<string | null>(null);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      venue: "",
      venueAddress: "",
      expectedAttendees: 50,
      budget: 5000,
      liveStreamPlatform: "",
      liveStreamUrl: "",
      enableRsvp: true,
      rsvpDeadline: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      additionalNotes: "",
    },
  });

  // Fetch vendors data
  const { data: vendorData = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['/api/vendor-listings'],
    enabled: activeTab === "vendors",
  });

  // Fetch event tasks if we have an event plan ID
  const { data: eventTasks = [], refetch: refetchTasks } = useQuery({
    queryKey: [`/api/event-tasks/${eventPlanId}`],
    enabled: !!eventPlanId && activeTab === "tasks",
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/event-plans", {
        eventName: data.eventName,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate).toISOString(),
        eventTime: data.eventTime,
        venue: {
          name: data.venue,
          address: data.venueAddress || "",
          city: "",
          state: "",
          zipCode: "",
        },
        expectedAttendees: data.expectedAttendees,
        budget: data.budget.toString(),
        liveStream: data.liveStreamUrl ? {
          platform: data.liveStreamPlatform || "Other",
          url: data.liveStreamUrl,
        } : undefined,
        rsvpSettings: {
          enabled: data.enableRsvp,
          deadline: data.rsvpDeadline ? new Date(data.rsvpDeadline).toISOString() : undefined,
        },
        contactInfo: {
          name: data.contactName,
          email: data.contactEmail,
          phone: data.contactPhone || "",
        },
        additionalNotes: data.additionalNotes || "",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setEventPlanId(data.id);
      toast({
        title: "Event Created",
        description: "Your memorial event has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/event-plans'] });
      // Reset form or redirect
      form.reset();
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createVendorBookingMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      if (!eventPlanId) {
        throw new Error("Please create an event plan first");
      }
      const response = await apiRequest("POST", "/api/vendor-bookings", {
        eventId: eventPlanId,
        vendorId,
        serviceType: selectedVendor?.category || "General",
        bookingDate: new Date().toISOString(),
        serviceDetails: {
          description: `Booking request for ${selectedVendor?.name}`,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Request Sent",
        description: `Your booking request has been sent to ${selectedVendor?.name}. They will contact you within 24 hours.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/vendor-bookings/${eventPlanId}`] });
      setBookingModalOpen(false);
      setSelectedVendor(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send booking request.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const applyTemplate = (templateId: string) => {
    const template = eventTemplates.find(t => t.id === templateId);
    if (template) {
      form.setValue("eventType", template.name);
      setSelectedTemplate(templateId);
      toast({
        title: "Template Applied",
        description: `${template.name} template has been applied to your event.`,
      });
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklistProgress(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Circle className="w-4 h-4 text-yellow-600 fill-yellow-600" />;
      case "pending":
        return <Circle className="w-4 h-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getTaskStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      "in-progress": "secondary",
      pending: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="text-xs">
        {status.replace("-", " ")}
      </Badge>
    );
  };

  const filteredVendors = selectedVendorCategory === "all" 
    ? vendorData 
    : vendorData.filter((v: VendorListing) => v.category === selectedVendorCategory);

  const handleVendorBooking = (vendor: VendorListing) => {
    setSelectedVendor(vendor);
    setBookingModalOpen(true);
  };

  const confirmBooking = () => {
    if (selectedVendor) {
      createVendorBookingMutation.mutate(selectedVendor.id);
    }
  };

  const totalBudget = taskTimelineData.reduce((sum, task) => sum + task.budgetAllocated, 0);
  const totalSpent = taskTimelineData.reduce((sum, task) => sum + task.actualCost, 0);
  const completedTasks = taskTimelineData.filter(t => t.status === "completed").length;
  const totalTasks = taskTimelineData.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" data-testid="page-title">Memorial Event Planner</h1>
        <p className="text-muted-foreground">Plan and organize meaningful memorial services with our comprehensive event planning tools</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl" data-testid="main-tabs">
          <TabsTrigger value="wizard" data-testid="tab-wizard">
            <FileText className="w-4 h-4 mr-2" />
            Create Event
          </TabsTrigger>
          <TabsTrigger value="templates" data-testid="tab-templates">
            <Package className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="checklist" data-testid="tab-checklist">
            <CheckSquare className="w-4 h-4 mr-2" />
            Checklists
          </TabsTrigger>
          <TabsTrigger value="vendors" data-testid="tab-vendors">
            <Users className="w-4 h-4 mr-2" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="tasks" data-testid="tab-tasks">
            <Timer className="w-4 h-4 mr-2" />
            Tasks
          </TabsTrigger>
        </TabsList>

        {/* Event Planning Wizard Tab */}
        <TabsContent value="wizard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Memorial Event</CardTitle>
              <CardDescription>
                Step {currentStep} of 4: {
                  currentStep === 1 ? "Basic Information" :
                  currentStep === 2 ? "Event Details" :
                  currentStep === 3 ? "Streaming & RSVP" :
                  "Review & Confirm"
                }
              </CardDescription>
              <Progress value={(currentStep / 4) * 100} className="mt-2" />
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Memorial Service for John Doe" 
                                {...field} 
                                data-testid="input-event-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                                <SelectItem value="funeral">Traditional Funeral</SelectItem>
                                <SelectItem value="memorial">Memorial Service</SelectItem>
                                <SelectItem value="celebration">Celebration of Life</SelectItem>
                                <SelectItem value="military">Military Honors</SelectItem>
                                <SelectItem value="viewing">Viewing/Visitation</SelectItem>
                                <SelectItem value="graveside">Graveside Service</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="eventDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
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
                          name="eventTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Time</FormLabel>
                              <FormControl>
                                <Input 
                                  type="time" 
                                  {...field} 
                                  data-testid="input-event-time"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Event Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="venue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="First Baptist Church" 
                                {...field} 
                                data-testid="input-venue"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="venueAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123 Main St, City, State 12345" 
                                {...field} 
                                data-testid="input-venue-address"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expectedAttendees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Attendees</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-expected-attendees"
                                />
                              </FormControl>
                              <FormDescription>Approximate number of guests</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Budget ($)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                  data-testid="input-budget"
                                />
                              </FormControl>
                              <FormDescription>Estimated total budget</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Streaming & RSVP */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="liveStreamPlatform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Live Streaming Platform</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-stream-platform">
                                  <SelectValue placeholder="Select platform (optional)" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">No Live Stream</SelectItem>
                                <SelectItem value="youtube">YouTube Live</SelectItem>
                                <SelectItem value="zoom">Zoom</SelectItem>
                                <SelectItem value="facebook">Facebook Live</SelectItem>
                                <SelectItem value="custom">Custom Platform</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="liveStreamUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Live Stream URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://..." 
                                {...field} 
                                data-testid="input-stream-url"
                              />
                            </FormControl>
                            <FormDescription>Link to the live stream (if applicable)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enableRsvp"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Enable RSVP</FormLabel>
                              <FormDescription>
                                Allow guests to RSVP for the event
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="switch-enable-rsvp"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("enableRsvp") && (
                        <FormField
                          control={form.control}
                          name="rsvpDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>RSVP Deadline</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field} 
                                  data-testid="input-rsvp-deadline"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Step 4: Contact & Review */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your name" 
                                {...field} 
                                data-testid="input-contact-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="email@example.com" 
                                  {...field} 
                                  data-testid="input-contact-email"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="contactPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Phone</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel" 
                                  placeholder="(555) 123-4567" 
                                  {...field} 
                                  data-testid="input-contact-phone"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any special requests or additional information..." 
                                {...field} 
                                data-testid="textarea-additional-notes"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Review Summary */}
                      <Card className="bg-muted/50">
                        <CardHeader>
                          <CardTitle className="text-lg">Event Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Event:</span>
                            <span className="font-medium">{form.watch("eventName") || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{form.watch("eventType") || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date & Time:</span>
                            <span className="font-medium">
                              {form.watch("eventDate")} at {form.watch("eventTime")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Venue:</span>
                            <span className="font-medium">{form.watch("venue") || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Attendees:</span>
                            <span className="font-medium">{form.watch("expectedAttendees")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Budget:</span>
                            <span className="font-medium">${form.watch("budget")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      data-testid="button-previous"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        data-testid="button-next"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={createEventMutation.isPending}
                        data-testid="button-create-event"
                      >
                        {createEventMutation.isPending ? "Creating..." : "Create Event"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {eventTemplates.map((template) => (
              <Card key={template.id} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <template.icon className="w-8 h-8 text-primary" />
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Timeline:</span>
                      <span>{template.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Budget:</span>
                      <span>{template.budgetRange}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-3 h-3 mt-0.5 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">
                      <span className="font-medium">Cultural Notes:</span> {template.culturalNotes}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Suggested Vendors:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.suggestedVendors.map((vendor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      applyTemplate(template.id);
                      setActiveTab("wizard");
                    }}
                    data-testid={`button-use-template-${template.id}`}
                  >
                    Use This Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Timeline Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Planning Timelines</CardTitle>
              <CardDescription>Choose a timeline that works for your situation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">30-Day Plan</h4>
                  <p className="text-sm text-muted-foreground">For immediate needs</p>
                  <ul className="text-sm space-y-1 mt-3">
                    <li>• Week 1: Venue & date</li>
                    <li>• Week 2: Vendors & catering</li>
                    <li>• Week 3: Invitations & flowers</li>
                    <li>• Week 4: Final preparations</li>
                  </ul>
                </div>

                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">60-Day Plan</h4>
                  <p className="text-sm text-muted-foreground">Standard timeline</p>
                  <ul className="text-sm space-y-1 mt-3">
                    <li>• Weeks 1-2: Planning & budget</li>
                    <li>• Weeks 3-4: Bookings & vendors</li>
                    <li>• Weeks 5-6: Details & decorations</li>
                    <li>• Weeks 7-8: Finalization</li>
                  </ul>
                </div>

                <div className="space-y-2 p-4 border rounded-lg">
                  <h4 className="font-semibold">90-Day Plan</h4>
                  <p className="text-sm text-muted-foreground">Extended planning</p>
                  <ul className="text-sm space-y-1 mt-3">
                    <li>• Month 1: Conceptualization</li>
                    <li>• Month 2: Arrangements</li>
                    <li>• Month 3: Execution & details</li>
                    <li>• Final week: Review & prepare</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What You Need Checklist</CardTitle>
              <CardDescription>Track your progress for all memorial event requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {checklistCategories.map((category) => (
                <Collapsible key={category.id} defaultOpen>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover-elevate" data-testid={`checklist-category-${category.id}`}>
                    <div className="flex items-center gap-3">
                      <category.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {category.items.filter(item => checklistProgress[item.id]).length}/{category.items.length}
                      </Badge>
                    </div>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2 pl-12">
                    {category.items.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover-elevate"
                      >
                        <Checkbox
                          checked={checklistProgress[item.id] || false}
                          onCheckedChange={() => toggleChecklistItem(item.id)}
                          data-testid={`checkbox-${item.id}`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={checklistProgress[item.id] ? "line-through text-muted-foreground" : ""}>
                              {item.name}
                            </span>
                            {item.required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Estimated cost: {item.estimatedCost}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Checklist Completion</span>
                    <span className="font-medium">
                      {Object.values(checklistProgress).filter(Boolean).length} of{" "}
                      {checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0)} items
                    </span>
                  </div>
                  <Progress 
                    value={
                      (Object.values(checklistProgress).filter(Boolean).length / 
                      checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0)) * 100
                    } 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Required Items</p>
                    <p className="text-2xl font-bold">
                      {checklistCategories.reduce((sum, cat) => 
                        sum + cat.items.filter(i => i.required && checklistProgress[i.id]).length, 0
                      )}/
                      {checklistCategories.reduce((sum, cat) => 
                        sum + cat.items.filter(i => i.required).length, 0
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Optional Items</p>
                    <p className="text-2xl font-bold">
                      {checklistCategories.reduce((sum, cat) => 
                        sum + cat.items.filter(i => !i.required && checklistProgress[i.id]).length, 0
                      )}/
                      {checklistCategories.reduce((sum, cat) => 
                        sum + cat.items.filter(i => !i.required).length, 0
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Vendor Marketplace</CardTitle>
                  <CardDescription>Find trusted vendors for your memorial event</CardDescription>
                </div>
                <Select value={selectedVendorCategory} onValueChange={setSelectedVendorCategory}>
                  <SelectTrigger className="w-[200px]" data-testid="select-vendor-filter">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Funeral Home">Funeral Homes</SelectItem>
                    <SelectItem value="Florist">Florists</SelectItem>
                    <SelectItem value="Caterer">Caterers</SelectItem>
                    <SelectItem value="Photographer">Photographers</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          <CardDescription>{vendor.category}</CardDescription>
                        </div>
                        <Badge variant="secondary">{vendor.priceRange}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium text-sm">{vendor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({vendor.reviews} reviews)
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>Service Area: {vendor.serviceArea}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span>{vendor.specialization}</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        {vendor.contact?.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{vendor.contact.phone}</span>
                          </div>
                        )}
                        {vendor.contact?.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{vendor.contact.email}</span>
                          </div>
                        )}
                        {vendor.contact?.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span>{vendor.contact.website}</span>
                          </div>
                        )}
                        {!vendor.contact && (
                          <p className="text-sm text-muted-foreground italic">Contact information not available</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        data-testid={`button-contact-${vendor.id}`}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                      <Button 
                        className="flex-1"
                        data-testid={`button-book-${vendor.id}`}
                        onClick={() => handleVendorBooking(vendor)}
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          {/* Budget Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Budget</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Spent So Far</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">${totalSpent.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Remaining</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${(totalBudget - totalSpent).toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Task Progress</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                <Progress value={progressPercentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Task Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Task Management Dashboard</CardTitle>
              <CardDescription>Track all your memorial event tasks and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {taskTimelineData.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover-elevate"
                      data-testid={`task-item-${task.id}`}
                    >
                      <div>{getTaskStatusIcon(task.status)}</div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{task.task}</h4>
                          <Badge variant="secondary" className="text-xs">{task.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Budget: ${task.budgetAllocated}</span>
                          </div>
                          {task.actualCost > 0 && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>Actual: ${task.actualCost}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getTaskStatusBadge(task.status)}
                        <Button 
                          size="sm" 
                          variant="outline"
                          data-testid={`button-edit-task-${task.id}`}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Vendor Booking Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent data-testid="modal-booking">
          <DialogHeader>
            <DialogTitle>Book {selectedVendor?.name}</DialogTitle>
            <DialogDescription>
              Complete the form below to send a booking request to {selectedVendor?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendor && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Vendor Details</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Category:</strong> {selectedVendor.category}</p>
                  <p><strong>Service Area:</strong> {selectedVendor.serviceArea}</p>
                  <p><strong>Specialization:</strong> {selectedVendor.specialization}</p>
                  <p><strong>Rating:</strong> ⭐ {selectedVendor.rating} ({selectedVendor.reviews} reviews)</p>
                  <p><strong>Price Range:</strong> {selectedVendor.priceRange}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="booking-date">Service Date</Label>
                  <Input
                    id="booking-date"
                    type="date"
                    data-testid="input-booking-date"
                  />
                </div>
                
                <div>
                  <Label htmlFor="booking-message">Special Requirements</Label>
                  <Textarea
                    id="booking-message"
                    placeholder="Any special requirements or notes for the vendor..."
                    data-testid="textarea-booking-message"
                  />
                </div>

                <div>
                  <Label htmlFor="booking-budget">Estimated Budget</Label>
                  <Input
                    id="booking-budget"
                    type="text"
                    placeholder="e.g., $500-$1000"
                    data-testid="input-booking-budget"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setBookingModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmBooking} data-testid="button-confirm-booking">
                  Send Booking Request
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}