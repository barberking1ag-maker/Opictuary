import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Trophy, Users, Medal, Award, Calendar, MapPin, Play, 
  Star, TrendingUp, Shield, Target, Timer, Hash, 
  UserPlus, Filter, Search, ChevronRight, ExternalLink,
  BarChart3, Clock, Zap, Heart, Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample athlete data
const sampleAthletes = [
  {
    id: "1",
    name: "Michael Jordan",
    sport: "Basketball",
    position: "Shooting Guard",
    jerseyNumber: "23",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=MJ23",
    birthDate: "Feb 17, 1963",
    retiredDate: "2003",
    legacyScore: 98,
    teams: [
      { name: "Chicago Bulls", years: "1984-1993, 1995-1998", championships: 6 },
      { name: "Washington Wizards", years: "2001-2003", championships: 0 }
    ],
    stats: {
      "Points": "32,292",
      "Rebounds": "6,672",
      "Assists": "5,633",
      "Championships": "6",
      "MVP Awards": "5",
      "Finals MVPs": "6"
    },
    achievements: [
      "6× NBA Champion",
      "5× NBA MVP",
      "14× NBA All-Star",
      "10× NBA Scoring Champion",
      "NBA Rookie of the Year (1985)",
      "2× Olympic Gold Medal"
    ],
    hallOfFame: {
      inducted: true,
      year: "2009",
      location: "Naismith Memorial Basketball Hall of Fame"
    },
    mediaLinks: [
      { type: "highlights", title: "Career Highlights", url: "#" },
      { type: "documentary", title: "The Last Dance", url: "#" }
    ]
  },
  {
    id: "2",
    name: "Tom Brady",
    sport: "Football",
    position: "Quarterback",
    jerseyNumber: "12",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=TB12",
    birthDate: "Aug 3, 1977",
    retiredDate: "2023",
    legacyScore: 97,
    teams: [
      { name: "New England Patriots", years: "2000-2019", championships: 6 },
      { name: "Tampa Bay Buccaneers", years: "2020-2022", championships: 1 }
    ],
    stats: {
      "Passing Yards": "89,214",
      "Touchdowns": "649",
      "Completions": "7,753",
      "Super Bowl Wins": "7",
      "Pro Bowls": "15",
      "MVP Awards": "3"
    },
    achievements: [
      "7× Super Bowl Champion",
      "5× Super Bowl MVP",
      "3× NFL MVP",
      "15× Pro Bowl",
      "NFL 2000s All-Decade Team",
      "NFL 2010s All-Decade Team"
    ],
    hallOfFame: {
      inducted: false,
      year: "Eligible 2028",
      location: "Pro Football Hall of Fame"
    },
    mediaLinks: [
      { type: "highlights", title: "7 Super Bowl Victories", url: "#" },
      { type: "interview", title: "Retirement Speech", url: "#" }
    ]
  },
  {
    id: "3",
    name: "Serena Williams",
    sport: "Tennis",
    position: "Singles/Doubles",
    jerseyNumber: "N/A",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=SerenaW",
    birthDate: "Sep 26, 1981",
    retiredDate: "2022",
    legacyScore: 96,
    teams: [
      { name: "USA Fed Cup Team", years: "1999-2020", championships: 2 },
      { name: "USA Olympic Team", years: "2000-2016", championships: 4 }
    ],
    stats: {
      "Grand Slam Singles": "23",
      "Grand Slam Doubles": "14",
      "WTA Tour Singles": "73",
      "Olympic Gold Medals": "4",
      "Career Prize Money": "$94.8M",
      "Weeks at No. 1": "319"
    },
    achievements: [
      "23× Grand Slam Singles Champion",
      "14× Grand Slam Doubles Champion",
      "4× Olympic Gold Medalist",
      "5× WTA Tour Championships",
      "Career Golden Slam in Doubles",
      "3× AP Female Athlete of the Year"
    ],
    hallOfFame: {
      inducted: true,
      year: "2023",
      location: "International Tennis Hall of Fame"
    },
    mediaLinks: [
      { type: "highlights", title: "23 Grand Slam Victories", url: "#" },
      { type: "documentary", title: "Being Serena", url: "#" }
    ]
  }
];

