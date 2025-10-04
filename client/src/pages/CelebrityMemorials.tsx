import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CelebrityMemorial } from "@shared/schema";
import CelebrityMemorialCard from "@/components/CelebrityMemorialCard";
import DonationGateModal from "@/components/DonationGateModal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CelebrityMemorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCelebrity, setSelectedCelebrity] = useState<CelebrityMemorial | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  const { data: celebrities = [], isLoading } = useQuery<CelebrityMemorial[]>({
    queryKey: ["/api/celebrity-memorials"],
  });

  const filteredCelebrities = celebrities.filter(celebrity =>
    celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    celebrity.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDonate = (celebrity: CelebrityMemorial) => {
    setSelectedCelebrity(celebrity);
    setDonationModalOpen(true);
  };

  const handleDonationSubmit = async (amount: number, email: string) => {
    if (!selectedCelebrity) return;
    
    console.log('Donation completed:', { 
      celebrity: selectedCelebrity.name, 
      amount, 
      email 
    });
    setDonationModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M16 2L18 8H14L16 2Z" fill="currentColor" opacity="0.9"/>
              <rect x="14" y="8" width="4" height="16" fill="currentColor" opacity="0.8"/>
              <path d="M16 24C16 24 20 22 20 18V12H12V18C12 22 16 24 16 24Z" fill="currentColor" opacity="0.6"/>
              <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.7"/>
              <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.7"/>
              <path d="M8 8C8 8 10 6 12 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
              <path d="M24 8C24 8 22 6 20 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
              <ellipse cx="16" cy="28" rx="12" ry="2" fill="currentColor" opacity="0.3"/>
            </svg>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground">
              Celebrity & Influencer Memorials
            </h1>
          </div>
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

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Loading celebrity memorials...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCelebrities.map((celebrity) => (
                <CelebrityMemorialCard
                  key={celebrity.id}
                  name={celebrity.name}
                  title={celebrity.title}
                  imageUrl={celebrity.imageUrl || undefined}
                  charityName={celebrity.charityName}
                  donationAmount={Number(celebrity.donationAmount)}
                  fanCount={celebrity.fanCount || 0}
                  isUnlocked={false}
                  onDonate={() => handleDonate(celebrity)}
                  onView={() => console.log('View memorial:', celebrity.name)}
                />
              ))}
            </div>

            {filteredCelebrities.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  {celebrities.length === 0 
                    ? "No celebrity memorials available yet."
                    : "No celebrities found matching your search."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCelebrity && (
        <DonationGateModal
          open={donationModalOpen}
          onOpenChange={setDonationModalOpen}
          celebrityName={selectedCelebrity.name}
          charityName={selectedCelebrity.charityName}
          donationAmount={Number(selectedCelebrity.donationAmount)}
          platformPercentage={selectedCelebrity.platformPercentage || 5}
          onSubmit={handleDonationSubmit}
        />
      )}
    </div>
  );
}
