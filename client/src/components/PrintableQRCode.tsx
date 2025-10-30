import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, QrCode, Heart, Download } from "lucide-react";
import { OpictuaryLogo } from "./OpictuaryLogo";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface PrintableQRCodeProps {
  qrCodeDataUrl: string;
  memorialName: string;
  purpose?: string;
  instructions?: string;
}

export function PrintableQRCode({
  qrCodeDataUrl,
  memorialName,
  purpose = "Share Memories",
  instructions = "Scan to upload photos and videos"
}: PrintableQRCodeProps) {
  const { toast } = useToast();
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Purple background gradient effect
      pdf.setFillColor(126, 58, 242); // Purple
      pdf.rect(0, 0, 210, 297, 'F');
      
      // White content area
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(15, 15, 180, 267, 3, 3, 'F');

      // Gold accent line at top
      pdf.setFillColor(212, 175, 55); // Gold
      pdf.rect(15, 15, 180, 8, 'F');

      // Title
      pdf.setFontSize(28);
      pdf.setTextColor(126, 58, 242); // Purple
      pdf.setFont('helvetica', 'bold');
      pdf.text(memorialName, 105, 40, { align: 'center', maxWidth: 160 });

      // Purpose/Subtitle
      pdf.setFontSize(16);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.text(purpose, 105, 55, { align: 'center' });

      // QR Code
      const qrSize = 100;
      const qrX = (210 - qrSize) / 2;
      const qrY = 70;
      
      // QR code background (white)
      pdf.setFillColor(255, 255, 255);
      pdf.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 'F');
      
      // Add QR code image
      pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

      // Instructions section
      pdf.setFontSize(14);
      pdf.setTextColor(126, 58, 242);
      pdf.setFont('helvetica', 'bold');
      pdf.text('How to Use:', 105, qrY + qrSize + 20, { align: 'center' });

      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
      const instructionsList = [
        '1. Open your phone\'s camera app',
        '2. Point it at this QR code',
        '3. Tap the notification that appears',
        `4. ${instructions}`
      ];
      
      let yPos = qrY + qrSize + 30;
      instructionsList.forEach(instruction => {
        pdf.text(instruction, 105, yPos, { align: 'center' });
        yPos += 8;
      });

      // Divider line
      pdf.setDrawColor(212, 175, 55); // Gold
      pdf.setLineWidth(0.5);
      pdf.line(30, yPos + 5, 180, yPos + 5);

      // Bottom section
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('This QR code can be placed on tombstones, memorial cards,', 105, yPos + 15, { align: 'center' });
      pdf.text('or anywhere you\'d like to share memories.', 105, yPos + 22, { align: 'center' });

      // Opictuary branding
      pdf.setFontSize(16);
      pdf.setTextColor(126, 58, 242);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Opictuary', 105, yPos + 35, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'italic');
      pdf.text('Honoring Life, Preserving Legacy', 105, yPos + 42, { align: 'center' });

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('opictuary.app', 105, yPos + 50, { align: 'center' });

      // Save the PDF
      const fileName = `${memorialName.replace(/[^a-z0-9]/gi, '_')}_QR_Code.pdf`;
      pdf.save(fileName);

      toast({
        title: "PDF Downloaded",
        description: "Your memorial QR code PDF is ready to print!",
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
    <div>
      {/* Action Buttons - Hidden when printing */}
      <div className="no-print mb-4 flex gap-2">
        <Button
          onClick={handleDownloadPDF}
          className="flex-1"
          data-testid="button-download-pdf-qr"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1"
          data-testid="button-print-qr"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>

      {/* Printable QR Code Card */}
      <Card 
        className="printable-qr-card bg-white text-black border-4 border-black"
        data-testid="card-printable-qr"
      >
        <CardHeader className="text-center pb-4 border-b-2 border-black">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-gold-500 mr-2" />
            <OpictuaryLogo variant="classic" className="scale-90" />
          </div>
          <CardTitle className="text-3xl font-serif text-black">
            {memorialName}
          </CardTitle>
          <p className="text-xl font-semibold text-black mt-2">
            {purpose}
          </p>
        </CardHeader>
        
        <CardContent className="pt-6 text-center">
          {/* QR Code - Large and centered */}
          <div className="flex items-center justify-center mb-6 bg-white p-4">
            <img
              src={qrCodeDataUrl}
              alt="Memorial QR Code"
              className="w-full max-w-md"
              data-testid="img-qr-code"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-4 text-black">
            <div className="border-t-2 border-black pt-4">
              <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
                <QrCode className="w-6 h-6" />
                How to Use
              </h3>
              <ol className="text-left text-lg space-y-2 max-w-lg mx-auto list-decimal list-inside">
                <li className="font-medium">Open your phone's camera app</li>
                <li className="font-medium">Point it at this QR code</li>
                <li className="font-medium">Tap the notification that appears</li>
                <li className="font-medium">{instructions}</li>
              </ol>
            </div>

            <div className="border-t-2 border-black pt-4 mt-4">
              <p className="text-sm font-medium">
                This QR code can be placed on tombstones, memorial cards, or anywhere you'd like to share memories.
              </p>
              <p className="text-lg font-bold mt-2">
                opictuary.app
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @media print {
          /* Hide everything except the printable card */
          body * {
            visibility: hidden;
          }
          
          .printable-qr-card,
          .printable-qr-card * {
            visibility: visible;
          }
          
          .printable-qr-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2cm;
            background: white !important;
            border: 4px solid black !important;
            box-shadow: none !important;
          }

          /* Ensure QR code prints clearly */
          img {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color-adjust: exact;
          }

          /* Hide the print button */
          .no-print {
            display: none !important;
          }

          /* Ensure black text prints */
          * {
            color: black !important;
            border-color: black !important;
          }

          /* Force colors for icons */
          .text-gold-500 {
            color: #d4af37 !important;
          }
        }

        /* Screen styling for preview */
        @media screen {
          .printable-qr-card {
            max-width: 800px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