// Sample team data (replaced by API - keeping for reference structure)
const sampleTeamsStructure = [
  {
    id: "t1",
    name: "1985 Chicago Bears",
    sport: "Football",
    level: "Professional",
    season: "1985-1986",
    logo: null, // Removed emoji
    record: "15-1",
    championship: "Super Bowl XX Champions",
    achievements: [
      "NFL Champions",
      "15-1 Regular Season Record",
      "Allowed only 198 points all season",
      "Super Bowl XX victory 46-10"
    ],
    notableMembers: ["Walter Payton", "Mike Ditka", "William Perry", "Jim McMahon"]
  },
  {
    id: "t2",
    name: "1995-96 Chicago Bulls",
    sport: "Basketball",
    level: "Professional",
    season: "1995-1996",
    logo: null, // Removed emoji
    record: "72-10",
    championship: "NBA Champions",
    achievements: [
      "NBA Champions",
      "72-10 Regular Season Record (Best in NBA history at the time)",
      "15-3 Playoff Record",
      "Led by Michael Jordan, Scottie Pippen, Dennis Rodman"
    ],
    notableMembers: ["Michael Jordan", "Scottie Pippen", "Dennis Rodman", "Phil Jackson"]
  },
  {
    id: "t3",
    name: "UCLA Basketball 1967-1973",
    sport: "Basketball",
    level: "College",
    season: "1967-1973",
    logo: null, // Removed emoji
    record: "205-5",
    championship: "7 Consecutive NCAA Championships",
    achievements: [
      "7 straight NCAA Championships",
      "88 game winning streak",
      "Coached by John Wooden",
      "Most dominant dynasty in college sports"
    ],
    notableMembers: ["John Wooden", "Kareem Abdul-Jabbar", "Bill Walton"]
  }
];

// Sample retired jerseys
const retiredJerseys = [
  {
    id: "rj1",
    playerName: "Michael Jordan",
    number: "23",
    team: "Chicago Bulls",
    retirementDate: "November 1, 1994",
    ceremony: "United Center",
    videoLink: "#"
  },
  {
    id: "rj2",
    playerName: "Magic Johnson",
    number: "32",
    team: "Los Angeles Lakers",
    retirementDate: "February 16, 1992",
    ceremony: "The Forum",
    videoLink: "#"
  },
  {
    id: "rj3",
    playerName: "Wayne Gretzky",
    number: "99",
    team: "League-wide (NHL)",
    retirementDate: "February 6, 2000",
    ceremony: "NHL All-Star Game",
    videoLink: "#"
  }
];

// Stats to Story examples
const statsToStories = [
  {
    athlete: "Michael Jordan",
    stat: "32,292 career points",
    story: "That's enough to score 30 points in every game for 32 straight seasons, or the equivalent of scoring every single point in 403 complete NBA games where the final score was 80-0.",
    visual: null
  },
  {
    athlete: "Tom Brady",
    stat: "649 touchdown passes",
    story: "If Tom Brady threw one touchdown pass every Sunday, it would take over 12 years of non-stop Sunday football to match his career total.",
    visual: null
  },
  {
    athlete: "Serena Williams",
    stat: "23 Grand Slam singles titles",
    story: "That's more Grand Slams than Roger Federer (20) and almost enough to win every Grand Slam tournament for 6 straight years.",
    visual: null
  }
];

