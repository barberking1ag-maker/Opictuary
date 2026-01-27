import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  PartyPopper, Heart, Camera, MessageCircle, Sparkles, Send,
  Image, ThumbsUp, Star, Gift, Cake, ArrowLeft, Users, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const recentReactions = [
  { id: 1, user: "Sarah M.", type: "emoji", content: "🎉", time: "Just now" },
  { id: 2, user: "Uncle Joe", type: "message", content: "So happy to be part of this!", time: "1 min ago" },
  { id: 3, user: "Cousin Amy", type: "photo", content: "family-photo.jpg", time: "2 min ago" },
  { id: 4, user: "Grandma Rose", type: "emoji", content: "❤️", time: "2 min ago" },
  { id: 5, user: "Mike T.", type: "emoji", content: "🎂", time: "3 min ago" },
  { id: 6, user: "Lisa K.", type: "message", content: "Wishing you all the best!", time: "4 min ago" },
];

const quickEmojis = ["🎉", "❤️", "🎂", "🥳", "👏", "😍", "🙌", "✨", "🎁", "💐", "🌟", "💝"];

export default function VirtualReactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [reactionCount, setReactionCount] = useState(156);

  const sendReaction = (emoji: string) => {
    setReactionCount(prev => prev + 1);
    toast({ 
      title: "Reaction Sent!", 
      description: `You sent ${emoji} to the celebration`
    });
  };

  const sendMessage = () => {
    if (message.trim()) {
      toast({ title: "Message Sent!", description: "Your message is now visible to everyone" });
      setMessage("");
    }
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
                  <Badge className="bg-pink-100 text-pink-700">
                    {reactionCount} reactions
                  </Badge>
                </div>
                <CardDescription>
                  Tap to send instant reactions visible to everyone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {quickEmojis.map((emoji) => (
                    <Button 
                      key={emoji}
                      variant="outline" 
                      size="lg"
                      className="text-3xl h-16 hover:scale-110 transition-transform"
                      onClick={() => sendReaction(emoji)}
                      data-testid={`button-emoji-${emoji}`}
                    >
                      {emoji}
                    </Button>
                  ))}
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
                    className="bg-pink-600 hover:bg-pink-700"
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    data-testid="button-send"
                  >
                    <Send className="h-4 w-4 mr-2" />
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
                  {recentReactions.map((reaction) => (
                    <div key={reaction.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                        {reaction.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{reaction.user}</span>
                          <span className="text-xs text-muted-foreground">{reaction.time}</span>
                        </div>
                        {reaction.type === "emoji" && (
                          <span className="text-2xl">{reaction.content}</span>
                        )}
                        {reaction.type === "message" && (
                          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 mt-1">
                            {reaction.content}
                          </p>
                        )}
                        {reaction.type === "photo" && (
                          <div className="mt-1 w-full h-20 bg-muted rounded-lg flex items-center justify-center">
                            <Camera className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                  {["S", "J", "M", "A", "R", "L", "+12"].map((initial, i) => (
                    <div 
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-sm font-medium border-2 border-background"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  18 people reacting to this celebration
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20">
              <CardContent className="py-6 text-center">
                <ThumbsUp className="h-10 w-10 mx-auto text-pink-500 mb-3" />
                <h3 className="font-semibold">Top Reactor</h3>
                <p className="text-sm text-muted-foreground">
                  Sarah M. has sent the most reactions!
                </p>
                <Badge className="mt-2 bg-pink-100 text-pink-700">
                  23 reactions
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {!user && (
          <Card className="max-w-2xl mx-auto mt-8 border-pink-200 dark:border-pink-800">
            <CardContent className="py-8 text-center">
              <PartyPopper className="h-12 w-12 mx-auto text-pink-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sign in to Send Reactions</h3>
              <p className="text-muted-foreground mb-4">
                Join the celebration and send your reactions, photos, and messages
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700" data-testid="button-signin">
                Sign In to Participate
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
