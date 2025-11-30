import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Memory } from "@shared/schema";

interface MemoryTimelineProps {
  memories: Memory[];
}

export default function MemoryTimeline({ memories }: MemoryTimelineProps) {
  const sortedMemories = [...memories].sort((a, b) => 
    new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
  );

  const groupedByDate = sortedMemories.reduce((acc, memory) => {
    const date = new Date(memory.createdAt || "").toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedByDate).map(([date, dateMemories]) => (
        <div key={date} className="relative">
          <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-sm py-2 mb-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">{date}</h3>
          </div>
          
          <div className="space-y-4 pl-6 border-l-2 border-border">
            {dateMemories.map((memory) => {
              const initials = memory.authorName.split(' ').map(n => n[0]).join('').slice(0, 2);
              
              return (
                <Card key={memory.id} className="p-4 -ml-8 shadow-sm" data-testid={`timeline-memory-${memory.id}`}>
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{memory.authorName}</h4>
                      {memory.mediaUrl && (
                        <img 
                          src={memory.mediaUrl} 
                          alt="Memory" 
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                      )}
                      <p className="text-foreground leading-relaxed">{memory.caption}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
