import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Video, Trash2, Edit, Eye, Clock, User } from "lucide-react";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface VideoTimeCapsule {
  id: string;
  memorialId: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  recipientName?: string;
  recipientRelationship?: string;
  milestoneType: string;
  customMilestoneName?: string;
  releaseDate: string;
  releaseTime: string;
  isRecurring: boolean;
  recurrenceInterval?: string;
  recurrenceEndDate?: string;
  nextReleaseDate?: string;
  status: string;
  isReleased: boolean;
  releasedAt?: string;
  isPublic: boolean;
  requiresQRScan: boolean;
  viewCount: number;
  uniqueViewers: number;
  releasedCount: number;
  createdAt: string;
}

const capsuleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  videoUrl: z.string().url("Valid video URL is required"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  recipientName: z.string().optional(),
  recipientRelationship: z.string().optional(),
  milestoneType: z.string().min(1, "Milestone type is required"),
  customMilestoneName: z.string().optional(),
  releaseDate: z.string().min(1, "Release date is required"),
  releaseTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  isRecurring: z.boolean().default(false),
  recurrenceInterval: z.enum(['yearly']).optional(),
  recurrenceEndDate: z.string().optional(),
  isPublic: z.boolean().default(false),
  requiresQRScan: z.boolean().default(false),
  status: z.enum(['scheduled', 'released', 'viewed', 'expired']).optional(),
});

type CapsuleFormData = z.infer<typeof capsuleSchema>;

