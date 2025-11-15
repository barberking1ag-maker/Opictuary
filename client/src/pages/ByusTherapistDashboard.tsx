import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { 
  Search, 
  Users, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  FileText,
  Shield,
  Brain 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mock therapist data for development
const mockTherapist = {
  id: "therapist-1",
  email: "dr.smith@therapy.com",
  firstName: "Dr. Sarah",
  lastName: "Smith",
  licenseNumber: "PSY-2024-001",
  specialty: "Conflict Resolution & Family Therapy",
  qualifications: "Ph.D. Clinical Psychology, Certified Mediator",
  bio: "20 years of experience in family therapy and conflict resolution",
  hourlyRate: "150",
  isActive: true,
};

// Mock reviews data for development
const mockPendingReviews = [
  {
    id: "review-1",
    mediationId: "med-1",
    therapistId: "therapist-1",
    reviewStatus: "pending",
    createdAt: "2024-01-18T10:00:00Z",
    mediation: {
      id: "med-1",
      title: "Family Property Division",
      category: "family",
      party1Name: "John Smith",
      party2Name: "Jane Smith",
      description: "Divorce settlement property division",
      aiAnalysis: "AI has suggested an equitable division based on contribution history...",
      fairnessScore: 78,
    }
  },
  {
    id: "review-2",
    mediationId: "med-2",
    therapistId: "therapist-1",
    reviewStatus: "pending",
    createdAt: "2024-01-19T14:00:00Z",
    mediation: {
      id: "med-2",
      title: "Business Partnership Dispute",
      category: "business",
      party1Name: "ABC Corp",
      party2Name: "XYZ Inc",
      description: "Contract breach and compensation dispute",
      aiAnalysis: "Analysis suggests a settlement amount of $50,000...",
      fairnessScore: 82,
    }
  },
];

const mockCompletedReviews = [
  {
    id: "review-3",
    mediationId: "med-3",
    therapistId: "therapist-1",
    reviewStatus: "approved",
    reviewedAt: "2024-01-15T10:00:00Z",
    validationScore: 92,
    therapistNotes: "The AI analysis is thorough and fair. Recommendations are sound.",
    mediation: {
      title: "Custody Arrangement",
      category: "family",
    }
  },
  {
    id: "review-4",
    mediationId: "med-4",
    therapistId: "therapist-1",
    reviewStatus: "needs_revision",
    reviewedAt: "2024-01-14T10:00:00Z",
    validationScore: 65,
    therapistNotes: "Needs more consideration of emotional factors.",
    mediation: {
      title: "Workplace Conflict",
      category: "business",
    }
  },
];

export default function ByusTherapistDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("pending");

  // Fetch therapist profile and reviews
  const { data: pendingReviews = mockPendingReviews, isLoading: loadingPending } = useQuery({
    queryKey: ["/api/byus/therapist/pending-reviews", { therapistId: mockTherapist.id }],
    enabled: false, // Using mock data for now
  });

  const { data: completedReviews = mockCompletedReviews, isLoading: loadingCompleted } = useQuery({
    queryKey: ["/api/byus/therapist/completed-reviews", { therapistId: mockTherapist.id }],
    enabled: false, // Using mock data for now
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; text: string; className?: string }> = {
      pending: { variant: "secondary", icon: Clock, text: "Pending Review" },
      reviewing: { variant: "default", icon: FileText, text: "Under Review", className: "text-blue-600" },
      approved: { variant: "default", icon: CheckCircle2, text: "Approved", className: "text-green-600 border-green-600" },
      needs_revision: { variant: "destructive", icon: AlertCircle, text: "Needs Revision" },
    };
    
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className || ''}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </Badge>
    );
  };

  const getValidationScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const stats = {
    pendingCount: pendingReviews.length,
    completedCount: completedReviews.length,
    approvalRate: completedReviews.length > 0 
      ? Math.round((completedReviews.filter(r => r.reviewStatus === 'approved').length / completedReviews.length) * 100)
      : 0,
    averageScore: completedReviews.length > 0
      ? Math.round(completedReviews.reduce((acc, r) => acc + (r.validationScore || 0), 0) / completedReviews.length)
      : 0,
  };

  return (
    <div className="byus-theme min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Professional Review Dashboard</h1>
                <p className="text-muted-foreground">Review and validate AI-mediated solutions</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300">
              <Award className="w-4 h-4 mr-1" />
              Licensed Therapist
            </Badge>
          </div>

          {/* Therapist Info Card */}
          <Card className="mt-6 border-green-200 dark:border-green-800">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {mockTherapist.firstName} {mockTherapist.lastName}
                    </CardTitle>
                    <CardDescription>
                      {mockTherapist.specialty} • License: {mockTherapist.licenseNumber}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  ${mockTherapist.hourlyRate}/hour
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card data-testid="stat-pending">
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-completed">
            <CardHeader className="pb-2">
              <CardDescription>Completed Reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedCount}</div>
            </CardContent>
          </Card>

          <Card data-testid="stat-approval">
            <CardHeader className="pb-2">
              <CardDescription>Approval Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getValidationScoreColor(stats.approvalRate)}`}>
                {stats.approvalRate}%
              </div>
            </CardContent>
          </Card>

          <Card data-testid="stat-score">
            <CardHeader className="pb-2">
              <CardDescription>Avg. Validation Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getValidationScoreColor(stats.averageScore)}`}>
                {stats.averageScore}/100
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({stats.pendingCount})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({stats.completedCount})
            </TabsTrigger>
          </TabsList>

          {/* Pending Reviews */}
          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {pendingReviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <p className="text-muted-foreground">No pending reviews</p>
                  </CardContent>
                </Card>
              ) : (
                pendingReviews.map((review) => (
                  <Card key={review.id} className="hover-elevate">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {review.mediation.title}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            <span className="font-medium">Parties:</span> {review.mediation.party1Name} vs {review.mediation.party2Name}
                          </CardDescription>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">
                              {review.mediation.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              AI Fairness Score: {review.mediation.fairnessScore}%
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Submitted: {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(review.reviewStatus)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {review.mediation.description}
                      </p>
                      <Link href={`/byus/review/${review.id}`}>
                        <Button data-testid={`button-review-${review.id}`} className="w-full sm:w-auto">
                          <FileText className="w-4 h-4 mr-2" />
                          Start Professional Review
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Completed Reviews */}
          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedReviews.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No completed reviews yet</p>
                  </CardContent>
                </Card>
              ) : (
                completedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {review.mediation.title}
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">
                              {review.mediation.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Reviewed: {new Date(review.reviewedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(review.reviewStatus)}
                          <Badge 
                            variant="outline" 
                            className={`${getValidationScoreColor(review.validationScore)} border-current`}
                          >
                            <Star className="w-3 h-3 mr-1" />
                            {review.validationScore}/100
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Your Notes:</span> {review.therapistNotes}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}