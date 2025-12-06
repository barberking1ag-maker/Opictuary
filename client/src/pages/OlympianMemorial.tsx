import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AthleteProfile } from "@shared/schema";
import { 
  Trophy, 
  Medal, 
  Target, 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Star,
  ArrowLeft,
  Flame,
  Award,
  Users,
  Globe,
  Clock,
  Heart,
  Zap,
  Crown
} from "lucide-react";

const olympicYears = [
  { year: 1896, city: "Athens", country: "Greece" },
  { year: 1900, city: "Paris", country: "France" },
  { year: 1904, city: "St. Louis", country: "USA" },
  { year: 1908, city: "London", country: "UK" },
  { year: 1912, city: "Stockholm", country: "Sweden" },
  { year: 1920, city: "Antwerp", country: "Belgium" },
  { year: 1924, city: "Paris", country: "France" },
  { year: 1928, city: "Amsterdam", country: "Netherlands" },
  { year: 1932, city: "Los Angeles", country: "USA" },
  { year: 1936, city: "Berlin", country: "Germany" },
  { year: 1948, city: "London", country: "UK" },
  { year: 1952, city: "Helsinki", country: "Finland" },
  { year: 1956, city: "Melbourne", country: "Australia" },
  { year: 1960, city: "Rome", country: "Italy" },
  { year: 1964, city: "Tokyo", country: "Japan" },
  { year: 1968, city: "Mexico City", country: "Mexico" },
  { year: 1972, city: "Munich", country: "Germany" },
  { year: 1976, city: "Montreal", country: "Canada" },
  { year: 1980, city: "Moscow", country: "USSR" },
  { year: 1984, city: "Los Angeles", country: "USA" },
  { year: 1988, city: "Seoul", country: "South Korea" },
  { year: 1992, city: "Barcelona", country: "Spain" },
  { year: 1996, city: "Atlanta", country: "USA" },
  { year: 2000, city: "Sydney", country: "Australia" },
  { year: 2004, city: "Athens", country: "Greece" },
  { year: 2008, city: "Beijing", country: "China" },
  { year: 2012, city: "London", country: "UK" },
  { year: 2016, city: "Rio", country: "Brazil" },
  { year: 2020, city: "Tokyo", country: "Japan" },
  { year: 2024, city: "Paris", country: "France" },
];

interface LegacyScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  icon: any;
  description: string;
}

