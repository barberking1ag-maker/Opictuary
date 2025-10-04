import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";

interface MemorialHeroProps {
  name: string;
  birthDate: string;
  deathDate: string;
  imageUrl?: string;
  onEnterCode?: () => void;
  onShare?: () => void;
}

export default function MemorialHero({
  name,
  birthDate,
  deathDate,
  imageUrl,
  onEnterCode,
  onShare
}: MemorialHeroProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl 
            ? `url(${imageUrl})` 
            : 'linear-gradient(135deg, hsl(220, 15%, 92%) 0%, hsl(220, 15%, 78%) 100%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
            <p className="text-sm text-white/90 tracking-wide">In Loving Memory</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-semibold text-white mb-4 tracking-tight" data-testid="text-memorial-name">
            {name}
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-white/90">
            <time className="text-lg md:text-xl font-light" data-testid="text-memorial-dates">
              {formatDate(birthDate)}
            </time>
            <span className="text-2xl font-light">—</span>
            <time className="text-lg md:text-xl font-light">
              {formatDate(deathDate)}
            </time>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button 
              size="lg" 
              className="bg-white/95 backdrop-blur-md text-foreground border border-white/20 hover-elevate active-elevate-2 shadow-lg"
              onClick={onEnterCode}
              data-testid="button-enter-code"
            >
              <Heart className="w-5 h-5 mr-2" />
              Enter Access Code
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/15 backdrop-blur-md text-white border-white/40 hover-elevate active-elevate-2"
              onClick={onShare}
              data-testid="button-share"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Memorial
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
