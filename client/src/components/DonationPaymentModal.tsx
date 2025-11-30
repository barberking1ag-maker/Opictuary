import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, Loader2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface DonationPaymentFormProps {
  fundraiserId: string;
  fundraiserTitle: string;
  amount: string;
  donorName: string;
  isAnonymous: boolean;
  clientSecret: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function DonationPaymentForm({
  fundraiserId,
  fundraiserTitle,
  amount,
  donorName,
  isAnonymous,
  clientSecret,
  onSuccess,
  onCancel,
}: DonationPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        const res = await apiRequest("POST", `/api/fundraisers/${fundraiserId}/donations`, {
          donorName,
          amount,
          isAnonymous,
          stripePaymentId: paymentIntent.id,
        });
        
        const donation = await res.json();
        
        toast({
          title: "Donation Successful",
          description: `Thank you for your $${amount} donation!`,
        });
        
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process donation",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-accent/10 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Donation Amount</span>
          <span className="text-2xl font-bold text-foreground" data-testid="text-donation-amount">
            ${amount}
          </span>
        </div>
      </div>

      <PaymentElement />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
          data-testid="button-cancel-donation"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1"
          data-testid="button-complete-donation"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Complete Donation
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

interface DonationPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fundraiserId: string;
  fundraiserTitle: string;
  onSuccess: () => void;
}

export default function DonationPaymentModal({
  open,
  onOpenChange,
  fundraiserId,
  fundraiserTitle,
  onSuccess,
}: DonationPaymentModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const resetForm = () => {
    setStep('details');
    setDonorName("");
    setAmount("");
    setIsAnonymous(false);
    setClientSecret("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleContinueToPayment = async () => {
    if (!donorName.trim() || !amount || Number(amount) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter your name and a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingIntent(true);
    try {
      const res = await apiRequest("POST", `/api/fundraisers/${fundraiserId}/create-donation-payment-intent`, {
        amount: Number(amount),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setStep('payment');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleSuccess = () => {
    resetForm();
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-donation-payment">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Make a Donation</DialogTitle>
          <DialogDescription>
            Support {fundraiserTitle}
          </DialogDescription>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="donorName">Your Name*</Label>
              <Input
                id="donorName"
                placeholder="John Smith"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                data-testid="input-donor-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount (USD)*</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="50.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  data-testid="input-donation-amount"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                data-testid="checkbox-anonymous"
              />
              <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                Make this donation anonymous
              </Label>
            </div>

            <Button
              onClick={handleContinueToPayment}
              disabled={isCreatingIntent}
              className="w-full"
              size="lg"
              data-testid="button-continue-to-payment"
            >
              {isCreatingIntent ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Preparing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && clientSecret && (
          <div className="py-4">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <DonationPaymentForm
                fundraiserId={fundraiserId}
                fundraiserTitle={fundraiserTitle}
                amount={amount}
                donorName={donorName}
                isAnonymous={isAnonymous}
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
                onCancel={() => setStep('details')}
              />
            </Elements>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
