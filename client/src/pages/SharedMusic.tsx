import { useState, useEffect } from "react";
import { Link, useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Music, Users, Play, Pause, SkipForward, SkipBack, Volume2,
  Bluetooth, Radio, Plus, Heart, Share2, ArrowLeft, ListMusic,
  Shuffle, Repeat, Loader2, Copy, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  url?: string;
}

interface MusicSession {
  id: string;
  sessionName: string;
  sessionCode: string;
  hostUserId: string;
  isPlaying: boolean;
  currentTrackIndex: number;
  status: string;
  connectedDevices: Array<{
    deviceId: string;
    deviceName: string;
    deviceType: string;
    connectedAt: string;
  }>;
  createdAt: string;
}

const defaultPlaylist: Track[] = [
  { id: 1, title: "Happy Birthday", artist: "Traditional", duration: "0:32" },
  { id: 2, title: "Celebration", artist: "Kool & The Gang", duration: "3:40" },
  { id: 3, title: "Best Day of My Life", artist: "American Authors", duration: "3:14" },
  { id: 4, title: "Good Time", artist: "Owl City & Carly Rae Jepsen", duration: "3:26" },
  { id: 5, title: "Happy", artist: "Pharrell Williams", duration: "3:53" },
  { id: 6, title: "Uptown Funk", artist: "Bruno Mars", duration: "4:30" },
];

