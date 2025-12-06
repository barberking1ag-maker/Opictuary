import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Memorial } from "@shared/schema";
import { 
  Cake, 
  Heart, 
  Gift, 
  PartyPopper, 
  Calendar, 
  Clock, 
  Send,
  Plus,
  ArrowLeft,
  Star,
  Sparkles,
  MessageCircle,
  Share2,
  Camera,
  Music,
  Lightbulb,
  Users
} from "lucide-react";
import { format, parseISO, differenceInDays, addYears, isBefore } from "date-fns";

interface BirthdayWish {
  id: string;
  memorialId: string;
  authorName: string;
  authorEmail?: string;
  message: string;
  relationship?: string;
  year: number;
  createdAt: string;
}

const celebrationIdeas = [
  { icon: Gift, title: "Make a Donation", description: "Donate to their favorite charity in their memory" },
  { icon: Cake, title: "Bake Their Recipe", description: "Make their favorite cake or dish" },
  { icon: Users, title: "Family Gathering", description: "Bring family together to share stories" },
  { icon: Camera, title: "Photo Memories", description: "Create a slideshow of cherished moments" },
  { icon: Music, title: "Play Their Music", description: "Listen to songs they loved" },
  { icon: MessageCircle, title: "Share Stories", description: "Tell stories about them to younger generations" },
  { icon: Star, title: "Release Balloons", description: "Release balloons with messages attached" },
  { icon: Heart, title: "Visit Their Place", description: "Visit the cemetery or their favorite spot" },
];

