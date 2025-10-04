import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface CondolenceMessageProps {
  authorName: string;
  authorAvatar?: string;
  message: string;
  timestamp: string;
}

export default function CondolenceMessage({
  authorName,
  authorAvatar,
  message,
  timestamp
}: CondolenceMessageProps) {
  const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Card className="p-6 shadow-sm" data-testid="card-condolence">
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={authorAvatar} />
          <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <h4 className="font-semibold text-foreground" data-testid="text-condolence-author">
              {authorName}
            </h4>
            <span className="text-xs text-muted-foreground" data-testid="text-condolence-time">
              {timestamp}
            </span>
          </div>
          <p className="text-foreground leading-relaxed" data-testid="text-condolence-message">
            {message}
          </p>
        </div>
      </div>
    </Card>
  );
}
