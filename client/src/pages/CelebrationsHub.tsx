import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, Cake, Heart, Gift, PartyPopper, Music, Video, 
  ShoppingBag, Users, Bluetooth, Globe, Sparkles, Star,
  TreeDeciduous, Sun, Moon, Flame, Clock, Play, Search, Radio
} from "lucide-react";

const allHolidays = [
  { id: 1, name: "Lunar New Year", date: "February 17, 2026", icon: Moon, color: "text-red-500", category: "Cultural", tradition: "East Asian" },
  { id: 2, name: "Ramadan Begins", date: "February 17, 2026", icon: Moon, color: "text-emerald-500", category: "Islamic", tradition: "Islamic" },
  { id: 3, name: "Eid al-Fitr", date: "March 20, 2026", icon: Moon, color: "text-emerald-500", category: "Islamic", tradition: "Islamic" },
  { id: 4, name: "Nowruz", date: "March 20, 2026", icon: Sun, color: "text-green-400", category: "Persian", tradition: "Persian" },
  { id: 5, name: "Holi", date: "March 10, 2026", icon: Sparkles, color: "text-pink-400", category: "Hindu", tradition: "Hindu" },
  { id: 6, name: "Purim", date: "March 5, 2026", icon: Star, color: "text-purple-500", category: "Jewish", tradition: "Jewish" },
  { id: 7, name: "St. Patrick's Day", date: "March 17, 2026", icon: TreeDeciduous, color: "text-green-500", category: "Irish", tradition: "Irish" },
  { id: 8, name: "Easter", date: "April 5, 2026", icon: Sun, color: "text-pink-500", category: "Christian", tradition: "Christian" },
  { id: 9, name: "Passover", date: "April 2, 2026", icon: Star, color: "text-blue-400", category: "Jewish", tradition: "Jewish" },
  { id: 10, name: "Hanami", date: "April 1, 2026", icon: TreeDeciduous, color: "text-pink-400", category: "Japanese", tradition: "Japanese" },
  { id: 11, name: "Thai New Year (Songkran)", date: "April 13, 2026", icon: Sun, color: "text-blue-400", category: "Thai", tradition: "Thai" },
  { id: 12, name: "Baisakhi", date: "April 14, 2026", icon: Sun, color: "text-orange-500", category: "Sikh", tradition: "Sikh" },
  { id: 13, name: "Cinco de Mayo", date: "May 5, 2026", icon: PartyPopper, color: "text-green-500", category: "Mexican", tradition: "Mexican" },
  { id: 14, name: "Vesak (Buddha Day)", date: "May 12, 2026", icon: Sun, color: "text-yellow-500", category: "Buddhist", tradition: "Buddhist" },
  { id: 15, name: "Mother's Day", date: "May 10, 2026", icon: Heart, color: "text-pink-500", category: "National", tradition: "American" },
  { id: 16, name: "Eid al-Adha", date: "May 27, 2026", icon: Moon, color: "text-emerald-600", category: "Islamic", tradition: "Islamic" },
  { id: 17, name: "Memorial Day", date: "May 25, 2026", icon: Star, color: "text-red-500", category: "National", tradition: "American" },
  { id: 18, name: "Shavuot", date: "May 22, 2026", icon: Star, color: "text-blue-500", category: "Jewish", tradition: "Jewish" },
  { id: 19, name: "Father's Day", date: "June 21, 2026", icon: Heart, color: "text-blue-500", category: "National", tradition: "American" },
  { id: 20, name: "Juneteenth", date: "June 19, 2026", icon: Star, color: "text-red-500", category: "American", tradition: "African American" },
  { id: 21, name: "Obon Festival", date: "August 15, 2026", icon: Flame, color: "text-purple-400", category: "Japanese", tradition: "Japanese" },
  { id: 22, name: "Raksha Bandhan", date: "August 28, 2026", icon: Heart, color: "text-pink-500", category: "Hindu", tradition: "Hindu" },
  { id: 23, name: "Krishna Janmashtami", date: "September 4, 2026", icon: Moon, color: "text-blue-600", category: "Hindu", tradition: "Hindu" },
  { id: 24, name: "Rosh Hashanah", date: "September 12, 2026", icon: Moon, color: "text-blue-500", category: "Jewish", tradition: "Jewish" },
  { id: 25, name: "Yom Kippur", date: "September 21, 2026", icon: Star, color: "text-blue-600", category: "Jewish", tradition: "Jewish" },
  { id: 26, name: "Mid-Autumn Festival", date: "September 25, 2026", icon: Moon, color: "text-amber-400", category: "Chinese", tradition: "Chinese" },
  { id: 27, name: "Sukkot", date: "September 26, 2026", icon: TreeDeciduous, color: "text-green-500", category: "Jewish", tradition: "Jewish" },
  { id: 28, name: "Navratri", date: "September 21, 2026", icon: Sparkles, color: "text-red-400", category: "Hindu", tradition: "Hindu" },
  { id: 29, name: "Durga Puja", date: "September 30, 2026", icon: Star, color: "text-red-500", category: "Hindu", tradition: "Hindu" },
  { id: 30, name: "Indigenous Peoples Day", date: "October 12, 2026", icon: Globe, color: "text-amber-600", category: "Indigenous", tradition: "Indigenous" },
  { id: 31, name: "Samhain", date: "October 31, 2026", icon: Moon, color: "text-orange-500", category: "Pagan", tradition: "Celtic" },
  { id: 32, name: "All Saints Day", date: "November 1, 2026", icon: Star, color: "text-white", category: "Christian", tradition: "Christian" },
  { id: 33, name: "Dia de los Muertos", date: "November 2, 2026", icon: Flame, color: "text-orange-600", category: "Mexican", tradition: "Latin American" },
  { id: 34, name: "Diwali", date: "November 8, 2026", icon: Flame, color: "text-amber-500", category: "Hindu", tradition: "Hindu" },
  { id: 35, name: "Guru Nanak Jayanti", date: "November 4, 2026", icon: Sun, color: "text-yellow-500", category: "Sikh", tradition: "Sikh" },
  { id: 36, name: "Thanksgiving", date: "November 26, 2026", icon: TreeDeciduous, color: "text-orange-500", category: "National", tradition: "American" },
  { id: 37, name: "Hanukkah", date: "December 5, 2026", icon: Flame, color: "text-blue-500", category: "Jewish", tradition: "Jewish" },
  { id: 38, name: "Bodhi Day", date: "December 8, 2026", icon: TreeDeciduous, color: "text-green-600", category: "Buddhist", tradition: "Buddhist" },
  { id: 39, name: "Winter Solstice", date: "December 21, 2026", icon: Sun, color: "text-cyan-500", category: "Pagan", tradition: "Pagan/Wiccan" },
  { id: 40, name: "Yule", date: "December 21, 2026", icon: Flame, color: "text-red-600", category: "Pagan", tradition: "Nordic" },
  { id: 41, name: "Festivus", date: "December 23, 2026", icon: PartyPopper, color: "text-gray-500", category: "Secular", tradition: "Secular" },
  { id: 42, name: "Christmas", date: "December 25, 2026", icon: Star, color: "text-red-500", category: "Christian", tradition: "Christian" },
  { id: 43, name: "Kwanzaa", date: "December 26, 2026", icon: Flame, color: "text-green-500", category: "Cultural", tradition: "African American" },
  { id: 44, name: "New Year's Eve", date: "December 31, 2026", icon: PartyPopper, color: "text-purple-500", category: "Global", tradition: "Global" },
];