export default function BirthdayCelebration() {
  const params = useParams();
  const memorialId = params.memorialId as string;
  const [showWishDialog, setShowWishDialog] = useState(false);
  const [wishForm, setWishForm] = useState({
    authorName: "",
    authorEmail: "",
    message: "",
    relationship: "",
  });
  const { toast } = useToast();

  const { data: memorial, isLoading: memorialLoading } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${memorialId}`],
    enabled: !!memorialId,
  });

  const { data: wishes, isLoading: wishesLoading } = useQuery<BirthdayWish[]>({
    queryKey: [`/api/memorials/${memorialId}/birthday-wishes`],
    enabled: !!memorialId,
  });

  const createWishMutation = useMutation({
    mutationFn: async (data: typeof wishForm) => {
      return apiRequest("POST", `/api/memorials/${memorialId}/birthday-wishes`, {
        ...data,
        year: new Date().getFullYear(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/birthday-wishes`] });
      setShowWishDialog(false);
      setWishForm({ authorName: "", authorEmail: "", message: "", relationship: "" });
      toast({
        title: "Wish Sent",
        description: "Your birthday wish has been added to the celebration.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send birthday wish",
        variant: "destructive",
      });
    },
  });

  const birthdayInfo = useMemo(() => {
    if (!memorial?.birthDate) return null;
    
    const today = new Date();
    const birthParts = memorial.birthDate.split(/[\s,]+/);
    const birthMonth = new Date(Date.parse(birthParts[0] + " 1, 2000")).getMonth();
    const birthDay = parseInt(birthParts[1]) || 1;
    
    let nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
    if (isBefore(nextBirthday, today)) {
      nextBirthday = addYears(nextBirthday, 1);
    }
    
    const daysUntil = differenceInDays(nextBirthday, today);
    
    const birthYear = parseInt(birthParts[2]) || parseInt(birthParts[birthParts.length - 1]);
    const age = nextBirthday.getFullYear() - birthYear;
    
    return {
      nextBirthday,
      daysUntil,
      age,
      birthMonth,
      birthDay,
    };
  }, [memorial?.birthDate]);

  const wishesByYear = useMemo(() => {
    if (!wishes) return {};
    const grouped: Record<number, BirthdayWish[]> = {};
    wishes.forEach(wish => {
      if (!grouped[wish.year]) grouped[wish.year] = [];
      grouped[wish.year].push(wish);
    });
    return grouped;
  }, [wishes]);

  if (!memorialId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Cake className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Memorial Selected</h2>
          <p className="text-muted-foreground">Please select a memorial to celebrate.</p>
        </Card>
      </div>
    );
  }

  if (memorialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600" />
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Cake className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Memorial Not Found</h2>
          <p className="text-muted-foreground">The memorial you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/memorial/${memorial.inviteCode}`}>
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Memorial
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cake className="h-10 w-10 text-pink-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Birthday Celebration
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate and honor {memorial.name}'s birthday with love and cherished memories
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-8 text-white text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/30">
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {memorial.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold mb-2">{memorial.name}</h2>
                {birthdayInfo && (
                  <div className="space-y-2">
                    <p className="text-xl opacity-90">
                      {birthdayInfo.daysUntil === 0 ? (
                        <span className="flex items-center justify-center gap-2">
                          <PartyPopper className="h-6 w-6" />
                          Happy Heavenly Birthday!
                          <PartyPopper className="h-6 w-6" />
                        </span>
                      ) : (
                        <>Birthday in {birthdayInfo.daysUntil} days</>
                      )}
                    </p>
                    <p className="opacity-80">
                      Would be celebrating {birthdayInfo.age} years
                    </p>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Birthday Date</h3>
                    <p className="text-muted-foreground">{memorial.birthDate}</p>
                  </div>
                  <Button 
                    onClick={() => setShowWishDialog(true)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500"
                    data-testid="button-send-wish"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Send Birthday Wish
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Birthday Wishes
                  </CardTitle>
                  <CardDescription>Messages of love and remembrance</CardDescription>
                </div>
                <Badge variant="secondary">{wishes?.length || 0} wishes</Badge>
              </CardHeader>
              <CardContent>
                {wishesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
                  </div>
                ) : wishes && wishes.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(wishesByYear)
                      .sort(([a], [b]) => parseInt(b) - parseInt(a))
                      .map(([year, yearWishes]) => (
                        <div key={year}>
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">{year}</span>
                            <Separator className="flex-1" />
                          </div>
                          <div className="space-y-3 pl-6">
                            {yearWishes.map((wish) => (
                              <div
                                key={wish.id}
                                className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-100 dark:border-pink-800"
                                data-testid={`wish-${wish.id}`}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <span className="font-medium">{wish.authorName}</span>
                                    {wish.relationship && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {wish.relationship}
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {format(parseISO(wish.createdAt), "MMM d")}
                                  </span>
                                </div>
                                <p className="text-sm">{wish.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No birthday wishes yet.</p>
                    <Button onClick={() => setShowWishDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Be the First to Send a Wish
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Celebration Ideas
                </CardTitle>
                <CardDescription>Ways to honor their special day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {celebrationIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover-elevate cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                        <idea.icon className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{idea.title}</h4>
                        <p className="text-xs text-muted-foreground">{idea.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 border-pink-200 dark:border-pink-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-pink-800 dark:text-pink-200">
                  <Share2 className="h-5 w-5" />
                  Share This Celebration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-pink-700 dark:text-pink-300">
                  Invite family and friends to join in celebrating {memorial.name}'s birthday.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-pink-300 dark:border-pink-700"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({
                      title: "Link Copied",
                      description: "Share this link to invite others to celebrate.",
                    });
                  }}
                  data-testid="button-share"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Copy Celebration Link
                </Button>
              </CardContent>
            </Card>

            {birthdayInfo && birthdayInfo.daysUntil <= 30 && birthdayInfo.daysUntil > 0 && (
              <Card className="bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h4 className="font-bold text-yellow-800 dark:text-yellow-200">
                        Birthday Coming Soon!
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {birthdayInfo.daysUntil} days until {memorial.name}'s heavenly birthday
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={showWishDialog} onOpenChange={setShowWishDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Send a Birthday Wish
              </DialogTitle>
              <DialogDescription>
                Share a loving message for {memorial.name}'s birthday celebration
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input
                  value={wishForm.authorName}
                  onChange={(e) => setWishForm({ ...wishForm, authorName: e.target.value })}
                  placeholder="Enter your name"
                  data-testid="input-author-name"
                />
              </div>

              <div className="space-y-2">
                <Label>Your Relationship (Optional)</Label>
                <Input
                  value={wishForm.relationship}
                  onChange={(e) => setWishForm({ ...wishForm, relationship: e.target.value })}
                  placeholder="e.g., Daughter, Friend, Colleague"
                  data-testid="input-relationship"
                />
              </div>

              <div className="space-y-2">
                <Label>Your Birthday Wish</Label>
                <Textarea
                  value={wishForm.message}
                  onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                  placeholder="Share your loving message..."
                  rows={4}
                  data-testid="input-message"
                />
              </div>

              <div className="space-y-2">
                <Label>Email (Optional - for notifications)</Label>
                <Input
                  type="email"
                  value={wishForm.authorEmail}
                  onChange={(e) => setWishForm({ ...wishForm, authorEmail: e.target.value })}
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWishDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => createWishMutation.mutate(wishForm)}
                disabled={!wishForm.authorName || !wishForm.message || createWishMutation.isPending}
                className="bg-gradient-to-r from-pink-500 to-rose-500"
                data-testid="button-submit-wish"
              >
                {createWishMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Wish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
