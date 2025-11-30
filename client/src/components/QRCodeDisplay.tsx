import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface QRCodeDisplayProps {
  url: string;
  title: string;
  description: string;
  onDownload?: () => void;
}

export default function QRCodeDisplay({
  url,
  title,
  description,
  onDownload
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        }
      }).then(() => setQrGenerated(true));
    }
  }, [url]);

  return (
    <Card className="overflow-hidden" data-testid="card-qr-code">
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold text-foreground mb-2" data-testid="text-qr-title">
          {title}
        </h3>
        <p className="text-muted-foreground mb-6" data-testid="text-qr-description">
          {description}
        </p>

        <div className="flex justify-center mb-6">
          <div className="bg-white p-6 rounded-lg border-4 border-border">
            <canvas 
              ref={canvasRef} 
              className={qrGenerated ? '' : 'opacity-0'}
              data-testid="canvas-qr-code"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={onDownload}
            data-testid="button-download-qr"
          >
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <code className="text-xs text-foreground break-all" data-testid="text-qr-url">
              {url}
            </code>
          </div>
        </div>
      </div>
    </Card>
  );
}
