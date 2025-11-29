import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Rainbow, PawPrint, Dog, Cat, Bird, Fish, Rabbit, Heart,
  Flame, Calendar, Share2, ArrowLeft, MessageCircle, Star,
  Sparkles, Clock, User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PetMemorial, PetMemorialCondolence, PetMemorialCandle } from "@shared/schema";

const speciesIcons: Record<string, any> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  other: PawPrint,
};

const themeColors: Record<string, string> = {
  rainbow_bridge: "from-purple-400 via-pink-300 to-orange-300",
  garden: "from-green-400 to-emerald-300",
  starlight: "from-indigo-500 to-purple-400",
  forest: "from-green-600 to-teal-400",
  ocean: "from-blue-400 to-cyan-300",
};

export default function PetMemorialView() {
  const [, params] = useRoute("/pet-memorial/:inviteCode");
  const inviteCode = params?.inviteCode;
  const [showCondolenceDialog, setShowCondolenceDialog] = useState(false);
  const [showCandleDialog, setShowCandleDialog] = useState(false);
  const [condolenceForm, setCondolenceForm] = useState({ authorName: "", message: "", relationship: "" });
  const [candleForm, setCandleForm] = useState({ litBy: "", message: "" });
  const { toast } = useToast();

  const { data: memorial, isLoading } = useQuery<PetMemorial>({
    queryKey: [`/api/pet-memorials/${inviteCode}`],
    enabled: !!inviteCode,
  });

  const { data: condolences } = useQuery<PetMemorialCondolence[]>({
    queryKey: [`/api/pet-memorials/${inviteCode}/condolences`],
    enabled: !!inviteCode,
  });

  const { data: candles } = useQuery<PetMemorialCandle[]>({
    queryKey: [`/api/pet-memorials/${inviteCode}/candles`],
    enabled: !!inviteCode,
  });

  const addCondolenceMutation = useMutation({
    mutationFn: async (data: typeof condolenceForm) => {
      return apiRequest("POST", `/api/pet-memorials/${inviteCode}/condolences`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pet-memorials/${inviteCode}/condolences`] });
      setShowCondolenceDialog(false);
      setCondolenceForm({ authorName: "", message: "", relationship: "" });
      toast({ title: "Condolence Sent", description: "Your message has been shared." });
    },
  });

  const lightCandleMutation = useMutation({
    mutationFn: async (data: typeof candleForm) => {
      return apiRequest("POST", `/api/pet-memorials/${inviteCode}/candles`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pet-memorials/${inviteCode}/candles`] });
      queryClient.invalidateQueries({ queryKey: [`/api/pet-memorials/${inviteCode}`] });
      setShowCandleDialog(false);
      setCandleForm({ litBy: "", message: "" });
      toast({ title: "Candle Lit", description: "Your candle shines in their memory." });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <PawPrint className="h-16 w-16 mx-auto text-purple-300 mb-4" />
          <p className="text-muted-foreground">Loading memorial...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md text-center p-8">
          <PawPrint className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Memorial Not Found</h2>
          <p className="text-muted-foreground mb-4">This memorial may be private or doesn't exist.</p>
          <Link href="/pet-memorials">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pet Memorials
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const SpeciesIcon = speciesIcons[memorial.species] || PawPrint;
  const themeGradient = themeColors[memorial.theme || "rainbow_bridge"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className={`h-64 md:h-80 bg-gradient-to-r ${themeGradient} relative`}>
        {memorial.coverPhoto && (
          <img src={memorial.coverPhoto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative">
          <Link href="/pet-memorials" className="absolute top-4 left-4">
            <Button variant="secondary" size="sm" className="gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-end gap-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
              <AvatarImage src={memorial.profilePhoto || undefined} alt={memorial.name} />
              <AvatarFallback className="bg-purple-100 text-4xl">
                <SpeciesIcon className="h-16 w-16 text-purple-600" />
              </AvatarFallback>
            </Avatar>
            
            <div className="text-white pb-2">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg" data-testid="text-pet-name">
                {memorial.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="secondary" className="bg-white/90">
                  <SpeciesIcon className="h-3 w-3 mr-1" />
                  {memorial.breed || memorial.species}
                </Badge>
                {memorial.age && (
                  <Badge variant="secondary" className="bg-white/90">
                    <Calendar className="h-3 w-3 mr-1" />
                    {memorial.age}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {memorial.epitaph && (
              <Card className="border-0 bg-gradient-to-r from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardContent className="pt-6 text-center">
                  <Sparkles className="h-6 w-6 mx-auto text-purple-500 mb-3" />
                  <p className="text-xl italic text-purple-900 dark:text-purple-100" data-testid="text-epitaph">
                    "{memorial.epitaph}"
                  </p>
                </CardContent>
              </Card>
            )}

            {memorial.biography && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Life Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-biography">
                    {memorial.biography}
                  </p>
                </CardContent>
              </Card>
            )}

            {memorial.specialTraits && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    What Made {memorial.name} Special
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{memorial.specialTraits}</p>
                </CardContent>
              </Card>
            )}

            {(memorial.personality?.length || memorial.favoriteFood || memorial.favoriteToy) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-purple-500" />
                    Personality & Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {memorial.personality && memorial.personality.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Personality</p>
                      <div className="flex flex-wrap gap-2">
                        {memorial.personality.map((trait) => (
                          <Badge key={trait} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    {memorial.favoriteFood && (
                      <div>
                        <p className="text-sm font-medium">Favorite Food</p>
                        <p className="text-muted-foreground">{memorial.favoriteFood}</p>
                      </div>
                    )}
                    {memorial.favoriteToy && (
                      <div>
                        <p className="text-sm font-medium">Favorite Toy</p>
                        <p className="text-muted-foreground">{memorial.favoriteToy}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {memorial.rainbowBridgeMessage && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rainbow className="h-5 w-5 text-purple-500" />
                    Rainbow Bridge Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{memorial.rainbowBridgeMessage}"</p>
                </CardContent>
              </Card>
            )}

            {condolences && condolences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Condolences ({condolences.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {condolences.map((condolence) => (
                    <div key={condolence.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{condolence.authorName}</span>
                        {condolence.relationship && (
                          <Badge variant="outline" className="text-xs">{condolence.relationship}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{condolence.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Dialog open={showCandleDialog} onOpenChange={setShowCandleDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600" data-testid="button-light-candle">
                      <Flame className="h-4 w-4" />
                      Light a Candle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Light a Candle for {memorial.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Your Name</Label>
                        <Input 
                          value={candleForm.litBy}
                          onChange={(e) => setCandleForm(f => ({ ...f, litBy: e.target.value }))}
                          placeholder="Enter your name"
                          data-testid="input-candle-name"
                        />
                      </div>
                      <div>
                        <Label>Message (Optional)</Label>
                        <Textarea 
                          value={candleForm.message}
                          onChange={(e) => setCandleForm(f => ({ ...f, message: e.target.value }))}
                          placeholder="A brief message..."
                          data-testid="textarea-candle-message"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={() => lightCandleMutation.mutate(candleForm)}
                        disabled={!candleForm.litBy || lightCandleMutation.isPending}
                        className="bg-gradient-to-r from-orange-400 to-amber-500"
                        data-testid="button-submit-candle"
                      >
                        {lightCandleMutation.isPending ? "Lighting..." : "Light Candle"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {memorial.allowCondolences && (
                  <Dialog open={showCondolenceDialog} onOpenChange={setShowCondolenceDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2" data-testid="button-leave-condolence">
                        <MessageCircle className="h-4 w-4" />
                        Leave Condolence
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Your Condolences</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label>Your Name *</Label>
                          <Input 
                            value={condolenceForm.authorName}
                            onChange={(e) => setCondolenceForm(f => ({ ...f, authorName: e.target.value }))}
                            placeholder="Enter your name"
                            data-testid="input-condolence-name"
                          />
                        </div>
                        <div>
                          <Label>Relationship to Owner</Label>
                          <Input 
                            value={condolenceForm.relationship}
                            onChange={(e) => setCondolenceForm(f => ({ ...f, relationship: e.target.value }))}
                            placeholder="e.g., Friend, Neighbor"
                            data-testid="input-condolence-relationship"
                          />
                        </div>
                        <div>
                          <Label>Your Message *</Label>
                          <Textarea 
                            value={condolenceForm.message}
                            onChange={(e) => setCondolenceForm(f => ({ ...f, message: e.target.value }))}
                            placeholder="Share your memories or condolences..."
                            className="min-h-24"
                            data-testid="textarea-condolence-message"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => addCondolenceMutation.mutate(condolenceForm)}
                          disabled={!condolenceForm.authorName || !condolenceForm.message || addCondolenceMutation.isPending}
                          data-testid="button-submit-condolence"
                        >
                          {addCondolenceMutation.isPending ? "Sending..." : "Send Condolence"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                <Button variant="outline" className="w-full gap-2" data-testid="button-share">
                  <Share2 className="h-4 w-4" />
                  Share Memorial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Candles Lit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-orange-500" data-testid="text-candle-count">
                    {memorial.candleLitCount || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">candles burning bright</p>
                </div>
                
                {candles && candles.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                    {candles.slice(0, 5).map((candle) => (
                      <div key={candle.id} className="flex items-center gap-2 text-sm">
                        <Flame className="h-3 w-3 text-orange-400" />
                        <span>{candle.litBy}</span>
                      </div>
                    ))}
                    {candles.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{candles.length - 5} more
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0">
              <CardContent className="pt-6 text-center">
                <Rainbow className="h-10 w-10 mx-auto text-purple-500 mb-3" />
                <p className="text-sm text-muted-foreground italic">
                  "Until we meet again at the Rainbow Bridge..."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
