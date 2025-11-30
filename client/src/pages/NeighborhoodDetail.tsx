import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Users, Home, Heart, ArrowLeft, Loader2 } from "lucide-react";
import type { Neighborhood, HoodMemorial } from "@shared/schema";
import { Link, useParams } from "wouter";

export default function NeighborhoodDetail() {
  const { id } = useParams();

  const { data: neighborhood, isLoading } = useQuery<Neighborhood>({
    queryKey: ["/api/neighborhoods", id],
    queryFn: async () => {
      const res = await fetch(`/api/neighborhoods/${id}`);
      if (!res.ok) throw new Error("Failed to fetch neighborhood");
      return res.json();
    },
  });

  const { data: memorialsData } = useQuery<{ memorials: HoodMemorial[]; count: number }>({
    queryKey: ["/api/hood-memorials", neighborhood?.city, neighborhood?.state],
    enabled: !!neighborhood,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (neighborhood?.city) params.append("city", neighborhood.city);
      if (neighborhood?.state) params.append("state", neighborhood.state);
      
      const res = await fetch(`/api/hood-memorials?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const memorials = memorialsData?.memorials?.filter(
    m => m.neighborhoodName?.toLowerCase() === neighborhood?.name?.toLowerCase()
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen" data-testid="loading-skeletons">
        {/* Hero Section Skeleton */}
        <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Skeleton className="w-24 h-24 mx-auto rounded-lg" />
              <Skeleton className="h-10 w-64 mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
          </div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-6 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Loading neighborhood details...</p>
          </div>

          <Skeleton className="h-9 w-48 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              {/* About Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>

              {/* Notable Features Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Quick Facts Card Skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </CardContent>
              </Card>

              <Skeleton className="h-10 w-full rounded" />
            </div>
          </div>

          {/* Memorials Section Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="w-20 h-20 rounded-lg" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-9 w-full rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!neighborhood) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12 text-center">
        <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Neighborhood Not Found</h2>
        <p className="text-muted-foreground mb-6">This neighborhood doesn't exist or has been removed.</p>
        <Link href="/neighborhoods">
          <Button>View All Neighborhoods</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {neighborhood.backgroundImage && (
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${neighborhood.backgroundImage})` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {neighborhood.logoUrl && (
                <img 
                  src={neighborhood.logoUrl} 
                  alt={neighborhood.name}
                  className="w-24 h-24 mx-auto mb-4 object-contain bg-white/10 backdrop-blur-sm rounded-lg p-2"
                />
              )}
              <h1 className="text-4xl font-serif font-bold text-white">{neighborhood.name}</h1>
              <p className="text-xl text-white/90 flex items-center justify-center gap-2 mt-2">
                <MapPin className="w-5 h-5" />
                {neighborhood.city}, {neighborhood.state}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Link href="/neighborhoods">
          <Button variant="ghost" size="sm" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Neighborhoods
          </Button>
        </Link>

        {!neighborhood.backgroundImage && (
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {neighborhood.logoUrl ? (
                <img 
                  src={neighborhood.logoUrl} 
                  alt={neighborhood.name}
                  className="w-16 h-16 object-contain"
                />
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
              )}
              <h1 className="text-4xl font-serif font-bold">{neighborhood.name}</h1>
            </div>
            <p className="text-xl text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              {neighborhood.city}, {neighborhood.state}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            {neighborhood.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About {neighborhood.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{neighborhood.description}</p>
                </CardContent>
              </Card>
            )}

            {neighborhood.notableFeatures && (
              <Card>
                <CardHeader>
                  <CardTitle>Notable Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{neighborhood.notableFeatures}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {neighborhood.foundedYear && (
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Founded:</span> {neighborhood.foundedYear}
                    </span>
                  </div>
                )}
                {neighborhood.population && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Population:</span> {neighborhood.population.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    <span className="text-muted-foreground">Memorials:</span> {memorials.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Link href="/create-hood-memorial">
              <Button className="w-full" data-testid="button-create-memorial">
                <Heart className="w-4 h-4 mr-2" />
                Create Hood Memorial
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hood Memorials from {neighborhood.name}</CardTitle>
            <CardDescription>
              Honoring the legends and community leaders from this neighborhood
            </CardDescription>
          </CardHeader>
          <CardContent>
            {memorials.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No memorials yet for this neighborhood</p>
                <Link href="/create-hood-memorial">
                  <Button size="sm">Create First Memorial</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memorials.map((memorial) => (
                  <Card key={memorial.id} className="hover-elevate" data-testid={`memorial-${memorial.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{memorial.name}</CardTitle>
                          {memorial.nickname && (
                            <p className="text-sm text-muted-foreground">"{memorial.nickname}"</p>
                          )}
                        </div>
                      </div>
                      {memorial.legendStatus && (
                        <Badge variant="secondary" className="w-fit">{memorial.legendStatus}</Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {memorial.role && <p className="text-sm font-medium">{memorial.role}</p>}
                      {memorial.epitaph && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{memorial.epitaph}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {memorial.birthDate} - {memorial.deathDate}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