export default function OlympianMemorial() {
  const params = useParams();
  const athleteId = params.athleteId as string;
  const [selectedOlympics, setSelectedOlympics] = useState<string | null>(null);

  const { data: athlete, isLoading } = useQuery<AthleteProfile>({
    queryKey: [`/api/athlete-profiles/${athleteId}`],
    enabled: !!athleteId,
  });

  const legacyBreakdown = useMemo<LegacyScoreBreakdown[]>(() => {
    if (!athlete) return [];

    const stats = athlete.careerStats as Record<string, string> | null;
    if (!stats) return [];

    const goldMedals = parseInt(stats["Gold Medals"]?.replace(/[^0-9]/g, "") || "0");
    const silverMedals = parseInt(stats["Silver Medals"]?.replace(/[^0-9]/g, "") || "0");
    const bronzeMedals = parseInt(stats["Bronze Medals"]?.replace(/[^0-9]/g, "") || "0");
    const worldRecords = parseInt(stats["World Records"]?.replace(/[^0-9]/g, "") || "0");
    const olympicAppearances = parseInt(stats["Olympic Appearances"]?.replace(/[^0-9]/g, "") || "1");

    return [
      {
        category: "Gold Medal Performance",
        score: Math.min(40, goldMedals * 8),
        maxScore: 40,
        icon: Trophy,
        description: `${goldMedals} gold medal${goldMedals !== 1 ? "s" : ""} won`,
      },
      {
        category: "Overall Medal Count",
        score: Math.min(25, (goldMedals + silverMedals + bronzeMedals) * 3),
        maxScore: 25,
        icon: Medal,
        description: `${goldMedals + silverMedals + bronzeMedals} total medals`,
      },
      {
        category: "Olympic Longevity",
        score: Math.min(15, olympicAppearances * 5),
        maxScore: 15,
        icon: Calendar,
        description: `${olympicAppearances} Olympic games attended`,
      },
      {
        category: "Record Breaking",
        score: Math.min(15, worldRecords * 5),
        maxScore: 15,
        icon: Zap,
        description: `${worldRecords} world record${worldRecords !== 1 ? "s" : ""}`,
      },
      {
        category: "Legacy Impact",
        score: Math.min(5, athlete.legacyScore ? Math.floor(athlete.legacyScore / 20) : 0),
        maxScore: 5,
        icon: Crown,
        description: "Cultural and historical significance",
      },
    ];
  }, [athlete]);

  const totalLegacyScore = useMemo(() => {
    return legacyBreakdown.reduce((sum, item) => sum + item.score, 0);
  }, [legacyBreakdown]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-yellow-500";
    if (score >= 60) return "text-gray-400";
    if (score >= 40) return "text-amber-700";
    return "text-muted-foreground";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Legendary";
    if (score >= 80) return "Hall of Fame";
    if (score >= 60) return "Olympic Champion";
    if (score >= 40) return "Medalist";
    return "Olympic Athlete";
  };

  if (!athleteId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Olympian Selected</h2>
          <p className="text-muted-foreground">Please select an Olympic athlete to view their legacy.</p>
          <Link href="/sports-memorials">
            <Button className="mt-4">Browse Olympic Athletes</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600" />
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Athlete Not Found</h2>
          <p className="text-muted-foreground">The Olympic athlete you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  const stats = athlete.careerStats as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link href="/sports-memorials">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sports Memorials
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="h-10 w-10 text-orange-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Olympic Legacy Memorial
            </h1>
            <Flame className="h-10 w-10 text-orange-500" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating the extraordinary achievements of {athlete.name}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 p-8 text-white">
                <div className="flex items-center gap-6">
                  <Avatar className="w-32 h-32 border-4 border-white/30">
                    {athlete.profileImage ? (
                      <AvatarImage src={athlete.profileImage} alt={athlete.name} />
                    ) : null}
                    <AvatarFallback className="bg-white/20 text-white text-3xl">
                      {athlete.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{athlete.name}</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Trophy className="mr-1 h-3 w-3" />
                        {athlete.sport}
                      </Badge>
                      {athlete.position && (
                        <Badge className="bg-white/20 text-white border-white/30">
                          {athlete.position}
                        </Badge>
                      )}
                      {athlete.nationality && (
                        <Badge className="bg-white/20 text-white border-white/30">
                          <Globe className="mr-1 h-3 w-3" />
                          {athlete.nationality}
                        </Badge>
                      )}
                    </div>
                    <p className="opacity-90">
                      {athlete.careerSpan || "Olympic Career"}
                    </p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Medal className="h-5 w-5 text-yellow-600" />
                  Olympic Medal Count
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats?.["Gold Medals"] || "0"}
                    </p>
                    <p className="text-sm text-muted-foreground">Gold</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50">
                    <Medal className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-3xl font-bold text-gray-500">
                      {stats?.["Silver Medals"] || "0"}
                    </p>
                    <p className="text-sm text-muted-foreground">Silver</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                    <Award className="h-8 w-8 mx-auto mb-2 text-amber-700" />
                    <p className="text-3xl font-bold text-amber-700">
                      {stats?.["Bronze Medals"] || "0"}
                    </p>
                    <p className="text-sm text-muted-foreground">Bronze</p>
                  </div>
                </div>

                {athlete.biography && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-xl font-bold mb-3">Biography</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {athlete.biography}
                    </p>
                  </>
                )}

                {athlete.achievements && (athlete.achievements as string[]).length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Key Achievements
                    </h3>
                    <div className="space-y-2">
                      {(athlete.achievements as string[]).map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Career Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stats).map(([key, value]) => (
                      <div key={key} className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">{key}</p>
                        <p className="text-2xl font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No statistics available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Athletic Legacy Score
                </CardTitle>
                <CardDescription className="text-yellow-100">
                  Comprehensive Olympic achievement rating
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className={`text-6xl font-bold ${getScoreColor(totalLegacyScore)}`}>
                    {totalLegacyScore}
                  </p>
                  <p className="text-sm text-muted-foreground">out of 100</p>
                  <Badge className="mt-2" variant="secondary">
                    {getScoreLabel(totalLegacyScore)}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {legacyBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.score}/{item.maxScore}
                        </span>
                      </div>
                      <Progress 
                        value={(item.score / item.maxScore) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Olympic Games History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {olympicYears.slice(-10).reverse().map((olympics) => (
                    <div
                      key={olympics.year}
                      className="flex items-center justify-between p-2 rounded-lg hover-elevate cursor-pointer"
                      onClick={() => setSelectedOlympics(olympics.year.toString())}
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-400" />
                        <span className="font-medium">{olympics.year}</span>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{olympics.city}</p>
                        <p className="text-xs">{olympics.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-6 w-6 text-orange-600" />
                  <h4 className="font-bold text-orange-800 dark:text-orange-200">
                    Honor Their Legacy
                  </h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                  Share this memorial to celebrate their Olympic achievements and inspire future generations.
                </p>
                <Link href={athlete.memorialId ? `/memorial/${athlete.memorialId}` : "/sports-memorials"}>
                  <Button variant="outline" className="w-full border-orange-300 dark:border-orange-700">
                    View Full Memorial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