export default function SportsMemorials() {
  const [activeTab, setActiveTab] = useState("athletes");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null);
  const { toast } = useToast();

  // Fetch athletes from API
  const { data: athletes = [], isLoading: athletesLoading } = useQuery({
    queryKey: ['/api/athlete-profiles'],
    enabled: activeTab === "athletes",
  });

  // Fetch teams from API
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['/api/team-memorials'],
    enabled: activeTab === "teams",
  });

  // Fetch hall of fame entries from API
  const { data: hallOfFameEntries = [], isLoading: hallOfFameLoading } = useQuery({
    queryKey: ['/api/hall-of-fame'],
    enabled: activeTab === "hall-of-fame",
  });

  // Use sample data as fallback if API is empty
  const displayAthletes = athletes.length > 0 ? athletes : sampleAthletes;
  const displayTeams = teams.length > 0 ? teams : [];

  // Form state for creating athlete memorial
  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    position: "",
    jerseyNumber: "",
    birthDate: "",
    retiredDate: "",
    biography: "",
    teams: [] as string[],
    achievements: [] as string[]
  });

  // Create athlete profile mutation
  const createAthleteMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/athlete-profiles", {
        memorialId: "", // This should be linked to an existing memorial
        sport: data.sport,
        level: "professional",
        position: data.position,
        jerseyNumber: data.jerseyNumber,
        teams: data.teams.map(team => ({
          teamName: team,
          startYear: new Date().getFullYear() - 10,
          endYear: new Date().getFullYear(),
        })),
        careerStart: data.birthDate ? new Date(data.birthDate).toISOString() : undefined,
        careerEnd: data.retiredDate ? new Date(data.retiredDate).toISOString() : undefined,
        achievements: data.achievements,
        biography: data.biography,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Memorial Created",
        description: `Athletic memorial for ${formData.name} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/athlete-profiles'] });
      // Trigger legacy score calculation
      if (data.id) {
        calculateLegacyScoreMutation.mutate(data.id);
      }
      setCreateModalOpen(false);
      setFormData({
        name: "",
        sport: "",
        position: "",
        jerseyNumber: "",
        birthDate: "",
        retiredDate: "",
        biography: "",
        teams: [],
        achievements: []
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create athletic memorial.",
        variant: "destructive",
      });
    },
  });

  // Calculate legacy score mutation
  const calculateLegacyScoreMutation = useMutation({
    mutationFn: async (athleteId: string) => {
      const response = await apiRequest("GET", `/api/legacy-score/${athleteId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/athlete-profiles'] });
    },
  });

  const handleCreateMemorial = () => {
    createAthleteMutation.mutate(formData);
  };

  const calculateLegacyScore = (stats: Record<string, string>) => {
    // Simplified legacy score calculation
    const values = Object.values(stats).map(v => parseInt(v.replace(/[^0-9]/g, '')) || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.min(100, Math.floor(avg / 100));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sports Memorials
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Honor the legends of sports. Celebrate athletic excellence, team dynasties, and the moments that defined generations.
            </p>
            <Button 
              size="lg" 
              onClick={() => setCreateModalOpen(true)}
              data-testid="button-create-athlete-memorial"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Create Athlete Memorial
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="athletes" data-testid="tab-athletes">
              <Medal className="w-4 h-4 mr-2" />
              Athletes
            </TabsTrigger>
            <TabsTrigger value="teams" data-testid="tab-teams">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="hall-of-fame" data-testid="tab-hall-of-fame">
              <Crown className="w-4 h-4 mr-2" />
              Hall of Fame
            </TabsTrigger>
            <TabsTrigger value="jersey-retirements" data-testid="tab-jersey-retirements">
              <Hash className="w-4 h-4 mr-2" />
              Jersey Retirements
            </TabsTrigger>
          </TabsList>

          {/* Athletes Tab */}
          <TabsContent value="athletes" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search athletes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-athletes"
                />
              </div>
              <Select value={selectedSport} onValueChange={setSelectedSport} data-testid="select-sport-filter">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="hockey">Hockey</SelectItem>
                  <SelectItem value="soccer">Soccer</SelectItem>
                  <SelectItem value="golf">Golf</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Athlete Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleAthletes.map((athlete) => (
                <Card key={athlete.id} className="hover-elevate" data-testid={`card-athlete-${athlete.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={athlete.photo} alt={athlete.name} />
                          <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{athlete.name}</CardTitle>
                          <CardDescription>{athlete.sport} • #{athlete.jerseyNumber}</CardDescription>
                        </div>
                      </div>
                      {athlete.hallOfFame.inducted && (
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20">
                          <Award className="w-3 h-3 mr-1" />
                          HOF
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Legacy Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Athletic Legacy Score</span>
                        <span className="font-semibold">{athlete.legacyScore}/100</span>
                      </div>
                      <Progress value={athlete.legacyScore} className="h-2" />
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(athlete.stats).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Teams Timeline */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Career Timeline</p>
                      {athlete.teams.map((team, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-2">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span>{team.name}</span>
                          <span className="text-muted-foreground">({team.years})</span>
                          {team.championships > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {team.championships} Championships
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Media Links */}
                    <div className="flex gap-2">
                      {athlete.mediaLinks.map((link, idx) => (
                        <Button 
                          key={idx}
                          variant="outline" 
                          size="sm"
                          data-testid={`button-media-${athlete.id}-${idx}`}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          {link.type === 'highlights' ? 'Highlights' : 
                           link.type === 'documentary' ? 'Documentary' : 'Interview'}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedAthlete(athlete)}
                      data-testid={`button-view-profile-${athlete.id}`}
                    >
                      View Full Profile
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Stats to Story Engine */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Stats-to-Story Engine
                </CardTitle>
                <CardDescription>
                  Converting raw statistics into memorable narratives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsToStories.map((story, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{story.visual}</div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1">{story.athlete}</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {story.stat}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {story.story}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Select value={selectedLevel} onValueChange={setSelectedLevel} data-testid="select-level-filter">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="olympic">Olympic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSport} onValueChange={setSelectedSport} data-testid="select-team-sport-filter">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="basketball">Basketball</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="baseball">Baseball</SelectItem>
                  <SelectItem value="hockey">Hockey</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team Memorial Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleTeams.map((team) => (
                <Card key={team.id} className="hover-elevate" data-testid={`card-team-${team.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl">{team.logo}</div>
                      <Badge variant={team.level === "Professional" ? "default" : "secondary"}>
                        {team.level}
                      </Badge>
                    </div>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.sport} • {team.season}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold">{team.championship}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Achievements</p>
                      <ul className="space-y-1">
                        {team.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-1">
                            <Star className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Notable Members</p>
                      <div className="flex flex-wrap gap-1">
                        {team.notableMembers.map((member, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" data-testid={`button-view-roster-${team.id}`}>
                      View Full Roster
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hall of Fame Tab */}
          <TabsContent value="hall-of-fame" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                  Hall of Fame Inductees
                </CardTitle>
                <CardDescription>
                  Celebrating the greatest athletes of all time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {sampleAthletes.filter(a => a.hallOfFame.inducted).map((athlete) => (
                    <div key={athlete.id} className="flex items-start gap-4 p-4 border rounded-lg hover-elevate" data-testid={`hof-athlete-${athlete.id}`}>
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={athlete.photo} alt={athlete.name} />
                        <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{athlete.name}</h3>
                        <p className="text-sm text-muted-foreground">{athlete.sport} • {athlete.position}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Inducted:</span>{' '}
                            <span className="font-medium">{athlete.hallOfFame.year}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Location:</span>{' '}
                            <span className="font-medium">{athlete.hallOfFame.location}</span>
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {athlete.achievements.slice(0, 3).map((achievement, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" data-testid={`button-hof-details-${athlete.id}`}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jersey Retirements Tab */}
          <TabsContent value="jersey-retirements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-6 h-6" />
                  Retired Jersey Numbers
                </CardTitle>
                <CardDescription>
                  Virtual jersey retirement ceremonies and honors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {retiredJerseys.map((jersey) => (
                    <div key={jersey.id} className="p-4 border rounded-lg hover-elevate" data-testid={`jersey-${jersey.id}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">#{jersey.number}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{jersey.playerName}</h3>
                            <p className="text-sm text-muted-foreground">{jersey.team}</p>
                            <div className="mt-1 flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {jersey.retirementDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {jersey.ceremony}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" data-testid={`button-watch-ceremony-${jersey.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          Watch Ceremony
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Athlete Memorial Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Athlete Memorial</DialogTitle>
            <DialogDescription>
              Honor an athlete's legacy by creating a comprehensive memorial
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="athlete-name">Athlete Name</Label>
                <Input
                  id="athlete-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                  data-testid="input-athlete-name"
                />
              </div>
              <div>
                <Label htmlFor="jersey-number">Jersey Number</Label>
                <Input
                  id="jersey-number"
                  value={formData.jerseyNumber}
                  onChange={(e) => setFormData({...formData, jerseyNumber: e.target.value})}
                  placeholder="#23"
                  data-testid="input-jersey-number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sport">Sport</Label>
                <Select 
                  value={formData.sport} 
                  onValueChange={(value) => setFormData({...formData, sport: value})}
                >
                  <SelectTrigger id="sport" data-testid="select-sport">
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="baseball">Baseball</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="hockey">Hockey</SelectItem>
                    <SelectItem value="soccer">Soccer</SelectItem>
                    <SelectItem value="golf">Golf</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="e.g., Point Guard"
                  data-testid="input-position"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birth-date">Birth Date</Label>
                <Input
                  id="birth-date"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  data-testid="input-birth-date"
                />
              </div>
              <div>
                <Label htmlFor="retired-date">Retirement Date</Label>
                <Input
                  id="retired-date"
                  type="date"
                  value={formData.retiredDate}
                  onChange={(e) => setFormData({...formData, retiredDate: e.target.value})}
                  data-testid="input-retired-date"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="biography">Biography</Label>
              <Textarea
                id="biography"
                value={formData.biography}
                onChange={(e) => setFormData({...formData, biography: e.target.value})}
                placeholder="Share the athlete's story, career highlights, and legacy..."
                rows={4}
                data-testid="textarea-biography"
              />
            </div>

            <Separator />

            <div>
              <Label>Career Statistics (Sport-Specific)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add relevant statistics based on the selected sport
              </p>
              {formData.sport === "basketball" && (
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Points" data-testid="input-stat-points" />
                  <Input placeholder="Rebounds" data-testid="input-stat-rebounds" />
                  <Input placeholder="Assists" data-testid="input-stat-assists" />
                </div>
              )}
              {formData.sport === "football" && (
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Passing Yards" data-testid="input-stat-yards" />
                  <Input placeholder="Touchdowns" data-testid="input-stat-touchdowns" />
                  <Input placeholder="Completions" data-testid="input-stat-completions" />
                </div>
              )}
              {!formData.sport && (
                <p className="text-sm text-muted-foreground italic">Select a sport to see relevant statistics fields</p>
              )}
            </div>

            <div>
              <Label>Initial Legacy Score Calculation</Label>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Calculated Legacy Score</span>
                  <span className="text-2xl font-bold">75/100</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Based on championships, awards, statistics, and career longevity
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} data-testid="button-cancel-create">
              Cancel
            </Button>
            <Button onClick={handleCreateMemorial} data-testid="button-submit-create">
              Create Memorial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Athlete Detail Modal */}
      {selectedAthlete && (
        <Dialog open={!!selectedAthlete} onOpenChange={() => setSelectedAthlete(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAthlete.photo} alt={selectedAthlete.name} />
                  <AvatarFallback>{selectedAthlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl">{selectedAthlete.name}</DialogTitle>
                  <DialogDescription className="text-base">
                    {selectedAthlete.sport} • {selectedAthlete.position} • #{selectedAthlete.jerseyNumber}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="mt-6">
              <div className="space-y-6">
                {/* Legacy Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Athletic Legacy Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl font-bold">{selectedAthlete.legacyScore}/100</span>
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <Progress value={selectedAthlete.legacyScore} className="h-3" />
                  </CardContent>
                </Card>

                {/* Career Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Career Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(selectedAthlete.stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="text-sm text-muted-foreground">{key}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Achievements & Awards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedAthlete.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hall of Fame Status */}
                {selectedAthlete.hallOfFame.inducted && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Hall of Fame
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><span className="text-muted-foreground">Inducted:</span> {selectedAthlete.hallOfFame.year}</p>
                        <p><span className="text-muted-foreground">Location:</span> {selectedAthlete.hallOfFame.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}