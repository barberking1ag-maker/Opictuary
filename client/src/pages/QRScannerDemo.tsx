import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScanLine, Camera, QrCode, ArrowRight, Smartphone, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function QRScannerDemo() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [manualCode, setManualCode] = useState("");

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      if (manualCode.includes('/memorial/')) {
        const memorialId = manualCode.split('/memorial/').pop();
        if (memorialId) {
          navigate(`/memorial/${memorialId}`);
          return;
        }
      }
      
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidPattern.test(manualCode.trim())) {
        navigate(`/memorial/${manualCode.trim()}`);
        return;
      }
      
      toast({
        title: "Invalid Code",
        description: "Please enter a valid memorial URL or ID",
        variant: "destructive",
      });
    }
  };

  const handleDemoMemorial = () => {
    navigate("/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81");
  };

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <ScanLine className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">QR Memorial Scanner</h1>
          <p className="text-muted-foreground">
            Instantly visit any memorial by scanning its QR code
          </p>
        </div>

        {/* Native App Prompt */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Smartphone className="w-5 h-5 text-primary" />
              Native Camera Scanning
            </CardTitle>
            <CardDescription>
              On the Opictuary mobile app, the QR scanner uses your device's camera for instant memorial access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <Camera className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">Point & Scan</p>
                <p className="text-xs text-muted-foreground">
                  Tap the scan button in the tab bar to activate your camera
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <QrCode className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">QR-Enabled Products</p>
                <p className="text-xs text-muted-foreground">
                  Scan QR codes on memorial plaques, jewelry, and keepsakes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-card border">
              <Sparkles className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">Instant Access</p>
                <p className="text-xs text-muted-foreground">
                  View memorials, photos, and stories in seconds
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Manual Entry</CardTitle>
            <CardDescription>
              Enter a memorial URL or ID directly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Memorial URL or ID"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              data-testid="input-memorial-code"
            />
            <Button 
              onClick={handleManualEntry}
              className="w-full"
              disabled={!manualCode.trim()}
              data-testid="button-go-to-memorial"
            >
              Go to Memorial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Demo */}
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Try scanning a memorial to see how it works
            </p>
            <Button 
              variant="outline" 
              onClick={handleDemoMemorial}
              data-testid="button-view-demo"
            >
              <QrCode className="w-4 h-4 mr-2" />
              View Demo Memorial
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
