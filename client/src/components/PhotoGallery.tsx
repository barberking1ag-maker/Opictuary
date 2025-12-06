import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, X, Download, Heart, MessageCircle, User } from "lucide-react";
import type { Memory, MemoryComment, MemoryCondolence } from "@shared/schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface PhotoGalleryProps {
  memories: Memory[];
}

export function PhotoGallery({ memories }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Memory | null>(null);
  const [newComment, setNewComment] = useState("");
  const [commentAuthorName, setCommentAuthorName] = useState("");
  const [commentAuthorEmail, setCommentAuthorEmail] = useState("");
  const { toast } = useToast();

  // Filter memories that have photos
  const photosWithMemories = memories.filter((m) => m.mediaUrl && m.isApproved);

  // Fetch comments for selected photo
  const { data: comments = [], refetch: refetchComments } = useQuery<MemoryComment[]>({
    queryKey: ["/api/memories", selectedPhoto?.id, "comments"],
    enabled: !!selectedPhoto,
  });

  // Fetch condolences count for selected photo
  const { data: condolencesData } = useQuery<{ count: number }>({
    queryKey: ["/api/memories", selectedPhoto?.id, "condolences", "count"],
    enabled: !!selectedPhoto,
  });

  const condolencesCount = condolencesData?.count || 0;

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; authorName: string; authorEmail?: string }) => {
      if (!selectedPhoto) throw new Error("No photo selected");
      return await apiRequest("POST", `/api/memories/${selectedPhoto.id}/comments`, data);
    },
    onSuccess: () => {
      toast({
        title: "Comment Added",
        description: "Your comment has been shared with love.",
      });
      setNewComment("");
      setCommentAuthorName("");
      setCommentAuthorEmail("");
      refetchComments();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Comment",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add condolence mutation
  const addCondolenceMutation = useMutation({
    mutationFn: async (data: { authorName: string; authorEmail?: string }) => {
      if (!selectedPhoto) throw new Error("No photo selected");
      return await apiRequest("POST", `/api/memories/${selectedPhoto.id}/condolences`, data);
    },
    onSuccess: () => {
      toast({
        title: "Condolence Sent",
        description: "Your condolence has been expressed with sympathy.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/memories", selectedPhoto?.id, "condolences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/memories", selectedPhoto?.id, "condolences", "count"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Condolence",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment Required",
        description: "Please enter a comment.",
        variant: "destructive",
      });
      return;
    }

    if (!commentAuthorName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    addCommentMutation.mutate({
      comment: newComment,
      authorName: commentAuthorName,
      authorEmail: commentAuthorEmail || undefined,
    });
  };

  const handleSendCondolence = () => {
    if (!commentAuthorName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to send condolences.",
        variant: "destructive",
      });
      return;
    }

    addCondolenceMutation.mutate({
      authorName: commentAuthorName,
      authorEmail: commentAuthorEmail || undefined,
    });
  };

  if (photosWithMemories.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto mb-4">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Photos Yet</h3>
          <p className="text-muted-foreground">
            Photos shared by family and friends will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-serif font-bold">Photo Gallery</h3>
            <p className="text-muted-foreground">
              {photosWithMemories.length} {photosWithMemories.length === 1 ? 'photo' : 'photos'} shared with love
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            <ImageIcon className="w-3 h-3 mr-1" />
            {photosWithMemories.length}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photosWithMemories.map((memory) => (
            <Button
              key={memory.id}
              variant="ghost"
              className="w-full h-auto p-0 flex flex-col rounded-md group"
              onClick={() => setSelectedPhoto(memory)}
              aria-label={`View photo by ${memory.authorName}${memory.caption ? `: ${memory.caption}` : ''}`}
              data-testid={`button-view-photo-${memory.id}`}
            >
              <Card className="overflow-hidden w-full" data-testid={`photo-card-${memory.id}`}>
                <div className="aspect-square relative overflow-hidden w-full">
                  <img
                    src={memory.mediaUrl!}
                    alt={memory.caption || `Photo by ${memory.authorName}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-testid={`photo-img-${memory.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <div className="absolute bottom-2 left-2 right-2 space-y-1">
                      <p className="text-white text-xs font-medium line-clamp-2 text-left drop-shadow-lg" data-testid={`photo-author-${memory.id}`}>
                        <User className="w-3 h-3 inline mr-1" />
                        {memory.authorName}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </Button>
          ))}
        </div>
      </div>

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0" data-testid="dialog-photo-viewer">
          {selectedPhoto && (
            <div className="flex flex-col h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo viewer"
                data-testid="button-close-photo"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex-1 overflow-y-auto">
                <div className="relative bg-black">
                  <img
                    src={selectedPhoto.mediaUrl!}
                    alt={selectedPhoto.caption || "Memorial photo"}
                    className="w-full max-h-[50vh] object-contain"
                    data-testid="img-photo-viewer"
                  />
                </div>

                <div className="bg-card p-6 space-y-6">
                  {/* Photo Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground" data-testid="text-photo-author">
                            {selectedPhoto.authorName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {selectedPhoto.createdAt 
                              ? new Date(selectedPhoto.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })
                              : 'Shared with love'
                            }
                          </p>
                        </div>
                      </div>

                      {selectedPhoto.caption && (
                        <div className="mt-3 p-4 bg-muted/50 rounded-lg">
                          <p className="text-foreground leading-relaxed" data-testid="text-photo-caption">
                            {selectedPhoto.caption}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                        data-testid="button-download-photo"
                      >
                        <a
                          href={selectedPhoto.mediaUrl!}
                          download={`memorial-photo-${selectedPhoto.id}.jpg`}
                          aria-label="Download photo"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Condolence Button */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">Express Your Sympathy</h4>
                        <p className="text-sm text-muted-foreground">
                          {condolencesCount} {condolencesCount === 1 ? 'person has' : 'people have'} sent condolences
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      onClick={handleSendCondolence}
                      disabled={addCondolenceMutation.isPending}
                      data-testid="button-send-condolence"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Sorry for Your Loss
                    </Button>
                  </div>

                  <Separator />

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">Comments ({comments.length})</h4>
                    </div>

                    {/* Add Comment Form */}
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <Input
                        placeholder="Your name"
                        value={commentAuthorName}
                        onChange={(e) => setCommentAuthorName(e.target.value)}
                        data-testid="input-comment-name"
                      />
                      <Input
                        placeholder="Your email (optional)"
                        type="email"
                        value={commentAuthorEmail}
                        onChange={(e) => setCommentAuthorEmail(e.target.value)}
                        data-testid="input-comment-email"
                      />
                      <Textarea
                        placeholder="Share your thoughts about this memory..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                        data-testid="input-comment-text"
                      />
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleAddComment}
                          disabled={addCommentMutation.isPending}
                          data-testid="button-add-comment"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-4">
                        {comments.length === 0 ? (
                          <p className="text-center text-muted-foreground py-8">
                            No comments yet. Be the first to share your thoughts.
                          </p>
                        ) : (
                          comments.map((comment) => (
                            <Card key={comment.id} className="p-4" data-testid={`comment-card-${comment.id}`}>
                              <div className="flex items-start gap-3">
                                <div className="bg-primary/20 p-2 rounded-full">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="font-semibold text-sm" data-testid={`comment-author-${comment.id}`}>
                                      {comment.authorName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {comment.createdAt 
                                        ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                          })
                                        : ''
                                      }
                                    </p>
                                  </div>
                                  <p className="text-sm text-foreground" data-testid={`comment-text-${comment.id}`}>
                                    {comment.comment}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
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
