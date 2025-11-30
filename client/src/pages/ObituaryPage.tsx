import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Heart } from "lucide-react";
import { format } from "date-fns";
import { ShareObituaryButton } from "@/components/ShareObituaryButton";
import { MemorialCondolenceBar } from "@/components/MemorialCondolenceBar";

interface Memorial {
  id: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deceasedMiddleName?: string;
  birthDate: string;
  deathDate: string;
  obituary?: string;
  birthplace?: string;
  residence?: string;
  photoUrl?: string;
  faithTradition?: string;
  designStyle?: string;
}

export default function ObituaryPage() {
  const { memorialId } = useParams<{ memorialId: string }>();

  const { data: memorial, isLoading, error } = useQuery<Memorial>({
    queryKey: ["/api/memorials", memorialId],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(280,60%,15%)] via-[hsl(280,50%,10%)] to-[hsl(280,60%,5%)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-pulse text-4xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[hsl(280,60%,15%)] via-[hsl(280,50%,10%)] to-[hsl(280,60%,5%)] flex items-center justify-center p-4">
        <Card className="max-w-md bg-card/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Memorial Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This memorial could not be found or has been removed.
            </p>
            <Button asChild className="w-full" data-testid="button-back-home">
              <a href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullName = [
    memorial.deceasedFirstName,
    memorial.deceasedMiddleName,
    memorial.deceasedLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const calculateAge = (birthDate: string, deathDate: string) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(memorial.birthDate, memorial.deathDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(280,60%,15%)] via-[hsl(280,50%,10%)] to-[hsl(280,60%,5%)]">
      <div className="container max-w-4xl mx-auto p-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            asChild
            className="gap-2"
            data-testid="button-back"
          >
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </a>
          </Button>
          <div className="flex items-center gap-3">
            <ShareObituaryButton 
              memorialId={memorial.id} 
              deceasedName={fullName} 
            />
            <div className="text-sm text-muted-foreground">Public Obituary</div>
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6 space-y-6">
            {memorial.photoUrl && (
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-[hsl(45,80%,55%)]">
                  <img
                    src={memorial.photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    data-testid="img-deceased-photo"
                  />
                </div>
              </div>
            )}

            <div className="text-center space-y-2">
              <h1
                className="text-4xl font-serif font-bold text-[hsl(45,80%,55%)]"
                data-testid="text-deceased-name"
              >
                {fullName}
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span data-testid="text-life-dates">
                  {format(new Date(memorial.birthDate), "MMMM d, yyyy")} -{" "}
                  {format(new Date(memorial.deathDate), "MMMM d, yyyy")}
                </span>
              </div>
              <p className="text-muted-foreground" data-testid="text-age">
                Age {age}
              </p>
            </div>

            <Separator className="bg-white/10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {memorial.birthplace && (
                <div className="space-y-1">
                  <div className="text-muted-foreground">Born in</div>
                  <div className="flex items-center gap-2" data-testid="text-birthplace">
                    <MapPin className="h-4 w-4" />
                    {memorial.birthplace}
                  </div>
                </div>
              )}
              {memorial.residence && (
                <div className="space-y-1">
                  <div className="text-muted-foreground">Resided in</div>
                  <div className="flex items-center gap-2" data-testid="text-residence">
                    <MapPin className="h-4 w-4" />
                    {memorial.residence}
                  </div>
                </div>
              )}
            </div>

            {memorial.obituary && (
              <>
                <Separator className="bg-white/10" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif font-semibold">Obituary</h2>
                  <div
                    className="prose prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed"
                    data-testid="text-obituary"
                  >
                    {memorial.obituary}
                  </div>
                </div>
              </>
            )}

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <h3 className="text-xl font-serif font-semibold text-center">Express Your Condolences</h3>
              <MemorialCondolenceBar memorialId={memorial.id} />
            </div>

            <Separator className="bg-white/10" />

            <div className="bg-background/20 rounded-lg p-6 text-center space-y-4 border border-white/10">
              <Heart className="h-12 w-12 mx-auto text-[hsl(45,80%,55%)]" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  View Full Memorial
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Access photos, memories, fundraisers, and more with an invite code from the family.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="gap-2"
                data-testid="button-view-full-memorial"
              >
                <a href={`/?inviteCode=${memorial.id}`}>
                  View Full Memorial
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Powered by{" "}
            <a
              href="/"
              className="text-[hsl(45,80%,55%)] hover:underline"
            >
              Opictuary
            </a>
            {" "}- Preserving memories with dignity
          </p>
        </div>
      </div>
    </div>
  );
}
