import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Scale, Users, Brain, FileText, Edit, Save, Play } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Mock data for development
const mockMediation = {
  id: "1",
  title: "Business Partnership Dispute",
  category: "business",
  description: "Disagreement over company direction and resource allocation between co-founders",
  status: "active",
  fairnessScore: null,
  party1Name: "John Smith",
  party1Email: "john@example.com",
  party1Perspective: "I believe the company should focus on product development and innovation. We've been investing too much in marketing without having a solid product foundation. My partner wants to spend more on advertising, but I think we need to perfect our core offering first. This disagreement has been ongoing for months and is affecting our ability to make decisions.",
  party2Name: "Jane Doe",
  party2Email: "jane@example.com",
  party2Perspective: "Marketing is essential for growth. We have a good enough product, but nobody knows about it. John wants to keep building features that users aren't asking for. I believe we should invest in customer acquisition now while we have funding. The product can be improved based on real customer feedback rather than assumptions.",
  desiredOutcome: "Find a balanced approach that allows for both product development and marketing efforts",
  additionalContext: "We've been business partners for 3 years and have generally worked well together until this disagreement.",
  confidentialityLevel: "standard",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T14:30:00Z",
};

export default function ByusMediationDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerspectives, setEditedPerspectives] = useState({
    party1: "",
    party2: "",
  });

  // Fetch mediation details
  const { data: mediation = mockMediation, isLoading } = useQuery({
    queryKey: [`/api/byus/mediations/${id}`],
    enabled: false, // Using mock data for now
  });

  // Update mediation mutation
  const updateMutation = useMutation({
    mutationFn: (updates: any) =>
      apiRequest(`/api/byus/mediations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/byus/mediations/${id}`] });
      toast({
        title: "Mediation updated",
        description: "The perspectives have been saved.",
      });
      setIsEditing(false);
    },
  });

  // Request AI analysis mutation
  const analysisMutation = useMutation({
    mutationFn: () =>
      apiRequest(`/api/byus/mediations/${id}/analyze`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/byus/mediations/${id}`] });
      toast({
        title: "Analysis started",
        description: "AI is analyzing the mediation. This may take a few moments.",
      });
      setTimeout(() => {
        setLocation(`/byus/analysis/${id}`);
      }, 2000);
    },
  });

  const handleEdit = () => {
    setEditedPerspectives({
      party1: mediation.party1Perspective,
      party2: mediation.party2Perspective,
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      party1Perspective: editedPerspectives.party1,
      party2Perspective: editedPerspectives.party2,
    });
  };

  const handleAnalyze = async () => {
    await analysisMutation.mutateAsync();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; text: string }> = {
      draft: { variant: "secondary", text: "Draft" },
      active: { variant: "default", text: "Active" },
      analyzing: { variant: "default", text: "Analyzing" },
      complete: { variant: "default", text: "Complete" },
    };
    
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="byus-theme min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading mediation details...</p>
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
              <Link href="/byus/dashboard">
                <Button variant="ghost" size="icon" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{mediation.title}</h1>
                <p className="text-muted-foreground">
                  Created {new Date(mediation.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(mediation.status)}
              {mediation.status === "active" && !isEditing && (
                <Button onClick={handleAnalyze} disabled={analysisMutation.isPending} data-testid="button-analyze">
                  <Brain className="w-4 h-4 mr-2" />
                  {analysisMutation.isPending ? "Analyzing..." : "Run AI Analysis"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p className="capitalize">{mediation.category}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <p>{mediation.description}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Desired Outcome</Label>
              <p>{mediation.desiredOutcome}</p>
            </div>
            {mediation.additionalContext && (
              <div>
                <Label className="text-sm text-muted-foreground">Additional Context</Label>
                <p>{mediation.additionalContext}</p>
              </div>
            )}
            <div>
              <Label className="text-sm text-muted-foreground">Confidentiality Level</Label>
              <Badge variant="outline" className="capitalize">
                {mediation.confidentialityLevel}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Perspectives Tabs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Perspectives
              </CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={handleEdit} data-testid="button-edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Perspectives
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    data-testid="button-save"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="party1" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="party1" data-testid="tab-party1">
                  {mediation.party1Name}
                </TabsTrigger>
                <TabsTrigger value="party2" data-testid="tab-party2">
                  {mediation.party2Name}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="party1" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="font-medium">{mediation.party1Name}</p>
                  </div>
                  {mediation.party1Email && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p>{mediation.party1Email}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm text-muted-foreground">Perspective</Label>
                    {isEditing ? (
                      <Textarea
                        className="mt-2 min-h-[200px]"
                        value={editedPerspectives.party1}
                        onChange={(e) =>
                          setEditedPerspectives({
                            ...editedPerspectives,
                            party1: e.target.value,
                          })
                        }
                        data-testid="textarea-party1-edit"
                      />
                    ) : (
                      <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                        {mediation.party1Perspective}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="party2" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="font-medium">{mediation.party2Name}</p>
                  </div>
                  {mediation.party2Email && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p>{mediation.party2Email}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm text-muted-foreground">Perspective</Label>
                    {isEditing ? (
                      <Textarea
                        className="mt-2 min-h-[200px]"
                        value={editedPerspectives.party2}
                        onChange={(e) =>
                          setEditedPerspectives({
                            ...editedPerspectives,
                            party2: e.target.value,
                          })
                        }
                        data-testid="textarea-party2-edit"
                      />
                    ) : (
                      <div className="mt-2 p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                        {mediation.party2Perspective}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {mediation.status === "complete" && (
          <div className="mt-6 flex justify-center">
            <Link href={`/byus/analysis/${id}`}>
              <Button size="lg" data-testid="button-view-analysis">
                <Brain className="w-4 h-4 mr-2" />
                View AI Analysis
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing Label import
import { Label } from "@/components/ui/label";