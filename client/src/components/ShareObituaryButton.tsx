import { useState } from "react";
import { Share2, Check, Copy, Facebook, Twitter, MessageCircle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

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

  const shareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`;
    window.open(fbUrl, '_blank', 'width=600,height=400');
  };

  const shareTwitter = () => {
    const text = `Remembering ${deceasedName}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareableUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareWhatsApp = () => {
    const text = `View the obituary for ${deceasedName}: ${shareableUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
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
              data-testid="button-copy-link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {navigator.share && (
            <>
              <Button
                onClick={shareViaWebShare}
                className="w-full gap-2"
                data-testid="button-share-via-native"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Separator />
            </>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">Share on social media</p>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={shareFacebook}
                className="gap-2"
                data-testid="button-share-facebook"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={shareTwitter}
                className="gap-2"
                data-testid="button-share-twitter"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={shareWhatsApp}
                className="gap-2"
                data-testid="button-share-whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This link provides public access to the obituary only. The full memorial, photos, and fundraisers remain private and require an invite code.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
