import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Plus, Calendar, Users, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { handleMobileLogin } from "@/lib/mobileUtils";

export default function MyMemorials() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // For now, this is a placeholder - we'll implement the actual query once we have the backend endpoint
  const { data: memorials = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/user/memorials'],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-40 rounded" />
          </div>
          
          <div className="space-y-8" data-testid="loading-skeletons">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <p>Loading your memorials...</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-8" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-8" />
                      </div>
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
        </div>
      </div>
    );
  }

  // Show demo content for non-authenticated users (allows Apple reviewers to see features)
  if (!isAuthenticated) {
    const demoMemorials = [
      {
        id: "demo-1",
        name: "Margaret Rose Johnson",
        dates: "1945 - 2024",
        photoCount: 12,
        condolenceCount: 47,
        status: "published",
      },
      {
        id: "demo-2", 
        name: "Robert James Williams",
        dates: "1938 - 2023",
        photoCount: 8,
        condolenceCount: 23,
        status: "published",
      },
      {
        id: "demo-3",
        name: "Eleanor Grace Smith",
        dates: "1952 - 2024",
        photoCount: 5,
        condolenceCount: 15,
        status: "draft",
      },
    ];
    
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2" data-testid="text-my-memorials-heading">
                My Memorials
              </h1>
              <p className="text-muted-foreground">
                Preview of memorial management features
              </p>
            </div>
            <Button onClick={() => handleMobileLogin()} data-testid="button-login-to-manage">
              Login to Manage
            </Button>
          </div>
          
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="py-4">
              <p className="text-sm text-center text-muted-foreground">
                This is a preview of the memorial management dashboard. Login to create and manage your own memorials.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="demo-memorials-grid">
            {demoMemorials.map((memorial) => (
              <Card key={memorial.id} className="hover-elevate" data-testid={`card-demo-memorial-${memorial.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{memorial.name}</CardTitle>
                    <Badge variant={memorial.status === "published" ? "default" : "secondary"}>
                      {memorial.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{memorial.dates}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{memorial.photoCount}</p>
                      <p className="text-xs text-muted-foreground">Photos</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{memorial.condolenceCount}</p>
                      <p className="text-xs text-muted-foreground">Condolences</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81" className="flex-1">
                      <Button variant="outline" className="w-full" data-testid={`button-view-demo-${memorial.id}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1" onClick={() => handleMobileLogin()} data-testid={`button-manage-demo-${memorial.id}`}>
                      <Users className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memorials.map((memorial: any) => (
              <Card key={memorial.id} className="hover-elevate" data-testid={`card-memorial-${memorial.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{memorial.name}</CardTitle>
                    {memorial.isPublic ? (
                      <Badge variant="secondary">Public</Badge>
                    ) : (
                      <Badge variant="outline">Private</Badge>
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
      </div>
    </div>
  );
}
