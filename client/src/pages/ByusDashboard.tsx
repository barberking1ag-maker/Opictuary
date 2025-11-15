import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { Plus, Scale, FileText, Clock, CheckCircle, Search, TrendingUp, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mock data for development
const mockMediations = [
  {
    id: "1",
    title: "Business Partnership Dispute",
    category: "business",
    status: "complete",
    fairnessScore: 85,
    createdAt: "2024-01-15",
    party1Name: "John Smith",
    party2Name: "Jane Doe",
  },
  {
    id: "2",
    title: "Family Property Division",
    category: "family",
    status: "analyzing",
    fairnessScore: null,
    createdAt: "2024-01-18",
    party1Name: "Sarah Johnson",
    party2Name: "Mike Johnson",
  },
  {
    id: "3",
    title: "Contract Negotiation",
    category: "business",
    status: "draft",
    fairnessScore: null,
    createdAt: "2024-01-20",
    party1Name: "ABC Corp",
    party2Name: "XYZ Inc",
  },
];

export default function ByusDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  // Fetch user's mediations
  const { data: mediations = mockMediations, isLoading } = useQuery({
    queryKey: ["/api/byus/mediations"],
    enabled: false, // Using mock data for now
  });

  const filteredMediations = mediations.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.party1Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.party2Name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === "all") return matchesSearch;
    return matchesSearch && m.status === selectedTab;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; text: string }> = {
      draft: { variant: "secondary", icon: FileText, text: "Draft" },
      active: { variant: "default", icon: Clock, text: "Active" },
      analyzing: { variant: "default", icon: TrendingUp, text: "Analyzing" },
      complete: { variant: "default", icon: CheckCircle, text: "Complete" },
    };
    
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getFairnessColor = (score: number | null) => {
    if (!score) return "";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const stats = {
    total: mediations.length,
    active: mediations.filter(m => m.status === "active" || m.status === "analyzing").length,
    completed: mediations.filter(m => m.status === "complete").length,
    averageFairness: Math.round(
      mediations
        .filter(m => m.fairnessScore !== null)
        .reduce((acc, m) => acc + (m.fairnessScore || 0), 0) / 
      mediations.filter(m => m.fairnessScore !== null).length || 0
    ),
  };

  return (
    <div className="byus-theme min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">BYUS Mediator Dashboard</h1>
                <p className="text-muted-foreground">Manage your mediations</p>
              </div>
            </div>
            <Link href="/byus/create">
              <Button data-testid="button-new-mediation">
                <Plus className="w-4 h-4 mr-2" />
                New Mediation
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="stat-total">
            <CardHeader className="pb-2">
              <CardDescription>Total Mediations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-active">
            <CardHeader className="pb-2">
              <CardDescription>Active</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.active}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-completed">
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-fairness">
            <CardHeader className="pb-2">
              <CardDescription>Avg. Fairness Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getFairnessColor(stats.averageFairness)}`}>
                {stats.averageFairness}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search mediations..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-mediations"
              />
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="draft" data-testid="tab-draft">Drafts</TabsTrigger>
              <TabsTrigger value="active" data-testid="tab-active">Active</TabsTrigger>
              <TabsTrigger value="analyzing" data-testid="tab-analyzing">Analyzing</TabsTrigger>
              <TabsTrigger value="complete" data-testid="tab-complete">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Mediations List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span>Loading mediations...</span>
            </div>
          </div>
        ) : filteredMediations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Scale className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No mediations found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Create your first mediation to get started"}
              </p>
              {!searchTerm && (
                <Link href="/byus/create">
                  <Button data-testid="button-create-first">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Mediation
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMediations.map((mediation) => (
              <Card key={mediation.id} className="hover-elevate" data-testid={`card-mediation-${mediation.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{mediation.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {mediation.party1Name} & {mediation.party2Name}
                        </span>
                        <span>{new Date(mediation.createdAt).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {mediation.fairnessScore && (
                        <div className={`text-lg font-semibold ${getFairnessColor(mediation.fairnessScore)}`}>
                          {mediation.fairnessScore}%
                        </div>
                      )}
                      {getStatusBadge(mediation.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Link href={`/byus/mediation/${mediation.id}`}>
                      <Button variant="outline" size="sm" data-testid={`button-view-${mediation.id}`}>
                        View Details
                      </Button>
                    </Link>
                    {mediation.status === "draft" && (
                      <Link href={`/byus/mediation/${mediation.id}/edit`}>
                        <Button variant="outline" size="sm" data-testid={`button-continue-${mediation.id}`}>
                          Continue Editing
                        </Button>
                      </Link>
                    )}
                    {mediation.status === "complete" && (
                      <Link href={`/byus/analysis/${mediation.id}`}>
                        <Button variant="outline" size="sm" data-testid={`button-analysis-${mediation.id}`}>
                          View Analysis
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}