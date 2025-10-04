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
import { Key } from "lucide-react";

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

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code);
      setCode("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-invite-code">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Enter Access Code</DialogTitle>
          <DialogDescription>
            Please enter the invitation code you received to view this memorial.
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