const birthdayFeatures = [
  { icon: Cake, title: "Birthday Wishes", description: "Collect and display birthday wishes from friends and family" },
  { icon: Music, title: "Bluetooth Playlists", description: "Share music with connected devices during celebrations" },
  { icon: Video, title: "Live Celebration", description: "Stream and celebrate with friends in real-time" },
  { icon: ShoppingBag, title: "Shopping Spree", description: "Spend birthday donations at partner stores" },
];

const weddingFeatures = [
  { icon: Gift, title: "Gift Registry", description: "Create and share your wedding gift wishlist" },
  { icon: Heart, title: "Cash Gifts", description: "Accept monetary gifts through secure wallets" },
  { icon: Users, title: "Guest Management", description: "Track RSVPs and thank-you notes" },
  { icon: Video, title: "Live Stream", description: "Share your special day with remote guests" },
];

export default function CelebrationsHub() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<string | null>(null);
  const [showAllHolidays, setShowAllHolidays] = useState(false);
  
  // Parse tab from URL query parameter
  const getTabFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    return tab && ["holidays", "birthdays", "weddings"].includes(tab) ? tab : "holidays";
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  
  // Sync tab state with URL
  useEffect(() => {
    const tab = getTabFromUrl();
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [location]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = `/celebrations${value !== "holidays" ? `?tab=${value}` : ""}`;
    setLocation(newUrl);
  };
  
  // Get unique traditions for filtering
  const traditions = Array.from(new Set(allHolidays.map(h => h.tradition))).sort();
  
  // Filter holidays
  const filteredHolidays = allHolidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          holiday.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          holiday.tradition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTradition = !selectedTradition || holiday.tradition === selectedTradition;
    return matchesSearch && matchesTradition;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(218,165,32,0.15),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4" data-testid="badge-new-feature">
              <Sparkles className="w-3 h-3 mr-1" />
              Continuum Celebrations
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight" data-testid="text-celebrations-title">
              Celebrate Every
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Moment Together</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-celebrations-description">
              From holidays and birthdays to weddings and special occasions - 
              create shared experiences with live streaming, Bluetooth playlists, 
              gift registries, and shopping sprees from donated funds.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-12" data-testid="tabs-celebrations">
            <TabsTrigger value="holidays" className="gap-2" data-testid="tab-holidays">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Holidays</span>
            </TabsTrigger>
            <TabsTrigger value="birthdays" className="gap-2" data-testid="tab-birthdays">
              <Cake className="w-4 h-4" />
              <span className="hidden sm:inline">Birthdays</span>
            </TabsTrigger>
            <TabsTrigger value="weddings" className="gap-2" data-testid="tab-weddings">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Weddings</span>
            </TabsTrigger>
          </TabsList>

          {/* Holidays Tab */}
          <TabsContent value="holidays" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold text-foreground mb-3" data-testid="text-holidays-title">
                Multi-Faith Holiday Calendar
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                50+ holidays from every tradition and culture. No religious bias - you choose what matters to you.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search holidays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-holidays"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant={selectedTradition === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTradition(null)}
                  data-testid="filter-all"
                >
                  All
                </Button>
                {["Hindu", "Jewish", "Islamic", "Christian", "Buddhist", "Sikh", "Global"].map((t) => (
                  <Button
                    key={t}
                    variant={selectedTradition === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTradition(selectedTradition === t ? null : t)}
                    data-testid={`filter-${t.toLowerCase()}`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            {/* Holiday Count */}
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredHolidays.length} of {allHolidays.length} holidays
            </div>

            {/* Holidays Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(showAllHolidays ? filteredHolidays : filteredHolidays.slice(0, 12)).map((holiday) => (
                <Card key={holiday.id} className="hover-elevate" data-testid={`card-holiday-${holiday.id}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-muted ${holiday.color}`}>
                        <holiday.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-foreground">{holiday.name}</h3>
                          <Badge variant="outline" className="text-xs shrink-0">{holiday.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{holiday.date}</p>
                        <p className="text-xs text-muted-foreground mt-1">{holiday.tradition}</p>
                        <div className="mt-3 flex gap-2">
                          <Link href={`/holiday-celebration/${holiday.id}?name=${encodeURIComponent(holiday.name)}&tradition=${encodeURIComponent(holiday.tradition)}`}>
                            <Button size="sm" className="gap-1" data-testid={`button-celebrate-${holiday.id}`}>
                              <Radio className="w-3 h-3" />
                              Go Live
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHolidays.length > 12 && !showAllHolidays && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setShowAllHolidays(true)}
                  data-testid="button-load-more-holidays"
                >
                  Show All {filteredHolidays.length} Holidays
                </Button>
              </div>
            )}

            {showAllHolidays && filteredHolidays.length > 12 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={() => setShowAllHolidays(false)}
                  data-testid="button-show-less-holidays"
                >
                  Show Less
                </Button>
              </div>
            )}

            {/* Holiday Features */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  All Holidays, All Traditions
                </CardTitle>
                <CardDescription>
                  Our platform respects every faith and culture. Create celebration events for any holiday.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-primary">{allHolidays.length}+</div>
                    <div className="text-sm text-muted-foreground">World Holidays</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-primary">{traditions.length}+</div>
                    <div className="text-sm text-muted-foreground">Faith Traditions</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-primary">100+</div>
                    <div className="text-sm text-muted-foreground">Regional Celebrations</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <div className="text-2xl font-bold text-primary">Custom</div>
                    <div className="text-sm text-muted-foreground">Personal Dates</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4">
              <Link href="/holiday-timeline">
                <Button size="lg" data-testid="button-explore-holidays">
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Full Holiday Calendar
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Birthdays Tab */}
          <TabsContent value="birthdays" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold text-foreground mb-3" data-testid="text-birthdays-title">
                Birthday Celebration Platform
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create unforgettable birthday experiences with live streaming, shared playlists, and a shopping spree from donated funds.
              </p>
            </div>

            {/* Birthday Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {birthdayFeatures.map((feature, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-birthday-feature-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bluetooth & Live Features Highlight */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bluetooth className="w-5 h-5 text-primary" />
                    Bluetooth Party Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect multiple devices to share music during the celebration. 
                    Everyone hears the same playlist in perfect sync.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-primary" />
                      <span>Curated celebration playlists</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span>Up to 20 connected devices</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-primary" />
                      <span>Host controls playback</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-accent-foreground" />
                    Birthday Shopping Spree
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Receive birthday donations and spend them on things you actually want. 
                    Shop from your wallet balance at partner stores.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-primary" />
                      <span>Collect donations from guests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <span>Shop at partner retailers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>Track spending and orders</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center pt-4">
              <Link href="/birthday-celebration">
                <Button size="lg" data-testid="button-create-birthday">
                  <Cake className="w-5 h-5 mr-2" />
                  Create Birthday Celebration
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Weddings Tab */}
          <TabsContent value="weddings" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-semibold text-foreground mb-3" data-testid="text-weddings-title">
                Wedding Gift Registry
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create beautiful gift registries, accept cash gifts, and share your special day with everyone - near and far.
              </p>
            </div>

            {/* Wedding Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {weddingFeatures.map((feature, index) => (
                <Card key={index} className="hover-elevate" data-testid={`card-wedding-feature-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Registry Preview */}
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">1</span>
                    </div>
                    <h4 className="font-semibold">Create Registry</h4>
                    <p className="text-sm text-muted-foreground">
                      Add items from any store or accept cash contributions
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">2</span>
                    </div>
                    <h4 className="font-semibold">Share with Guests</h4>
                    <p className="text-sm text-muted-foreground">
                      Send your unique registry link to friends and family
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <span className="text-xl font-bold text-primary">3</span>
                    </div>
                    <h4 className="font-semibold">Receive & Thank</h4>
                    <p className="text-sm text-muted-foreground">
                      Track gifts and send personalized thank-you notes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-4 flex flex-wrap justify-center gap-4">
              <Link href="/wedding-registry">
                <Button size="lg" data-testid="button-create-registry">
                  <Gift className="w-5 h-5 mr-2" />
                  Wedding Registry
                </Button>
              </Link>
              <Link href="/baby-shower">
                <Button size="lg" variant="outline" data-testid="button-baby-shower">
                  <Cake className="w-5 h-5 mr-2" />
                  Baby Shower Registry
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Live Celebration Feature */}
      <div className="bg-card/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-semibold text-foreground mb-3" data-testid="text-live-title">
              Celebrate Together, Anywhere
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stream your celebrations live to friends and family who can't be there in person.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link href="/live-celebration">
              <Card className="text-center hover-elevate cursor-pointer" data-testid="card-live-video">
                <CardContent className="p-6 space-y-4">
                  <Video className="w-10 h-10 text-primary mx-auto" />
                  <h3 className="font-semibold">Live Video</h3>
                  <p className="text-sm text-muted-foreground">
                    HD video streaming with chat and reactions
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/shared-music">
              <Card className="text-center hover-elevate cursor-pointer" data-testid="card-shared-music">
                <CardContent className="p-6 space-y-4">
                  <Music className="w-10 h-10 text-primary mx-auto" />
                  <h3 className="font-semibold">Shared Music</h3>
                  <p className="text-sm text-muted-foreground">
                    Everyone listens to the same playlist together
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/virtual-reactions">
              <Card className="text-center hover-elevate cursor-pointer" data-testid="card-virtual-reactions">
                <CardContent className="p-6 space-y-4">
                  <PartyPopper className="w-10 h-10 text-primary mx-auto" />
                  <h3 className="font-semibold">Virtual Reactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Send reactions, photos, and messages in real-time
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/ai-holiday-cards">
            <Card className="hover-elevate cursor-pointer" data-testid="card-ai-holiday-cards-promo">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Holiday Cards</h3>
                  <p className="text-sm text-muted-foreground">
                    Create beautiful, personalized holiday cards with AI for any celebration or faith tradition
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
