import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Video, Users, Clock, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns";
import type { MemorialLiveStream, MemorialLiveStreamViewer } from "@shared/schema";

interface LiveStreamViewerProps {
  memorialId: string;
  currentUser?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export function LiveStreamViewer({
  memorialId,
  currentUser,
}: LiveStreamViewerProps) {
  const { toast } = useToast();
  const [selectedStream, setSelectedStream] = useState<MemorialLiveStream | null>(null);
  const [viewerSessionId, setViewerSessionId] = useState<string | null>(null);
  const joinTimeRef = useRef<Date | null>(null);

  const { data: streams = [] } = useQuery<MemorialLiveStream[]>({
    queryKey: ["/api/memorials", memorialId, "live-streams"],
  });

  const { data: viewers = [] } = useQuery<MemorialLiveStreamViewer[]>({
    queryKey: ["/api/live-streams", selectedStream?.id, "viewers"],
    enabled: !!selectedStream,
  });

  const joinStreamMutation = useMutation({
    mutationFn: async (streamId: string) => {
      const userName = currentUser?.firstName && currentUser?.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser?.email || "Anonymous Viewer";

      const response = await apiRequest("POST", `/api/live-streams/${streamId}/viewers`, {
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        userName,
      });

      return await response.json();
    },
    onSuccess: (data) => {
      setViewerSessionId(data.id);
      joinTimeRef.current = new Date();
      toast({
        title: "Joined live stream",
        description: "You are now viewing the memorial service.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join live stream.",
        variant: "destructive",
      });
    },
  });

  const leaveStreamMutation = useMutation({
    mutationFn: async () => {
      if (!viewerSessionId || !joinTimeRef.current) return;

      const leftAt = new Date();
      const durationMinutes = Math.floor(
        (leftAt.getTime() - joinTimeRef.current.getTime()) / 60000
      );

      await apiRequest("PUT", `/api/live-stream-viewers/${viewerSessionId}/leave`, {
        leftAt: leftAt.toISOString(),
        durationMinutes,
      });
    },
    onSuccess: () => {
      setViewerSessionId(null);
      joinTimeRef.current = null;
    },
  });

  useEffect(() => {
    return () => {
      if (viewerSessionId) {
        leaveStreamMutation.mutate();
      }
    };
  }, [viewerSessionId]);

  const activeStreams = streams.filter((s) => s.isActive);
  const upcomingStreams = streams.filter(
    (s) => !s.isActive && isFuture(new Date(s.scheduledStartTime))
  );
  const pastStreams = streams.filter(
    (s) => !s.isActive && isPast(new Date(s.scheduledStartTime))
  );

  const getStreamStatus = (stream: MemorialLiveStream) => {
    if (stream.isActive) {
      return { label: "Live Now", variant: "destructive" as const };
    }
    if (isFuture(new Date(stream.scheduledStartTime))) {
      return { label: "Upcoming", variant: "secondary" as const };
    }
    return { label: "Ended", variant: "outline" as const };
  };

  const handleJoinStream = (stream: MemorialLiveStream) => {
    setSelectedStream(stream);
    if (stream.isActive) {
      joinStreamMutation.mutate(stream.id);
    }
  };

  const handleLeaveStream = () => {
    leaveStreamMutation.mutate();
    setSelectedStream(null);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "AN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (streams.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="live-stream-viewer">
      {selectedStream && (
        <Card className="bg-card/40 backdrop-blur-sm border-white/10">
          <CardHeader className="gap-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl" data-testid="text-stream-title">
                    {selectedStream.title}
                  </CardTitle>
                  <Badge {...getStreamStatus(selectedStream)} data-testid="badge-stream-status">
                    {getStreamStatus(selectedStream).label}
                  </Badge>
                </div>
                {selectedStream.description && (
                  <CardDescription className="text-base" data-testid="text-stream-description">
                    {selectedStream.description}
                  </CardDescription>
                )}
              </div>
              {viewerSessionId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLeaveStream}
                  data-testid="button-leave-stream"
                >
                  Leave Stream
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-background/50 rounded-md flex items-center justify-center relative overflow-hidden border border-white/10">
              {selectedStream.isActive ? (
                <div className="w-full h-full">
                  {selectedStream.platform === "youtube" && selectedStream.streamUrl.includes("youtube.com") ? (
                    <iframe
                      className="w-full h-full"
                      src={selectedStream.streamUrl.replace("watch?v=", "embed/")}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      data-testid="iframe-youtube-stream"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-4 p-8">
                      <Video className="h-16 w-16 text-muted-foreground" />
                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium">External Stream</p>
                        <p className="text-sm text-muted-foreground">
                          This stream is hosted on {selectedStream.platform || "an external platform"}
                        </p>
                        <Button
                          asChild
                          className="gap-2"
                          data-testid="button-open-external-stream"
                        >
                          <a
                            href={selectedStream.streamUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Open Stream
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8">
                  <Play className="h-16 w-16 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">
                      {isFuture(new Date(selectedStream.scheduledStartTime))
                        ? "Stream Not Started"
                        : "Stream Ended"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isFuture(new Date(selectedStream.scheduledStartTime))
                        ? `Scheduled for ${format(new Date(selectedStream.scheduledStartTime), "PPp")}`
                        : `Ended ${formatDistanceToNow(new Date(selectedStream.scheduledStartTime), { addSuffix: true })}`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span data-testid="text-viewer-count">
                    {viewers.filter((v) => !v.leftAt).length} viewing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(selectedStream.scheduledStartTime), "PPp")}
                  </span>
                </div>
              </div>
            </div>

            {viewers.filter((v) => !v.leftAt).length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Viewers</p>
                <div className="flex flex-wrap gap-2">
                  {viewers
                    .filter((v) => !v.leftAt)
                    .slice(0, 10)
                    .map((viewer) => (
                      <div
                        key={viewer.id}
                        className="flex items-center gap-2 bg-background/50 rounded-full px-3 py-1.5"
                        data-testid={`viewer-${viewer.id}`}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/20 text-xs">
                            {getInitials(viewer.userName || "A")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{viewer.userName || "Anonymous"}</span>
                      </div>
                    ))}
                  {viewers.filter((v) => !v.leftAt).length > 10 && (
                    <div className="flex items-center gap-2 bg-background/50 rounded-full px-3 py-1.5">
                      <span className="text-sm text-muted-foreground">
                        +{viewers.filter((v) => !v.leftAt).length - 10} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedStream && (
        <div className="space-y-4">
          {activeStreams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5" />
                Live Now
              </h3>
              {activeStreams.map((stream) => (
                <Card
                  key={stream.id}
                  className="bg-card/40 backdrop-blur-sm border-white/10 hover-elevate cursor-pointer"
                  onClick={() => handleJoinStream(stream)}
                  data-testid={`stream-card-${stream.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold" data-testid={`text-stream-title-${stream.id}`}>
                            {stream.title}
                          </h4>
                          <Badge variant="destructive">Live</Badge>
                        </div>
                        {stream.description && (
                          <p className="text-sm text-muted-foreground">
                            {stream.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(stream.scheduledStartTime), "p")}
                          </span>
                          {stream.platform && (
                            <span className="capitalize">{stream.platform}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="gap-2"
                        data-testid={`button-join-stream-${stream.id}`}
                      >
                        <Play className="h-4 w-4" />
                        Join Stream
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {upcomingStreams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Upcoming Streams</h3>
              {upcomingStreams.map((stream) => (
                <Card
                  key={stream.id}
                  className="bg-card/40 backdrop-blur-sm border-white/10"
                  data-testid={`stream-card-${stream.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold" data-testid={`text-stream-title-${stream.id}`}>
                            {stream.title}
                          </h4>
                          <Badge variant="secondary">Upcoming</Badge>
                        </div>
                        {stream.description && (
                          <p className="text-sm text-muted-foreground">
                            {stream.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(stream.scheduledStartTime), "PPp")}
                          </span>
                          {stream.platform && (
                            <span className="capitalize">{stream.platform}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {pastStreams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Past Streams</h3>
              {pastStreams.slice(0, 3).map((stream) => (
                <Card
                  key={stream.id}
                  className="bg-card/40 backdrop-blur-sm border-white/10 opacity-75"
                  data-testid={`stream-card-${stream.id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold" data-testid={`text-stream-title-${stream.id}`}>
                            {stream.title}
                          </h4>
                          <Badge variant="outline">Ended</Badge>
                        </div>
                        {stream.description && (
                          <p className="text-sm text-muted-foreground">
                            {stream.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(stream.scheduledStartTime), "PPp")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
