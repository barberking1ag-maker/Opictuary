import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, Search, Plus, Flame, PawPrint, Bird, Fish, 
  Rabbit, Cat, Dog, Star, Rainbow, TreePine, Waves,
  Calendar, MapPin, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { PetMemorial } from "@shared/schema";

const speciesIcons: Record<string, any> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  other: PawPrint,
};

const themeColors: Record<string, string> = {
  rainbow_bridge: "from-purple-400 via-pink-300 to-orange-300",
  garden: "from-green-400 to-emerald-300",
  starlight: "from-indigo-500 to-purple-400",
  forest: "from-green-600 to-teal-400",
  ocean: "from-blue-400 to-cyan-300",
};

export default function PetMemorials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const { toast } = useToast();

  const { data: petMemorials, isLoading } = useQuery<PetMemorial[]>({
    queryKey: ["/api/pet-memorials"],
  });

  const filteredMemorials = petMemorials?.filter((memorial) => {
    const matchesSearch = memorial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memorial.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === "all" || memorial.species === speciesFilter;
    return matchesSearch && matchesSpecies;
  });

  const species = ["dog", "cat", "bird", "rabbit", "fish", "horse", "reptile", "other"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rainbow className="h-10 w-10 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Pet Memorials
            </h1>
            <Rainbow className="h-10 w-10 text-orange-400" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Honor your beloved companions who have crossed the Rainbow Bridge. 
            Create lasting tributes to celebrate their unconditional love and cherished memories.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-pets"
            />
          </div>
          
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-40" data-testid="select-species-filter">
              <SelectValue placeholder="All Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              {species.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link href="/create-pet-memorial">
            <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" data-testid="button-create-pet-memorial">
              <Plus className="h-4 w-4" />
              Create Pet Memorial
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all" data-testid="tab-all-pets">All Pets</TabsTrigger>
            <TabsTrigger value="dogs" data-testid="tab-dogs">Dogs</TabsTrigger>
            <TabsTrigger value="cats" data-testid="tab-cats">Cats</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-32 bg-gray-200 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMemorials && filteredMemorials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMemorials.map((pet) => (
                  <PetMemorialCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <PawPrint className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Pet Memorials Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to create a loving tribute to your beloved pet
                </p>
                <Link href="/create-pet-memorial">
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="h-4 w-4" />
                    Create First Memorial
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="dogs" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemorials?.filter(p => p.species === "dog").map((pet) => (
                <PetMemorialCard key={pet.id} pet={pet} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemorials?.filter(p => p.species === "cat").map((pet) => (
                <PetMemorialCard key={pet.id} pet={pet} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-0">
            <CardContent className="pt-8 pb-8">
              <Rainbow className="h-12 w-12 mx-auto text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold mb-3">The Rainbow Bridge</h3>
              <p className="text-muted-foreground italic">
                "Just this side of heaven is a place called Rainbow Bridge. 
                When an animal who has been especially close to someone here dies, 
                that pet goes to Rainbow Bridge. There they are restored to health and vigor..."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PetMemorialCard({ pet }: { pet: PetMemorial }) {
  const SpeciesIcon = speciesIcons[pet.species] || PawPrint;
  const themeGradient = themeColors[pet.theme || "rainbow_bridge"];

  return (
    <Link href={`/pet-memorial/${pet.inviteCode}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group" data-testid={`card-pet-memorial-${pet.id}`}>
        <div className={`h-32 bg-gradient-to-r ${themeGradient} relative`}>
          {pet.profilePhoto ? (
            <img 
              src={pet.profilePhoto} 
              alt={pet.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <SpeciesIcon className="h-16 w-16 text-white/50" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-xs">
              <SpeciesIcon className="h-3 w-3 mr-1" />
              {pet.species}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                {pet.name}
              </CardTitle>
              {pet.breed && (
                <CardDescription>{pet.breed}</CardDescription>
              )}
            </div>
            <Avatar className="h-12 w-12 border-2 border-white shadow-lg -mt-8">
              <AvatarImage src={pet.profilePhoto || undefined} alt={pet.name} />
              <AvatarFallback className="bg-purple-100">
                <SpeciesIcon className="h-6 w-6 text-purple-600" />
              </AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          {pet.epitaph && (
            <p className="text-sm text-muted-foreground italic line-clamp-2">
              "{pet.epitaph}"
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            {pet.age && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {pet.age}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" />
              {pet.candleLitCount || 0} candles
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 border-t">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-3 w-3" />
              {pet.viewCount || 0} views
            </div>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              View Memorial
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
