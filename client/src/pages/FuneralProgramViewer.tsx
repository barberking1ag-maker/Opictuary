import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { FuneralProgram, ProgramItem, Memorial } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Clock, Calendar, Users, Heart } from "lucide-react";

const ITEM_TYPE_LABELS: Record<string, string> = {
  hymn: "Hymn",
  reading: "Scripture Reading",
  prayer: "Prayer",
  eulogy: "Eulogy",
  music: "Musical Selection",
  poem: "Poem",
  tribute: "Video Tribute",
  other: "Special",
};

export default function FuneralProgramViewer() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  // Fetch memorial
  const { data: memorial, isLoading: memorialLoading } = useQuery<Memorial>({
    queryKey: [`/api/memorials/${id}`],
    enabled: !!id,
  });

  // Fetch program
  const { data: program, isLoading: programLoading } = useQuery<FuneralProgram>({
    queryKey: [`/api/memorials/${id}/funeral-program`],
    enabled: !!id,
  });

  // Fetch program items
  const { data: items } = useQuery<ProgramItem[]>({
    queryKey: [`/api/funeral-programs/${program?.id}/items`],
    enabled: !!program?.id,
  });

  const isLoading = memorialLoading || programLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading program...</div>
      </div>
    );
  }

  if (!memorial || !program) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-serif font-bold mb-4">Program Not Available</h2>
        <p className="text-muted-foreground mb-6">A funeral program has not been created for this memorial yet.</p>
        <Button onClick={() => navigate(`/memorial/${id}`)}>
          Back to Memorial
        </Button>
      </div>
    );
  }

  const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : "";
  const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-card border-b px-4 py-3 flex items-center gap-3 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/memorial/${id}`)}
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-serif font-semibold text-foreground">Funeral Program</h2>
        </div>
      </div>

      {/* Program Content */}
      <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
        {/* Cover Page */}
        <Card className="mb-6 overflow-hidden">
          <div 
            className="h-48 md:h-64 relative bg-cover bg-center"
            style={{
              backgroundImage: memorial.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${memorial.backgroundImage})`
                : 'linear-gradient(135deg, hsl(280 70% 20%), hsl(280 60% 30%))'
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Heart className="w-12 h-12 md:w-16 md:h-16 mb-4 text-gold" />
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2" data-testid="text-memorial-name">
                {memorial.name}
              </h1>
              <p className="text-xl md:text-2xl font-light" data-testid="text-memorial-dates">
                {birthYear} — {deathYear}
              </p>
              <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <p className="text-sm md:text-base font-medium">{program.serviceName || "Celebration of Life"}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 text-center">
              Service Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {program.serviceDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(program.serviceDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {program.serviceTime && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Time</p>
                    <p className="text-muted-foreground">
                      {new Date(`2000-01-01T${program.serviceTime}`).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                </div>
              )}

              {program.serviceLocation && (
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">{program.serviceLocation}</p>
                    {program.serviceAddress && (
                      <p className="text-muted-foreground">{program.serviceAddress}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {program.welcomeMessage && (
              <>
                <Separator className="my-6" />
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground italic text-center md:text-left whitespace-pre-wrap">
                    {program.welcomeMessage}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Order of Service */}
        {items && items.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 text-center">
                Order of Service
              </h2>
              
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id} className="border-l-2 border-primary pl-4 py-2">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                            {ITEM_TYPE_LABELS[item.itemType] || item.itemType}
                          </span>
                          <h3 className="font-serif font-semibold text-foreground text-lg" data-testid={`text-item-title-${index}`}>
                            {item.title}
                          </h3>
                        </div>
                        
                        {item.performedBy && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.performedBy}
                          </p>
                        )}
                      </div>
                      
                      {item.duration && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {item.description}
                      </p>
                    )}

                    {item.content && (
                      <div className="mt-3 p-3 bg-muted/30 rounded text-sm">
                        <p className="whitespace-pre-wrap italic text-muted-foreground">
                          {item.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Biography */}
        {memorial.biography && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-4 text-center">
                Life Celebration
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {memorial.biography}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Family Information */}
        {(program.survivedBy || program.predeceased) && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 text-center">
                <Users className="w-6 h-6 inline-block mr-2 mb-1" />
                Family
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {program.survivedBy && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Survived By</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {program.survivedBy}
                    </p>
                  </div>
                )}

                {program.predeceased && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Predeceased By</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {program.predeceased}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pallbearers */}
        {(program.pallbearers || program.honoraryPallbearers) && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {program.pallbearers && (
                  <div>
                    <h3 className="font-serif font-semibold text-foreground mb-3">Pallbearers</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {program.pallbearers}
                    </p>
                  </div>
                )}

                {program.honoraryPallbearers && (
                  <div>
                    <h3 className="font-serif font-semibold text-foreground mb-3">Honorary Pallbearers</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                      {program.honoraryPallbearers}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Repast/Reception */}
        {program.repastLocation && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-4 text-center">
                Reception
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-center md:text-left w-full">
                  <p className="font-medium text-foreground">{program.repastLocation}</p>
                  {program.repastAddress && (
                    <p className="text-muted-foreground">{program.repastAddress}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    All are welcome to join the family for food and fellowship following the service
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Acknowledgments */}
        {(program.acknowledgments || program.specialThanks) && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6 text-center">
                Acknowledgments
              </h2>
              
              {program.acknowledgments && (
                <div className="mb-4">
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed text-center md:text-left">
                    {program.acknowledgments}
                  </p>
                </div>
              )}

              {program.specialThanks && (
                <div className="mt-4 p-4 bg-muted/30 rounded">
                  <h3 className="font-semibold text-foreground mb-2 text-sm">Special Thanks</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {program.specialThanks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Closing Message */}
        {program.closingMessage && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <Heart className="w-8 h-8 text-gold mx-auto mb-4" />
                <p className="text-muted-foreground italic whitespace-pre-wrap leading-relaxed">
                  {program.closingMessage}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Quote */}
        <div className="text-center py-8">
          {memorial.epitaph ? (
            <p className="text-lg font-serif italic text-muted-foreground">
              "{memorial.epitaph}"
            </p>
          ) : (
            <p className="text-lg font-serif italic text-muted-foreground">
              "Those we love don't go away, they walk beside us every day."
            </p>
          )}
        </div>

        {/* Desktop Back Button */}
        <div className="hidden md:flex justify-center pt-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/memorial/${id}`)}
            data-testid="button-back-desktop"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Memorial
          </Button>
        </div>
      </div>
    </div>
  );
}
