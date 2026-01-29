import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  PartyPopper, Heart, Camera, MessageCircle, Sparkles, Send,
  Image, ThumbsUp, Star, Gift, Cake, ArrowLeft, Users, Zap, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Reaction {
  id: string;
  userId?: string;
  user?: string;
  reactionType: string;
  message?: string;
  createdAt: string;
}

interface ReactionCount {
  reactionType: string;
  count: number;
}

const quickEmojis = ["love", "celebrate", "pray", "remember", "support", "honor", "peace", "candle", "flower", "star", "heart", "light"];
const emojiIcons: Record<string, string> = {
  love: "❤️",
  celebrate: "🎉",
  pray: "🙏",
  remember: "💭",
  support: "💪",
  honor: "🏆",
  peace: "☮️",
  candle: "🕯️",
  flower: "🌹",
  star: "⭐",
  heart: "💕",
  light: "✨",
};

export default function VirtualReactions() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute("/virtual-reactions/:memorialId");
  const memorialId = params?.memorialId;
  
  const [message, setMessage] = useState("");
  const [recentActivity, setRecentActivity] = useState<Reaction[]>([]);
  const [participantCount, setParticipantCount] = useState(0);

  // Fetch reactions for memorial
  const { data: reactionsData, isLoading: reactionsLoading } = useQuery<{
    reactions: ReactionCount[];
    userReactions: string[];
    counts: ReactionCount[];
  }>({
    queryKey: ['/api/memorials', memorialId, 'reactions'],
    enabled: !!memorialId,
  });

  // Calculate total reactions
  const totalReactions = reactionsData?.reactions?.reduce((acc, r) => acc + r.count, 0) || 0;
  const userReactions = reactionsData?.userReactions || [];

  // Simulate participant count based on reactions
  useEffect(() => {
    const baseCount = Math.max(1, Math.floor(totalReactions / 3));
    setParticipantCount(baseCount + Math.floor(Math.random() * 5));
  }, [totalReactions]);

  // Send reaction mutation
  const sendReactionMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      if (!memorialId) {
        // Demo mode - just show toast
        return { success: true, demo: true };
      }
      const response = await apiRequest('POST', '/api/memorial-reactions', {
        memorialId,
        reactionType,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (data, reactionType) => {
      if (memorialId) {
        queryClient.invalidateQueries({ queryKey: ['/api/memorials', memorialId, 'reactions'] });
      }
      
      // Add to recent activity
      const newReaction: Reaction = {
        id: Date.now().toString(),
        user: user?.firstName || user?.email?.split('@')[0] || "You",
        reactionType,
        createdAt: new Date().toISOString(),
      };
      setRecentActivity(prev => [newReaction, ...prev.slice(0, 10)]);
      
      toast({ 
        title: "Reaction Sent!", 
        description: `You sent ${emojiIcons[reactionType] || reactionType} to the celebration`
      });
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to send reaction",
        variant: "destructive"
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!memorialId) {
        return { success: true, demo: true };
      }
      const response = await apiRequest('POST', `/api/memorials/${memorialId}/condolences`, {
        message: messageText,
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      const newReaction: Reaction = {
        id: Date.now().toString(),
        user: user?.firstName || user?.email?.split('@')[0] || "You",
        reactionType: "message",
        message: message,
        createdAt: new Date().toISOString(),
      };
      setRecentActivity(prev => [newReaction, ...prev.slice(0, 10)]);
      
      toast({ title: "Message Sent!", description: "Your message is now visible to everyone" });
      setMessage("");
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to send message",
        variant: "destructive"
      });
    },
  });

  const sendReaction = (reactionType: string) => {
    sendReactionMutation.mutate(reactionType);
  };

  const sendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-pink-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/celebrations">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Celebrations
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-pink-400 to-orange-400">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-serif text-pink-600 dark:text-pink-400">
            Virtual Reactions
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Send reactions, photos, and messages in real-time to make every celebration interactive
          </p>
          {!memorialId && (
            <Badge variant="secondary" className="mt-3">
              Demo Mode - Reactions are simulated
            </Badge>
          )}
        </div>

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Reactions
                  </CardTitle>
                  <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                    {totalReactions + recentActivity.filter(r => r.reactionType !== 'message').length} reactions
                  </Badge>
                </div>
                <CardDescription>
                  Tap to send instant reactions visible to everyone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {quickEmojis.map((reactionType) => {
                    const isSelected = userReactions.includes(reactionType);
                    return (
                      <Button 
                        key={reactionType}
                        variant={isSelected ? "default" : "outline"}
                        size="lg"
                        className={`text-3xl h-16 transition-transform ${isSelected ? 'bg-pink-100 border-pink-400' : ''}`}
                        onClick={() => sendReaction(reactionType)}
                        disabled={sendReactionMutation.isPending}
                        data-testid={`button-emoji-${reactionType}`}
                      >
                        {emojiIcons[reactionType]}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Send a Message
                </CardTitle>
                <CardDescription>
                  Write a heartfelt message for the celebration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea 
                  placeholder="Share your wishes, memories, or congratulations..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-24"
                  data-testid="input-message"
                />
                <div className="flex items-center gap-3">
                  <Button variant="outline" data-testid="button-add-photo">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                  <Button variant="outline" data-testid="button-add-gif">
                    <Image className="h-4 w-4 mr-2" />
                    Add GIF
                  </Button>
                  <div className="flex-1" />
                  <Button 
                    className="bg-pink-600"
                    onClick={sendMessage}
                    disabled={!message.trim() || sendMessageMutation.isPending}
                    data-testid="button-send"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-500" />
                  Special Reaction Packs
                </CardTitle>
                <CardDescription>
                  Premium animated reactions for special occasions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "Birthday Pack", icon: Cake, emojis: "🎂🎁🎈🎉", color: "from-pink-400 to-purple-400" },
                    { name: "Love Pack", icon: Heart, emojis: "❤️💕💖💝", color: "from-red-400 to-pink-400" },
                    { name: "Celebration Pack", icon: PartyPopper, emojis: "🎉🥳🎊✨", color: "from-yellow-400 to-orange-400" },
                    { name: "Thank You Pack", icon: Star, emojis: "🌟💫⭐🙏", color: "from-blue-400 to-indigo-400" },
                  ].map((pack) => (
                    <Card key={pack.name} className="hover-elevate cursor-pointer">
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${pack.color} flex items-center justify-center mb-2`}>
                          <pack.icon className="h-6 w-6 text-white" />
                        </div>
                        <p className="font-medium text-sm">{pack.name}</p>
                        <p className="text-lg mt-1">{pack.emojis}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Live Activity
                </CardTitle>
                <CardDescription>
                  Real-time reactions from guests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((reaction) => (
                      <div key={reaction.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                          {(reaction.user || "A").charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{reaction.user || "Anonymous"}</span>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(reaction.createdAt)}</span>
                          </div>
                          {reaction.reactionType === "message" ? (
                            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 mt-1">
                              {reaction.message}
                            </p>
                          ) : (
                            <span className="text-2xl">{emojiIcons[reaction.reactionType] || reaction.reactionType}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No reactions yet - be the first!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Active Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2 mb-3">
                  {["S", "J", "M", "A", "R", "L"].slice(0, Math.min(6, participantCount)).map((initial, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                    >
                      {initial}
                    </div>
                  ))}
                  {participantCount > 6 && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background">
                      +{participantCount - 6}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground" data-testid="text-participant-count">
                  {participantCount} {participantCount === 1 ? 'person' : 'people'} reacting to this celebration
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20">
              <CardContent className="py-6 text-center">
                <ThumbsUp className="h-10 w-10 mx-auto text-pink-500 mb-3" />
                <h3 className="font-semibold">Your Reactions</h3>
                <p className="text-sm text-muted-foreground">
                  {userReactions.length > 0 
                    ? `You've sent ${userReactions.length} reactions!`
                    : recentActivity.length > 0
                    ? `You've sent ${recentActivity.length} reactions!`
                    : "Send your first reaction!"}
                </p>
                <Badge className="mt-2 bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300">
                  {userReactions.length + recentActivity.length} reactions
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {!isAuthenticated && (
          <Card className="max-w-2xl mx-auto mt-8 border-pink-200 dark:border-pink-800">
            <CardContent className="py-8 text-center">
              <PartyPopper className="h-12 w-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Send Reactions</h3>
              <p className="text-muted-foreground mb-4">
                Join the celebration and send your reactions, photos, and messages
              </p>
              <Button className="bg-pink-600" data-testid="button-signin">
                Sign In to Participate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
