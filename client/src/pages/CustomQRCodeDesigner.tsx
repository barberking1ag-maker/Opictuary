import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Memorial } from "@shared/schema";
import { 
  QrCode, 
  Download, 
  Palette, 
  Square, 
  Circle, 
  Heart, 
  Star, 
  Cross,
  Flower2,
  Bird,
  Moon,
  Sun,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface QRShapeConfig {
  id: string;
  name: string;
  icon: any;
  cornerRadius: number;
  dotStyle: "square" | "rounded" | "dots";
}

const qrShapes: QRShapeConfig[] = [
  { id: "square", name: "Classic Square", icon: Square, cornerRadius: 0, dotStyle: "square" },
  { id: "rounded", name: "Rounded", icon: Circle, cornerRadius: 30, dotStyle: "rounded" },
  { id: "dots", name: "Dotted", icon: Sparkles, cornerRadius: 50, dotStyle: "dots" },
];

interface ThemeConfig {
  id: string;
  name: string;
  icon: any;
  primary: string;
  secondary: string;
  background: string;
}

const memorialThemes: ThemeConfig[] = [
  { id: "classic", name: "Classic", icon: Square, primary: "#000000", secondary: "#333333", background: "#FFFFFF" },
  { id: "serenity", name: "Serenity", icon: Moon, primary: "#4A5568", secondary: "#718096", background: "#F7FAFC" },
  { id: "remembrance", name: "Remembrance", icon: Heart, primary: "#7B341E", secondary: "#9C4221", background: "#FFFAF0" },
  { id: "celestial", name: "Celestial", icon: Star, primary: "#2C5282", secondary: "#3182CE", background: "#EBF8FF" },
  { id: "nature", name: "Nature", icon: Flower2, primary: "#276749", secondary: "#38A169", background: "#F0FFF4" },
  { id: "dove", name: "Dove", icon: Bird, primary: "#553C9A", secondary: "#6B46C1", background: "#FAF5FF" },
  { id: "sunset", name: "Sunset", icon: Sun, primary: "#C05621", secondary: "#DD6B20", background: "#FFFBEB" },
  { id: "faith", name: "Faith", icon: Cross, primary: "#702459", secondary: "#97266D", background: "#FFF5F7" },
];

interface FrameConfig {
  id: string;
  name: string;
  borderWidth: number;
  borderStyle: "solid" | "double" | "dashed";
  showLabel: boolean;
  labelPosition: "top" | "bottom";
}

const frames: FrameConfig[] = [
  { id: "none", name: "No Frame", borderWidth: 0, borderStyle: "solid", showLabel: false, labelPosition: "bottom" },
  { id: "simple", name: "Simple Border", borderWidth: 4, borderStyle: "solid", showLabel: false, labelPosition: "bottom" },
  { id: "elegant", name: "Elegant Double", borderWidth: 6, borderStyle: "double", showLabel: false, labelPosition: "bottom" },
  { id: "labeled-top", name: "Label Top", borderWidth: 4, borderStyle: "solid", showLabel: true, labelPosition: "top" },
  { id: "labeled-bottom", name: "Label Bottom", borderWidth: 4, borderStyle: "solid", showLabel: true, labelPosition: "bottom" },
];

export default function CustomQRCodeDesigner() {
  const [memorialUrl, setMemorialUrl] = useState("");
  const [selectedMemorialId, setSelectedMemorialId] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<QRShapeConfig>(qrShapes[0]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(memorialThemes[0]);
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig>(frames[0]);
  const [customLabel, setCustomLabel] = useState("Scan to Remember");
  const [qrSize, setQrSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const { data: memorials } = useQuery<Memorial[]>({
    queryKey: ["/api/memorials"],
  });

  useEffect(() => {
    if (selectedMemorialId && memorials) {
      const memorial = memorials.find(m => m.id === selectedMemorialId);
      if (memorial) {
        setMemorialUrl(`${window.location.origin}/memorial/${memorial.inviteCode}`);
      }
    }
  }, [selectedMemorialId, memorials]);

  const generateQRCode = async () => {
    if (!memorialUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a memorial URL or select a memorial",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const padding = selectedFrame.showLabel ? 50 : 20;
      const totalSize = qrSize + padding * 2;
      canvas.width = totalSize;
      canvas.height = totalSize + (selectedFrame.showLabel ? 30 : 0);

      ctx.fillStyle = selectedTheme.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (selectedFrame.borderWidth > 0) {
        ctx.strokeStyle = selectedTheme.primary;
        ctx.lineWidth = selectedFrame.borderWidth;
        if (selectedFrame.borderStyle === "double") {
          ctx.strokeRect(selectedFrame.borderWidth, selectedFrame.borderWidth, 
            canvas.width - selectedFrame.borderWidth * 2, canvas.height - selectedFrame.borderWidth * 2);
          ctx.strokeRect(selectedFrame.borderWidth * 2.5, selectedFrame.borderWidth * 2.5,
            canvas.width - selectedFrame.borderWidth * 5, canvas.height - selectedFrame.borderWidth * 5);
        } else if (selectedFrame.borderStyle === "dashed") {
          ctx.setLineDash([10, 5]);
          ctx.strokeRect(selectedFrame.borderWidth, selectedFrame.borderWidth,
            canvas.width - selectedFrame.borderWidth * 2, canvas.height - selectedFrame.borderWidth * 2);
          ctx.setLineDash([]);
        } else {
          ctx.strokeRect(selectedFrame.borderWidth, selectedFrame.borderWidth,
            canvas.width - selectedFrame.borderWidth * 2, canvas.height - selectedFrame.borderWidth * 2);
        }
      }

      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, memorialUrl, {
        width: qrSize,
        margin: 2,
        color: {
          dark: selectedTheme.primary,
          light: selectedTheme.background,
        },
        errorCorrectionLevel: "H",
      });

      if (selectedShape.dotStyle === "rounded" || selectedShape.dotStyle === "dots") {
        const tempCtx = qrCanvas.getContext("2d");
        if (tempCtx) {
          const imageData = tempCtx.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
          const data = imageData.data;
          
          const moduleSize = Math.floor(qrCanvas.width / 29);
          
          tempCtx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
          tempCtx.fillStyle = selectedTheme.background;
          tempCtx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
          tempCtx.fillStyle = selectedTheme.primary;
          
          for (let y = 0; y < qrCanvas.height; y += moduleSize) {
            for (let x = 0; x < qrCanvas.width; x += moduleSize) {
              const i = (y * qrCanvas.width + x) * 4;
              if (data[i] < 128) {
                const dotSize = selectedShape.dotStyle === "dots" ? moduleSize * 0.7 : moduleSize;
                const radius = selectedShape.dotStyle === "dots" ? dotSize / 2 : dotSize * 0.3;
                
                if (selectedShape.dotStyle === "dots") {
                  tempCtx.beginPath();
                  tempCtx.arc(x + moduleSize / 2, y + moduleSize / 2, radius, 0, Math.PI * 2);
                  tempCtx.fill();
                } else {
                  roundRect(tempCtx, x, y, moduleSize, moduleSize, radius);
                  tempCtx.fill();
                }
              }
            }
          }
        }
      }

      const qrX = (canvas.width - qrSize) / 2;
      let qrY = (canvas.height - qrSize) / 2;
      if (selectedFrame.showLabel) {
        qrY = selectedFrame.labelPosition === "top" ? padding + 25 : padding;
      }
      
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      if (selectedFrame.showLabel && customLabel) {
        ctx.fillStyle = selectedTheme.primary;
        ctx.font = "bold 16px Inter, sans-serif";
        ctx.textAlign = "center";
        const labelY = selectedFrame.labelPosition === "top" ? padding : canvas.height - padding + 15;
        ctx.fillText(customLabel, canvas.width / 2, labelY);
      }

      setQrCodeDataUrl(canvas.toDataURL("image/png"));
      
      toast({
        title: "QR Code Generated",
        description: "Your custom QR code is ready!",
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement("a");
    link.download = `memorial-qr-${selectedTheme.id}-${Date.now()}.png`;
    link.href = qrCodeDataUrl;
    link.click();
    
    toast({
      title: "Download Started",
      description: "Your QR code is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-violet-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="h-10 w-10 text-violet-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
              Custom QR Code Designer
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful, memorial-themed QR codes with custom shapes, colors, and frames
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Memorial Selection
                </CardTitle>
                <CardDescription>Choose a memorial or enter a custom URL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Memorial</Label>
                  <Select value={selectedMemorialId} onValueChange={setSelectedMemorialId}>
                    <SelectTrigger data-testid="select-memorial">
                      <SelectValue placeholder="Choose a memorial..." />
                    </SelectTrigger>
                    <SelectContent>
                      {memorials?.map((memorial) => (
                        <SelectItem key={memorial.id} value={memorial.id}>
                          {memorial.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Or Enter Custom URL</Label>
                  <Input
                    value={memorialUrl}
                    onChange={(e) => setMemorialUrl(e.target.value)}
                    placeholder="https://opictuary.app/memorial/..."
                    data-testid="input-custom-url"
                  />
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="theme">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="theme" data-testid="tab-theme">
                  <Palette className="mr-2 h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="shape" data-testid="tab-shape">
                  <Square className="mr-2 h-4 w-4" />
                  Shape
                </TabsTrigger>
                <TabsTrigger value="frame" data-testid="tab-frame">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Frame
                </TabsTrigger>
              </TabsList>

              <TabsContent value="theme">
                <Card>
                  <CardHeader>
                    <CardTitle>Memorial Themes</CardTitle>
                    <CardDescription>Choose a color theme that honors the memory</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {memorialThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme)}
                          className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                            selectedTheme.id === theme.id
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                              : "border-border"
                          }`}
                          data-testid={`theme-${theme.id}`}
                        >
                          <div
                            className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                            style={{ backgroundColor: theme.primary }}
                          >
                            <theme.icon className="h-6 w-6 text-white" />
                          </div>
                          <p className="text-sm font-medium text-center">{theme.name}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shape">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Style</CardTitle>
                    <CardDescription>Customize the appearance of the QR modules</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {qrShapes.map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setSelectedShape(shape)}
                          className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                            selectedShape.id === shape.id
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                              : "border-border"
                          }`}
                          data-testid={`shape-${shape.id}`}
                        >
                          <shape.icon className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm font-medium text-center">{shape.name}</p>
                        </button>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>QR Code Size</Label>
                          <Badge variant="secondary">{qrSize}px</Badge>
                        </div>
                        <Slider
                          value={[qrSize]}
                          onValueChange={(value) => setQrSize(value[0])}
                          min={150}
                          max={500}
                          step={10}
                          data-testid="slider-size"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="frame">
                <Card>
                  <CardHeader>
                    <CardTitle>Frame & Label</CardTitle>
                    <CardDescription>Add a decorative frame and custom text</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {frames.map((frame) => (
                        <button
                          key={frame.id}
                          onClick={() => setSelectedFrame(frame)}
                          className={`p-4 rounded-lg border-2 transition-all hover-elevate ${
                            selectedFrame.id === frame.id
                              ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                              : "border-border"
                          }`}
                          data-testid={`frame-${frame.id}`}
                        >
                          <div
                            className="w-12 h-12 mx-auto mb-2"
                            style={{
                              border: frame.borderWidth > 0 ? `${frame.borderWidth}px ${frame.borderStyle} currentColor` : "1px dashed currentColor",
                            }}
                          />
                          <p className="text-sm font-medium text-center">{frame.name}</p>
                        </button>
                      ))}
                    </div>

                    {selectedFrame.showLabel && (
                      <div className="space-y-2">
                        <Label>Custom Label Text</Label>
                        <Input
                          value={customLabel}
                          onChange={(e) => setCustomLabel(e.target.value)}
                          placeholder="Enter label text..."
                          maxLength={30}
                          data-testid="input-label"
                        />
                        <p className="text-xs text-muted-foreground">
                          {30 - customLabel.length} characters remaining
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center mb-6">
                  <div
                    className="rounded-lg overflow-hidden shadow-lg"
                    style={{ backgroundColor: selectedTheme.background }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="max-w-full"
                      style={{ display: qrCodeDataUrl ? "block" : "none" }}
                    />
                    {!qrCodeDataUrl && (
                      <div
                        className="w-64 h-64 flex items-center justify-center"
                        style={{ backgroundColor: selectedTheme.background }}
                      >
                        <div className="text-center text-muted-foreground">
                          <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Generate to preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={generateQRCode}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-500"
                    disabled={isGenerating || !memorialUrl}
                    data-testid="button-generate"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Generate QR Code
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    className="w-full"
                    disabled={!qrCodeDataUrl}
                    data-testid="button-download"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Theme:</span>
                    <Badge variant="secondary">{selectedTheme.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Style:</span>
                    <Badge variant="secondary">{selectedShape.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame:</span>
                    <Badge variant="secondary">{selectedFrame.name}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <Badge variant="secondary">{qrSize}px</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
