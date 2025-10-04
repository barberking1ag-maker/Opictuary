import { useState } from "react";
import MemorialHero from "@/components/MemorialHero";
import MemorialTabs from "@/components/MemorialTabs";
import MemoryCard from "@/components/MemoryCard";
import CondolenceMessage from "@/components/CondolenceMessage";
import LegacyEventCard from "@/components/LegacyEventCard";
import FundraiserProgress from "@/components/FundraiserProgress";
import CemeteryMap from "@/components/CemeteryMap";
import MusicPlayer from "@/components/MusicPlayer";
import InviteCodeModal from "@/components/InviteCodeModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  //todo: remove mock functionality
  const mockMemories = [
    {
      authorName: "Sarah Williams",
      caption: "I remember when Margaret taught me how to bake her famous apple pie. She was so patient and kind, always making sure I got every step just right. Those Sunday afternoons in her kitchen are some of my fondest memories.",
      timestamp: "2 hours ago",
      commentCount: 12
    },
    {
      authorName: "David Chen",
      caption: "Such a beautiful soul. Will be deeply missed by everyone who knew her.",
      timestamp: "5 hours ago",
      commentCount: 3,
      isPending: true
    }
  ];

  const mockCondolences = [
    {
      authorName: "Robert Martinez",
      message: "Margaret was a light in this world. Her kindness and warmth touched everyone who knew her. My deepest condolences to the family during this difficult time.",
      timestamp: "3 hours ago"
    },
    {
      authorName: "Lisa Thompson",
      message: "Sending prayers and love to the entire family. May her memory be a blessing.",
      timestamp: "1 day ago"
    }
  ];

  const mockDonors = [
    { name: "John Smith", amount: 500, timestamp: "2 hours ago" },
    { name: "Emily Rodriguez", amount: 250, timestamp: "5 hours ago" },
    { name: "Michael Chen", amount: 1000, timestamp: "1 day ago" },
    { name: "Sarah Johnson", amount: 100, timestamp: "2 days ago" },
    { name: "David Kim", amount: 300, timestamp: "3 days ago" }
  ];

  const mockPlaylist = [
    { id: '1', title: 'Amazing Grace', artist: 'Traditional', duration: '3:42' },
    { id: '2', title: 'What a Wonderful World', artist: 'Louis Armstrong', duration: '2:20' },
    { id: '3', title: 'Over the Rainbow', artist: 'Judy Garland', duration: '2:45' },
    { id: '4', title: 'Ave Maria', artist: 'Franz Schubert', duration: '4:15' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MemorialHero 
        name="Margaret Rose Johnson"
        birthDate="March 15, 1945"
        deathDate="September 28, 2024"
        onEnterCode={() => setCodeModalOpen(true)}
        onShare={() => console.log('Share clicked')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MemorialTabs 
          memoriesContent={
            <div className="space-y-6">
              <Button className="w-full" data-testid="button-add-memory">
                <Plus className="w-5 h-5 mr-2" />
                Share a Memory
              </Button>
              {mockMemories.map((memory, index) => (
                <MemoryCard 
                  key={index}
                  {...memory}
                  onComment={() => console.log('Comment clicked')}
                  onApprove={() => console.log('Approved')}
                  onReject={() => console.log('Rejected')}
                />
              ))}
            </div>
          }
          condolencesContent={
            <div className="space-y-6">
              <Button className="w-full" data-testid="button-leave-condolence">
                <Plus className="w-5 h-5 mr-2" />
                Leave a Condolence
              </Button>
              {mockCondolences.map((condolence, index) => (
                <CondolenceMessage key={index} {...condolence} />
              ))}
            </div>
          }
          eventsContent={
            <div className="grid gap-6 md:grid-cols-2">
              <LegacyEventCard 
                title="Annual Memorial Picnic"
                date="June 15, 2025"
                time="12:00 PM"
                location="Riverside Park, Pavilion 3"
                attendeeCount={28}
                description="Join us for our annual gathering to celebrate Margaret's life with food, music, and cherished memories."
                isUpcoming={true}
                onRSVP={() => console.log('RSVP clicked')}
              />
            </div>
          }
          fundraiserContent={
            <div className="max-w-2xl mx-auto">
              <FundraiserProgress 
                title="Memorial Fund"
                description="Help us cover the funeral expenses and celebrate Margaret's life with dignity."
                currentAmount={8450}
                goalAmount={15000}
                donors={mockDonors}
                onDonate={() => console.log('Donate clicked')}
              />
            </div>
          }
          mapContent={
            <div className="max-w-2xl mx-auto">
              <CemeteryMap 
                cemeteryName="Riverside Memorial Gardens"
                sectionLocation="Section C, Plot 142"
                coordinates={{ lat: 40.7128, lng: -74.0060 }}
                onGetDirections={() => console.log('Get directions clicked')}
              />
            </div>
          }
          musicContent={
            <div className="max-w-2xl mx-auto">
              <MusicPlayer playlist={mockPlaylist} />
            </div>
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
    </div>
  );
}
