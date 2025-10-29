import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { MemorialLike, MemorialComment, Condolence } from "@shared/schema";

interface MemorialEngagementProps {
  memorialId: string;
  currentUser?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  onLoginRequired: () => void;
}

export function MemorialEngagement({
  memorialId,
  currentUser,
  onLoginRequired,
}: MemorialEngagementProps) {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState("");
  const [condolenceText, setCondolenceText] = useState("");
  const [condolenceName, setCondolenceName] = useState("");
  const [condolenceEmail, setCondolenceEmail] = useState("");

  // Fetch likes
  const { data: likes = [] } = useQuery<MemorialLike[]>({
    queryKey: ["/api/memorials", memorialId, "likes"],
  });

  // Fetch likes count
  const { data: likesData } = useQuery<{ count: number }>({
    queryKey: ["/api/memorials", memorialId, "likes", "count"],
  });

  // Fetch comments
  const { data: comments = [] } = useQuery<MemorialComment[]>({
    queryKey: ["/api/memorials", memorialId, "comments"],
  });

  // Fetch condolences
  const { data: condolences = [] } = useQuery<Condolence[]>({
    queryKey: ["/api/memorials", memorialId, "condolences"],
  });

  const userHasLiked = currentUser
    ? likes.some(
        (like) =>
          like.userId === currentUser.id || like.userEmail === currentUser.email
      )
    : false;

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        onLoginRequired();
        throw new Error("Login required");
      }

      const userName = currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.email;

      return apiRequest("POST", `/api/memorials/${memorialId}/likes`, {
        userId: currentUser.id,
        userEmail: currentUser.email,
        userName: userName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "likes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "likes", "count"],
      });
      toast({
        title: "Memorial liked",
        description: "Your like has been added.",
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Login required") {
        toast({
          title: "Error",
          description: "Failed to like memorial.",
          variant: "destructive",
        });
      }
    },
  });

  // Unlike mutation
  const unlikeMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) {
        onLoginRequired();
        throw new Error("Login required");
      }

      return apiRequest("DELETE", `/api/memorials/${memorialId}/likes`, {
        userId: currentUser.id,
        userEmail: currentUser.email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "likes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "likes", "count"],
      });
      toast({
        title: "Like removed",
        description: "Your like has been removed.",
      });
    },
    onError: (error: Error) => {
      if (error.message !== "Login required") {
        toast({
          title: "Error",
          description: "Failed to remove like.",
          variant: "destructive",
        });
      }
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser) {
        onLoginRequired();
        throw new Error("Login required");
      }

      const userName = currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.email;

      return apiRequest("POST", `/api/memorials/${memorialId}/comments`, {
        userId: currentUser.id,
        authorEmail: currentUser.email,
        authorName: userName,
        comment: content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "comments"],
      });
      setCommentText("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: any) => {
      // Clear the comment text on error to prevent confusion
      setCommentText("");
      
      if (error.message !== "Login required") {
        // Show the actual API error message if available
        const errorMessage = error.message || "Failed to post comment.";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
  });

  // Condolence mutation
  const condolenceMutation = useMutation({
    mutationFn: async (data: {
      authorName: string;
      authorEmail?: string;
      message: string;
    }) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/condolences`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/memorials", memorialId, "condolences"],
      });
      setCondolenceText("");
      setCondolenceName("");
      setCondolenceEmail("");
      toast({
        title: "Condolence sent",
        description: "Your message of sympathy has been shared.",
      });
    },
    onError: (error: any) => {
      // Show the actual API error message if available
      const errorMessage = error.message || "Failed to send condolence.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleLikeToggle = () => {
    if (userHasLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
  };

  const handleCondolenceSubmit = () => {
    if (!condolenceText.trim() || !condolenceName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and message.",
        variant: "destructive",
      });
      return;
    }

    condolenceMutation.mutate({
      authorName: condolenceName,
      authorEmail: condolenceEmail || undefined,
      message: condolenceText,
    });
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

  return (
    <div className="space-y-4" data-testid="memorial-engagement">
      <Card className="bg-card/40 backdrop-blur-sm border-white/10">
        <CardHeader className="gap-2">
          <div className="flex items-center gap-4">
            <Button
              variant={userHasLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLikeToggle}
              disabled={likeMutation.isPending || unlikeMutation.isPending}
              className="gap-2"
              data-testid="button-like-memorial"
            >
              <Heart
                className={`h-4 w-4 ${userHasLiked ? "fill-current" : ""}`}
              />
              <span>{likesData?.count || 0}</span>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{comments.length} comments</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="comments" className="w-full">
        <TabsList className="grid w-full grid-cols-2" data-testid="engagement-tabs">
          <TabsTrigger value="comments" data-testid="tab-comments">
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="condolences" data-testid="tab-condolences">
            Condolences ({condolences.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="min-h-[100px] bg-background/50"
                  data-testid="input-comment"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className="gap-2"
                  data-testid="button-post-comment"
                >
                  <Send className="h-4 w-4" />
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {comments.map((comment) => (
              <Card
                key={comment.id}
                className="bg-card/40 backdrop-blur-sm border-white/10"
                data-testid={`comment-${comment.id}`}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20">
                        {getInitials(comment.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm" data-testid={`text-comment-author-${comment.id}`}>
                          {comment.authorName || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/90" data-testid={`text-comment-content-${comment.id}`}>
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="condolences" className="space-y-4">
          <Card className="bg-card/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Send Condolences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={condolenceName}
                    onChange={(e) => setCondolenceName(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="input-condolence-name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Your Email (optional)
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={condolenceEmail}
                    onChange={(e) => setCondolenceEmail(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="input-condolence-email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Your Message <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Share your condolences and support..."
                  value={condolenceText}
                  onChange={(e) => setCondolenceText(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                  data-testid="input-condolence-message"
                />
              </div>
              <Button
                onClick={handleCondolenceSubmit}
                disabled={condolenceMutation.isPending}
                className="w-full gap-2"
                data-testid="button-send-condolence"
              >
                <Send className="h-4 w-4" />
                Send Condolences
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {condolences.map((condolence) => (
              <Card
                key={condolence.id}
                className="bg-card/40 backdrop-blur-sm border-white/10"
                data-testid={`condolence-${condolence.id}`}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/20">
                        {getInitials(condolence.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm" data-testid={`text-condolence-sender-${condolence.id}`}>
                          {condolence.authorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(condolence.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/90 italic" data-testid={`text-condolence-message-${condolence.id}`}>
                        {condolence.message}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {condolences.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No condolences yet. Be the first to share your support.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
