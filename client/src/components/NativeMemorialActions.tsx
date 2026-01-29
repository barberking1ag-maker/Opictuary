import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useHaptics } from "@/hooks/useHaptics";
import { useToast } from "@/hooks/use-toast";
import { usePlatform } from "@/hooks/usePlatform";
import { nativeShare } from "@/lib/mobileUtils";
import { Flame, Share2, Camera, MessageCircle, Download, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { saveMemorialOffline, getOfflineMemorial, removeOfflineMemorial } from "@/lib/offlineStorage";

interface NativeMemorialActionsProps {
  memorialId: string;
  memorialName: string;
  memorial?: any;
  onAddMemory?: () => void;
  onAddCondolence?: () => void;
}

export function NativeMemorialActions({ 
  memorialId, 
  memorialName,
  memorial,
  onAddMemory,
  onAddCondolence 
}: NativeMemorialActionsProps) {
  const { isNative, isMobile } = usePlatform();
  const { impact, notification } = useHaptics();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [candleLit, setCandleLit] = useState(false);
  const [candleAnimation, setCandleAnimation] = useState(false);
  const [isSavedOffline, setIsSavedOffline] = useState(false);
  const [savingOffline, setSavingOffline] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      const saved = await getOfflineMemorial(memorialId);
      setIsSavedOffline(!!saved);
    };
    checkSaved();
  }, [memorialId]);

  const candleMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/memorials/${memorialId}/reactions`, {
        reactionType: "candle"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "reactions"] });
    }
  });

  const handleLightCandle = async () => {
    if (candleLit) return;
    
    impact('heavy');
    setCandleAnimation(true);
    
    try {
      await candleMutation.mutateAsync();
      setCandleLit(true);
      setCandleAnimation(false);
      notification('success');
      toast({
        title: "Candle Lit",
        description: `A candle has been lit in memory of ${memorialName}`,
      });
    } catch (error) {
      setCandleAnimation(false);
      notification('error');
      toast({
        title: "Unable to Light Candle",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    impact('light');
    const shareUrl = `${window.location.origin}/memorial/${memorialId}`;
    
    const shared = await nativeShare({
      title: `${memorialName} - Memorial`,
      text: `Honoring the memory of ${memorialName}`,
      url: shareUrl,
      dialogTitle: "Share Memorial",
    });

    if (shared) {
      notification('success');
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Memorial link copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Share Failed",
          description: "Unable to copy link. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAddPhoto = () => {
    impact('medium');
    if (onAddMemory) {
      onAddMemory();
    }
  };

  const handleAddCondolence = () => {
    impact('light');
    if (onAddCondolence) {
      onAddCondolence();
    }
  };

  const handleSaveOffline = async () => {
    if (!memorial) {
      toast({
        title: "Cannot Save",
        description: "Memorial data not available",
        variant: "destructive",
      });
      return;
    }

    setSavingOffline(true);
    impact('medium');

    try {
      if (isSavedOffline) {
        await removeOfflineMemorial(memorialId);
        setIsSavedOffline(false);
        notification('success');
        toast({
          title: "Removed from Offline",
          description: "This memorial is no longer saved for offline viewing",
        });
      } else {
        await saveMemorialOffline({ ...memorial, id: memorialId });
        setIsSavedOffline(true);
        notification('success');
        toast({
          title: "Saved for Offline",
          description: "You can now view this memorial without internet",
        });
      }
    } catch (error) {
      notification('error');
      toast({
        title: "Save Failed",
        description: "Unable to save memorial for offline viewing",
        variant: "destructive",
      });
    } finally {
      setSavingOffline(false);
    }
  };

  if (!isNative && !isMobile) {
    return null;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-lg">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-2">
          {/* Light Candle */}
          <button
            onClick={handleLightCandle}
            disabled={candleLit}
            data-testid="button-light-candle"
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300",
              "active:scale-90",
              candleLit 
                ? "bg-amber-500/20" 
                : "bg-card hover:bg-card/80"
            )}
          >
            <div className={cn(
              "relative w-10 h-10 flex items-center justify-center",
              candleAnimation && "animate-pulse"
            )}>
              <Flame 
                className={cn(
                  "w-6 h-6 transition-all duration-500",
                  candleLit 
                    ? "text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" 
                    : "text-muted-foreground"
                )} 
              />
              {candleLit && (
                <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg animate-pulse" />
              )}
            </div>
            <span className={cn(
              "text-[10px] font-medium mt-1",
              candleLit ? "text-amber-500" : "text-muted-foreground"
            )}>
              {candleLit ? "Lit" : "Candle"}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            data-testid="button-share-memorial"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-card hover:bg-card/80 transition-all active:scale-90"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-medium mt-1 text-muted-foreground">Share</span>
          </button>

          {/* Add Photo */}
          <button
            onClick={handleAddPhoto}
            data-testid="button-add-photo"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-card hover:bg-card/80 transition-all active:scale-90"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-medium mt-1 text-muted-foreground">Photo</span>
          </button>

          {/* Add Message */}
          <button
            onClick={handleAddCondolence}
            data-testid="button-add-message"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-card hover:bg-card/80 transition-all active:scale-90"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <span className="text-[10px] font-medium mt-1 text-muted-foreground">Message</span>
          </button>

          {/* Save Offline */}
          <button
            onClick={handleSaveOffline}
            disabled={savingOffline}
            data-testid="button-save-offline"
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl transition-all active:scale-90",
              isSavedOffline 
                ? "bg-green-500/20" 
                : "bg-card hover:bg-card/80"
            )}
          >
            <div className={cn(
              "w-10 h-10 flex items-center justify-center",
              savingOffline && "animate-pulse"
            )}>
              {isSavedOffline ? (
                <Check className="w-6 h-6 text-green-500" />
              ) : (
                <Download className="w-6 h-6 text-primary" />
              )}
            </div>
            <span className={cn(
              "text-[10px] font-medium mt-1",
              isSavedOffline ? "text-green-500" : "text-muted-foreground"
            )}>
              {isSavedOffline ? "Saved" : "Offline"}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
