import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, QrCode as QrCodeIcon } from "lucide-react";
import QRCode from "qrcode";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export default function QRCodeGenerator() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [appUrl, setAppUrl] = useState(window.location.origin);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const dataUrl = await QRCode.toDataURL(appUrl, {
        width: 500,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataUrl(dataUrl);
      toast({
        title: "QR Code Generated",
        description: "Your QR code is ready to download!",
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!qrCodeDataUrl) {
      toast({
        variant: "destructive",
        title: "No QR Code",
        description: "Please generate a QR code first.",
      });
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(126, 58, 242); // Purple color
      pdf.text('Opictuary', 105, 30, { align: 'center' });

      // Add subtitle
      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Digital Memorial Platform', 105, 40, { align: 'center' });

      // Add QR code image
      const qrSize = 120;
      const qrX = (210 - qrSize) / 2; // Center horizontally on A4 width (210mm)
      const qrY = 60;
      pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Add URL below QR code
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(appUrl, 105, qrY + qrSize + 15, { align: 'center' });

      // Add description
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      const description = 'Scan this QR code to visit Opictuary';
      pdf.text(description, 105, qrY + qrSize + 25, { align: 'center' });

      // Add tagline
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Honoring Life, Preserving Legacy', 105, qrY + qrSize + 35, { align: 'center' });

      // Save the PDF
      pdf.save('opictuary-qr-code.pdf');

      toast({
        title: "PDF Downloaded",
        description: "Your QR code PDF has been downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCodeIcon className="w-6 h-6" aria-hidden="true" />
              QR Code Generator
            </CardTitle>
            <CardDescription>
              Generate a QR code for the Opictuary app and download it as a PDF
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="app-url">App URL</Label>
              <Input
                id="app-url"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                placeholder="https://your-app.replit.app"
                data-testid="input-app-url"
              />
            </div>

            <Button
              onClick={generateQRCode}
              disabled={isGenerating || !appUrl}
              className="w-full"
              data-testid="button-generate-qr"
            >
              {isGenerating ? "Generating..." : "Generate QR Code"}
            </Button>

            {qrCodeDataUrl && (
              <div className="space-y-4">
                <div className="flex justify-center p-6 bg-muted rounded-lg">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code for Opictuary app"
                    className="w-64 h-64"
                    data-testid="img-qr-code"
                  />
                </div>

                <Button
                  onClick={downloadPDF}
                  variant="default"
                  className="w-full"
                  data-testid="button-download-pdf"
                >
                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                  Download as PDF
                </Button>

                <div className="p-4 bg-accent/20 rounded-lg border border-accent">
                  <p className="text-sm text-foreground">
                    <strong>Next step:</strong> After downloading the PDF, you can email it to{" "}
                    <span className="font-mono">opictuary@gmail.com</span> or any other email address.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