export default function SharedMusic() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/shared-music/:code");
  const joinCode = params?.code;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playlist] = useState<Track[]>(defaultPlaylist);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [copied, setCopied] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  // Fetch session if joining via code
  const { data: joinedSession, isLoading: isJoiningSession } = useQuery<MusicSession>({
    queryKey: ['/api/shared-music/join', joinCode],
    enabled: !!joinCode,
  });

  // Fetch user's sessions
  const { data: userSessions = [], isLoading: isLoadingSessions } = useQuery<MusicSession[]>({
    queryKey: ['/api/shared-music/sessions'],
    enabled: isAuthenticated,
  });

  // Active session (either joined or user's active one)
  const activeSession = joinedSession || userSessions.find(s => s.status === 'active');

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest('POST', '/api/shared-music/sessions', {
        sessionName: name || 'My Music Session',
        deviceName: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop',
      });
      return response.json();
    },
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: ['/api/shared-music/sessions'] });
      toast({ title: "Session Created!", description: `Share code: ${session.sessionCode}` });
      setCreateDialogOpen(false);
      setSessionName("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create session", variant: "destructive" });
    },
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await apiRequest('PATCH', `/api/shared-music/sessions/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shared-music/sessions'] });
      if (joinCode) {
        queryClient.invalidateQueries({ queryKey: ['/api/shared-music/join', joinCode] });
      }
    },
  });

  // Sync playback state with session
  useEffect(() => {
    if (activeSession) {
      setIsPlaying(activeSession.isPlaying);
      setCurrentTrackIndex(activeSession.currentTrackIndex || 0);
    }
  }, [activeSession]);

  // Progress simulation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 1));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (activeSession) {
      updateSessionMutation.mutate({
        id: activeSession.id,
        updates: { isPlaying: newIsPlaying },
      });
    }
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setProgress(0);
    
    if (activeSession) {
      updateSessionMutation.mutate({
        id: activeSession.id,
        updates: { currentTrackIndex: index },
      });
    }
  };

  const handlePrevTrack = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    handleTrackChange(newIndex);
  };

  const handleNextTrack = () => {
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    handleTrackChange(newIndex);
  };

  const copySessionLink = () => {
    if (!activeSession) return;
    const link = `${window.location.origin}/shared-music/${activeSession.sessionCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: "Link Copied!", description: "Share this link to sync music with guests" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSession = () => {
    if (joinCodeInput.trim()) {
      navigate(`/shared-music/${joinCodeInput.toUpperCase()}`);
    }
  };

  const connectedCount = activeSession?.connectedDevices?.length || 1;

  if (isJoiningSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <Link href="/celebrations">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Celebrations
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400">
              <Music className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-serif text-indigo-600 dark:text-indigo-400">
            Shared Music Experience
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everyone listens to the same playlist together - sync music across all connected devices
          </p>
        </div>

        {/* Session Status Banner */}
        {activeSession && (
          <div className="max-w-5xl mx-auto mb-6">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-medium">{activeSession.sessionName}</span>
                  <Badge variant="secondary" className="bg-white/20">
                    Code: {activeSession.sessionCode}
                  </Badge>
                </div>
                <Button variant="secondary" size="sm" onClick={copySessionLink} data-testid="button-copy-code">
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create or Join Session */}
        {!activeSession && isAuthenticated && (
          <div className="max-w-md mx-auto mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Start or Join a Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-indigo-600" data-testid="button-create-session">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Music Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="session-name">Session Name</Label>
                        <Input
                          id="session-name"
                          placeholder="Birthday Party Playlist"
                          value={sessionName}
                          onChange={(e) => setSessionName(e.target.value)}
                          data-testid="input-session-name"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => createSessionMutation.mutate(sessionName)}
                        disabled={createSessionMutation.isPending}
                        data-testid="button-confirm-create"
                      >
                        {createSessionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Create Session
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
                    placeholder="Enter session code"
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
            {/* Now Playing Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                    <Music className="h-16 w-16" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-white/20 mb-2">
                      <Radio className="h-3 w-3 mr-1" />
                      Now Playing
                    </Badge>
                    <h2 className="text-2xl font-bold" data-testid="text-current-track">{currentTrack.title}</h2>
                    <p className="text-white/80">{currentTrack.artist}</p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-white/70">
                      <Bluetooth className="h-4 w-4" />
                      <span data-testid="text-device-count">{connectedCount} {connectedCount === 1 ? 'device' : 'devices'} synced</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Progress value={progress} className="h-2 bg-white/20" />
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{Math.floor(progress * 0.32 / 100)}:{String(Math.floor((progress * 32 / 100) % 60)).padStart(2, '0')}</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="ghost" size="icon" className="text-white" data-testid="button-shuffle">
                    <Shuffle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={handlePrevTrack} data-testid="button-prev">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-white text-indigo-600"
                    onClick={handlePlayPause}
                    data-testid="button-play"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" onClick={handleNextTrack} data-testid="button-next">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white" data-testid="button-repeat">
                    <Repeat className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Playlist Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-indigo-500" />
                    Celebration Playlist
                  </CardTitle>
                  <Button variant="outline" size="sm" data-testid="button-add-song">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Song
                  </Button>
                </div>
                <CardDescription>
                  {playlist.length} songs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playlist.map((track, index) => (
                    <div 
                      key={track.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                        index === currentTrackIndex 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleTrackChange(index)}
                      data-testid={`track-${track.id}`}
                    >
                      <div className="w-8 text-center text-muted-foreground">
                        {index === currentTrackIndex && isPlaying ? (
                          <div className="flex justify-center gap-0.5">
                            <div className="w-1 h-4 bg-indigo-500 animate-pulse" />
                            <div className="w-1 h-3 bg-indigo-500 animate-pulse" style={{animationDelay: '75ms'}} />
                            <div className="w-1 h-5 bg-indigo-500 animate-pulse" style={{animationDelay: '150ms'}} />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${index === currentTrackIndex ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                          {track.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-muted-foreground">{track.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Connected Devices Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bluetooth className="h-5 w-5 text-blue-500" />
                  Connected Devices
                </CardTitle>
                <CardDescription>
                  All devices play in perfect sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(activeSession?.connectedDevices?.length ? activeSession.connectedDevices : [
                    { deviceId: '1', deviceName: "This Device", deviceType: "Browser", connectedAt: new Date().toISOString() },
                  ]).map((device, i) => (
                    <div key={device.deviceId || i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{device.deviceName}</p>
                        <p className="text-xs text-muted-foreground">{device.deviceType}</p>
                      </div>
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" data-testid="button-add-device">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </CardContent>
            </Card>

            {/* Invite Guests Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-indigo-500" />
                  Invite Guests
                </CardTitle>
                <CardDescription>
                  Share the playlist link to sync with others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  value={activeSession ? `${window.location.origin}/shared-music/${activeSession.sessionCode}` : `${window.location.origin}/shared-music`}
                  readOnly
                  className="text-sm"
                  data-testid="input-share-link"
                />
                <Button className="w-full bg-indigo-600" onClick={copySessionLink} disabled={!activeSession} data-testid="button-copy-link">
                  Copy Playlist Link
                </Button>
              </CardContent>
            </Card>

            {/* Listening Together Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Listening Together
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2">
                  {["You", ...(activeSession?.connectedDevices?.slice(0, 4).map((_, i) => String.fromCharCode(65 + i)) || [])].map((initial, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                    >
                      {initial.charAt(0)}
                    </div>
                  ))}
                  {connectedCount > 5 && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background">
                      +{connectedCount - 5}
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-3" data-testid="text-listener-count">
                  {connectedCount} {connectedCount === 1 ? 'person' : 'people'} listening together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!isAuthenticated && (
          <Card className="max-w-2xl mx-auto mt-8 border-indigo-200 dark:border-indigo-800">
            <CardContent className="py-8 text-center">
              <Music className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Create Sessions</h3>
              <p className="text-muted-foreground mb-4">
                Create shared music sessions and sync playback across all your celebration devices
              </p>
              <Button className="bg-indigo-600" data-testid="button-signin">
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
