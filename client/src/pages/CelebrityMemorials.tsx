import { useState } from "react";
import CelebrityMemorialCard from "@/components/CelebrityMemorialCard";
import DonationGateModal from "@/components/DonationGateModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CelebrityMemorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCelebrity, setSelectedCelebrity] = useState<any>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  //todo: remove mock functionality
  const mockCelebrities = [
    {
      id: 1,
      name: "Queen Elizabeth II",
      title: "Queen of the United Kingdom (1926-2022)",
      charityName: "The Queen's Commonwealth Trust",
      donationAmount: 10,
      fanCount: 125847,
      isUnlocked: false
    },
    {
      id: 2,
      name: "Kobe Bryant",
      title: "NBA Legend & Philanthropist (1978-2020)",
      charityName: "Mamba & Mambacita Sports Foundation",
      donationAmount: 10,
      fanCount: 98432,
      isUnlocked: false
    },
    {
      id: 3,
      name: "David Bowie",
      title: "Music Icon & Cultural Pioneer (1947-2016)",
      charityName: "Save the Children",
      donationAmount: 10,
      fanCount: 87234,
      isUnlocked: false
    },
    {
      id: 4,
      name: "Ruth Bader Ginsburg",
      title: "Supreme Court Justice (1933-2020)",
      charityName: "American Civil Liberties Union",
      donationAmount: 10,
      fanCount: 76543,
      isUnlocked: false
    },
    {
      id: 5,
      name: "Robin Williams",
      title: "Actor & Comedian (1951-2014)",
      charityName: "St. Jude Children's Research Hospital",
      donationAmount: 10,
      fanCount: 112389,
      isUnlocked: false
    },
    {
      id: 6,
      name: "Princess Diana",
      title: "Princess of Wales (1961-1997)",
      charityName: "The Diana Award",
      donationAmount: 10,
      fanCount: 156782,
      isUnlocked: false
    }
  ];

  const filteredCelebrities = mockCelebrities.filter(celebrity =>
    celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celebrity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDonate = (celebrity: any) => {
    setSelectedCelebrity(celebrity);
    setDonationModalOpen(true);
  };

  const handleDonationSubmit = (amount: number, email: string) => {
    console.log('Donation completed:', { 
      celebrity: selectedCelebrity?.name, 
      amount, 
      email 
    });
    setDonationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
            Celebrity & Influencer Memorials
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Honor iconic figures and support their favorite charities. Each memorial unlocks with a $10 donation, 
            with 95% going directly to the charity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search celebrities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-celebrities"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCelebrities.map((celebrity) => (
            <CelebrityMemorialCard
              key={celebrity.id}
              {...celebrity}
              onDonate={() => handleDonate(celebrity)}
              onView={() => console.log('View memorial:', celebrity.name)}
            />
          ))}
        </div>

        {filteredCelebrities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No celebrities found matching your search.</p>
          </div>
        )}
      </div>

      {selectedCelebrity && (
        <DonationGateModal
          open={donationModalOpen}
          onOpenChange={setDonationModalOpen}
          celebrityName={selectedCelebrity.name}
          charityName={selectedCelebrity.charityName}
          donationAmount={selectedCelebrity.donationAmount}
          onSubmit={handleDonationSubmit}
        />
      )}
    </div>
  );
}
