import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import type { Advertisement } from "@shared/schema";

interface AdDisplayProps {
  category?: string;
  maxAds?: number;
  className?: string;
}

export function AdDisplay({ category, maxAds = 2, className }: AdDisplayProps) {
  const { data: ads } = useQuery<Advertisement[]>({
    queryKey: ["/api/advertisements", category],
    queryFn: async () => {
      const url = category 
        ? `/api/advertisements?category=${category}`
        : "/api/advertisements";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const displayAds = ads?.slice(0, maxAds) || [];

  useEffect(() => {
    displayAds.forEach(ad => {
      fetch(`/api/advertisements/${ad.id}/impression`, { method: "POST" });
    });
  }, [displayAds.map(ad => ad.id).join(',')]);

  const handleAdClick = async (ad: Advertisement) => {
    await fetch(`/api/advertisements/${ad.id}/click`, { method: "POST" });
    if (ad.websiteUrl) {
      window.open(ad.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (!displayAds.length) return null;

  return (
    <div className={className}>
      <div className="text-xs text-muted-foreground mb-2 text-center">Memorial Services & Products</div>
      <div className="space-y-3">
        {displayAds.map((ad) => (
          <Card 
            key={ad.id} 
            className="hover-elevate cursor-pointer transition-all"
            onClick={() => handleAdClick(ad)}
            data-testid={`ad-${ad.id}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-sm">{ad.productName}</CardTitle>
                    {ad.pricing && (
                      <Badge variant="secondary" className="text-xs">{ad.pricing}</Badge>
                    )}
                  </div>
                  <CardDescription className="text-xs">{ad.companyName}</CardDescription>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </CardHeader>
            {(ad.description || ad.imageUrl) && (
              <CardContent className="pt-0">
                {ad.imageUrl && (
                  <div className="mb-2 h-24 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
                {ad.contactPhone && (
                  <p className="text-xs text-muted-foreground mt-1">Call: {ad.contactPhone}</p>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center mt-2">
        Sponsored
      </div>
    </div>
  );
}
