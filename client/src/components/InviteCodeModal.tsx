import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Key, Camera } from "lucide-react";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useToast } from "@/hooks/use-toast";

interface InviteCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (code: string) => void;
}

export default function InviteCodeModal({
  open,
  onOpenChange,
  onSubmit
}: InviteCodeModalProps) {
  const [code, setCode] = useState("");
  const { scanQRCode, isScanning, isNative } = useQRScanner();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code);
      setCode("");
    }
  };

  const handleScanQR = async () => {
    const scannedCode = await scanQRCode();
    if (scannedCode) {
      const codeMatch = scannedCode.match(/inviteCode=([^&]+)/);
      if (codeMatch) {
        const extractedCode = codeMatch[1];
        setCode(extractedCode);
        onSubmit(extractedCode);
      } else if (scannedCode.length <= 20) {
        setCode(scannedCode);
        onSubmit(scannedCode);
      } else {
        toast({
          title: "Invalid QR Code",
          description: "This QR code doesn't contain a valid memorial access code.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-invite-code">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Enter Access Code</DialogTitle>
          <DialogDescription>
            {isNative 
              ? "Enter the code or scan the QR code to view this memorial."
              : "Please enter the invitation code you received to view this memorial."
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="pl-10 text-center text-lg tracking-wider"
              data-testid="input-access-code"
            />
          </div>
          
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={!code.trim()}
            data-testid="button-submit-code"
          >
            Access Memorial
          </Button>

          {isNative && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full" 
                size="lg"
                onClick={handleScanQR}
                disabled={isScanning}
                data-testid="button-scan-qr"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isScanning ? "Scanning..." : "Scan QR Code"}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
