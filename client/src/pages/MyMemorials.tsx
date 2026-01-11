import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Calendar, Users, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { usePlatform } from "@/hooks/usePlatform";
import { useHaptics } from "@/hooks/useHaptics";
import { NativeHeader } from "@/components/NativeHeader";
import { PullToRefresh } from "@/components/PullToRefresh";
import { SkeletonCard, SkeletonList } from "@/components/SkeletonCard";

export default function MyMemorials() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { isMobile } = usePlatform();
  const { notification } = useHaptics();
  const queryClient = useQueryClient();

  const { data: memorials = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ['/api/user/memorials'],
    enabled: isAuthenticated,
  });

  const handleRefresh = async () => {
    await refetch();
    notification('success');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {isMobile && <NativeHeader title="My Memorials" showBack={false} />}
        <div className="py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {!isMobile && (
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1">
                  <div className="h-9 w-64 mb-2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-10 w-40 bg-muted rounded animate-pulse" />
              </div>
            )}
            
            <div className="space-y-4" data-testid="loading-skeletons">
              <SkeletonList count={6} variant="list" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              Please login to view your memorials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/api/login'} className="w-full">
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memorialsList = (
    <>
      {memorials.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Memorials Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't created any memorials yet. Start by creating your first memorial.
            </p>
            <Link href="/create-memorial">
              <Button data-testid="button-create-first-memorial">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Memorial
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memorials.map((memorial: any) => (
            <Card key={memorial.id} className="hover-elevate active:scale-[0.98] transition-transform" data-testid={`card-memorial-${memorial.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{memorial.name}</CardTitle>
                  {memorial.isPublic ? (
                    <Badge variant="secondary" className="shrink-0">Public</Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0">Private</Badge>
                  )}
                </div>
                <CardDescription>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    {memorial.birthDate} — {memorial.deathDate}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Memories</p>
                    <p className="font-medium">{memorial.memoryCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Condolences</p>
                    <p className="font-medium">{memorial.condolenceCount || 0}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <a href={`/memorial/${memorial.id}`} target="_blank" rel="noopener noreferrer" data-testid={`button-view-${memorial.id}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </a>
                  </Button>
                  <Link href={`/memorials/${memorial.id}/manage`}>
                    <Button variant="default" className="flex-1" data-testid={`button-manage-${memorial.id}`}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <NativeHeader 
          title="My Memorials" 
          showBack={false}
          rightAction={
            <Link href="/create-memorial">
              <Button size="icon" variant="ghost" data-testid="button-create-memorial-mobile">
                <Plus className="w-5 h-5" />
              </Button>
            </Link>
          }
        />
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="px-4 pb-24">
            {memorialsList}
          </div>
        </PullToRefresh>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2" data-testid="text-my-memorials-heading">
              My Memorials
            </h1>
            <p className="text-muted-foreground">
              Memorials you've created and manage
            </p>
          </div>
          <Link href="/create-memorial">
            <Button data-testid="button-create-memorial">
              <Plus className="w-4 h-4 mr-2" />
              Create Memorial
            </Button>
          </Link>
        </div>
        {memorialsList}
      </div>
    </div>
  );
}
