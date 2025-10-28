import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ShareObituaryButtonProps {
  memorialId: string;
  deceasedName: string;
}

export function ShareObituaryButton({
  memorialId,
  deceasedName,
}: ShareObituaryButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const shareableUrl = `${window.location.origin}/obituary/${memorialId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Obituary link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Obituary: ${deceasedName}`,
          text: `View the obituary for ${deceasedName}`,
          url: shareableUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "Error",
            description: "Failed to share obituary link.",
            variant: "destructive",
          });
        }
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          data-testid="button-share-obituary"
        >
          <Share2 className="h-4 w-4" />
          Share Obituary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Obituary</DialogTitle>
          <DialogDescription>
            Share a direct link to {deceasedName}'s obituary. No login or invite code required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareableUrl}
              readOnly
              className="flex h-9 w-full rounded-md border border-input bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="input-shareable-url"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
              data-testid="button-copy-url"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={shareViaWebShare}
              className="flex-1 gap-2"
              data-testid="button-share-via-native"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex-1 gap-2"
              data-testid="button-copy-link"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This link provides public access to the obituary only. The full memorial, photos, and fundraisers remain private and require an invite code.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
