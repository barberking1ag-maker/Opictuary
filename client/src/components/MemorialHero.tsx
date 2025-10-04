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
  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(135deg, hsl(220, 15%, 85%) 0%, hsl(220, 15%, 65%) 100%)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-white mb-3" data-testid="text-memorial-name">
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8" data-testid="text-memorial-dates">
            {birthDate} - {deathDate}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-white/90 backdrop-blur-md text-foreground border border-white/20 hover-elevate active-elevate-2"
              onClick={onEnterCode}
              data-testid="button-enter-code"
            >
              <Heart className="w-5 h-5 mr-2" />
              Enter Access Code
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md text-white border-white/30 hover-elevate active-elevate-2"
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
