import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, MapPin, Plus, Users, Home, Loader2 } from "lucide-react";
import type { Neighborhood } from "@shared/schema";
import { Link } from "wouter";

export default function Neighborhoods() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const { data, isLoading } = useQuery<{ neighborhoods: Neighborhood[]; count: number }>({
    queryKey: ["/api/neighborhoods", selectedState, selectedCity],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("city", selectedCity);
      
      const url = params.toString() 
        ? `/api/neighborhoods?${params.toString()}`
        : "/api/neighborhoods";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const neighborhoods = data?.neighborhoods || [];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Neighborhoods
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Explore communities across America. Each neighborhood has its own story, legends, and heroes worth remembering.
        </p>
        <Link href="/create-neighborhood">
          <Button 
            size="lg"
            data-testid="button-create-neighborhood"
            className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none shadow-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Neighborhood
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedState || undefined} onValueChange={(value) => {
            setSelectedState(value);
            if (!value) setSelectedCity("");
          }}>
            <SelectTrigger data-testid="select-state-filter">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="IL">Illinois</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="TX">Texas</SelectItem>
              <SelectItem value="FL">Florida</SelectItem>
              <SelectItem value="GA">Georgia</SelectItem>
              <SelectItem value="PA">Pennsylvania</SelectItem>
              <SelectItem value="MI">Michigan</SelectItem>
              <SelectItem value="OH">Ohio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Input
            placeholder="Filter by City (e.g., Chicago)"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            data-testid="input-city-filter"
            className="h-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8" data-testid="loading-skeletons">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <p>Loading neighborhoods...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-full">
                <Skeleton className="h-32 w-full rounded-t-lg" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : neighborhoods.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Neighborhoods Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedState || selectedCity ? `No neighborhoods match your filters.` : `Be the first to add a neighborhood.`}
            </p>
            <Link href="/create-neighborhood">
              <Button data-testid="button-create-first-neighborhood">
                <Plus className="w-4 h-4 mr-2" />
                Add First Neighborhood
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {neighborhoods.map((neighborhood) => (
            <Link key={neighborhood.id} href={`/neighborhood/${neighborhood.id}`}>
              <Card className="hover-elevate h-full" data-testid={`card-neighborhood-${neighborhood.id}`}>
                {neighborhood.logoUrl && (
                  <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center overflow-hidden rounded-t-lg">
                    <img 
                      src={neighborhood.logoUrl} 
                      alt={`${neighborhood.name} logo`}
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl">{neighborhood.name}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm">
                    <MapPin className="w-4 h-4" />
                    {neighborhood.city}, {neighborhood.state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {neighborhood.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {neighborhood.description}
                    </p>
                  )}
                  {neighborhood.foundedYear && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Home className="w-3 h-3" />
                      Founded {neighborhood.foundedYear}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {data && data.count > 0 && (
        <div className="text-center mt-12 text-sm text-muted-foreground">
          Showing {neighborhoods.length} of {data.count} neighborhood{data.count === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
}
