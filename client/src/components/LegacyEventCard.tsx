import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

interface LegacyEventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  description: string;
  isUpcoming?: boolean;
  onRSVP?: () => void;
}

export default function LegacyEventCard({
  title,
  date,
  time,
  location,
  attendeeCount,
  description,
  isUpcoming = false,
  onRSVP
}: LegacyEventCardProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-legacy-event">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-1" data-testid="text-event-title">
              {title}
            </h3>
            {isUpcoming && (
              <Badge className="bg-chart-3 text-white" data-testid="badge-upcoming">
                Upcoming
              </Badge>
            )}
          </div>
        </div>

        <p className="text-muted-foreground mb-4" data-testid="text-event-description">
          {description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-event-datetime">{date} at {time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-event-location">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-event-attendees">{attendeeCount} attending</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={onRSVP}
          data-testid="button-rsvp"
        >
          RSVP to Attend
        </Button>
      </div>
    </Card>
  );
}
