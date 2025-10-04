import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, DollarSign } from "lucide-react";
import { useState } from "react";

interface DonationGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  celebrityName: string;
  charityName: string;
  donationAmount: number;
  platformPercentage?: number;
  onSubmit: (amount: number, email: string) => void;
}

export default function DonationGateModal({
  open,
  onOpenChange,
  celebrityName,
  charityName,
  donationAmount,
  platformPercentage = 5,
  onSubmit
}: DonationGateModalProps) {
  const [email, setEmail] = useState("");
  const charityAmount = donationAmount * ((100 - platformPercentage) / 100);
  const platformAmount = donationAmount * (platformPercentage / 100);

  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(donationAmount, email);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-donation-gate">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Unlock Memorial</DialogTitle>
          <DialogDescription>
            Support {charityName} and gain access to {celebrityName}'s memorial
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-accent/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-foreground">Donation Breakdown</span>
              <span className="text-2xl font-bold text-foreground" data-testid="text-total-amount">
                ${donationAmount}
              </span>
            </div>
            
            <Separator className="mb-3" />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">To {charityName}</span>
                <span className="font-medium text-foreground" data-testid="text-charity-amount">
                  ${charityAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee ({platformPercentage}%)</span>
                <span className="font-medium text-foreground" data-testid="text-platform-amount">
                  ${platformAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              data-testid="input-donation-email"
            />
            <p className="text-xs text-muted-foreground">
              Receive access confirmation and donation receipt
            </p>
          </div>
          
          <Button 
            className="w-full bg-chart-3 hover:bg-chart-3 text-white" 
            size="lg"
            onClick={handleSubmit}
            disabled={!email.trim()}
            data-testid="button-complete-donation"
          >
            <Heart className="w-5 h-5 mr-2" />
            Complete Donation
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
