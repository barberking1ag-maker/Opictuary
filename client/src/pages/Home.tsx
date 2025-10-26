import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Memorial, Memory, Condolence, Fundraiser, LegacyEvent, MusicPlaylist, GriefSupport, Donation } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, DollarSign, Music, MessageSquare, Image as ImageIcon, MapPin, Share2, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InviteCodeModal from "@/components/InviteCodeModal";
import DonationPaymentModal from "@/components/DonationPaymentModal";
import FlowerOrderButton from "@/components/FlowerOrderButton";
import { trackPageView, trackEvent } from "@/lib/analytics";

const DEMO_MEMORIAL_ID = "e94ee1f4-2506-4848-9c7e-97b6d473cf81";

export default function Home() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [memorialId, setMemorialId] = useState<string | null>(DEMO_MEMORIAL_ID);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

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

  // Check if memorial is saved in localStorage
  useEffect(() => {
    if (memorialId) {
      const savedMemorials = JSON.parse(localStorage.getItem('savedMemorials') || '[]');
      setIsSaved(savedMemorials.includes(memorialId));
    }
  }, [memorialId]);

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

  const handleSave = () => {
    if (!memorialId) return;

    const savedMemorials = JSON.parse(localStorage.getItem('savedMemorials') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedMemorials.filter((id: string) => id !== memorialId);
      localStorage.setItem('savedMemorials', JSON.stringify(updated));
      setIsSaved(false);
      toast({
        title: "Memorial Removed",
        description: "Memorial removed from your saved list.",
      });
      trackEvent('memorial_unsave', 'memorial', memorial?.name, undefined, {
        memorialId: memorial?.id,
        memorialName: memorial?.name,
      });
    } else {
      // Add to saved
      const updated = [...savedMemorials, memorialId];
      localStorage.setItem('savedMemorials', JSON.stringify(updated));
      setIsSaved(true);
      toast({
        title: "Memorial Saved",
        description: "Memorial added to your saved list.",
      });
      trackEvent('memorial_save', 'memorial', memorial?.name, undefined, {
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
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-background" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            {/* Memorial Photo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-accent/30 shadow-2xl">
                  {memorial.backgroundImage ? (
                    <img 
                      src={memorial.backgroundImage} 
                      alt={memorial.name}
                      className="w-full h-full object-cover"
                      data-testid="img-memorial-photo"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  <svg width="60" height="15" viewBox="0 0 60 15" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="30" cy="7.5" rx="28" ry="6" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.8"/>
                    <ellipse cx="30" cy="7.5" rx="28" ry="6" fill="#FFD700" opacity="0.15"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Name and Dates */}
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-3" data-testid="text-name">
                {memorial.name}
              </h1>
              {years && (
                <p className="text-2xl text-muted-foreground font-light" data-testid="text-years">
                  {years}
                </p>
              )}
            </div>

            {/* Quote/Preface */}
            {memorial.prefaceText && (
              <blockquote className="text-xl md:text-2xl font-serif italic text-foreground/90 max-w-3xl mx-auto mt-8 leading-relaxed" data-testid="text-quote">
                "{memorial.prefaceText}"
              </blockquote>
            )}

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-5 h-5" />
                <span data-testid="text-memory-count">{approvedMemories.length} Memories</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="w-5 h-5" />
                <span data-testid="text-condolence-count">{condolences.length} Condolences</span>
              </div>
              {events.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span data-testid="text-event-count">{events.length} Events</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button size="lg" onClick={() => setCodeModalOpen(true)} data-testid="button-enter-code">
                <MessageSquare className="w-5 h-5 mr-2" />
                Enter Code
              </Button>
              <Button size="lg" onClick={handleShare} data-testid="button-share">
                <Share2 className="w-5 h-5 mr-2" />
                Share Memorial
              </Button>
              <Button 
                size="lg" 
                variant={isSaved ? "default" : "outline"}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="memories" className="w-full" data-testid="tabs-main">
          <TabsList className="grid w-full grid-cols-4 mb-8" data-testid="tabs-list">
            <TabsTrigger value="memories" data-testid="tab-memories">
              <ImageIcon className="w-4 h-4 mr-2" />
              Memories
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
    </div>
  );
}
