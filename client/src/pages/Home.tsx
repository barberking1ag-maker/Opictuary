import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Memorial, Memory, Condolence, Fundraiser, LegacyEvent, MusicPlaylist, GriefSupport, Donation, FuneralProgram } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, DollarSign, Music, MessageSquare, Image as ImageIcon, MapPin, Share2, Bookmark, UserPlus, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import InviteCodeModal from "@/components/InviteCodeModal";
import DonationPaymentModal from "@/components/DonationPaymentModal";
import FlowerOrderButton from "@/components/FlowerOrderButton";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MemorialEngagement } from "@/components/MemorialEngagement";
import { LiveStreamViewer } from "@/components/LiveStreamViewer";
import { ShareObituaryButton } from "@/components/ShareObituaryButton";
import { SaveMemorialDialog } from "@/components/SaveMemorialDialog";
import { MerchandiseServices } from "@/components/MerchandiseServices";
import { FutureMessagesSection } from "@/components/FutureMessagesSection";
import { trackPageView, trackEvent } from "@/lib/analytics";

const DEMO_MEMORIAL_ID = "e94ee1f4-2506-4848-9c7e-97b6d473cf81";

export default function Home() {
  const params = useParams<{ id: string }>();
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [memorialId, setMemorialId] = useState<string | null>(params.id || null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const verifyInviteCodeMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      const res = await apiRequest("POST", "/api/memorials/validate-code", { inviteCode });
      return await res.json() as Memorial;
    },
    onSuccess: (memorial) => {
      setMemorialId(memorial.id);
      setCodeModalOpen(false);
      toast({
        title: "Access Granted",
        description: `Welcome to ${memorial.name}'s memorial.`,
      });
    },
    onError: () => {
      toast({
        title: "Invalid Code",
        description: "The access code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: memorial } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${memorialId}`],
    enabled: !!memorialId,
  });

  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: [`/api/memorials/${memorialId}/memories`],
    enabled: !!memorialId,
  });

  const { data: condolences = [] } = useQuery<Condolence[]>({
    queryKey: [`/api/memorials/${memorialId}/condolences`],
    enabled: !!memorialId,
  });

  const { data: fundraisers = [] } = useQuery<Fundraiser[]>({
    queryKey: [`/api/memorials/${memorialId}/fundraisers`],
    enabled: !!memorialId,
  });

  const { data: events = [] } = useQuery<LegacyEvent[]>({
    queryKey: [`/api/memorials/${memorialId}/legacy-events`],
    enabled: !!memorialId,
  });

  const { data: playlist } = useQuery<MusicPlaylist>({
    queryKey: [`/api/memorials/${memorialId}/playlist`],
    enabled: !!memorialId,
  });

  const { data: funeralProgram } = useQuery<FuneralProgram>({
    queryKey: [`/api/memorials/${memorialId}/funeral-program`],
    enabled: !!memorialId,
    retry: false,
  });

  const approvedMemories = memories.filter(m => m.isApproved);
  const firstFundraiser = fundraisers[0];

  const { data: donations = [] } = useQuery<Donation[]>({
    queryKey: [`/api/fundraisers/${firstFundraiser?.id}/donations`],
    enabled: !!firstFundraiser?.id,
  });

  // Check for ?code= parameter in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      verifyInviteCodeMutation.mutate(code);
    }
  }, []);

  // Track memorial view when page loads
  useEffect(() => {
    if (memorial) {
      trackPageView(`/memorial/${memorial.id}`);
      trackEvent('memorial_view', 'memorial', memorial.name, undefined, {
        memorialId: memorial.id,
        memorialName: memorial.name,
      });
    }
  }, [memorial]);

  // Check if memorial is saved (database-backed)
  const { data: savedMemorialResponse } = useQuery<{isSaved: boolean; savedMemorial: any}>({
    queryKey: [`/api/saved-memorials/${memorialId}`],
    enabled: !!memorialId && isAuthenticated,
    retry: false,
  });

  const isSaved = savedMemorialResponse?.isSaved || false;

  const handleShare = async () => {
    trackEvent('memorial_share', 'memorial', memorial?.name, undefined, {
      memorialId: memorial?.id,
      memorialName: memorial?.name,
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Memorial for ${memorial?.name}`,
          text: `Remember ${memorial?.name} - ${years}`,
          url: window.location.href,
        });
        toast({
          title: "Memorial Shared",
          description: "Thank you for sharing this memorial.",
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Memorial link copied to clipboard.",
      });
    }
  };

  const handleLoginRequired = () => {
    toast({
      title: "Login Required",
      description: "Please log in to interact with this memorial.",
      variant: "default",
    });
    window.location.href = "/api/login";
  };

  const unsaveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/saved-memorials/${memorialId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/saved-memorials/${memorialId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-memorials"] });
      toast({
        title: "Memorial Removed",
        description: "Memorial removed from your saved list.",
      });
      trackEvent('memorial_unsave', 'memorial', memorial?.name, undefined, {
        memorialId: memorial?.id,
        memorialName: memorial?.name,
      });
    },
  });

  const handleSave = () => {
    if (!memorialId) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to save memorials.",
        variant: "default",
      });
      window.location.href = "/api/login";
      return;
    }

    if (isSaved) {
      // Unsave the memorial
      unsaveMutation.mutate();
    } else {
      // Open save dialog to choose relationship category
      setSaveDialogOpen(true);
      trackEvent('memorial_save_initiated', 'memorial', memorial?.name, undefined, {
        memorialId: memorial?.id,
        memorialName: memorial?.name,
      });
    }
  };

  if (!memorialId || !memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InviteCodeModal 
          open={codeModalOpen}
          onOpenChange={(open) => {
            if (memorialId) {
              setCodeModalOpen(open);
            }
          }}
          onSubmit={(code) => {
            verifyInviteCodeMutation.mutate(code);
          }}
        />
        {memorialId && !memorial && (
          <p className="text-muted-foreground" data-testid="text-loading">Loading memorial...</p>
        )}
      </div>
    );
  }

  const years = memorial.birthDate && memorial.deathDate
    ? `${new Date(memorial.birthDate).getFullYear()} - ${new Date(memorial.deathDate).getFullYear()}`
    : '';

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <header className="relative h-[600px] md:h-[700px] w-full overflow-hidden" aria-label={`Memorial hero for ${memorial.name}`}>
        {/* Background Image or Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: memorial.backgroundImage 
              ? `url(${memorial.backgroundImage})` 
              : 'linear-gradient(135deg, hsl(280, 70%, 30%) 0%, hsl(280, 60%, 20%) 50%, hsl(280, 70%, 15%) 100%)'
          }}
          role="img"
          aria-label={memorial.backgroundImage ? `Memorial background image for ${memorial.name}` : "Memorial background gradient"}
        />
        {/* Enhanced dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="inline-block px-6 py-2 bg-white/15 backdrop-blur-lg rounded-full border border-white/30 shadow-xl mb-6 hover-elevate">
              <p className="text-sm md:text-base text-white/95 tracking-widest font-medium uppercase">In Loving Memory</p>
            </div>
            
            {/* Name with enhanced styling */}
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight drop-shadow-2xl" data-testid="text-name" style={{textShadow: '0 4px 12px rgba(0,0,0,0.4)'}}>
              {memorial.name}
            </h1>
            
            {/* Dates with better styling */}
            {years && (
              <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <Calendar className="w-5 h-5 text-white/90" />
                <p className="text-xl md:text-2xl text-white/95 font-light tracking-wide" data-testid="text-years">
                  {years}
                </p>
              </div>
            )}

            {/* Quote/Preface with better typography */}
            {memorial.prefaceText && (
              <blockquote className="text-xl md:text-2xl font-serif italic text-white/95 max-w-4xl mx-auto mt-8 leading-relaxed px-6 py-4 border-l-4 border-[hsl(45,80%,60%)]" data-testid="text-quote" style={{textShadow: '0 2px 8px rgba(0,0,0,0.3)'}}>
                "{memorial.prefaceText}"
              </blockquote>
            )}

            {/* Quick Stats with improved design */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/20" role="region" aria-label="Memorial statistics">
              <div className="flex flex-col items-center gap-2 text-white/90 min-w-[100px]">
                <div className="bg-white/15 backdrop-blur-md rounded-full p-3 border border-white/20">
                  <ImageIcon className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-semibold text-lg" data-testid="text-memory-count" aria-label={`${approvedMemories.length} ${approvedMemories.length === 1 ? 'memory' : 'memories'}`}>{approvedMemories.length}</span>
                <span className="text-sm text-white/70">Memories</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-white/90 min-w-[100px]">
                <div className="bg-white/15 backdrop-blur-md rounded-full p-3 border border-white/20">
                  <MessageSquare className="w-6 h-6" aria-hidden="true" />
                </div>
                <span className="font-semibold text-lg" data-testid="text-condolence-count" aria-label={`${condolences.length} ${condolences.length === 1 ? 'condolence' : 'condolences'}`}>{condolences.length}</span>
                <span className="text-sm text-white/70">Condolences</span>
              </div>
              {events.length > 0 && (
                <div className="flex flex-col items-center gap-2 text-white/90 min-w-[100px]">
                  <div className="bg-white/15 backdrop-blur-md rounded-full p-3 border border-white/20">
                    <Calendar className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="font-semibold text-lg" data-testid="text-event-count" aria-label={`${events.length} ${events.length === 1 ? 'event' : 'events'}`}>{events.length}</span>
                  <span className="text-sm text-white/70">Events</span>
                </div>
              )}
            </div>

            {/* Action Buttons with improved layout */}
            <nav className="flex flex-wrap justify-center gap-4 mt-12 pt-4" role="navigation" aria-label="Memorial actions">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/95 text-foreground border-none shadow-2xl font-medium min-w-[160px]"
                onClick={() => setCodeModalOpen(true)} 
                data-testid="button-enter-code"
                aria-label="Enter memorial invite code"
              >
                <MessageSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                Enter Code
              </Button>
              {funeralProgram && (
                <Button 
                  size="lg" 
                  className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none shadow-2xl font-medium min-w-[160px]"
                  onClick={() => window.location.href = `/memorial/${memorialId}/program`}
                  data-testid="button-view-program"
                  aria-label="View digital funeral program"
                >
                  <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                  View Program
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-md text-white border-white/50 hover-elevate active-elevate-2 shadow-lg font-medium min-w-[160px]"
                onClick={handleShare} 
                data-testid="button-share"
                aria-label="Share memorial"
              >
                <Share2 className="w-5 h-5 mr-2" aria-hidden="true" />
                Share
              </Button>
              <ShareObituaryButton 
                memorialId={memorialId!}
                deceasedName={memorial.name}
              />
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 backdrop-blur-md text-white border-white/50 hover-elevate active-elevate-2 shadow-lg font-medium min-w-[160px]"
                onClick={handleSave} 
                data-testid="button-save"
                aria-label={isSaved ? `Memorial already saved` : `Save memorial`}
                aria-pressed={isSaved}
              >
                <Bookmark className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} aria-hidden="true" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <FlowerOrderButton 
                memorialId={memorialId || undefined}
                memorialName={memorial.name}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Engagement Call-to-Action Card */}
      {!isAuthenticated && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 shadow-lg" data-testid="card-engagement-cta">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="bg-primary/20 p-3 rounded-full">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold text-foreground">
                  Keep Their Memory Alive
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Create your free account to save memorials, share with loved ones, and preserve precious memories forever.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="button-cta-signup"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Free Account
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleShare}
                    data-testid="button-cta-share"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share This Memorial
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleSave}
                    data-testid="button-cta-save"
                  >
                    <Bookmark className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save Memorial'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Engagement Reminder for Logged-in Users */}
      {isAuthenticated && !isSaved && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <Card className="bg-gradient-to-br from-accent/10 via-accent/5 to-background border-2 border-accent/20" data-testid="card-save-reminder">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="bg-accent/20 p-2 rounded-full flex-shrink-0">
                    <Bookmark className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Remember this memorial</p>
                    <p className="text-sm text-muted-foreground">Save it to easily find and share later</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSave}
                    data-testid="button-reminder-save"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save Memorial
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleShare}
                    data-testid="button-reminder-share"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Biography Section */}
      {memorial.biography && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Life Story</h2>
            </div>
            <div className="prose prose-lg max-w-none" data-testid="text-biography">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-lg">
                {memorial.biography}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="memories" className="w-full" data-testid="tabs-main">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-12 bg-muted/30 p-2 rounded-xl h-auto" data-testid="tabs-list">
            <TabsTrigger 
              value="memories" 
              data-testid="tab-memories"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Memories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              data-testid="tab-photos"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium">Photos</span>
            </TabsTrigger>
            <TabsTrigger 
              value="condolences" 
              data-testid="tab-condolences"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Condolences</span>
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              data-testid="tab-events"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Events</span>
            </TabsTrigger>
            <TabsTrigger 
              value="support" 
              data-testid="tab-support"
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-card data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Heart className="w-5 h-5" />
              <span className="font-medium">Support</span>
            </TabsTrigger>
          </TabsList>

          {/* Memories Tab */}
          <TabsContent value="memories" className="space-y-8" data-testid="content-memories">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Cherished Memories</h2>
                <p className="text-muted-foreground">Precious moments shared with {memorial.name}</p>
              </div>
              <Button size="lg" data-testid="button-add-memory" className="shadow-md">
                <ImageIcon className="w-5 h-5 mr-2" />
                Add Memory
              </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {approvedMemories.map((memory) => (
                <Card key={memory.id} data-testid={`card-memory-${memory.id}`} className="overflow-hidden hover-elevate border-border/50 shadow-lg group">
                  {memory.mediaUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-muted relative">
                      <img 
                        src={memory.mediaUrl} 
                        alt={memory.caption || ''}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        data-testid={`img-memory-${memory.id}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate" data-testid={`text-memory-author-${memory.id}`}>
                          {memory.authorName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1" data-testid={`text-memory-date-${memory.id}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(memory.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </CardDescription>
                      </div>
                      <Heart className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed line-clamp-4" data-testid={`text-memory-caption-${memory.id}`}>
                      {memory.caption}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {approvedMemories.length === 0 && (
              <Card className="border-2 border-dashed border-border/50 bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-6">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No memories shared yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Be the first to share a cherished memory and keep their spirit alive.
                  </p>
                  <Button size="lg" data-testid="button-add-first-memory">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Share First Memory
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6" data-testid="content-photos">
            <PhotoGallery memories={approvedMemories} />
          </TabsContent>

          {/* Condolences Tab */}
          <TabsContent value="condolences" className="space-y-8" data-testid="content-condolences">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Words of Comfort</h2>
                <p className="text-muted-foreground">Messages of love and support</p>
              </div>
              <Button size="lg" data-testid="button-leave-condolence" className="shadow-md">
                <MessageSquare className="w-5 h-5 mr-2" />
                Leave Condolence
              </Button>
            </div>

            <div className="space-y-6">
              {condolences.map((condolence) => (
                <Card key={condolence.id} data-testid={`card-condolence-${condolence.id}`} className="hover-elevate border-border/50 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground mb-1" data-testid={`text-condolence-author-${condolence.id}`}>
                          {condolence.authorName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2" data-testid={`text-condolence-date-${condolence.id}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(condolence.createdAt || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </CardDescription>
                      </div>
                      <div className="bg-accent/10 rounded-full p-2">
                        <Heart className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed text-base" data-testid={`text-condolence-message-${condolence.id}`}>
                      {condolence.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {condolences.length === 0 && (
              <Card className="border-2 border-dashed border-border/50 bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-6">
                    <MessageSquare className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No condolences yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Share your thoughts and support for the family during this difficult time.
                  </p>
                  <Button size="lg" data-testid="button-leave-first-condolence">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Leave First Condolence
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-8" data-testid="content-events">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Memorial Services & Events</h2>
              <p className="text-muted-foreground">Upcoming and past events honoring {memorial.name}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const isUpcoming = new Date(event.eventDate) > new Date();
                return (
                  <Card key={event.id} data-testid={`card-event-${event.id}`} className="hover-elevate border-border/50 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <CardTitle className="text-xl font-bold flex-1" data-testid={`text-event-title-${event.id}`}>
                          {event.title}
                        </CardTitle>
                        {isUpcoming && (
                          <Badge className="bg-primary text-primary-foreground" data-testid={`badge-upcoming-${event.id}`}>
                            Upcoming
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-2 text-foreground/80" data-testid={`text-event-date-${event.id}`}>
                          <div className="bg-muted rounded-full p-1.5">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="font-medium">
                            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            {event.eventTime && ` at ${event.eventTime}`}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-foreground/80" data-testid={`text-event-location-${event.id}`}>
                            <div className="bg-muted rounded-full p-1.5">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span>{event.location}</span>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    {event.description && (
                      <CardContent className="pt-0">
                        <p className="text-foreground/90 leading-relaxed mb-3" data-testid={`text-event-desc-${event.id}`}>
                          {event.description}
                        </p>
                        {isUpcoming && event.attendeeCount !== undefined && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t" data-testid={`text-event-attendees-${event.id}`}>
                            <Heart className="w-4 h-4" />
                            <span className="font-medium">{event.attendeeCount} attending</span>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {events.length === 0 && (
              <Card className="border-2 border-dashed border-border/50 bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="bg-muted/50 rounded-full p-6 mb-6">
                    <Calendar className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No events scheduled</h3>
                  <p className="text-muted-foreground max-w-md">
                    Memorial services and celebration of life events will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-8" data-testid="content-support">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">Support the Family</h2>
              <p className="text-muted-foreground">Help honor {memorial.name}'s memory</p>
            </div>

            {firstFundraiser && (
              <Card className="overflow-hidden border-border/50 shadow-xl bg-gradient-to-br from-card to-card/50" data-testid="card-fundraiser">
                <CardHeader className="pb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-primary/10 rounded-full p-3">
                      <DollarSign className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2" data-testid="text-fundraiser-title">{firstFundraiser.title}</CardTitle>
                      {firstFundraiser.description && (
                        <CardDescription className="text-base" data-testid="text-fundraiser-desc">{firstFundraiser.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 rounded-xl p-6">
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Progress</span>
                      <span className="text-2xl font-bold text-foreground" data-testid="text-fundraiser-amount">
                        ${Number(firstFundraiser.currentAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-4 overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min((Number(firstFundraiser.currentAmount) / Number(firstFundraiser.goalAmount)) * 100, 100)}%` }}
                        data-testid="progress-fundraiser"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-right">
                      of ${Number(firstFundraiser.goalAmount).toLocaleString()} goal
                    </p>
                  </div>
                  <Button 
                    className="w-full shadow-lg" 
                    size="lg" 
                    onClick={() => setDonationModalOpen(true)}
                    data-testid="button-donate"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Make a Donation
                  </Button>
                </CardContent>
              </Card>
            )}

            {memorial.cemeteryName && (
              <Card data-testid="card-cemetery">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Final Resting Place
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/90" data-testid="text-cemetery-name">{memorial.cemeteryName}</p>
                  {memorial.cemeteryLocation && (
                    <p className="text-sm text-muted-foreground mt-1" data-testid="text-cemetery-location">
                      {memorial.cemeteryLocation}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {playlist && playlist.tracks && playlist.tracks.length > 0 && (
              <Card data-testid="card-playlist">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Memorial Playlist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {playlist.tracks.slice(0, 5).map((track, idx) => (
                      <div key={track.id} className="flex items-center gap-3 text-sm" data-testid={`text-song-${idx}`}>
                        <Music className="w-4 h-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{track.title}</p>
                          <p className="text-xs text-muted-foreground">{track.artist} • {track.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Live Stream Section */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <LiveStreamViewer
            memorialId={memorialId!}
            currentUser={
              user && user.email
                ? {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                  }
                : undefined
            }
          />
        </div>

        {/* Social Engagement Section */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
              Engage with this Memorial
            </h2>
            <p className="text-muted-foreground">Share your connection and keep their memory alive</p>
          </div>
          <MemorialEngagement
            memorialId={memorialId!}
            currentUser={
              user && user.email
                ? {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName || undefined,
                    lastName: user.lastName || undefined,
                  }
                : undefined
            }
            onLoginRequired={handleLoginRequired}
          />
        </div>

        {/* Merchandise Services Section */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <MerchandiseServices 
            memorialName={memorial.name}
            memorialId={memorialId!}
          />
        </div>

        {/* Future Messages Section */}
        <div className="mt-16 pt-16 border-t border-border/30">
          <FutureMessagesSection 
            memorialId={memorialId!}
            memorialName={memorial.name}
            canCreate={isAuthenticated && (memorial.creatorEmail === user?.email)}
          />
        </div>
      </div>

      <InviteCodeModal 
        open={codeModalOpen}
        onOpenChange={setCodeModalOpen}
        onSubmit={(code) => verifyInviteCodeMutation.mutate(code)}
      />

      {firstFundraiser && (
        <DonationPaymentModal
          open={donationModalOpen}
          onOpenChange={setDonationModalOpen}
          fundraiserId={firstFundraiser.id}
          fundraiserTitle={firstFundraiser.title}
          onSuccess={() => {
            setDonationModalOpen(false);
            queryClient.invalidateQueries({ queryKey: [`/api/fundraisers/${firstFundraiser.id}/donations`] });
            queryClient.invalidateQueries({ queryKey: [`/api/memorials/${memorialId}/fundraisers`] });
          }}
        />
      )}

      <SaveMemorialDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        memorialId={memorialId!}
        memorialName={memorial.name}
      />
    </div>
  );
}
