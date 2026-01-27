import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Music, Users, Play, Pause, SkipForward, SkipBack, Volume2,
  Bluetooth, Radio, Plus, Heart, Share2, ArrowLeft, ListMusic,
  Shuffle, Repeat
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const samplePlaylist = [
  { id: 1, title: "Happy Birthday", artist: "Traditional", duration: "0:32", isPlaying: true },
  { id: 2, title: "Celebration", artist: "Kool & The Gang", duration: "3:40", isPlaying: false },
  { id: 3, title: "Best Day of My Life", artist: "American Authors", duration: "3:14", isPlaying: false },
  { id: 4, title: "Good Time", artist: "Owl City & Carly Rae Jepsen", duration: "3:26", isPlaying: false },
  { id: 5, title: "Happy", artist: "Pharrell Williams", duration: "3:53", isPlaying: false },
  { id: 6, title: "Uptown Funk", artist: "Bruno Mars", duration: "4:30", isPlaying: false },
];

export default function SharedMusic() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(samplePlaylist[0]);
  const [connectedDevices, setConnectedDevices] = useState(3);
  const [progress, setProgress] = useState(45);

  const copyPlaylistLink = () => {
    const link = `${window.location.origin}/shared-music/demo-playlist`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link Copied!", description: "Share this link to sync music with guests" });
  };

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

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
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
                    <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                    <p className="text-white/80">{currentTrack.artist}</p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-white/70">
                      <Bluetooth className="h-4 w-4" />
                      <span>{connectedDevices} devices synced</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Progress value={progress} className="h-2 bg-white/20" />
                  <div className="flex justify-between text-sm text-white/70">
                    <span>0:14</span>
                    <span>{currentTrack.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Shuffle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="h-14 w-14 rounded-full bg-white text-indigo-600 hover:bg-white/90"
                    onClick={() => setIsPlaying(!isPlaying)}
                    data-testid="button-play"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Repeat className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>

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
                  {samplePlaylist.length} songs • 18 min total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {samplePlaylist.map((track, index) => (
                    <div 
                      key={track.id}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                        track.id === currentTrack.id 
                          ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setCurrentTrack(track)}
                      data-testid={`track-${track.id}`}
                    >
                      <div className="w-8 text-center text-muted-foreground">
                        {track.id === currentTrack.id && isPlaying ? (
                          <div className="flex justify-center gap-0.5">
                            <div className="w-1 h-4 bg-indigo-500 animate-pulse" />
                            <div className="w-1 h-3 bg-indigo-500 animate-pulse delay-75" />
                            <div className="w-1 h-5 bg-indigo-500 animate-pulse delay-150" />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${track.id === currentTrack.id ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
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
                  {[
                    { name: "Living Room Speaker", type: "Bluetooth", status: "playing" },
                    { name: "Kitchen Echo", type: "WiFi", status: "playing" },
                    { name: "Sarah's Phone", type: "App", status: "playing" },
                  ].map((device, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.type}</p>
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
                  value={`${window.location.origin}/shared-music/demo`}
                  readOnly
                  className="text-sm"
                  data-testid="input-share-link"
                />
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={copyPlaylistLink} data-testid="button-copy-link">
                  Copy Playlist Link
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  Listening Together
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex -space-x-2">
                  {["S", "J", "M", "A", "+5"].map((initial, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  8 people listening together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user && (
          <Card className="max-w-2xl mx-auto mt-8 border-indigo-200 dark:border-indigo-800">
            <CardContent className="py-8 text-center">
              <Music className="h-12 w-12 mx-auto text-indigo-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Create Playlists</h3>
              <p className="text-muted-foreground mb-4">
                Create shared playlists and sync music across all your celebration devices
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700" data-testid="button-signin">
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
