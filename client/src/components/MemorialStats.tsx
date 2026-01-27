import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, MessageCircle, Eye, Heart, Flower } from "lucide-react";
import { cn } from "@/lib/utils";

interface MemorialStatsProps {
  memorialId: string;
  className?: string;
  compact?: boolean;
}

interface ReactionCounts {
  candle?: number;
  prayer?: number;
  flowers?: number;
  heart?: number;
}

interface StatsData {
  reactions: ReactionCounts;
  condolenceCount: number;
  viewCount: number;
}

export function MemorialStats({ memorialId, className, compact = false }: MemorialStatsProps) {
  const { data: reactionsData } = useQuery<{ totalCounts: ReactionCounts }>({
    queryKey: ["/api/memorials", memorialId, "reactions"],
  });

  const { data: condolences } = useQuery<{ id: string }[]>({
    queryKey: ["/api/memorials", memorialId, "condolences"],
  });

  const reactions = reactionsData?.totalCounts || {};
  const totalCandles = reactions.candle || 0;
  const totalPrayers = reactions.prayer || 0;
  const totalFlowers = reactions.flowers || 0;
  const totalHearts = reactions.heart || 0;
  const totalCondolences = condolences?.length || 0;
  
  const totalReactions = totalCandles + totalPrayers + totalFlowers + totalHearts;

  const stats = [
    { 
      icon: Flame, 
      label: "Candles Lit", 
      value: totalCandles,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10"
    },
    { 
      icon: Heart, 
      label: "Hearts", 
      value: totalHearts,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    },
    { 
      icon: Flower, 
      label: "Flowers", 
      value: totalFlowers,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10"
    },
    { 
      icon: MessageCircle, 
      label: "Messages", 
      value: totalCondolences,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
  ];

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 text-sm text-muted-foreground", className)} data-testid="memorial-stats-compact">
        <div className="flex items-center gap-1" data-testid="stat-candles">
          <Flame className="h-4 w-4 text-amber-500" />
          <span>{totalCandles}</span>
        </div>
        <div className="flex items-center gap-1" data-testid="stat-hearts">
          <Heart className="h-4 w-4 text-red-500" />
          <span>{totalHearts}</span>
        </div>
        <div className="flex items-center gap-1" data-testid="stat-messages">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          <span>{totalCondolences}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("bg-card/60 backdrop-blur-sm border-white/10", className)} data-testid="memorial-stats">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3" data-testid="text-stats-title">
          Memorial Tributes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className={cn(
                "flex flex-col items-center p-3 rounded-lg",
                stat.bgColor
              )}
              data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}
            >
              <stat.icon className={cn("h-5 w-5 mb-1", stat.color)} />
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        {totalReactions > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10 text-center">
            <span className="text-sm text-muted-foreground">
              {totalReactions} total tribute{totalReactions !== 1 ? 's' : ''} received
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
