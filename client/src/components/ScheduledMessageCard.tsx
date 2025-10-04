import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Calendar, User } from "lucide-react";

interface ScheduledMessageCardProps {
  recipientName: string;
  eventType: string;
  triggerDate: string;
  messagePreview: string;
  isLocked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ScheduledMessageCard({
  recipientName,
  eventType,
  triggerDate,
  messagePreview,
  isLocked = true,
  onEdit,
  onDelete
}: ScheduledMessageCardProps) {
  return (
    <Card className="overflow-hidden" data-testid="card-scheduled-message">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-serif font-semibold text-foreground" data-testid="text-message-event">
              {eventType}
            </h3>
          </div>
          {isLocked && (
            <Badge variant="outline" className="bg-primary/10" data-testid="badge-locked">
              Locked
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-recipient">To: {recipientName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground" data-testid="text-trigger-date">Sends on: {triggerDate}</span>
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 mb-4">
          <p className="text-sm text-muted-foreground italic line-clamp-3" data-testid="text-message-preview">
            {messagePreview}
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onEdit}
            data-testid="button-edit-message"
          >
            Edit Message
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onDelete}
            data-testid="button-delete-message"
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
