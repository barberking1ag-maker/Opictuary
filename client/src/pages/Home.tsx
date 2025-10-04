import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DEMO_MEMORIAL_ID = "e94ee1f4-2506-4848-9c7e-97b6d473cf81";

export default function Home() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

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

  if (!memorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading memorial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M16 2L18 8H14L16 2Z" fill="currentColor" opacity="0.9"/>
                <rect x="14" y="8" width="4" height="16" fill="currentColor" opacity="0.8"/>
                <path d="M16 24C16 24 20 22 20 18V12H12V18C12 22 16 24 16 24Z" fill="currentColor" opacity="0.6"/>
                <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                <path d="M8 8C8 8 10 6 12 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <path d="M24 8C24 8 22 6 20 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <ellipse cx="16" cy="28" rx="12" ry="2" fill="currentColor" opacity="0.3"/>
              </svg>
              <div>
                <h1 className="text-xl font-serif font-semibold text-foreground">Opictuary</h1>
                <p className="text-xs text-muted-foreground">Honoring memories with dignity</p>
              </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 flex justify-center">
          <FlowerOrderButton 
            memorialName={memorial.name}
            deliveryLocation={memorial.cemeteryName || undefined}
          />
        </div>

        <MemorialTabs 
          memoriesContent={
            <div className="space-y-6">
              <Button className="w-full" data-testid="button-add-memory">
                <Plus className="w-5 h-5 mr-2" />
                Share a Memory
              </Button>
              {memories.map((memory) => (
                <MemoryCard 
                  key={memory.id}
                  authorName={memory.authorName}
                  caption={memory.caption}
                  timestamp={new Date(memory.createdAt || "").toLocaleDateString()}
                  commentCount={0}
                  isPending={!memory.isApproved}
                  onComment={() => console.log('Comment clicked')}
                  onApprove={() => console.log('Approved')}
                  onReject={() => console.log('Rejected')}
                />
              ))}
              {memories.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No memories shared yet. Be the first to share a memory.</p>
              )}
            </div>
          }
          condolencesContent={
            <div className="space-y-6">
              <Button className="w-full" data-testid="button-leave-condolence">
                <Plus className="w-5 h-5 mr-2" />
                Leave a Condolence
              </Button>
              {condolences.map((condolence) => (
                <CondolenceMessage 
                  key={condolence.id}
                  authorName={condolence.authorName}
                  message={condolence.message}
                  timestamp={new Date(condolence.createdAt || "").toLocaleDateString()}
                />
              ))}
              {condolences.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No condolences yet.</p>
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
