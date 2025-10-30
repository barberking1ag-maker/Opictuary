import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, MessageCircle, Calendar, Image as ImageIcon, Video, X, Send, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Memory {
  id: string;
  memorialId: string;
  authorName: string;
  caption: string;
  mediaUrl: string;
  isApproved: boolean;
  createdAt: string;
}

interface MemoryComment {
  id: string;
  memoryId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

interface MemoryCondolence {
  id: string;
  memoryId: string;
  userId?: string;
  authorName: string;
  authorEmail?: string;
  createdAt: string;
}

interface MemorialGalleryProps {
  memorialId: string;
  isOwner?: boolean;
}

export function MemorialGallery({ memorialId, isOwner = false }: MemorialGalleryProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [commentText, setCommentText] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch memories
  const { data: memories = [], isLoading } = useQuery<Memory[]>({
    queryKey: ["/api/memorials", memorialId, "memories"],
  });

  // Fetch comments for selected memory
  const { data: comments = [] } = useQuery<MemoryComment[]>({
    queryKey: ["/api/memories", selectedMemory?.id, "comments"],
    enabled: !!selectedMemory,
  });

  // Fetch condolences for selected memory
  const { data: condolences = [] } = useQuery<MemoryCondolence[]>({
    queryKey: ["/api/memories", selectedMemory?.id, "condolences"],
    enabled: !!selectedMemory,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMemory) return;

      const authorName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User' : guestName;
      const authorEmail = user?.email || guestEmail || '';

      if (!authorName || !commentText) {
        throw new Error("Name and comment are required");
      }

      const res = await apiRequest("POST", `/api/memories/${selectedMemory.id}/comments`, {
        authorName,
        authorEmail,
        comment: commentText,
        userId: user?.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", selectedMemory?.id, "comments"] });
      setCommentText("");
      setGuestName("");
      setGuestEmail("");
      toast({
        title: "Comment Added",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to post comment.",
      });
    },
  });

  // Add condolence mutation
  const addCondolenceMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMemory) return;

      const authorName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User' : guestName;
      const authorEmail = user?.email || guestEmail || '';

      if (!authorName) {
        throw new Error("Name is required");
      }

      const res = await apiRequest("POST", `/api/memories/${selectedMemory.id}/condolences`, {
        authorName,
        authorEmail,
        userId: user?.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", selectedMemory?.id, "condolences"] });
      setGuestName("");
      setGuestEmail("");
      toast({
        title: "Condolence Sent",
        description: "Your condolence has been added.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send condolence.",
      });
    },
  });

  const approvedMemories = memories.filter(m => m.isApproved || isOwner);
  const isVideo = (url: string | null) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes('youtube.com') || url.includes('vimeo.com');
  };

  const handleSubmitComment = () => {
    addCommentMutation.mutate();
  };

  const handleSendCondolence = () => {
    addCondolenceMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (approvedMemories.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Memories Yet</h3>
        <p className="text-muted-foreground">
          Be the first to share a photo or video memory
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="container-gallery">
        {approvedMemories.map((memory) => (
          <Card
            key={memory.id}
            className="group relative overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-all"
            onClick={() => setSelectedMemory(memory)}
            data-testid={`card-memory-${memory.id}`}
          >
            <div className="aspect-square relative">
              {isVideo(memory.mediaUrl) ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <Video className="w-12 h-12 text-white" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      Video
                    </Badge>
                  </div>
                </div>
              ) : (
                <img
                  src={memory.mediaUrl}
                  alt={memory.caption}
                  className="w-full h-full object-cover"
                  data-testid="img-memory-thumbnail"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-sm font-medium line-clamp-2">{memory.caption}</p>
                  <p className="text-xs text-white/80 mt-1">{memory.authorName}</p>
                </div>
              </div>

              {!memory.isApproved && (
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-amber-500 text-white border-amber-600">
                    Pending
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedMemory} onOpenChange={(open) => !open && setSelectedMemory(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" data-testid="dialog-memory-lightbox">
          {selectedMemory && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedMemory.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle data-testid="text-memory-author">{selectedMemory.authorName}</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {formatDistanceToNow(new Date(selectedMemory.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Media Display */}
              <div className="rounded-lg overflow-hidden bg-black">
                {isVideo(selectedMemory.mediaUrl) ? (
                  <video
                    src={selectedMemory.mediaUrl}
                    controls
                    className="w-full max-h-[60vh]"
                    data-testid="video-memory"
                  />
                ) : (
                  <img
                    src={selectedMemory.mediaUrl}
                    alt={selectedMemory.caption}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                    data-testid="img-memory-full"
                  />
                )}
              </div>

              {/* Caption */}
              <div>
                <p className="text-foreground leading-relaxed" data-testid="text-memory-caption">
                  {selectedMemory.caption}
                </p>
              </div>

              <Separator />

              {/* Condolences Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Condolences ({condolences.length})
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendCondolence}
                    disabled={addCondolenceMutation.isPending || (!user && !guestName)}
                    data-testid="button-send-condolence"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Send Condolence
                  </Button>
                </div>

                {condolences.length > 0 ? (
                  <div className="space-y-3 max-h-32 overflow-y-auto">
                    {condolences.map((condolence) => (
                      <div key={condolence.id} className="flex items-start gap-2 text-sm" data-testid={`condolence-${condolence.id}`}>
                        <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium">{condolence.authorName}</span>
                          <span className="text-muted-foreground text-xs ml-2">
                            {formatDistanceToNow(new Date(condolence.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Be the first to send a condolence
                  </p>
                )}
              </div>

              <Separator />

              {/* Comments Section */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Comments ({comments.length})
                </h3>

                {comments.length > 0 && (
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3" data-testid={`comment-${comment.id}`}>
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">{comment.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted rounded-lg p-3">
                            <p className="font-medium text-sm">{comment.authorName}</p>
                            <p className="text-sm mt-1">{comment.comment}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 ml-3">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <div className="space-y-3">
                  {!user && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="guest-name">Your Name</Label>
                        <Input
                          id="guest-name"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="John Doe"
                          data-testid="input-guest-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="guest-email">Email (optional)</Label>
                        <Input
                          id="guest-email"
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="john@example.com"
                          data-testid="input-guest-email"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {user ? (user.firstName?.charAt(0) || user.email?.charAt(0) || 'U') : (guestName.charAt(0) || '?')}
                      </AvatarFallback>
                    </Avatar>
                    <Textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 min-h-[80px]"
                      data-testid="textarea-comment"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!commentText || addCommentMutation.isPending || (!user && !guestName)}
                      data-testid="button-submit-comment"
                    >
                      {addCommentMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
