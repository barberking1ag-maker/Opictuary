import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, QrCode, Heart } from "lucide-react";
import { OpictuaryLogo } from "./OpictuaryLogo";

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
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Print Button - Hidden when printing */}
      <div className="no-print mb-4">
        <Button
          onClick={handlePrint}
          className="w-full"
          data-testid="button-print-qr"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print QR Code
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
