import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CelebrityMemorial } from "@shared/schema";
import CelebrityMemorialCard from "@/components/CelebrityMemorialCard";
import DonationGateModal from "@/components/DonationGateModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Crown, Trophy, Music, Film, Heart, Briefcase, Users, Plus, Star, Award, Mic2, Loader2 } from "lucide-react";

// Profession categories with comprehensive list
const professionCategories = [
  { 
    id: "sports", 
    name: "Sports & Athletics", 
    icon: Trophy,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    subCategories: ["Basketball", "Football", "Baseball", "Soccer", "Tennis", "Boxing", "Golf", "Track & Field", "Swimming", "Other Sports"]
  },
  { 
    id: "entertainment", 
    name: "Actors & Actresses", 
    icon: Film,
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    subCategories: ["Film", "Television", "Theater", "Voice Acting", "Stunt Performers"]
  },
  { 
    id: "music", 
    name: "Musicians & Artists", 
    icon: Music,
    color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    subCategories: ["Pop", "Rock", "Hip-Hop/Rap", "R&B/Soul", "Country", "Jazz", "Classical", "Gospel", "Producers", "Songwriters"]
  },
  { 
    id: "royalty", 
    name: "Royalty & Nobility", 
    icon: Crown,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    subCategories: ["Kings", "Queens", "Princes", "Princesses", "Dukes", "Duchesses", "Other Nobility"]
  },
  { 
    id: "philanthropy", 
    name: "Philanthropists", 
    icon: Heart,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    subCategories: ["Humanitarian", "Charity Founders", "Social Activists", "Environmental"]
  },
  { 
    id: "business", 
    name: "Business Leaders", 
    icon: Briefcase,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    subCategories: ["CEOs", "Entrepreneurs", "Investors", "Innovators"]
  },
  { 
    id: "politics", 
    name: "Political Figures", 
    icon: Users,
    color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    subCategories: ["Presidents", "Prime Ministers", "Senators", "Governors", "Ambassadors", "Activists"]
  },
  { 
    id: "arts", 
    name: "Artists & Writers", 
    icon: Award,
    color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
    subCategories: ["Painters", "Sculptors", "Novelists", "Poets", "Playwrights", "Journalists", "Critics"]
  },
  { 
    id: "comedy", 
    name: "Comedians", 
    icon: Mic2,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    subCategories: ["Stand-up", "Improv", "Sketch Comedy", "Comedy Writers"]
  },
  { 
    id: "science", 
    name: "Scientists & Educators", 
    icon: Star,
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    subCategories: ["Physicists", "Biologists", "Chemists", "Astronomers", "Professors", "Researchers"]
  },
];

export default function CelebrityMemorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCelebrity, setSelectedCelebrity] = useState<CelebrityMemorial | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);

  const { data: celebrities = [], isLoading } = useQuery<CelebrityMemorial[]>({
    queryKey: ["/api/celebrity-memorials"],
  });

  // Sort celebrities by fan count to get featured ones
  const featuredCelebrities = [...celebrities]
    .sort((a, b) => (b.fanCount || 0) - (a.fanCount || 0))
    .slice(0, 3);

  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      celebrity.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || celebrity.professionCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
      <div className="bg-gradient-to-br from-primary/15 to-accent/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary drop-shadow-md">
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
                <h1 className="text-4xl md:text-5xl font-serif font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Celebrity & Influencer Memorials
                </h1>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => window.location.href = '/create-celebrity-memorial'}
              data-testid="button-create-celebrity-memorial"
              className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Memorial
            </Button>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Honor iconic figures and support their favorite charities. Each memorial unlocks with a $10 donation, 
            with 95% going directly to the charity.
          </p>
          <Badge variant="outline" className="text-sm">
            Verified by family, lawyers, or authorized representatives
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Celebrities Section */}
        {featuredCelebrities.length > 0 && !isLoading && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-serif font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Featured Memorials</h2>
                <p className="text-muted-foreground mt-1">Most visited and celebrated figures</p>
              </div>
              <Badge variant="secondary" className="bg-[hsl(45,80%,15%)] text-[hsl(45,80%,60%)]">
                <Star className="w-4 h-4 mr-1" />
                Top Tributes
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredCelebrities.map((celebrity) => {
                const category = professionCategories.find(c => c.id === celebrity.professionCategory);
                return (
                  <Card key={celebrity.id} className="group cursor-pointer overflow-hidden hover-elevate">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                      {celebrity.imageUrl ? (
                        <img 
                          src={celebrity.imageUrl} 
                          alt={celebrity.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Star className="w-16 h-16 mx-auto mb-2 text-primary/50" />
                            <p className="text-lg font-serif text-foreground/80">{celebrity.name}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white">{celebrity.name}</h3>
                        <p className="text-white/90 text-sm">{celebrity.title}</p>
                      </div>
                      {category && (
                        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full ${category.color} flex items-center justify-center`}>
                          <category.icon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          {celebrity.fanCount?.toLocaleString() || 0} fans
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {celebrity.birthDate} - {celebrity.deathDate}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Supporting: <span className="font-medium text-foreground">{celebrity.charityName}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDonate(celebrity);
                          }}
                          data-testid={`button-donate-${celebrity.id}`}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Support ${celebrity.donationAmount}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => window.location.href = `/celebrity-memorial/${celebrity.id}`}
                          data-testid={`button-view-${celebrity.id}`}
                        >
                          View Memorial
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Profession Category Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Profession</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {professionCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all hover-elevate ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}
                  onClick={() => setSelectedCategory(isSelected ? "" : category.id)}
                  data-testid={`card-category-${category.id}`}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${category.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm">{category.name}</p>
                    {isSelected && (
                      <Badge variant="secondary" className="mt-2 text-xs">Active</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

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

        {/* Active Category Filter Display */}
        {selectedCategory && (
          <div className="flex items-center justify-between mb-6 bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              {(() => {
                const category = professionCategories.find(c => c.id === selectedCategory);
                const IconComponent = category?.icon || Star;
                return (
                  <>
                    <div className={`w-8 h-8 rounded-full ${category?.color} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Showing {category?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {filteredCelebrities.length} memorial{filteredCelebrities.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("")}
              data-testid="button-clear-category-filter"
            >
              Show All
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-8" data-testid="loading-skeletons">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p>Loading celebrity memorials...</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative">
                    <Skeleton className="h-64 w-full" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <Skeleton className="h-6 w-3/4 bg-white/20 mb-2" />
                      <Skeleton className="h-4 w-1/2 bg-white/20" />
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1 rounded" />
                      <Skeleton className="h-9 flex-1 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
