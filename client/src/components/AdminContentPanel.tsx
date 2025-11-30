import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Eye, Shield } from "lucide-react";
import type { Memory } from "@shared/schema";

interface AdminContentPanelProps {
  pendingMemories: Memory[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPreview: (memory: Memory) => void;
}

export default function AdminContentPanel({
  pendingMemories,
  onApprove,
  onReject,
  onPreview
}: AdminContentPanelProps) {
  if (pendingMemories.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mb-8 bg-amber-50/30 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Administrator Approval Queue
        </h3>
        <Badge variant="secondary" className="ml-auto" data-testid="badge-pending-count">
          {pendingMemories.length} Pending
        </Badge>
      </div>

      <div className="space-y-3">
        {pendingMemories.map((memory) => {
          const initials = memory.authorName.split(' ').map(n => n[0]).join('').slice(0, 2);
          
          return (
            <Card key={memory.id} className="p-4 bg-card" data-testid={`admin-memory-${memory.id}`}>
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{memory.authorName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(memory.createdAt || "").toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{memory.caption}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPreview(memory)}
                    data-testid={`button-preview-${memory.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onApprove(memory.id)}
                    data-testid={`button-approve-${memory.id}`}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(memory.id)}
                    data-testid={`button-reject-${memory.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}
