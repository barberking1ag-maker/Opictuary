import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface CemeteryMapProps {
  cemeteryName: string;
  sectionLocation: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  onGetDirections?: () => void;
}

export default function CemeteryMap({
  cemeteryName,
  sectionLocation,
  coordinates,
  onGetDirections
}: CemeteryMapProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-cemetery-map">
      <div className="p-6">
        <h3 className="text-2xl font-serif font-semibold text-foreground mb-2" data-testid="text-cemetery-name">
          {cemeteryName}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <MapPin className="w-4 h-4" />
          <span data-testid="text-section-location">{sectionLocation}</span>
        </div>

        <div className="bg-muted rounded-lg h-64 flex items-center justify-center mb-6">
          <div className="text-center p-8">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground" data-testid="text-map-placeholder">
              Interactive map would display here
            </p>
            {coordinates && (
              <p className="text-xs text-muted-foreground mt-2">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={onGetDirections}
          data-testid="button-get-directions"
        >
          <Navigation className="w-5 h-5 mr-2" />
          Get Directions
        </Button>
      </div>
    </Card>
  );
}
