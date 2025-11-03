import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Shield, Activity, Flame, Cross, Plus, Loader2 } from "lucide-react";
import type { EssentialWorkerMemorial } from "@shared/schema";
import { getFontFamily, getSymbolIcon } from "@/lib/customization";
import { AdDisplay } from "@/components/AdDisplay";

const categoryIcons = {
  police: Shield,
  fire: Flame,
  medical: Activity,
  military: Shield,
  other: Heart,
};

const categoryColors = {
  police: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  fire: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  medical: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  military: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function EssentialWorkers() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: memorials, isLoading } = useQuery<EssentialWorkerMemorial[]>({
    queryKey: ["/api/essential-workers", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/essential-workers?category=${selectedCategory}`
        : "/api/essential-workers";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category as keyof typeof categoryIcons] || Heart;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Cross className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Honoring Essential Workers
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          In grateful memory of the brave men and women who dedicated their lives to serving and protecting our communities.
        </p>
        <Button 
          size="lg"
          onClick={() => window.location.href = '/create-essential-worker'}
          data-testid="button-create-essential-worker-memorial"
          className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none shadow-lg font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Essential Worker Memorial
        </Button>
      </div>

      {/* Interactive Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Police Officers */}
        <Card className="hover-elevate overflow-hidden group" data-testid="card-category-police">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Police Officers</h3>
                <p className="text-xs text-muted-foreground">Protect & Serve</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  size="sm"
                  variant={selectedCategory === "police" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("police")}
                  data-testid="button-view-police"
                  className="w-full"
                >
                  View Memorials
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/create-essential-worker?category=police'}
                  data-testid="button-create-police"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Police Memorial
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Firefighters */}
        <Card className="hover-elevate overflow-hidden group" data-testid="card-category-fire">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Firefighters</h3>
                <p className="text-xs text-muted-foreground">Courage & Honor</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  size="sm"
                  variant={selectedCategory === "fire" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("fire")}
                  data-testid="button-view-fire"
                  className="w-full"
                >
                  View Memorials
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/create-essential-worker?category=fire'}
                  data-testid="button-create-fire"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Fire Memorial
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Workers */}
        <Card className="hover-elevate overflow-hidden group" data-testid="card-category-medical">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Medical Workers</h3>
                <p className="text-xs text-muted-foreground">Heal & Care</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  size="sm"
                  variant={selectedCategory === "medical" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("medical")}
                  data-testid="button-view-medical"
                  className="w-full"
                >
                  View Memorials
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/create-essential-worker?category=medical'}
                  data-testid="button-create-medical"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Medical Memorial
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Military */}
        <Card className="hover-elevate overflow-hidden group" data-testid="card-category-military">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Military</h3>
                <p className="text-xs text-muted-foreground">Duty & Sacrifice</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button
                  size="sm"
                  variant={selectedCategory === "military" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("military")}
                  data-testid="button-view-military"
                  className="w-full"
                >
                  View Memorials
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.location.href = '/create-essential-worker?category=military'}
                  data-testid="button-create-military"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create Military Memorial
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Filter Display */}
      {selectedCategory && (
        <div className="flex items-center justify-between mb-6 bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              {getCategoryIcon(selectedCategory)}
            </div>
            <div>
              <p className="font-semibold">
                Showing {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Memorials
              </p>
              <p className="text-sm text-muted-foreground">
                {memorials?.length || 0} memorial{memorials?.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCategory("")}
            data-testid="button-clear-filter"
          >
            Show All Heroes
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-8" data-testid="loading-skeletons">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Loading essential worker memorials...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-9 w-full rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : memorials && memorials.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {memorials.map((memorial) => {
            const customFont = getFontFamily(memorial.fontFamily ?? undefined);
            const SymbolIcon = getSymbolIcon(memorial.symbol ?? undefined);
            
            return (
            <Card key={memorial.id} className="overflow-hidden hover-elevate" data-testid={`card-memorial-${memorial.id}`}>
              {memorial.imageUrl && (
                <div className="h-48 overflow-hidden bg-muted">
                  <img
                    src={memorial.imageUrl}
                    alt={memorial.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-xl" style={customFont ? { fontFamily: customFont } : undefined}>
                    {SymbolIcon && (
                      <SymbolIcon className="inline-block w-5 h-5 mr-2 text-primary" />
                    )}
                    {memorial.fullName}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${categoryColors[memorial.category as keyof typeof categoryColors]}`}>
                    {getCategoryIcon(memorial.category)}
                  </div>
                </div>
                <CardDescription>
                  {memorial.profession}
                  {memorial.department && ` • ${memorial.department}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Professional Details Section */}
                <div className="flex flex-wrap gap-2">
                  {memorial.rank && (
                    <Badge variant="secondary" className="text-xs">
                      {memorial.rank}
                    </Badge>
                  )}
                  {memorial.badgeNumber && (
                    <Badge variant="outline" className="text-xs">
                      Badge #{memorial.badgeNumber}
                    </Badge>
                  )}
                  {memorial.serviceBranch && (
                    <Badge variant="secondary" className="text-xs">
                      {memorial.serviceBranch}
                    </Badge>
                  )}
                  {memorial.unit && (
                    <Badge variant="outline" className="text-xs">
                      {memorial.unit}
                    </Badge>
                  )}
                  {memorial.specialization && (
                    <Badge variant="secondary" className="text-xs">
                      {memorial.specialization}
                    </Badge>
                  )}
                  {memorial.precinct && (
                    <Badge variant="outline" className="text-xs">
                      Precinct {memorial.precinct}
                    </Badge>
                  )}
                  {memorial.station && (
                    <Badge variant="outline" className="text-xs">
                      Station {memorial.station}
                    </Badge>
                  )}
                </div>

                {memorial.yearsOfService && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{memorial.yearsOfService} Years of Service</Badge>
                  </div>
                )}
                
                {memorial.lineOfDutyDeath && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      Line of Duty
                    </Badge>
                  </div>
                )}

                {/* Deployments for Military */}
                {memorial.deployments && memorial.deployments.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold mb-1">Deployments:</p>
                    <div className="flex flex-wrap gap-1">
                      {memorial.deployments.slice(0, 2).map((deployment, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {deployment.location} ({deployment.years})
                        </Badge>
                      ))}
                      {memorial.deployments.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{memorial.deployments.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {memorial.certifications && memorial.certifications.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold mb-1">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {memorial.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {memorial.certifications.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{memorial.certifications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {memorial.biography && (
                  <p className="text-sm text-muted-foreground line-clamp-3" style={customFont ? { fontFamily: customFont } : undefined}>
                    {memorial.biography}
                  </p>
                )}

                {memorial.honors && memorial.honors.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs font-semibold mb-1">Honors & Awards:</p>
                    <div className="flex flex-wrap gap-1">
                      {memorial.honors.slice(0, 2).map((honor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {honor.award}
                        </Badge>
                      ))}
                      {memorial.honors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{memorial.honors.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {memorial.birthDate && memorial.deathDate && (
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    {memorial.birthDate} - {memorial.deathDate}
                  </p>
                )}
              </CardContent>
            </Card>
          );
          })}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <AdDisplay category="memorials" maxAds={3} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No memorials found</h3>
          <p className="text-muted-foreground">
            {selectedCategory 
              ? `No memorials in the ${selectedCategory} category yet.`
              : "No essential worker memorials have been created yet."}
          </p>
        </div>
      )}
    </div>
  );
}
