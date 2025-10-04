import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MoreVertical } from "lucide-react";
import { useState } from "react";

interface MemoryCardProps {
  authorName: string;
  authorAvatar?: string;
  imageUrl?: string;
  caption: string;
  timestamp: string;
  commentCount: number;
  isPending?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onComment?: () => void;
}

export default function MemoryCard({
  authorName,
  authorAvatar,
  imageUrl,
  caption,
  timestamp,
  commentCount,
  isPending = false,
  onApprove,
  onReject,
  onComment
}: MemoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Card className={`overflow-hidden shadow-sm ${isPending ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200' : ''}`} data-testid={`card-memory-${isPending ? 'pending' : 'approved'}`}>
      {isPending && (
        <div className="px-6 py-3 bg-amber-100/50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-800">
          <Badge variant="outline" className="bg-amber-200 dark:bg-amber-900 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-100">
            Pending Approval
          </Badge>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={authorAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground" data-testid="text-author-name">{authorName}</h3>
            <p className="text-sm text-muted-foreground" data-testid="text-timestamp">{timestamp}</p>
          </div>
          <Button size="icon" variant="ghost" data-testid="button-memory-options">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={imageUrl} alt="Memory" className="w-full h-64 object-cover" data-testid="img-memory" />
          </div>
        )}

        <p className={`text-foreground leading-relaxed ${!isExpanded && 'line-clamp-3'}`} data-testid="text-memory-caption">
          {caption}
        </p>
        {caption.length > 150 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary mt-2 hover:underline"
            data-testid="button-expand-caption"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onComment}
            data-testid="button-comment"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {isPending && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
            <Button 
              className="flex-1" 
              onClick={onApprove}
              data-testid="button-approve"
            >
              Approve
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onReject}
              data-testid="button-reject"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
