import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Radio, Video, Users, Music, Share2, Camera, Flame, 
  Heart, PartyPopper, ArrowLeft, Calendar, Globe,
  Mic, MicOff, VideoOff, Settings, MessageCircle
} from "lucide-react";

export default function HolidayCelebration() {
  const params = useParams();
  const holidayId = params.id;
  const { toast } = useToast();
  
  const [holidayName, setHolidayName] = useState('Holiday');
  const [tradition, setTradition] = useState('Global');
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const trad = urlParams.get('tradition');
    if (name) setHolidayName(name);
    if (trad) setTradition(trad);
  }, []);
  const [viewerCount, setViewerCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [messages, setMessages] = useState<{name: string; message: string; time: string}[]>([]);
  
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 5) - 2;
          return Math.max(1, prev + change);
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleGoLive = () => {
    setIsLive(true);
    setViewerCount(Math.floor(Math.random() * 10) + 5);
    toast({
      title: "You're Live!",
      description: `Broadcasting your ${holidayName} celebration to friends and family.`,
    });
  };

  const handleEndStream = () => {
    setIsLive(false);
    setViewerCount(0);
    toast({
      title: "Stream Ended",
      description: "Your celebration broadcast has ended. Thanks for sharing!",
    });
  };

  const handleSendMessage = () => {
    if (celebrationMessage.trim()) {
      setMessages(prev => [...prev, {
        name: "You",
        message: celebrationMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setCelebrationMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(218,165,32,0.15),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/celebrations">
            <Button variant="ghost" className="mb-4 gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Back to Celebrations
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="gap-1">
                  <Globe className="w-3 h-3" />
                  {tradition}
                </Badge>
                {isLive && (
                  <Badge className="bg-red-500 text-white animate-pulse gap-1">
                    <Radio className="w-3 h-3" />
                    LIVE
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground" data-testid="text-holiday-name">
                {holidayName} Celebration
              </h1>
              <p className="text-muted-foreground mt-2">
                Share this special occasion with friends and family through live streaming
              </p>
            </div>
            
            {isLive && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{viewerCount}</span>
                  <span>watching</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative">
                {isLive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto flex items-center justify-center animate-pulse">
                        <Video className="w-12 h-12 text-primary" />
                      </div>
                      <p className="text-foreground font-medium">You are broadcasting live</p>
                      <p className="text-muted-foreground text-sm">Camera preview would appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-muted mx-auto flex items-center justify-center">
                        <Camera className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium">Ready to celebrate?</p>
                      <p className="text-muted-foreground text-sm">Start your live stream to share with loved ones</p>
                    </div>
                  </div>
                )}
                
                {isLive && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white gap-1">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-2">
                    {isLive ? (
                      <>
                        <Button
                          size="icon"
                          variant={isMuted ? "destructive" : "outline"}
                          onClick={() => setIsMuted(!isMuted)}
                          data-testid="button-mute"
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant={!isVideoOn ? "destructive" : "outline"}
                          onClick={() => setIsVideoOn(!isVideoOn)}
                          data-testid="button-video"
                        >
                          {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="outline" data-testid="button-settings">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="icon" variant="outline" data-testid="button-settings-offline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!isLive ? (
                      <Button 
                        className="gap-2 bg-red-500 hover:bg-red-600" 
                        onClick={handleGoLive}
                        data-testid="button-go-live"
                      >
                        <Radio className="w-4 h-4" />
                        Go Live
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        className="gap-2" 
                        onClick={handleEndStream}
                        data-testid="button-end-stream"
                      >
                        End Stream
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2" data-testid="button-share">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-primary" />
                  Celebration Activities
                </CardTitle>
                <CardDescription>
                  Engage with your viewers during the celebration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-light-candle">
                    <Flame className="w-6 h-6 text-orange-500" />
                    <span>Light Candle</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-play-music">
                    <Music className="w-6 h-6 text-blue-500" />
                    <span>Play Music</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="button-send-love">
                    <Heart className="w-6 h-6 text-pink-500" />
                    <span>Send Love</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="h-[400px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center text-muted-foreground">
                    <div>
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No messages yet</p>
                      <p className="text-xs">Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-foreground">{msg.message}</p>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Send a message..."
                    value={celebrationMessage}
                    onChange={(e) => setCelebrationMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    data-testid="input-chat"
                  />
                  <Button onClick={handleSendMessage} data-testid="button-send">
                    Send
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Invite Guests</CardTitle>
                <CardDescription>Share this celebration with others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="invite-link">Celebration Link</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      id="invite-link"
                      value={`opictuary.com/celebrate/${holidayId}`} 
                      readOnly 
                      data-testid="input-invite-link"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        navigator.clipboard.writeText(`https://opictuary.com/celebrate/${holidayId}`);
                        toast({ title: "Link copied!", description: "Share it with your guests" });
                      }}
                      data-testid="button-copy-link"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2" data-testid="button-invite-email">
                  <Users className="w-4 h-4" />
                  Invite via Email
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold mb-1">Schedule Future Celebrations</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Plan ahead for upcoming holidays and special occasions
                </p>
                <Button variant="outline" size="sm" data-testid="button-schedule">
                  Schedule Event
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
