import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Video, Users, MessageCircle, Heart, Sparkles, Camera,
  Mic, MicOff, VideoOff, Phone, PhoneOff, Share2, Copy,
  Settings, Monitor, ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function LiveCelebration() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const copyStreamLink = () => {
    const link = `${window.location.origin}/live/demo-stream`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link Copied!", description: "Share this link with your guests" });
  };

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

        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
                {isStreaming ? (
                  <div className="text-center text-white">
                    <Badge className="bg-red-500 mb-4 animate-pulse">
                      <span className="mr-2">●</span> LIVE
                    </Badge>
                    <p className="text-lg">Your celebration is streaming...</p>
                    <p className="text-sm text-gray-400 mt-2">127 viewers watching</p>
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
                    <span>127 watching</span>
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
                    onClick={() => setIsStreaming(!isStreaming)}
                    className={isStreaming ? "" : "bg-purple-600 hover:bg-purple-700"}
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
                  
                  <Button variant="outline" size="icon" data-testid="button-share">
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
                  Stream Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Stream Title</label>
                  <Input 
                    placeholder="e.g., Mom's 80th Birthday Celebration" 
                    className="mt-1"
                    data-testid="input-stream-title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
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
                  {isStreaming ? "127 viewers in chat" : "Chat will be active when streaming"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/30 rounded-lg p-3 mb-3 overflow-y-auto">
                  {isStreaming ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <span className="font-medium text-purple-600">Sarah:</span>
                        <span>Happy Birthday, Mom! We love you!</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-blue-600">Uncle Joe:</span>
                        <span>Looking great! Wish I could be there!</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium text-green-600">Cousin Amy:</span>
                        <span>The decorations look amazing!</span>
                      </div>
                      <div className="flex items-center gap-2 text-pink-500">
                        <Heart className="h-4 w-4" />
                        <span>15 people reacted with love</span>
                      </div>
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
                    disabled={!isStreaming}
                    data-testid="input-chat"
                  />
                  <Button disabled={!isStreaming} data-testid="button-send-chat">Send</Button>
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
                  {["❤️", "🎉", "👏", "🎂", "🥳", "😍", "🙌", "✨"].map((emoji) => (
                    <Button 
                      key={emoji} 
                      variant="outline" 
                      size="lg"
                      disabled={!isStreaming}
                      className="text-2xl"
                      data-testid={`button-reaction-${emoji}`}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user && (
          <Card className="max-w-2xl mx-auto mt-8 border-purple-200 dark:border-purple-800">
            <CardContent className="py-8 text-center">
              <Video className="h-12 w-12 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Start Streaming</h3>
              <p className="text-muted-foreground mb-4">
                Create your own live celebration streams and invite friends and family
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-signin">
                Sign In to Get Started
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
