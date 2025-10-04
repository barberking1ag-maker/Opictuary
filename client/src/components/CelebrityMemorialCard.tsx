import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Lock } from "lucide-react";

interface CelebrityMemorialCardProps {
  name: string;
  title: string;
  imageUrl?: string;
  charityName: string;
  donationAmount: number;
  fanCount: number;
  isUnlocked?: boolean;
  onDonate?: () => void;
  onView?: () => void;
}

export default function CelebrityMemorialCard({
  name,
  title,
  imageUrl,
  charityName,
  donationAmount,
  fanCount,
  isUnlocked = false,
  onDonate,
  onView
}: CelebrityMemorialCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid="card-celebrity-memorial">
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge className="bg-amber-500 text-white border-amber-600" data-testid="badge-celebrity">
            <Star className="w-3 h-3 mr-1" />
            Celebrity
          </Badge>
        </div>
        {!isUnlocked && (
          <div className="absolute inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center">
            <Lock className="w-12 h-12 text-white/80" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-1" data-testid="text-celebrity-name">
          {name}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid="text-celebrity-title">
          {title}
        </p>

        <div className="bg-accent/10 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-chart-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium mb-1">
                Support {charityName}
              </p>
              <p className="text-xs text-muted-foreground">
                Donate ${donationAmount} to unlock this memorial and support their favorite charity
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground" data-testid="text-fan-count">
            {fanCount.toLocaleString()} fans have donated
          </span>
        </div>

        {isUnlocked ? (
          <Button 
            className="w-full" 
            onClick={onView}
            data-testid="button-view-memorial"
          >
            View Memorial
          </Button>
        ) : (
          <Button 
            className="w-full bg-chart-3 hover:bg-chart-3 text-white" 
            onClick={onDonate}
            data-testid="button-unlock-memorial"
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate ${donationAmount} to Unlock
          </Button>
        )}
      </div>
    </Card>
  );
}
