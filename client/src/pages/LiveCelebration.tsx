import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Video, Users, MessageCircle, Heart, Sparkles, Camera,
  Mic, MicOff, VideoOff, Phone, PhoneOff, Share2, Copy,
  Settings, Monitor, ArrowLeft, Plus, Loader2, Check, Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LiveSession {
  id: string;
  sessionTitle: string;
  description?: string;
  hostUserId: string;
  joinCode: string;
  status: 'scheduled' | 'live' | 'ended';
  scheduledStart?: string;
  actualStartedAt?: string;
  actualEndedAt?: string;
  viewerCount: number;
  peakViewerCount: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  color: string;
}

const chatColors = ['text-purple-600', 'text-blue-600', 'text-green-600', 'text-pink-600', 'text-indigo-600'];

export default function LiveCelebration() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/live-celebration/:code");
  const joinCode = params?.code;

  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionDescription, setSessionDescription] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [viewerCount, setViewerCount] = useState(0);

  // Fetch joined session if via code
  const { data: joinedSession, isLoading: isJoiningSession } = useQuery<LiveSession>({
    queryKey: ['/api/live-celebrations/join', joinCode],
    enabled: !!joinCode,
  });

  // Fetch user's sessions
  const { data: userSessions = [], isLoading: isLoadingSessions } = useQuery<LiveSession[]>({
    queryKey: ['/api/live-celebrations/sessions'],
    enabled: isAuthenticated,
  });

  // Active session
  const activeSession = joinedSession || userSessions.find(s => s.status === 'live' || s.status === 'scheduled');

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (data: { sessionTitle: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/live-celebrations/sessions', data);
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['/api/live-celebrations/sessions'] });
      toast({ title: "Session Created!", description: `Share code: ${session.joinCode}` });
      setCreateDialogOpen(false);
      setSessionTitle("");
      setSessionDescription("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create session", variant: "destructive" });
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest('PATCH', `/api/live-celebrations/sessions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/live-celebrations/sessions'] });
    },
  });

  // End session mutation
  const endSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/live-celebrations/sessions/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/live-celebrations/sessions'] });
      setIsStreaming(false);
      toast({ title: "Stream Ended", description: "Your live celebration has ended" });
    },
  });

  // Sync streaming state with session
  useEffect(() => {
    if (activeSession) {
      setIsStreaming(activeSession.status === 'live');
      setViewerCount(activeSession.viewerCount || 0);
    }
  }, [activeSession]);

  // Simulate viewer count updates when streaming
  useEffect(() => {
    if (isStreaming) {
      const interval = setInterval(() => {
        setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 5) - 2));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  // Simulate incoming chat messages when streaming
  useEffect(() => {
    if (isStreaming) {
      const sampleMessages = [
        "This is amazing!",
        "Happy Birthday!",
        "So glad to be here!",
        "Love this celebration!",
        "Wishing you all the best!",
        "The decorations look beautiful!",
      ];
      const sampleSenders = ["Sarah", "Uncle Joe", "Cousin Amy", "Grandma", "Tom", "Jessica"];
      
      const interval = setInterval(() => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: sampleSenders[Math.floor(Math.random() * sampleSenders.length)],
          message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
          timestamp: new Date(),
          color: chatColors[Math.floor(Math.random() * chatColors.length)],
        };
        setChatMessages(prev => [...prev.slice(-20), newMessage]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isStreaming]);

  const handleStartStream = () => {
    if (activeSession) {
      updateSessionMutation.mutate({
        id: activeSession.id,
        updates: { status: 'live', actualStartedAt: new Date().toISOString() },
      });
    }
    setIsStreaming(true);
    setViewerCount(1);
    toast({ title: "Stream Started!", description: "Your celebration is now live" });
  };

  const handleEndStream = () => {
    if (activeSession) {
      endSessionMutation.mutate(activeSession.id);
    } else {
      setIsStreaming(false);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.firstName || user?.email?.split('@')[0] || "You",
      message: chatInput,
      timestamp: new Date(),
      color: 'text-orange-600',
    };
    setChatMessages(prev => [...prev.slice(-20), newMessage]);
    setChatInput("");
  };

  const handleReaction = (emoji: string) => {
    toast({ title: emoji, description: "Reaction sent!" });
  };

  const copyStreamLink = () => {
    const code = activeSession?.joinCode || 'DEMO';
    const link = `${window.location.origin}/live-celebration/${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Share this link with your guests" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSession = () => {
    if (joinCodeInput.trim()) {
      navigate(`/live-celebration/${joinCodeInput.toUpperCase()}`);
    }
  };

  if (isJoiningSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/celebrations">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Celebrations
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400">
              <Video className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-serif text-purple-600 dark:text-purple-400">
            Live Video Celebrations
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Stream your celebrations in HD with live chat, reactions, and real-time interactions
          </p>
        </div>

        {/* Session Status Banner */}
        {activeSession && (
          <div className="max-w-5xl mx-auto mb-6">
            <Card className={`${activeSession.status === 'live' ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white`}>
              <CardContent className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeSession.status === 'live' && (
                    <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                  )}
                  <span className="font-medium">{activeSession.sessionTitle}</span>
                  <Badge variant="secondary" className="bg-white/20">
                    Code: {activeSession.joinCode}
                  </Badge>
                </div>
                <Button variant="secondary" size="sm" onClick={copyStreamLink} data-testid="button-copy-code">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create or Join Session - Show when no active session */}
        {!activeSession && isAuthenticated && (
          <div className="max-w-md mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Start or Join a Stream</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-purple-600" data-testid="button-create-session">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Stream
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Live Celebration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="session-title">Stream Title</Label>
                        <Input
                          id="session-title"
                          placeholder="Mom's 80th Birthday Celebration"
                          value={sessionTitle}
                          onChange={(e) => setSessionTitle(e.target.value)}
                          data-testid="input-session-title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="session-desc">Description (optional)</Label>
                        <Textarea
                          id="session-desc"
                          placeholder="Tell guests what this celebration is about..."
                          value={sessionDescription}
                          onChange={(e) => setSessionDescription(e.target.value)}
                          data-testid="input-session-desc"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => createSessionMutation.mutate({ 
                          sessionTitle: sessionTitle || 'My Live Celebration',
                          description: sessionDescription 
                        })}
                        disabled={createSessionMutation.isPending}
                        data-testid="button-confirm-create"
                      >
                        {createSessionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Stream
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or join existing</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Enter stream code"
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                    maxLength={6}
                    data-testid="input-join-code"
                  />
                  <Button variant="outline" onClick={handleJoinSession} data-testid="button-join-session">
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                {isStreaming ? (
                  <div className="text-center text-white">
                    <Badge className="bg-red-500 mb-4 animate-pulse">
                      <span className="mr-2">●</span> LIVE
                    </Badge>
                    <p className="text-lg">{activeSession?.sessionTitle || "Your celebration is streaming..."}</p>
                    <p className="text-sm text-gray-400 mt-2" data-testid="text-viewer-count">{viewerCount} viewers watching</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Camera preview will appear here</p>
                    <p className="text-sm mt-2">Click "Start Stream" to begin</p>
                  </div>
                )}
                
                {isStreaming && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
                    <Users className="h-4 w-4" />
                    <span>{viewerCount} watching</span>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    variant={isMuted ? "destructive" : "outline"}
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    data-testid="button-mute"
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant={isVideoOff ? "destructive" : "outline"}
                    size="icon"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    data-testid="button-video"
                  >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant={isStreaming ? "destructive" : "default"}
                    size="lg"
                    onClick={isStreaming ? handleEndStream : handleStartStream}
                    className={isStreaming ? "" : "bg-purple-600"}
                    disabled={!activeSession && isAuthenticated && !isStreaming}
                    data-testid="button-stream"
                  >
                    {isStreaming ? (
                      <>
                        <PhoneOff className="h-5 w-5 mr-2" />
                        End Stream
                      </>
                    ) : (
                      <>
                        <Phone className="h-5 w-5 mr-2" />
                        Start Stream
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="icon" onClick={copyStreamLink} data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  
                  <Button variant="outline" size="icon" data-testid="button-settings">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-purple-500" />
                  Stream Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Stream Title</Label>
                  <Input 
                    value={activeSession?.sessionTitle || sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="e.g., Mom's 80th Birthday Celebration" 
                    className="mt-1"
                    data-testid="input-stream-title"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <Textarea 
                    value={activeSession?.description || sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    placeholder="Tell your guests what this celebration is about..."
                    className="mt-1"
                    data-testid="input-stream-description"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={copyStreamLink} data-testid="button-copy-link">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Stream Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  {isStreaming ? `${viewerCount} viewers in chat` : "Chat will be active when streaming"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg p-3 mb-3 overflow-y-auto">
                  {isStreaming && chatMessages.length > 0 ? (
                    <div className="space-y-3 text-sm">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-2">
                          <span className={`font-medium ${msg.color}`}>{msg.sender}:</span>
                          <span>{msg.message}</span>
                        </div>
                      ))}
                    </div>
                  ) : isStreaming ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p className="text-sm">Waiting for messages...</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <p className="text-sm">Start streaming to enable chat</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Send a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
                    disabled={!isStreaming}
                    data-testid="input-chat"
                  />
                  <Button onClick={handleSendChat} disabled={!isStreaming} data-testid="button-send-chat">Send</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Quick Reactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {["heart", "party", "clap", "cake", "excited", "love", "hands", "sparkle"].map((reaction, i) => {
                    const icons = [Heart, Sparkles, Users, Calendar, Video, Heart, Users, Sparkles];
                    const Icon = icons[i];
                    return (
                      <Button 
                        key={reaction} 
                        variant="outline" 
                        size="lg"
                        disabled={!isStreaming}
                        onClick={() => handleReaction(reaction)}
                        data-testid={`button-reaction-${reaction}`}
                      >
                        <Icon className="h-5 w-5" />
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Session History */}
            {userSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Your Streams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userSessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{session.sessionTitle}</span>
                          <Badge variant={session.status === 'live' ? 'destructive' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {session.peakViewerCount || 0} peak viewers
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {!isAuthenticated && (
          <Card className="max-w-2xl mx-auto mt-8 border-purple-200 dark:border-purple-800">
            <CardContent className="py-8 text-center">
              <Video className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Start Streaming</h3>
              <p className="text-muted-foreground mb-4">
                Create your own live celebration streams and invite friends and family
              </p>
              <Button className="bg-purple-600" data-testid="button-signin">
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
