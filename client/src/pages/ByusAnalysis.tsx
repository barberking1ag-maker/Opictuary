import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "wouter";
import { ArrowLeft, Scale, Brain, TrendingUp, Users, Target, AlertCircle, CheckCircle, Download, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Mock analysis data for development
const mockAnalysis = {
  id: "1",
  mediationId: "1",
  mediationTitle: "Business Partnership Dispute",
  fairnessScore: 85,
  party1BiasScore: 15,
  party2BiasScore: 12,
  confidence: 92,
  suggestedSolution: "Based on the analysis of both perspectives, I recommend a phased approach that addresses both parties' concerns:\n\n1. **Immediate Action (Month 1-2):** Allocate 60% of resources to finalizing core product features that are already in development, while dedicating 40% to targeted marketing campaigns for existing features.\n\n2. **Short-term (Month 3-4):** Conduct customer interviews and gather feedback to validate product-market fit. Use this data to inform both product development and marketing strategies.\n\n3. **Medium-term (Month 5-6):** Based on customer feedback, create a balanced roadmap where product improvements are directly tied to customer needs, and marketing efforts focus on proven value propositions.\n\n4. **Long-term:** Establish a quarterly review process where both partners assess metrics from product development and marketing to make data-driven decisions about resource allocation.",
  keyPoints: [
    "Both parties share the same goal of company success but differ on the path",
    "John's concern about product quality has merit - 73% of startups fail due to poor product-market fit",
    "Jane's emphasis on marketing is validated - customer acquisition is critical for growth",
    "The conflict stems from limited resources rather than fundamental disagreement"
  ],
  compromiseAreas: [
    {
      area: "Resource Allocation",
      suggestion: "Start with 60/40 split favoring product, then adjust based on metrics"
    },
    {
      area: "Decision Making",
      suggestion: "Implement data-driven decision framework with clear KPIs for both areas"
    },
    {
      area: "Communication",
      suggestion: "Weekly sync meetings to review progress and adjust priorities together"
    },
    {
      area: "Timeline",
      suggestion: "Set 3-month trial period for balanced approach, then reassess"
    }
  ],
  emotionalFactors: [
    {
      factor: "Trust",
      impact: "Both parties feel unheard, leading to entrenchment in positions"
    },
    {
      factor: "Fear",
      impact: "John fears product failure; Jane fears missing market opportunity"
    },
    {
      factor: "Frustration",
      impact: "Months of disagreement have created emotional fatigue"
    }
  ],
  legalConsiderations: "Review partnership agreement for decision-making protocols. Consider adding mediation clause for future disputes. Document agreed resource allocation to prevent future conflicts.",
  nextSteps: [
    "Schedule a meeting to review this analysis together",
    "Create a detailed 6-month roadmap incorporating the suggested approach",
    "Define clear metrics for both product quality and marketing effectiveness",
    "Establish weekly check-ins to maintain alignment",
    "Consider bringing in a neutral advisor for quarterly reviews"
  ],
  createdAt: "2024-01-15T15:00:00Z"
};

export default function ByusAnalysis() {
  const { id } = useParams();

  // Fetch analysis data
  const { data: analysis = mockAnalysis, isLoading } = useQuery({
    queryKey: [`/api/byus/analysis/${id}`],
    enabled: false, // Using mock data for now
  });

  const getFairnessColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBiasLevel = (score: number) => {
    if (score <= 10) return { text: "Very Low", color: "text-green-600" };
    if (score <= 20) return { text: "Low", color: "text-green-600" };
    if (score <= 40) return { text: "Moderate", color: "text-yellow-600" };
    if (score <= 60) return { text: "High", color: "text-orange-600" };
    return { text: "Very High", color: "text-red-600" };
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    console.log("Exporting analysis as PDF...");
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    console.log("Sharing analysis...");
  };

  if (isLoading) {
    return (
      <div className="byus-theme min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Analyzing perspectives...</p>
          <p className="text-muted-foreground">This may take a few moments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="byus-theme min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/byus/mediation/${analysis.mediationId}`}>
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">AI Analysis Results</h1>
                <p className="text-muted-foreground">{analysis.mediationTitle}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleShare} data-testid="button-share">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleExport} data-testid="button-export">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Fairness Score Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Fairness Assessment
            </CardTitle>
            <CardDescription>
              AI-generated fairness metrics based on both perspectives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getFairnessColor(analysis.fairnessScore)}`}>
                  {analysis.fairnessScore}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Fairness Score</p>
                <Progress 
                  value={analysis.fairnessScore} 
                  className="mt-2"
                  data-testid="progress-fairness"
                />
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2">
                  <span className={getBiasLevel(analysis.party1BiasScore).color}>
                    {analysis.party1BiasScore}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Party 1 Bias Detection</p>
                <Badge variant="outline" className="mt-2">
                  {getBiasLevel(analysis.party1BiasScore).text}
                </Badge>
              </div>

              <div className="text-center">
                <div className="text-2xl font-semibold mb-2">
                  <span className={getBiasLevel(analysis.party2BiasScore).color}>
                    {analysis.party2BiasScore}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Party 2 Bias Detection</p>
                <Badge variant="outline" className="mt-2">
                  {getBiasLevel(analysis.party2BiasScore).text}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Confidence Level: {analysis.confidence}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Solution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recommended Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-foreground">
                {analysis.suggestedSolution}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Points */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Key Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-3" data-testid={`keypoint-${index}`}>
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Compromise Areas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Areas for Compromise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.compromiseAreas.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg" data-testid={`compromise-${index}`}>
                  <h4 className="font-semibold mb-2">{item.area}</h4>
                  <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emotional Factors */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emotional Considerations
            </CardTitle>
            <CardDescription>
              Understanding the emotional dynamics can help resolve conflicts more effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.emotionalFactors.map((item, index) => (
                <div key={index} className="flex gap-4" data-testid={`emotion-${index}`}>
                  <div className="w-24 font-medium">{item.factor}:</div>
                  <div className="flex-1 text-muted-foreground">{item.impact}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legal Considerations */}
        {analysis.legalConsiderations && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Legal Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.legalConsiderations}</p>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {analysis.nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3" data-testid={`nextstep-${index}`}>
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/byus/dashboard">
            <Button variant="outline" data-testid="button-dashboard">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/byus/create">
            <Button data-testid="button-new-mediation">
              Start New Mediation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}