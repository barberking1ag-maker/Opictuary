import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Memorial, Memory, Condolence, Fundraiser, LegacyEvent, MusicPlaylist, GriefSupport, Donation } from "@shared/schema";
import MemorialHero from "@/components/MemorialHero";
import MemorialTabs from "@/components/MemorialTabs";
import MemoryCard from "@/components/MemoryCard";
import CondolenceMessage from "@/components/CondolenceMessage";
import LegacyEventCard from "@/components/LegacyEventCard";
import FundraiserProgress from "@/components/FundraiserProgress";
import CemeteryMap from "@/components/CemeteryMap";
import MusicPlayer from "@/components/MusicPlayer";
import InviteCodeModal from "@/components/InviteCodeModal";
import FlowerOrderButton from "@/components/FlowerOrderButton";
import GriefSupportPanel from "@/components/GriefSupportPanel";
import DonationPaymentModal from "@/components/DonationPaymentModal";
import ContentControls from "@/components/ContentControls";
import AdminContentPanel from "@/components/AdminContentPanel";
import MemoryTimeline from "@/components/MemoryTimeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const DEMO_MEMORIAL_ID = "e94ee1f4-2506-4848-9c7e-97b6d473cf81";

export default function Home() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const { toast } = useToast();
  const { registerToken, isNative } = usePushNotifications();

  const [memorySearchQuery, setMemorySearchQuery] = useState("");
  const [memorySortBy, setMemorySortBy] = useState("newest");
  const [memoryViewMode, setMemoryViewMode] = useState<"grid" | "list" | "timeline">("list");
  const [showApproved, setShowApproved] = useState(true);
  const [showPending, setShowPending] = useState(true);

  const [condolenceSearchQuery, setCondolenceSearchQuery] = useState("");
  const [condolenceSortBy, setCondolenceSortBy] = useState("newest");

  const { data: memorial } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}`],
  });

  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/memories`],
  });

  const { data: condolences = [] } = useQuery<Condolence[]>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/condolences`],
  });

  const { data: fundraisers = [] } = useQuery<Fundraiser[]>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/fundraisers`],
  });

  const { data: events = [] } = useQuery<LegacyEvent[]>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/legacy-events`],
  });

  const { data: playlist } = useQuery<MusicPlaylist>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/playlist`],
  });

  const { data: griefSupport } = useQuery<GriefSupport>({
    queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/grief-support`],
  });

  const firstFundraiser = fundraisers[0];
  const { data: donations = [] } = useQuery<Donation[]>({
    queryKey: [`/api/fundraisers/${firstFundraiser?.id}/donations`],
    enabled: !!firstFundraiser?.id,
  });

  const donorsForDisplay = donations.map(d => ({
    name: d.isAnonymous ? "Anonymous" : d.donorName,
    amount: Number(d.amount),
    timestamp: new Date(d.createdAt || "").toLocaleDateString(),
  }));

  const approveMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      return await apiRequest("POST", `/api/memories/${memoryId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/memories`] });
      toast({
        title: "Memory Approved",
        description: "The memory has been approved and is now visible to all visitors.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      return await apiRequest("DELETE", `/api/memories/${memoryId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/memories`] });
      toast({
        title: "Memory Rejected",
        description: "The memory has been removed.",
      });
    },
  });

  useEffect(() => {
    if (isNative && memorial?.id) {
      registerToken(memorial.id);
    }
  }, [isNative, memorial, registerToken]);

  const filteredMemories = useMemo(() => {
    let filtered = memories.filter(m => {
      const matchesSearch = m.authorName.toLowerCase().includes(memorySearchQuery.toLowerCase()) ||
                           m.caption.toLowerCase().includes(memorySearchQuery.toLowerCase());
      const matchesStatus = (showApproved && m.isApproved) || (showPending && !m.isApproved);
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      if (memorySortBy === "newest") {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      } else if (memorySortBy === "oldest") {
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      } else if (memorySortBy === "author") {
        return a.authorName.localeCompare(b.authorName);
      }
      return 0;
    });

    return filtered;
  }, [memories, memorySearchQuery, memorySortBy, showApproved, showPending]);

  const filteredCondolences = useMemo(() => {
    let filtered = condolences.filter(c =>
      c.authorName.toLowerCase().includes(condolenceSearchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(condolenceSearchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (condolenceSortBy === "newest") {
        return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
      } else if (condolenceSortBy === "oldest") {
        return new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime();
      } else if (condolenceSortBy === "author") {
        return a.authorName.localeCompare(b.authorName);
      }
      return 0;
    });

    return filtered;
  }, [condolences, condolenceSearchQuery, condolenceSortBy]);

  const pendingMemories = memories.filter(m => !m.isApproved);

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading memorial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-serif font-semibold text-foreground tracking-tight">Opictuary</h1>
              <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">Honoring Life · Preserving Legacy</p>
            </div>
          </div>
        </div>
      </header>

      {memorial.prefaceText && (
        <div 
          className="relative py-20 md:py-24 bg-cover bg-center"
          style={{
            backgroundImage: memorial.backgroundImage 
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${memorial.backgroundImage})`
              : 'linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--secondary) / 0.12))'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic text-white drop-shadow-lg leading-relaxed">
              "{memorial.prefaceText}"
            </blockquote>
          </div>
        </div>
      )}

      <MemorialHero 
        name={memorial.name}
        birthDate={memorial.birthDate}
        deathDate={memorial.deathDate}
        onEnterCode={() => setCodeModalOpen(true)}
        onShare={() => console.log('Share clicked')}
      />

      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center">
            <FlowerOrderButton 
              memorialName={memorial.name}
              deliveryLocation={memorial.cemeteryName || undefined}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">{" "}

        <MemorialTabs 
          memoriesContent={
            <div>
              <AdminContentPanel 
                pendingMemories={pendingMemories}
                onApprove={(id) => approveMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                onPreview={(memory) => console.log('Preview:', memory)}
              />

              <Button className="w-full mb-6" data-testid="button-add-memory">
                <Plus className="w-5 h-5 mr-2" />
                Share a Memory
              </Button>

              <ContentControls 
                searchQuery={memorySearchQuery}
                onSearchChange={setMemorySearchQuery}
                sortBy={memorySortBy}
                onSortChange={setMemorySortBy}
                viewMode={memoryViewMode}
                onViewModeChange={setMemoryViewMode}
                showApproved={showApproved}
                showPending={showPending}
                onApprovedToggle={() => setShowApproved(!showApproved)}
                onPendingToggle={() => setShowPending(!showPending)}
                totalCount={memories.length}
                filteredCount={filteredMemories.length}
              />

              {memoryViewMode === "timeline" ? (
                <MemoryTimeline memories={filteredMemories} />
              ) : (
                <div className={memoryViewMode === "grid" ? "grid gap-6 md:grid-cols-2" : "space-y-6"}>
                  {filteredMemories.map((memory) => (
                    <MemoryCard 
                      key={memory.id}
                      authorName={memory.authorName}
                      caption={memory.caption}
                      imageUrl={memory.mediaUrl || undefined}
                      timestamp={new Date(memory.createdAt || "").toLocaleDateString()}
                      commentCount={0}
                      isPending={!memory.isApproved}
                      onComment={() => console.log('Comment clicked')}
                      onApprove={() => approveMutation.mutate(memory.id)}
                      onReject={() => rejectMutation.mutate(memory.id)}
                    />
                  ))}
                </div>
              )}
              
              {filteredMemories.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {memories.length === 0 
                    ? "No memories shared yet. Be the first to share a memory."
                    : "No memories match your filters."}
                </p>
              )}
            </div>
          }
          condolencesContent={
            <div>
              <Button className="w-full mb-6" data-testid="button-leave-condolence">
                <Plus className="w-5 h-5 mr-2" />
                Leave a Condolence
              </Button>

              <ContentControls 
                searchQuery={condolenceSearchQuery}
                onSearchChange={setCondolenceSearchQuery}
                sortBy={condolenceSortBy}
                onSortChange={setCondolenceSortBy}
                totalCount={condolences.length}
                filteredCount={filteredCondolences.length}
              />

              <div className="space-y-4">
                {filteredCondolences.map((condolence) => (
                  <CondolenceMessage 
                    key={condolence.id}
                    authorName={condolence.authorName}
                    message={condolence.message}
                    timestamp={new Date(condolence.createdAt || "").toLocaleDateString()}
                  />
                ))}
              </div>
              
              {filteredCondolences.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  {condolences.length === 0 
                    ? "No condolences yet."
                    : "No condolences match your search."}
                </p>
              )}
            </div>
          }
          eventsContent={
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <LegacyEventCard 
                  key={event.id}
                  title={event.title}
                  date={event.eventDate}
                  time={event.eventTime || ""}
                  location={event.location || ""}
                  attendeeCount={event.attendeeCount || 0}
                  description={event.description || ""}
                  isUpcoming={new Date(event.eventDate) > new Date()}
                  onRSVP={() => console.log('RSVP clicked')}
                />
              ))}
              {events.length === 0 && (
                <p className="text-muted-foreground">No legacy events scheduled.</p>
              )}
            </div>
          }
          fundraiserContent={
            <div className="max-w-2xl mx-auto space-y-8">
              {firstFundraiser ? (
                <>
                  <FundraiserProgress 
                    title={firstFundraiser.title}
                    description={firstFundraiser.description || ""}
                    currentAmount={Number(firstFundraiser.currentAmount)}
                    goalAmount={Number(firstFundraiser.goalAmount)}
                    donors={donorsForDisplay}
                    onDonate={() => setDonationModalOpen(true)}
                  />
                  
                  {griefSupport && (
                    <GriefSupportPanel 
                      familyContact={griefSupport.familyContact || undefined}
                      pastoralContact={griefSupport.pastoralContact || undefined}
                      customContacts={(griefSupport.customContacts as any) || []}
                    />
                  )}
                </>
              ) : (
                <p className="text-center text-muted-foreground">No fundraiser active.</p>
              )}
            </div>
          }
          mapContent={
            memorial.cemeteryName ? (
              <div className="max-w-2xl mx-auto">
                <CemeteryMap 
                  cemeteryName={memorial.cemeteryName}
                  sectionLocation={memorial.cemeteryLocation || ""}
                  coordinates={memorial.cemeteryCoordinates || undefined}
                  onGetDirections={() => console.log('Get directions clicked')}
                />
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Cemetery information not available.</p>
            )
          }
          musicContent={
            playlist ? (
              <div className="max-w-2xl mx-auto">
                <MusicPlayer playlist={playlist.tracks} />
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No music playlist available.</p>
            )
          }
        />
      </div>

      <InviteCodeModal 
        open={codeModalOpen}
        onOpenChange={setCodeModalOpen}
        onSubmit={(code) => {
          console.log('Code submitted:', code);
          setCodeModalOpen(false);
        }}
      />

      {firstFundraiser && (
        <DonationPaymentModal
          open={donationModalOpen}
          onOpenChange={setDonationModalOpen}
          fundraiserId={firstFundraiser.id}
          fundraiserTitle={firstFundraiser.title}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: [`/api/fundraisers/${firstFundraiser.id}/donations`] });
            queryClient.invalidateQueries({ queryKey: [`/api/memorials/${DEMO_MEMORIAL_ID}/fundraisers`] });
            setDonationModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
