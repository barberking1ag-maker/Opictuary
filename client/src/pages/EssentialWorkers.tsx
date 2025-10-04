import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Activity, Flame, Cross } from "lucide-react";
import type { EssentialWorkerMemorial } from "@shared/schema";

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
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          In grateful memory of the brave men and women who dedicated their lives to serving and protecting our communities.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
            data-testid="filter-all"
          >
            All Heroes
          </Button>
          <Button
            variant={selectedCategory === "police" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("police")}
            data-testid="filter-police"
          >
            <Shield className="w-4 h-4 mr-2" />
            Police
          </Button>
          <Button
            variant={selectedCategory === "fire" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("fire")}
            data-testid="filter-fire"
          >
            <Flame className="w-4 h-4 mr-2" />
            Firefighters
          </Button>
          <Button
            variant={selectedCategory === "medical" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("medical")}
            data-testid="filter-medical"
          >
            <Activity className="w-4 h-4 mr-2" />
            Medical
          </Button>
          <Button
            variant={selectedCategory === "military" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("military")}
            data-testid="filter-military"
          >
            <Shield className="w-4 h-4 mr-2" />
            Military
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg" />
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : memorials && memorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memorials.map((memorial) => (
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
                  <CardTitle className="text-xl">{memorial.fullName}</CardTitle>
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

                {memorial.biography && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
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
          ))}
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
