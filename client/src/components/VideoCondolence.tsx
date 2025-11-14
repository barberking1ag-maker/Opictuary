import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  Square, 
  CircleDot,
  Eye, 
  EyeOff,
  Check,
  X,
  Clock,
  User
} from "lucide-react";
import type { VideoCondolence as VideoCondolenceType } from "@shared/schema";

interface VideoCondolenceProps {
  memorialId: string;
  canApprove?: boolean;
}

export function VideoCondolence({ memorialId, canApprove = false }: VideoCondolenceProps) {
  const { toast } = useToast();
  const [isRecordingOpen, setIsRecordingOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoCondolenceType | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("");
  const [message, setMessage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // Fetch video condolences
  const { data: condolences = [], isLoading } = useQuery<VideoCondolenceType[]>({
    queryKey: [`/api/memorials/${memorialId}/video-condolences`, canApprove],
    queryFn: async () => {
      const params = canApprove ? '?includePrivate=true' : '';
      const response = await fetch(`/api/memorials/${memorialId}/video-condolences${params}`);
      if (!response.ok) throw new Error("Failed to fetch video condolences");
      return response.json();
    },
  });

  // Submit video condolence
  const submitCondolenceMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // First upload video to storage
      // For now, we'll use a placeholder URL
      const videoUrl = "https://example.com/video.mp4"; // This would be actual upload logic
      
      return apiRequest(`/api/memorials/${memorialId}/video-condolences`, {
        method: "POST",
        body: JSON.stringify({
          videoUrl,
          thumbnailUrl: videoUrl + ".thumbnail.jpg",
          name,
          email,
          relationship,
          transcription: message,
          duration: 60, // Placeholder duration
          isPrivate,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/video-condolences`] });
      setIsRecordingOpen(false);
      resetForm();
      toast({
        title: "Video Submitted",
        description: "Your video condolence has been submitted for approval.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit video. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Approve video
  const approveCondolenceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/video-condolences/${id}/approve`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/video-condolences`] });
      toast({
        title: "Video Approved",
        description: "The video condolence is now visible on the memorial.",
      });
    },
  });

  // Reject/Delete video
  const rejectCondolenceMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/video-condolences/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/video-condolences`] });
      toast({
        title: "Video Removed",
        description: "The video condolence has been removed.",
      });
    },
  });

  // Track video view
  const trackViewMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/video-condolences/${id}/view`, {
        method: "POST",
      });
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Permission Denied",
        description: "Please allow camera and microphone access to record a video.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRelationship("");
    setMessage("");
    setIsPrivate(false);
    setRecordedBlob(null);
    setRecordedUrl(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRecordedBlob(file);
      setRecordedUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!recordedBlob) {
      toast({
        title: "No Video",
        description: "Please record or upload a video first.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('video', recordedBlob);
    submitCondolenceMutation.mutate(formData);
  };

  const playVideo = (condolence: VideoCondolenceType) => {
    setSelectedVideo(condolence);
    trackViewMutation.mutate(condolence.id);
  };

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (recordedUrl) {
        URL.revokeObjectURL(recordedUrl);
      }
    };
  }, [recordedUrl]);

  // Separate approved and pending condolences
  const approvedCondolences = condolences.filter(c => c.isApproved);
  const pendingCondolences = condolences.filter(c => !c.isApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Video Condolences</h3>
          <p className="text-sm text-muted-foreground">
            Share your memories and condolences through video messages
          </p>
        </div>
        <Button
          onClick={() => setIsRecordingOpen(true)}
          data-testid="button-add-video-condolence"
        >
          <Video className="w-4 h-4 mr-2" />
          Record Condolence
        </Button>
      </div>

      {/* Pending Approvals (for admins) */}
      {canApprove && pendingCondolences.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Approval ({pendingCondolences.length})
          </h4>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {pendingCondolences.map((condolence) => (
                <div
                  key={condolence.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  data-testid={`pending-video-${condolence.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-12 bg-black rounded overflow-hidden">
                      <img
                        src={condolence.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute inset-0 hover:bg-black/50"
                        onClick={() => playVideo(condolence)}
                        data-testid={`button-preview-${condolence.id}`}
                      >
                        <Play className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">{condolence.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {condolence.relationship}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => approveCondolenceMutation.mutate(condolence.id)}
                      data-testid={`button-approve-${condolence.id}`}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectCondolenceMutation.mutate(condolence.id)}
                      data-testid={`button-reject-${condolence.id}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* Approved Videos Grid */}
      {approvedCondolences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedCondolences.map((condolence) => (
            <Card 
              key={condolence.id} 
              className="overflow-hidden hover-elevate cursor-pointer"
              onClick={() => playVideo(condolence)}
              data-testid={`video-card-${condolence.id}`}
            >
              <div className="relative aspect-video bg-black">
                <img
                  src={condolence.thumbnailUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                  {Math.floor(condolence.duration / 60)}:{String(condolence.duration % 60).padStart(2, '0')}
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium">{condolence.name}</p>
                <p className="text-sm text-muted-foreground">{condolence.relationship}</p>
                {condolence.isPrivate && (
                  <Badge variant="secondary" className="mt-2">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Private
                  </Badge>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Eye className="w-3 h-3" />
                  {condolence.viewCount || 0} views
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No video condolences yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Be the first to share a video message
          </p>
        </Card>
      )}

      {/* Recording Dialog */}
      <Dialog open={isRecordingOpen} onOpenChange={setIsRecordingOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-record-video">
          <DialogHeader>
            <DialogTitle>Record Video Condolence</DialogTitle>
            <DialogDescription>
              Record a personal video message to honor their memory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video Preview/Recording Area */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isRecording}
                src={recordedUrl || undefined}
                className="w-full h-full object-cover"
                data-testid="video-preview"
              />
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <CircleDot className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Recording</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex justify-center gap-4">
              {!recordedUrl ? (
                <>
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "default"}
                    data-testid="button-record"
                  >
                    {isRecording ? (
                      <>
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <CircleDot className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('video-upload')?.click()}
                    data-testid="button-upload-video"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    data-testid="button-retake"
                  >
                    Retake
                  </Button>
                </>
              )}
            </div>

            {/* Form Fields */}
            {recordedUrl && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      data-testid="input-condolence-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                      data-testid="input-condolence-email"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g., Friend, Colleague, Family"
                    data-testid="input-relationship"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a memory or message..."
                    rows={3}
                    data-testid="textarea-message"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="is-private" className="flex-1">
                    Keep Private
                    <p className="text-xs text-muted-foreground">
                      Only memorial admins can view private messages
                    </p>
                  </Label>
                  <Switch
                    id="is-private"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                    data-testid="switch-private"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsRecordingOpen(false)}
              data-testid="button-cancel-video"
            >
              Cancel
            </Button>
            {recordedUrl && (
              <Button
                onClick={handleSubmit}
                disabled={!name || !email || submitCondolenceMutation.isPending}
                data-testid="button-submit-video"
              >
                {submitCondolenceMutation.isPending ? "Submitting..." : "Submit Video"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-3xl" data-testid="dialog-video-player">
            <DialogHeader>
              <DialogTitle>{selectedVideo.name}'s Message</DialogTitle>
              <DialogDescription>
                {selectedVideo.relationship}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                data-testid="video-player"
              />
            </div>
            
            {selectedVideo.transcription && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{selectedVideo.transcription}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}