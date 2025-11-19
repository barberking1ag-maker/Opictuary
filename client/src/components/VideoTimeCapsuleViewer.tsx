import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, User, Eye, Clock } from "lucide-react";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useEffect, useRef, useState } from "react";

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

interface VideoTimeCapsuleViewerProps {
  memorialId: string;
}

const milestoneLabels: Record<string, string> = {
  birthday: "Birthday",
  graduation: "Graduation",
  wedding: "Wedding",
  anniversary: "Anniversary",
  baby_birth: "Baby Birth",
  holiday: "Holiday",
  custom: "Special Milestone",
};

function VideoPlayer({ capsule }: { capsule: VideoTimeCapsule }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewRecorded, setViewRecorded] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  const recordViewMutation = useMutation({
    mutationFn: async (data: { viewDuration: number; completedVideo: boolean }) => {
      const res = await apiRequest("POST", `/api/video-time-capsules/${capsule.id}/view`, {
        viewDuration: data.viewDuration,
        completedVideo: data.completedVideo,
        viewerName: null,
        viewerEmail: null,
      });
      return await res.json();
    },
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let startTime = 0;
    let totalWatchTime = 0;

    const handlePlay = () => {
      startTime = Date.now();
    };

    const handlePause = () => {
      if (startTime > 0) {
        const duration = (Date.now() - startTime) / 1000;
        totalWatchTime += duration;
        setWatchTime(totalWatchTime);
        startTime = 0;
      }
    };

    const handleEnded = () => {
      if (startTime > 0) {
        const duration = (Date.now() - startTime) / 1000;
        totalWatchTime += duration;
      }
      if (!viewRecorded) {
        recordViewMutation.mutate({
          viewDuration: Math.round(totalWatchTime),
          completedVideo: true,
        });
        setViewRecorded(true);
      }
    };

    const handleTimeUpdate = () => {
      // Record view after watching at least 3 seconds
      if (video.currentTime >= 3 && !viewRecorded) {
        recordViewMutation.mutate({
          viewDuration: Math.round(video.currentTime),
          completedVideo: false,
        });
        setViewRecorded(true);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [capsule.id, viewRecorded]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        poster={capsule.thumbnailUrl}
        data-testid={`video-player-${capsule.id}`}
      >
        <source src={capsule.videoUrl} type="video/mp4" />
        <source src={capsule.videoUrl} type="video/webm" />
        <source src={capsule.videoUrl} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function VideoTimeCapsuleViewer({ memorialId }: VideoTimeCapsuleViewerProps) {
  const { data: memorial } = useQuery<{ timezone?: string }>({
    queryKey: [`/api/memorials/${memorialId}`],
  });

  const { data: capsules = [], isLoading } = useQuery<VideoTimeCapsule[]>({
    queryKey: ["/api/memorials", memorialId, "video-time-capsules", "released"],
  });

  const formatTimezoneDate = (utcTimestamp: string | null, includeTime: boolean = true): string => {
    if (!utcTimestamp) return 'Not set';
    
    const tz = memorial?.timezone || 'America/New_York';
    const pattern = includeTime ? 'MMM d, yyyy h:mm a zzz' : 'MMM d, yyyy';
    
    return formatInTimeZone(utcTimestamp, tz, pattern);
  };

  const constructUtcTimestamp = (dateString: string, timeString: string): string => {
    // For fallback: Construct timestamp without forcing UTC
    // Note: This is best-effort display; releasedAt should be the authoritative UTC timestamp
    const localTimeString = `${dateString}T${timeString}:00`;
    // Parse as ISO date and return as UTC (browser's interpretation)
    const date = parseISO(localTimeString);
    return date.toISOString();
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-center text-muted-foreground" data-testid="text-loading-capsules">
          Loading video time capsules...
        </p>
      </div>
    );
  }

  if (capsules.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="section-video-time-capsules">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="heading-video-capsules">
          Video Time Capsules
        </h2>
        <p className="text-muted-foreground">
          Pre-recorded video messages released on special milestones
        </p>
      </div>

      <div className="grid gap-6">
        {capsules.map((capsule) => (
          <Card key={capsule.id} data-testid={`card-video-capsule-${capsule.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl" data-testid={`title-video-capsule-${capsule.id}`}>
                      {capsule.title}
                    </CardTitle>
                    <Badge className="bg-green-600" data-testid={`badge-released-${capsule.id}`}>
                      Released
                    </Badge>
                  </div>
                  {capsule.description && (
                    <CardDescription data-testid={`description-video-capsule-${capsule.id}`}>
                      {capsule.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoPlayer capsule={capsule} />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Milestone</p>
                  <p className="font-medium flex items-center gap-2" data-testid={`milestone-video-${capsule.id}`}>
                    <Calendar className="w-4 h-4" />
                    {capsule.milestoneType === 'custom' && capsule.customMilestoneName
                      ? capsule.customMilestoneName
                      : milestoneLabels[capsule.milestoneType] || capsule.milestoneType}
                  </p>
                </div>
                {capsule.recipientName && (
                  <div>
                    <p className="text-muted-foreground mb-1">For</p>
                    <p className="font-medium flex items-center gap-2" data-testid={`recipient-video-${capsule.id}`}>
                      <User className="w-4 h-4" />
                      {capsule.recipientName}
                      {capsule.recipientRelationship && ` (${capsule.recipientRelationship})`}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground mb-1">Released</p>
                  <p className="font-medium flex items-center gap-2" data-testid={`released-date-${capsule.id}`}>
                    <Clock className="w-4 h-4" />
                    {capsule.releasedAt
                      ? formatTimezoneDate(capsule.releasedAt)
                      : formatTimezoneDate(fromZonedTime(`${capsule.releaseDate}T${capsule.releaseTime || '00:00:00'}`, memorial?.timezone || 'America/New_York').toISOString())}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Views</p>
                  <p className="font-medium flex items-center gap-2" data-testid={`views-video-${capsule.id}`}>
                    <Eye className="w-4 h-4" />
                    {capsule.viewCount}
                  </p>
                </div>
              </div>

              {capsule.isRecurring && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    This is a recurring video message released every year
                    {capsule.releasedCount > 1 && ` (Released ${capsule.releasedCount} times)`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
