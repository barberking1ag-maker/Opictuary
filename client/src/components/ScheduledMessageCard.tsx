import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Edit, Trash2, Clock, CheckCircle2, User } from "lucide-react";
import { format } from "date-fns";

interface ScheduledMessage {
  id: string;
  recipientName: string;
  recipientEmail: string | null;
  eventType: string;
  eventDate: string | null;
  message: string;
  mediaUrl: string | null;
  mediaType: string | null;
  isSent: boolean;
  sentAt: string | null;
  createdAt: string;
}

interface ScheduledMessageCardProps {
  message: ScheduledMessage;
  onEdit: (message: ScheduledMessage) => void;
  onDelete: (id: string) => void;
}

const eventTypeLabels: Record<string, string> = {
  birthday: "Birthday",
  graduation: "Graduation",
  wedding: "Wedding",
  anniversary: "Anniversary",
  baby_birth: "Baby Birth",
  holiday: "Holiday",
  custom: "Custom Event",
};

const eventTypeColors: Record<string, string> = {
  birthday: "bg-pink-500/20 text-pink-100 border-pink-500/30",
  graduation: "bg-blue-500/20 text-blue-100 border-blue-500/30",
  wedding: "bg-rose-500/20 text-rose-100 border-rose-500/30",
  anniversary: "bg-purple-500/20 text-purple-100 border-purple-500/30",
  baby_birth: "bg-cyan-500/20 text-cyan-100 border-cyan-500/30",
  holiday: "bg-green-500/20 text-green-100 border-green-500/30",
  custom: "bg-gold-500/20 text-gold-100 border-gold-500/30",
};

export function ScheduledMessageCard({ message, onEdit, onDelete }: ScheduledMessageCardProps) {
  const eventLabel = eventTypeLabels[message.eventType] || message.eventType;
  const eventColor = eventTypeColors[message.eventType] || eventTypeColors.custom;

  return (
    <Card 
      className="bg-purple-900/50 border-purple-700/50 hover-elevate" 
      data-testid={`card-scheduled-message-${message.id}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-purple-100 flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gold-400" />
              {message.recipientName}
            </CardTitle>
            <CardDescription className="text-purple-300 space-y-1">
              {message.recipientEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-3 h-3" />
                  {message.recipientEmail}
                </div>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {message.isSent ? (
              <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-500/30">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Sent
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-purple-500/20 text-purple-100 border-purple-500/30">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
            <Badge variant="outline" className={eventColor}>
              {eventLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Date */}
        {message.eventDate && (
          <div className="flex items-center gap-2 text-purple-200">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span className="text-sm">
              {format(new Date(message.eventDate), "MMMM d, yyyy")}
            </span>
          </div>
        )}

        {/* Message Preview */}
        <div className="bg-purple-950/50 rounded-lg p-3 border border-purple-700/30">
          <p className="text-purple-200 text-sm line-clamp-3">
            {message.message}
          </p>
        </div>

        {/* Media Indicator */}
        {message.mediaUrl && (
          <div className="text-xs text-purple-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-gold-400 rounded-full"></span>
            Includes {message.mediaType || "media"}
          </div>
        )}

        {/* Actions */}
        {!message.isSent && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(message)}
              className="flex-1"
              data-testid={`button-edit-message-${message.id}`}
            >
              <Edit className="w-3 h-3 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(message.id)}
              className="flex-1 text-red-300 border-red-500/30 hover:bg-red-500/20"
              data-testid={`button-delete-message-${message.id}`}
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </Button>
          </div>
        )}

        {/* Sent Info */}
        {message.isSent && message.sentAt && (
          <div className="text-xs text-purple-400 pt-2 border-t border-purple-700/30">
            Sent on {format(new Date(message.sentAt), "MMM d, yyyy 'at' h:mm a")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
