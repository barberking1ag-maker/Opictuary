import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Memorial, Memory, Condolence, Fundraiser, LegacyEvent, MusicPlaylist, GriefSupport, Donation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, DollarSign, Music, MessageSquare, Image as ImageIcon, MapPin, Share2, Bookmark, UserPlus } from "lucide-react";
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
import { trackPageView, trackEvent } from "@/lib/analytics";

const DEMO_MEMORIAL_ID = "e94ee1f4-2506-4848-9c7e-97b6d473cf81";

export default function Home() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [memorialId, setMemorialId] = useState<string | null>(DEMO_MEMORIAL_ID);
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

  const approvedMemories = memories.filter(m => m.isApproved);
  const firstFundraiser = fundraisers[0];

  const { data: donations = [] } = useQuery<Donation[]>({
    queryKey: [`/api/fundraisers/${firstFundraiser?.id}/donations`],
    enabled: !!firstFundraiser?.id,
  });

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
      <div className="relative h-[500px] w-full overflow-hidden">
        {/* Background Image or Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: memorial.backgroundImage 
              ? `url(${memorial.backgroundImage})` 
              : 'linear-gradient(135deg, hsl(280, 65%, 25%) 0%, hsl(280, 50%, 15%) 100%)'
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <p className="text-sm text-white/90 tracking-wide">In Loving Memory</p>
            </div>
            
            {/* Name */}
            <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-4 tracking-tight" data-testid="text-name">
              {memorial.name}
            </h1>
            
            {/* Dates */}
            {years && (
              <p className="text-xl md:text-2xl text-white/90 font-light" data-testid="text-years">
                {years}
              </p>
            )}

            {/* Quote/Preface */}
            {memorial.prefaceText && (
              <blockquote className="text-lg md:text-xl font-serif italic text-white/95 max-w-3xl mx-auto mt-6 leading-relaxed" data-testid="text-quote">
                "{memorial.prefaceText}"
              </blockquote>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="flex items-center gap-2 text-white/80">
                <ImageIcon className="w-5 h-5" />
                <span data-testid="text-memory-count">{approvedMemories.length} Memories</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <MessageSquare className="w-5 h-5" />
                <span data-testid="text-condolence-count">{condolences.length} Condolences</span>
              </div>
              {events.length > 0 && (
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="w-5 h-5" />
                  <span data-testid="text-event-count">{events.length} Events</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="bg-white/95 backdrop-blur-md text-foreground border border-white/20 hover-elevate active-elevate-2 shadow-lg"
                onClick={() => setCodeModalOpen(true)} 
                data-testid="button-enter-code"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Enter Code
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/15 backdrop-blur-md text-white border-white/40 hover-elevate active-elevate-2"
                onClick={handleShare} 
                data-testid="button-share"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Memorial
              </Button>
              <ShareObituaryButton 
                memorialId={memorialId!}
                deceasedName={memorial.name}
              />
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/15 backdrop-blur-md text-white border-white/40 hover-elevate active-elevate-2"
                onClick={handleSave} 
                data-testid="button-save"
              >
                <Bookmark className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save Memorial'}
              </Button>
              <FlowerOrderButton 
                memorialId={memorialId || undefined}
                memorialName={memorial.name}
              />
            </div>
          </div>
        </div>
      </div>

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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="memories" className="w-full" data-testid="tabs-main">
          <TabsList className="grid w-full grid-cols-5 mb-8" data-testid="tabs-list">
            <TabsTrigger value="memories" data-testid="tab-memories">
              <ImageIcon className="w-4 h-4 mr-2" />
              Memories
            </TabsTrigger>
            <TabsTrigger value="photos" data-testid="tab-photos">
              <ImageIcon className="w-4 h-4 mr-2" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="condolences" data-testid="tab-condolences">
              <MessageSquare className="w-4 h-4 mr-2" />
              Condolences
            </TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="support" data-testid="tab-support">
              <Heart className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Memories Tab */}
          <TabsContent value="memories" className="space-y-6" data-testid="content-memories">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold">Cherished Memories</h2>
              <Button data-testid="button-add-memory">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {approvedMemories.map((memory) => (
                <Card key={memory.id} data-testid={`card-memory-${memory.id}`} className="overflow-hidden hover-elevate">
                  {memory.mediaUrl && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={memory.mediaUrl} 
                        alt={memory.caption || ''}
                        className="w-full h-full object-cover"
                        data-testid={`img-memory-${memory.id}`}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-memory-author-${memory.id}`}>
                          {memory.authorName}
                        </CardTitle>
                        <CardDescription data-testid={`text-memory-date-${memory.id}`}>
                          {new Date(memory.createdAt || '').toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed" data-testid={`text-memory-caption-${memory.id}`}>
                      {memory.caption}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {approvedMemories.length === 0 && (
              <Card className="p-12 text-center">
                <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground">No memories shared yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Be the first to share a cherished memory.</p>
              </Card>
            )}
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6" data-testid="content-photos">
            <PhotoGallery memories={approvedMemories} />
          </TabsContent>

          {/* Condolences Tab */}
          <TabsContent value="condolences" className="space-y-6" data-testid="content-condolences">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold">Words of Comfort</h2>
              <Button data-testid="button-leave-condolence">
                <MessageSquare className="w-4 h-4 mr-2" />
                Leave Condolence
              </Button>
            </div>

            <div className="space-y-4">
              {condolences.map((condolence) => (
                <Card key={condolence.id} data-testid={`card-condolence-${condolence.id}`} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base" data-testid={`text-condolence-author-${condolence.id}`}>
                          {condolence.authorName}
                        </CardTitle>
                        <CardDescription data-testid={`text-condolence-date-${condolence.id}`}>
                          {new Date(condolence.createdAt || '').toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/90 leading-relaxed" data-testid={`text-condolence-message-${condolence.id}`}>
                      {condolence.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {condolences.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground">No condolences yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Share your thoughts and support.</p>
              </Card>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6" data-testid="content-events">
            <h2 className="text-2xl font-serif font-semibold">Memorial Services & Events</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => {
                const isUpcoming = new Date(event.eventDate) > new Date();
                return (
                  <Card key={event.id} data-testid={`card-event-${event.id}`} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle data-testid={`text-event-title-${event.id}`}>{event.title}</CardTitle>
                          <CardDescription className="mt-2 space-y-1">
                            <div className="flex items-center gap-2" data-testid={`text-event-date-${event.id}`}>
                              <Calendar className="w-4 h-4" />
                              {new Date(event.eventDate).toLocaleDateString()} {event.eventTime && `at ${event.eventTime}`}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-2" data-testid={`text-event-location-${event.id}`}>
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        {isUpcoming && (
                          <Badge data-testid={`badge-upcoming-${event.id}`}>Upcoming</Badge>
                        )}
                      </div>
                    </CardHeader>
                    {event.description && (
                      <CardContent>
                        <p className="text-sm text-muted-foreground" data-testid={`text-event-desc-${event.id}`}>
                          {event.description}
                        </p>
                        {isUpcoming && event.attendeeCount !== undefined && (
                          <p className="text-sm text-muted-foreground mt-3" data-testid={`text-event-attendees-${event.id}`}>
                            {event.attendeeCount} attending
                          </p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {events.length === 0 && (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg text-muted-foreground">No events scheduled.</p>
              </Card>
            )}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6" data-testid="content-support">
            <h2 className="text-2xl font-serif font-semibold">Support the Family</h2>

            {firstFundraiser && (
              <Card className="overflow-hidden" data-testid="card-fundraiser">
                <CardHeader>
                  <CardTitle data-testid="text-fundraiser-title">{firstFundraiser.title}</CardTitle>
                  {firstFundraiser.description && (
                    <CardDescription data-testid="text-fundraiser-desc">{firstFundraiser.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold" data-testid="text-fundraiser-amount">
                        ${Number(firstFundraiser.currentAmount).toLocaleString()} of ${Number(firstFundraiser.goalAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-accent h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((Number(firstFundraiser.currentAmount) / Number(firstFundraiser.goalAmount)) * 100, 100)}%` }}
                        data-testid="progress-fundraiser"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={() => setDonationModalOpen(true)}
                    data-testid="button-donate"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
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
        <div className="mt-12">
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
        <div className="mt-12">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
            Engage with this Memorial
          </h2>
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
        <div className="mt-16">
          <MerchandiseServices 
            memorialName={memorial.name}
            memorialId={memorialId!}
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
