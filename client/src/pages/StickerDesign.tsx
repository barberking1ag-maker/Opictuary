import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import QRCode from "qrcode";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.opictuary.app";

const FEATURES = [
  "Immersive Memorial Hubs",
  "AI-Guided Storytelling",
  "Multi-Faith Celebrations",
  "Future Messages & Time Capsules",
  "QR-Connected Keepsakes",
  "Family Trees & Collaboration",
  "Live Streaming",
  "Wedding & Baby Registries",
  "Memorial Products",
];

export default function StickerDesign() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const stickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(GOOGLE_PLAY_URL, {
      width: 200,
      margin: 1,
      color: {
        dark: "#1a1a1a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, []);

  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    const cornerRadius = 30;
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.lineTo(width - cornerRadius, 0);
    ctx.quadraticCurveTo(width, 0, width, cornerRadius);
    ctx.lineTo(width, height - cornerRadius);
    ctx.quadraticCurveTo(width, height, width - cornerRadius, height);
    ctx.lineTo(cornerRadius, height);
    ctx.quadraticCurveTo(0, height, 0, height - cornerRadius);
    ctx.lineTo(0, cornerRadius);
    ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
    ctx.closePath();
    ctx.clip();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#5B2D8E");
    gradient.addColorStop(0.6, "#7B4DAE");
    gradient.addColorStop(1, "#4A1D7A");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const iconImg = new Image();
    iconImg.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      iconImg.onload = () => {
        const iconSize = 160;
        const iconX = (width - iconSize) / 2;
        const iconY = 50;

        const iconRadius = 28;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(iconX + iconRadius, iconY);
        ctx.lineTo(iconX + iconSize - iconRadius, iconY);
        ctx.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + iconRadius);
        ctx.lineTo(iconX + iconSize, iconY + iconSize - iconRadius);
        ctx.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - iconRadius, iconY + iconSize);
        ctx.lineTo(iconX + iconRadius, iconY + iconSize);
        ctx.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - iconRadius);
        ctx.lineTo(iconX, iconY + iconRadius);
        ctx.quadraticCurveTo(iconX, iconY, iconX + iconRadius, iconY);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize);
        ctx.restore();

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(iconX + iconRadius, iconY);
        ctx.lineTo(iconX + iconSize - iconRadius, iconY);
        ctx.quadraticCurveTo(iconX + iconSize, iconY, iconX + iconSize, iconY + iconRadius);
        ctx.lineTo(iconX + iconSize, iconY + iconSize - iconRadius);
        ctx.quadraticCurveTo(iconX + iconSize, iconY + iconSize, iconX + iconSize - iconRadius, iconY + iconSize);
        ctx.lineTo(iconX + iconRadius, iconY + iconSize);
        ctx.quadraticCurveTo(iconX, iconY + iconSize, iconX, iconY + iconSize - iconRadius);
        ctx.lineTo(iconX, iconY + iconRadius);
        ctx.quadraticCurveTo(iconX, iconY, iconX + iconRadius, iconY);
        ctx.closePath();
        ctx.stroke();

        resolve();
      };
      iconImg.src = "/icon-512.png";
    });

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DOWNLOAD ON", width / 2, 250);

    ctx.font = "bold 22px Inter, sans-serif";
    ctx.fillText("Google Play", width / 2, 278);

    if (qrDataUrl) {
      const qrImg = new Image();
      await new Promise<void>((resolve) => {
        qrImg.onload = () => {
          const qrSize = 200;
          const qrX = (width - qrSize) / 2;
          const qrY = 300;

          const qrBgPad = 15;
          const bgRadius = 12;
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.moveTo(qrX - qrBgPad + bgRadius, qrY - qrBgPad);
          ctx.lineTo(qrX + qrSize + qrBgPad - bgRadius, qrY - qrBgPad);
          ctx.quadraticCurveTo(qrX + qrSize + qrBgPad, qrY - qrBgPad, qrX + qrSize + qrBgPad, qrY - qrBgPad + bgRadius);
          ctx.lineTo(qrX + qrSize + qrBgPad, qrY + qrSize + qrBgPad - bgRadius);
          ctx.quadraticCurveTo(qrX + qrSize + qrBgPad, qrY + qrSize + qrBgPad, qrX + qrSize + qrBgPad - bgRadius, qrY + qrSize + qrBgPad);
          ctx.lineTo(qrX - qrBgPad + bgRadius, qrY + qrSize + qrBgPad);
          ctx.quadraticCurveTo(qrX - qrBgPad, qrY + qrSize + qrBgPad, qrX - qrBgPad, qrY + qrSize + qrBgPad - bgRadius);
          ctx.lineTo(qrX - qrBgPad, qrY - qrBgPad + bgRadius);
          ctx.quadraticCurveTo(qrX - qrBgPad, qrY - qrBgPad, qrX - qrBgPad + bgRadius, qrY - qrBgPad);
          ctx.closePath();
          ctx.fill();

          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          resolve();
        };
        qrImg.src = qrDataUrl;
      });
    }

    const dividerY = 555;
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(40, dividerY, width - 80, 1);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 36px 'Crimson Text', Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Opictuary", width / 2, 600);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "16px Inter, sans-serif";
    ctx.fillText("A Celebration Memorial Legacy Platform", width / 2, 632);

    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(40, 650, width - 80, 1);

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";

    const featurePairs: string[] = [];
    for (let i = 0; i < FEATURES.length; i += 2) {
      if (i + 1 < FEATURES.length) {
        featurePairs.push(`${FEATURES[i]}  |  ${FEATURES[i + 1]}`);
      } else {
        featurePairs.push(FEATURES[i]);
      }
    }

    let featureY = 675;
    featurePairs.forEach((line) => {
      ctx.fillText(line, width / 2, featureY);
      featureY += 22;
    });

    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "11px Inter, sans-serif";
    ctx.fillText("Honor every life, in every dimension.", width / 2, height - 40);

    const link = document.createElement("a");
    link.download = "opictuary-sticker.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-2xl font-serif font-bold text-foreground" data-testid="text-sticker-title">
            Sticker Design
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} data-testid="button-print-sticker">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownload} data-testid="button-download-sticker">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            ref={stickerRef}
            className="w-[300px] rounded-2xl overflow-hidden print:w-[400px]"
            style={{
              background: "linear-gradient(180deg, #5B2D8E 0%, #7B4DAE 60%, #4A1D7A 100%)",
            }}
            data-testid="sticker-preview"
          >
            <div className="flex flex-col items-center px-6 pt-8 pb-6">
              <img
                src="/icon-512.png"
                alt="Opictuary App Icon"
                className="w-24 h-24 rounded-2xl mb-4"
                style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                data-testid="img-sticker-icon"
              />

              <p className="text-white/90 text-[10px] font-semibold tracking-widest uppercase mb-0.5">
                Download on
              </p>
              <p className="text-white text-sm font-bold mb-4">
                Google Play
              </p>

              {qrDataUrl && (
                <div className="bg-white rounded-xl p-2.5 mb-4">
                  <img
                    src={qrDataUrl}
                    alt="QR Code to download Opictuary on Google Play"
                    className="w-[140px] h-[140px]"
                    data-testid="img-sticker-qr"
                  />
                </div>
              )}

              <div className="w-full h-px bg-white/20 mb-4" />

              <h2 className="text-white text-xl font-serif font-bold mb-1">
                Opictuary
              </h2>
              <p className="text-white/85 text-[11px] text-center mb-3">
                A Celebration Memorial Legacy Platform
              </p>

              <div className="w-full h-px bg-white/15 mb-3" />

              <div className="text-white/70 text-[9px] text-center leading-relaxed space-y-0.5">
                <p>Immersive Memorial Hubs | AI-Guided Storytelling</p>
                <p>Multi-Faith Celebrations | Future Messages & Time Capsules</p>
                <p>QR-Connected Keepsakes | Family Trees & Collaboration</p>
                <p>Live Streaming | Wedding & Baby Registries</p>
                <p>Memorial Products</p>
              </div>

              <div className="mt-4">
                <p className="text-white/50 text-[8px] text-center">
                  Honor every life, in every dimension.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Download or print this sticker. The QR code links directly to the Google Play Store listing.
          </p>
        </div>
      </div>
    </div>
  );
}
