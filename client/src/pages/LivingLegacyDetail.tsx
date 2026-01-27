import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, Heart, BookOpen, Award, MapPin, Calendar, 
  Lock, Globe, Briefcase, Quote, ArrowLeft, Edit, Share2
} from "lucide-react";
import type { LivingLegacy, User } from "@shared/schema";

export default function LivingLegacyDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const { data: legacy, isLoading, error } = useQuery<LivingLegacy>({
    queryKey: ["/api/living-legacies", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !legacy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-lg mx-auto text-center">
            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <CardTitle>Legacy Not Found</CardTitle>
                <CardDescription>
                  This living legacy doesn't exist or you don't have permission to view it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild data-testid="button-back-to-legacy">
                  <Link href="/living-legacy">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Living Legacy
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && legacy.userId === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild data-testid="button-back-legacy-list">
              <Link href="/living-legacy">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Living Legacy
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl">{legacy.fullName}</CardTitle>
                    {legacy.occupation && (
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Briefcase className="h-4 w-4" />
                        {legacy.occupation}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={legacy.isPublic ? "default" : "secondary"}>
                    {legacy.isPublic ? (
                      <><Globe className="h-3 w-3 mr-1" /> Public</>
                    ) : (
                      <><Lock className="h-3 w-3 mr-1" /> Private</>
                    )}
                  </Badge>
                  {isOwner && (
                    <Button variant="outline" size="sm" data-testid="button-edit-legacy">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {legacy.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {legacy.location}
                  </div>
                )}
                {legacy.birthDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Born: {new Date(legacy.birthDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Legacy Completion</span>
                  <span className="text-purple-600 font-semibold">{legacy.completionPercentage || 0}%</span>
                </div>
                <Progress value={legacy.completionPercentage || 0} className="h-3" />
              </div>

              {legacy.favoriteQuote && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
                  <div className="flex items-start gap-2">
                    <Quote className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <p className="italic text-muted-foreground">"{legacy.favoriteQuote}"</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {legacy.biography && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{legacy.biography}</p>
              </CardContent>
            </Card>
          )}

          {legacy.lifePhilosophy && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  Life Philosophy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{legacy.lifePhilosophy}</p>
              </CardContent>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Achievements & Milestones
              </CardTitle>
              <CardDescription>
                Life accomplishments and memorable moments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No achievements documented yet.</p>
                {isOwner && (
                  <Button variant="outline" className="mt-4" data-testid="button-add-achievement">
                    Add Achievement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {isOwner && (
            <div className="flex justify-center gap-4">
              <Button variant="outline" data-testid="button-share-legacy">
                <Share2 className="h-4 w-4 mr-2" />
                Share Legacy
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