const milestoneTypes = [
  { value: "birthday", label: "Birthday" },
  { value: "graduation", label: "Graduation" },
  { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" },
  { value: "baby_birth", label: "Baby Birth" },
  { value: "holiday", label: "Holiday" },
  { value: "custom", label: "Custom Milestone" },
];

export default function VideoTimeCapsules() {
  const [, params] = useRoute("/memorial/:id/video-time-capsules");
  const memorialId = params?.id || "";
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState<VideoTimeCapsule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [capsuleToDelete, setCapsuleToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: memorial } = useQuery<{ timezone?: string }>({
    queryKey: [`/api/memorials/${memorialId}`],
  });

  const { data: capsules = [], isLoading } = useQuery<VideoTimeCapsule[]>({
    queryKey: ["/api/memorials", memorialId, "video-time-capsules"],
  });

  const form = useForm<CapsuleFormData>({
    resolver: zodResolver(capsuleSchema),
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      recipientName: "",
      recipientRelationship: "",
      milestoneType: "",
      customMilestoneName: "",
      releaseDate: "",
      releaseTime: "00:00",
      isRecurring: false,
      recurrenceInterval: undefined,
      recurrenceEndDate: "",
      isPublic: false,
      requiresQRScan: false,
      status: "scheduled",
    },
  });

  const createCapsuleMutation = useMutation({
    mutationFn: async (data: CapsuleFormData) => {
      const res = await apiRequest("POST", `/api/memorials/${memorialId}/video-time-capsules`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "video-time-capsules"] });
      setIsCreateOpen(false);
      setIsEditMode(false);
      setEditingCapsule(null);
      form.reset();
      toast({
        title: "Video Time Capsule Created",
        description: "Your video time capsule has been scheduled successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create video time capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCapsuleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CapsuleFormData }) => {
      const res = await apiRequest("PATCH", `/api/video-time-capsules/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "video-time-capsules"] });
      setIsCreateOpen(false);
      setIsEditMode(false);
      setEditingCapsule(null);
      form.reset();
      toast({
        title: "Video Time Capsule Updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update video time capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCapsuleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/video-time-capsules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "video-time-capsules"] });
      setDeleteDialogOpen(false);
      setCapsuleToDelete(null);
      toast({
        title: "Video Time Capsule Deleted",
        description: "The video time capsule has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete video time capsule. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CapsuleFormData) => {
    if (isEditMode && editingCapsule) {
      updateCapsuleMutation.mutate({ id: editingCapsule.id, data });
    } else {
      createCapsuleMutation.mutate(data);
    }
  };

  const handleEdit = (capsule: VideoTimeCapsule) => {
    setIsEditMode(true);
    setEditingCapsule(capsule);
    form.reset({
      title: capsule.title,
      description: capsule.description || "",
      videoUrl: capsule.videoUrl,
      thumbnailUrl: capsule.thumbnailUrl || "",
      recipientName: capsule.recipientName || "",
      recipientRelationship: capsule.recipientRelationship || "",
      milestoneType: capsule.milestoneType,
      customMilestoneName: capsule.customMilestoneName || "",
      releaseDate: capsule.releaseDate,
      releaseTime: capsule.releaseTime,
      isRecurring: capsule.isRecurring,
      recurrenceInterval: capsule.recurrenceInterval as 'yearly' | undefined,
      recurrenceEndDate: capsule.recurrenceEndDate || "",
      isPublic: capsule.isPublic,
      requiresQRScan: capsule.requiresQRScan,
    });
    setIsCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    setCapsuleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (capsuleToDelete) {
      deleteCapsuleMutation.mutate(capsuleToDelete);
    }
  };

  const getStatusBadge = (capsule: VideoTimeCapsule) => {
    if (capsule.isReleased) {
      return <Badge className="bg-green-600" data-testid={`badge-status-${capsule.id}`}>Released</Badge>;
    }
    if (capsule.status === 'scheduled') {
      return <Badge className="bg-purple-600" data-testid={`badge-status-${capsule.id}`}>Scheduled</Badge>;
    }
    return <Badge variant="secondary" data-testid={`badge-status-${capsule.id}`}>{capsule.status}</Badge>;
  };

  const getMilestoneLabel = (type: string) => {
    const milestone = milestoneTypes.find(m => m.value === type);
    return milestone?.label || type;
  };

  const formatTimezoneDate = (utcTimestamp: string | null, includeTime: boolean = true): string => {
    if (!utcTimestamp) return 'Not set';
    
    const tz = memorial?.timezone || 'America/New_York';
    const pattern = includeTime ? 'MMM d, yyyy h:mm a zzz' : 'MMM d, yyyy';
    
    return formatInTimeZone(utcTimestamp, tz, pattern);
  };

  const constructUtcTimestamp = (dateString: string, timeString: string): string => {
    // For fallback: Construct timestamp without forcing UTC
    // Note: This is best-effort display; nextReleaseDate should be the authoritative UTC timestamp
    const localTimeString = `${dateString}T${timeString}:00`;
    // Parse as ISO date and return as UTC (browser's interpretation)
    const date = parseISO(localTimeString);
    return date.toISOString();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="heading-video-time-capsules">
            Video Time Capsules
          </h1>
          <p className="text-muted-foreground">
            Pre-record video messages that automatically release on future milestones
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            setIsEditMode(false);
            setEditingCapsule(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-capsule">
              <Plus className="w-4 h-4 mr-2" />
              Create Time Capsule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle data-testid="dialog-title-capsule">
                {isEditMode ? "Edit Video Time Capsule" : "Create Video Time Capsule"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Happy 18th Birthday Message"
                          {...field}
                          data-testid="input-capsule-title"
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add context about this video message..."
                          {...field}
                          data-testid="textarea-capsule-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/video.mp4"
                          {...field}
                          data-testid="input-video-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Supported formats: .mp4, .webm, .ogg, .mov, .m4v
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnailUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/thumbnail.jpg"
                          {...field}
                          data-testid="input-thumbnail-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Sarah"
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
                    name="recipientRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Daughter, Son, Friend"
                            {...field}
                            data-testid="input-recipient-relationship"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="milestoneType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Milestone Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-milestone-type">
                            <SelectValue placeholder="Select milestone type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {milestoneTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} data-testid={`option-milestone-${type.value}`}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("milestoneType") === "custom" && (
                  <FormField
                    control={form.control}
                    name="customMilestoneName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Milestone Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., First Day of College"
                            {...field}
                            data-testid="input-custom-milestone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            data-testid="input-release-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="releaseTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Time</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            {...field}
                            data-testid="input-release-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Recurring Release</FormLabel>
                        <FormDescription>
                          Release this video every year on the same date (e.g., annual birthday message)
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
                      name="recurrenceInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurrence Pattern</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-recurrence-interval">
                                <SelectValue placeholder="Select recurrence pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yearly" data-testid="option-recurrence-yearly">Every Year</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recurrenceEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Recurrence On (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              data-testid="input-recurrence-end-date"
                            />
                          </FormControl>
                          <FormDescription>
                            Leave empty for indefinite recurrence
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Separator />

                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Public Access</FormLabel>
                        <FormDescription>
                          Allow anyone to view this video once released
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-public"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiresQRScan"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Require QR Code Scan</FormLabel>
                        <FormDescription>
                          Video only accessible via QR code scan at memorial site
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-qr-scan"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateOpen(false);
                      setIsEditMode(false);
                      setEditingCapsule(null);
                      form.reset();
                    }}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCapsuleMutation.isPending || updateCapsuleMutation.isPending}
                    data-testid="button-submit-capsule"
                  >
                    {createCapsuleMutation.isPending || updateCapsuleMutation.isPending
                      ? "Saving..."
                      : isEditMode
                      ? "Update Capsule"
                      : "Create Capsule"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-loading">Loading video time capsules...</p>
        </div>
      ) : capsules.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2" data-testid="heading-no-capsules">No Video Time Capsules Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first video time capsule to preserve precious moments for future milestones.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {capsules.map((capsule) => (
            <Card key={capsule.id} data-testid={`card-capsule-${capsule.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl" data-testid={`title-capsule-${capsule.id}`}>
                        {capsule.title}
                      </CardTitle>
                      {getStatusBadge(capsule)}
                    </div>
                    {capsule.description && (
                      <CardDescription data-testid={`description-capsule-${capsule.id}`}>
                        {capsule.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(capsule)}
                      data-testid={`button-edit-${capsule.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(capsule.id)}
                      data-testid={`button-delete-${capsule.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Milestone</p>
                    <p className="font-medium flex items-center gap-2" data-testid={`milestone-${capsule.id}`}>
                      <Calendar className="w-4 h-4" />
                      {capsule.milestoneType === 'custom' && capsule.customMilestoneName
                        ? capsule.customMilestoneName
                        : getMilestoneLabel(capsule.milestoneType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Release Date</p>
                    <p className="font-medium flex items-center gap-2" data-testid={`release-date-${capsule.id}`}>
                      <Clock className="w-4 h-4" />
                      {capsule.nextReleaseDate 
                        ? formatTimezoneDate(capsule.nextReleaseDate)
                        : formatTimezoneDate(fromZonedTime(`${capsule.releaseDate}T${capsule.releaseTime || '00:00:00'}`, memorial?.timezone || 'America/New_York').toISOString())}
                    </p>
                  </div>
                  {capsule.recipientName && (
                    <div>
                      <p className="text-muted-foreground mb-1">Recipient</p>
                      <p className="font-medium flex items-center gap-2" data-testid={`recipient-${capsule.id}`}>
                        <User className="w-4 h-4" />
                        {capsule.recipientName}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground mb-1">Views</p>
                    <p className="font-medium flex items-center gap-2" data-testid={`views-${capsule.id}`}>
                      <Eye className="w-4 h-4" />
                      {capsule.viewCount} ({capsule.uniqueViewers} unique)
                    </p>
                  </div>
                </div>

                {capsule.isRecurring && (
                  <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      Recurring Release: Every year
                      {capsule.recurrenceEndDate && ` until ${formatTimezoneDate(capsule.recurrenceEndDate, false)}`}
                      {capsule.releasedCount > 0 && ` (Released ${capsule.releasedCount} times)`}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {capsule.isPublic && (
                    <Badge variant="outline" data-testid={`badge-public-${capsule.id}`}>Public</Badge>
                  )}
                  {capsule.requiresQRScan && (
                    <Badge variant="outline" data-testid={`badge-qr-${capsule.id}`}>QR Code Only</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="dialog-title-delete">Delete Video Time Capsule?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The video time capsule will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
