import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MapPin, Users, Plus, Home, Building2 } from "lucide-react";
import type { HoodMemorial } from "@shared/schema";
import { Link } from "wouter";

export default function HoodMemorials() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const { data, isLoading } = useQuery<{ memorials: HoodMemorial[]; count: number }>({
    queryKey: ["/api/hood-memorials", selectedState, selectedCity],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedState) params.append("state", selectedState);
      if (selectedCity) params.append("city", selectedCity);
      
      const url = params.toString() 
        ? `/api/hood-memorials?${params.toString()}`
        : "/api/hood-memorials";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const memorials = data?.memorials || [];

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Home className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Hood Memorials
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
          Honoring neighborhood legends, community leaders, and those who made their mark on the streets they called home.
        </p>
        <Link href="/create-hood-memorial">
          <Button 
            size="lg"
            data-testid="button-create-hood-memorial"
            className="bg-[hsl(45,80%,60%)] hover:bg-[hsl(45,80%,55%)] text-foreground border-none shadow-lg font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Hood Memorial
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select value={selectedState} onValueChange={(value) => {
            setSelectedState(value);
            if (!value) setSelectedCity("");
          }}>
            <SelectTrigger data-testid="select-state-filter">
              <SelectValue placeholder="Filter by State (All States)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All States</SelectItem>
            <SelectItem value="AL">Alabama</SelectItem>
            <SelectItem value="AK">Alaska</SelectItem>
            <SelectItem value="AZ">Arizona</SelectItem>
            <SelectItem value="AR">Arkansas</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="CO">Colorado</SelectItem>
            <SelectItem value="CT">Connecticut</SelectItem>
            <SelectItem value="FL">Florida</SelectItem>
            <SelectItem value="GA">Georgia</SelectItem>
            <SelectItem value="IL">Illinois</SelectItem>
            <SelectItem value="IN">Indiana</SelectItem>
            <SelectItem value="LA">Louisiana</SelectItem>
            <SelectItem value="MD">Maryland</SelectItem>
            <SelectItem value="MA">Massachusetts</SelectItem>
            <SelectItem value="MI">Michigan</SelectItem>
            <SelectItem value="MN">Minnesota</SelectItem>
            <SelectItem value="MS">Mississippi</SelectItem>
            <SelectItem value="MO">Missouri</SelectItem>
            <SelectItem value="NV">Nevada</SelectItem>
            <SelectItem value="NJ">New Jersey</SelectItem>
            <SelectItem value="NM">New Mexico</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="NC">North Carolina</SelectItem>
            <SelectItem value="OH">Ohio</SelectItem>
            <SelectItem value="OK">Oklahoma</SelectItem>
            <SelectItem value="OR">Oregon</SelectItem>
            <SelectItem value="PA">Pennsylvania</SelectItem>
            <SelectItem value="SC">South Carolina</SelectItem>
            <SelectItem value="TN">Tennessee</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
            <SelectItem value="VA">Virginia</SelectItem>
            <SelectItem value="WA">Washington</SelectItem>
            <SelectItem value="WI">Wisconsin</SelectItem>
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

      {/* Memorial Cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading hood memorials...</p>
        </div>
      ) : memorials.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hood Memorials Found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedState ? `No memorials in this state yet.` : `Be the first to create a hood memorial.`}
            </p>
            <Link href="/create-hood-memorial">
              <Button data-testid="button-create-first-memorial">
                <Plus className="w-4 h-4 mr-2" />
                Create First Hood Memorial
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memorials.map((memorial) => (
            <Card key={memorial.id} className="hover-elevate overflow-hidden" data-testid={`card-hood-memorial-${memorial.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{memorial.name}</CardTitle>
                    {memorial.nickname && (
                      <p className="text-sm text-muted-foreground italic">&quot;{memorial.nickname}&quot;</p>
                    )}
                  </div>
                  {memorial.imageUrl && (
                    <img 
                      src={memorial.imageUrl} 
                      alt={memorial.name}
                      className="w-20 h-20 rounded-lg object-cover border-2 border-border"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{memorial.neighborhoodName}, {memorial.city}, {memorial.state}</span>
                  </div>
                  {memorial.legendStatus && (
                    <Badge variant="secondary" className="bg-[hsl(45,80%,60%)] text-foreground">
                      {memorial.legendStatus}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  {memorial.neighborhoodLogoUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={memorial.neighborhoodLogoUrl} 
                        alt={`${memorial.neighborhoodName} logo`}
                        className="w-12 h-12 rounded object-contain"
                      />
                    </div>
                  )}
                  {memorial.clubLogoUrl && (
                    <div className="flex-shrink-0">
                      <img 
                        src={memorial.clubLogoUrl} 
                        alt={`${memorial.clubName} logo`}
                        className="w-12 h-12 rounded object-contain"
                      />
                    </div>
                  )}
                </div>
                {memorial.role && (
                  <p className="text-sm font-medium">{memorial.role}</p>
                )}
                {memorial.epitaph && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{memorial.epitaph}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {memorial.birthDate} - {memorial.deathDate}
                </p>
                <Button className="w-full" variant="outline" size="sm" data-testid={`button-view-memorial-${memorial.id}`}>
                  <Heart className="w-4 h-4 mr-2" />
                  View Memorial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {data && data.count > 0 && (
        <div className="text-center mt-8 text-sm text-muted-foreground">
          Honoring {data.count} neighborhood {data.count === 1 ? 'legend' : 'legends'}
        </div>
      )}
    </div>
  );
}
