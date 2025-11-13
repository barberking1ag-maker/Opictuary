import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Heart, Flower2, Flame, HandHeart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ReactionCount {
  reactionType: string;
  count: number;
}

interface ReactionsResponse {
  reactions: ReactionCount[];
  userReactions: string[];
}

interface MemorialCondolenceBarProps {
  memorialId: string;
}

const REACTION_TYPES = [
  { type: 'heart', icon: Heart, label: 'Send Love', testId: 'heart' },
  { type: 'prayer', icon: HandHeart, label: 'Send Prayers', testId: 'prayer' },
  { type: 'candle', icon: Flame, label: 'Light a Candle', testId: 'candle' },
  { type: 'flower', icon: Flower2, label: 'Send Flowers', testId: 'flower' },
] as const;

function getSessionId(): string {
  let sessionId = localStorage.getItem('opictuary_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('opictuary_session_id', sessionId);
  }
  return sessionId;
}

export function MemorialCondolenceBar({ memorialId }: MemorialCondolenceBarProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const { data: reactionsData } = useQuery<ReactionsResponse>({
    queryKey: ['/api/memorials', memorialId, 'condolence-reactions'],
    enabled: !!memorialId,
  });

  // Initialize userReactions from API response (source of truth)
  useEffect(() => {
    if (reactionsData?.userReactions) {
      const newReactions = new Set(reactionsData.userReactions);
      setUserReactions(newReactions);
      // Update localStorage as cache
      localStorage.setItem(
        `memorial_reactions_${memorialId}`,
        JSON.stringify(Array.from(newReactions))
      );
    }
  }, [reactionsData?.userReactions, memorialId]);

  const addReactionMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      const payload: any = {
        reactionType,
      };
      
      if (user?.id) {
        payload.userId = user.id;
      } else {
        payload.sessionId = getSessionId();
      }
      
      return apiRequest('POST', `/api/memorials/${memorialId}/condolence-reactions`, payload);
    },
    onMutate: async (reactionType) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ 
        queryKey: ['/api/memorials', memorialId, 'condolence-reactions'] 
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ReactionsResponse>([
        '/api/memorials',
        memorialId,
        'condolence-reactions',
      ]);

      // Optimistically update reactions count
      queryClient.setQueryData<ReactionsResponse>(
        ['/api/memorials', memorialId, 'condolence-reactions'],
        (old) => {
          if (!old) return old;
          
          const existingReaction = old.reactions.find((r) => r.reactionType === reactionType);
          const updatedReactions = existingReaction
            ? old.reactions.map((r) =>
                r.reactionType === reactionType ? { ...r, count: r.count + 1 } : r
              )
            : [...old.reactions, { reactionType, count: 1 }];
          
          return {
            reactions: updatedReactions,
            userReactions: [...old.userReactions, reactionType],
          };
        }
      );

      // Update local state
      const newReactions = new Set(userReactions);
      newReactions.add(reactionType);
      setUserReactions(newReactions);
      localStorage.setItem(
        `memorial_reactions_${memorialId}`,
        JSON.stringify(Array.from(newReactions))
      );

      return { previousData };
    },
    onError: (err: any, reactionType, context) => {
      const is409 = err?.response?.status === 409 || err?.message?.includes("already reacted");
      
      if (is409) {
        // User already reacted - refresh to get current state from server
        queryClient.invalidateQueries({ 
          queryKey: ['/api/memorials', memorialId, 'condolence-reactions'] 
        });
        
        toast({
          title: "Already Reacted",
          description: "You've already sent this condolence",
          variant: "default",
        });
      } else {
        // Other error - rollback
        if (context?.previousData) {
          queryClient.setQueryData(
            ['/api/memorials', memorialId, 'condolence-reactions'],
            context.previousData
          );
        }
        
        // Rollback local state
        const newReactions = new Set(userReactions);
        newReactions.delete(reactionType);
        setUserReactions(newReactions);
        localStorage.setItem(
          `memorial_reactions_${memorialId}`,
          JSON.stringify(Array.from(newReactions))
        );

        toast({
          title: "Error",
          description: err?.response?.data?.message || "Failed to add reaction. Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/memorials', memorialId, 'condolence-reactions'] 
      });
    },
  });

  const removeReactionMutation = useMutation({
    mutationFn: async (reactionType: string) => {
      const payload: any = {};
      
      if (user?.id) {
        payload.userId = user.id;
      } else {
        payload.sessionId = getSessionId();
      }
      
      return apiRequest('DELETE', `/api/memorials/${memorialId}/condolence-reactions/${reactionType}`, payload);
    },
    onMutate: async (reactionType) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ 
        queryKey: ['/api/memorials', memorialId, 'condolence-reactions'] 
      });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<ReactionsResponse>([
        '/api/memorials',
        memorialId,
        'condolence-reactions',
      ]);

      // Optimistically update
      queryClient.setQueryData<ReactionsResponse>(
        ['/api/memorials', memorialId, 'condolence-reactions'],
        (old) => {
          if (!old) return old;
          
          const updatedReactions = old.reactions
            .map((r) =>
              r.reactionType === reactionType ? { ...r, count: Math.max(0, r.count - 1) } : r
            )
            .filter((r) => r.count > 0);
          
          return {
            reactions: updatedReactions,
            userReactions: old.userReactions.filter(r => r !== reactionType),
          };
        }
      );

      // Update local state
      const newReactions = new Set(userReactions);
      newReactions.delete(reactionType);
      setUserReactions(newReactions);
      localStorage.setItem(
        `memorial_reactions_${memorialId}`,
        JSON.stringify(Array.from(newReactions))
      );

      return { previousData };
    },
    onError: (err, reactionType, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['/api/memorials', memorialId, 'condolence-reactions'],
          context.previousData
        );
      }

      // Rollback local state
      const newReactions = new Set(userReactions);
      newReactions.add(reactionType);
      setUserReactions(newReactions);
      localStorage.setItem(
        `memorial_reactions_${memorialId}`,
        JSON.stringify(Array.from(newReactions))
      );

      toast({
        title: "Error",
        description: "Failed to remove reaction. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/memorials', memorialId, 'condolence-reactions'] 
      });
    },
  });

  const handleReactionClick = (reactionType: string) => {
    if (userReactions.has(reactionType)) {
      removeReactionMutation.mutate(reactionType);
    } else {
      addReactionMutation.mutate(reactionType);
    }
  };

  const getReactionCount = (reactionType: string): number => {
    if (!reactionsData?.reactions) return 0;
    const reaction = reactionsData.reactions.find((r) => r.reactionType === reactionType);
    return reaction?.count || 0;
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center">
      {REACTION_TYPES.map(({ type, icon: Icon, label, testId }) => {
        const count = getReactionCount(type);
        const isActive = userReactions.has(type);

        return (
          <Button
            key={type}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleReactionClick(type)}
            disabled={addReactionMutation.isPending || removeReactionMutation.isPending}
            className="gap-2"
            data-testid={`button-condolence-${testId}`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count > 0 && (
              <span
                className="ml-1 px-2 py-0.5 rounded-full text-xs bg-primary/10"
                data-testid={`text-condolence-${testId}-count`}
              >
                {count}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
