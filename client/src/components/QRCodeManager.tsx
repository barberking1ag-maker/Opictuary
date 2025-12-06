import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Plus, Loader2, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PrintableQRCode } from "./PrintableQRCode";

interface QRCode {
  id: string;
  code: string;
  purpose: string;
  title?: string;
  description?: string;
  createdAt: string;
}

interface QRCodeManagerProps {
  memorialId: string;
  memorialName: string;
  inviteCode: string;
}

export function QRCodeManager({ memorialId, memorialName, inviteCode }: QRCodeManagerProps) {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedPurpose, setSelectedPurpose] = useState("tombstone_upload");
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const { toast } = useToast();

  const { data: qrCodes, isLoading } = useQuery<QRCode[]>({
    queryKey: ["/api/memorials", memorialId, "qr-codes"],
  });

  const generateMutation = useMutation({
    mutationFn: async (purpose: string) => {
      const res = await apiRequest("POST", `/api/memorials/${memorialId}/qr-codes`, { purpose });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "qr-codes"] });
      toast({
        title: "QR Code Generated",
        description: "Your printable QR code is ready.",
      });
      setIsGenerateDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (qrCodeId: string) => {
      await apiRequest("DELETE", `/api/qr-codes/${qrCodeId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memorials", memorialId, "qr-codes"] });
      toast({
        title: "QR Code Deleted",
        description: "The QR code has been removed.",
      });
      setSelectedQRCode(null);
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    generateMutation.mutate(selectedPurpose);
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case "tombstone_upload":
        return "Tombstone Upload";
      case "upload":
        return "Photo/Video Upload";
      case "tombstone":
        return "Memorial View";
      default:
        return purpose;
    }
  };

  const getPurposeInstructions = (purpose: string) => {
    switch (purpose) {
      case "tombstone_upload":
      case "upload":
        return "Upload photos and videos to share memories";
      case "tombstone":
        return "View and honor this memorial";
      default:
        return "Scan to interact with the memorial";
    }
  };

  // Find upload QR codes
  const uploadQRCodes = qrCodes?.filter(qr => 
    qr.purpose === "tombstone_upload" || qr.purpose === "upload"
  ) || [];

  return (
    <Card className="bg-purple-900/50 border-purple-700/50" data-testid="card-qr-manager">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-purple-100 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Codes
            </CardTitle>
            <CardDescription className="text-purple-300">
              Generate printable QR codes for uploading photos and videos
            </CardDescription>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                data-testid="button-generate-qr"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-purple-900 border-purple-700">
              <DialogHeader>
                <DialogTitle className="text-purple-100">Generate QR Code</DialogTitle>
                <DialogDescription className="text-purple-300">
                  Create a printable QR code for this memorial
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-purple-100">
                    QR Code Purpose
                  </Label>
                  <Select
                    value={selectedPurpose}
                    onValueChange={setSelectedPurpose}
                  >
                    <SelectTrigger
                      id="purpose"
                      data-testid="select-qr-purpose"
                      className="bg-purple-950/50 border-purple-700/50 text-purple-100"
                    >
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tombstone_upload">Tombstone Upload (Recommended)</SelectItem>
                      <SelectItem value="upload">Photo/Video Upload</SelectItem>
                      <SelectItem value="tombstone">Memorial View Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-purple-400">
                    {selectedPurpose === "tombstone_upload" && "Perfect for placing on gravestones - allows visitors to upload photos and videos"}
                    {selectedPurpose === "upload" && "General upload QR code for sharing on memorial cards or announcements"}
                    {selectedPurpose === "tombstone" && "Links to memorial view page without upload functionality"}
                  </p>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending}
                  className="w-full"
                  data-testid="button-confirm-generate"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-gold-400 animate-spin mx-auto mb-2" />
            <p className="text-purple-300">Loading QR codes...</p>
          </div>
        ) : uploadQRCodes.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-purple-700/50 rounded-lg">
            <QrCode className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-purple-300 mb-2">No upload QR codes yet</p>
            <p className="text-sm text-purple-400 mb-4">
              Generate a QR code to place on the tombstone or share with visitors
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadQRCodes.map((qr) => (
              <div
                key={qr.id}
                className="border border-purple-700/50 rounded-lg p-4 bg-purple-950/30"
                data-testid={`qr-code-item-${qr.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-purple-100">
                      {getPurposeLabel(qr.purpose)}
                    </h4>
                    <p className="text-sm text-purple-400">
                      Created {new Date(qr.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedQRCode(qr)}
                      data-testid={`button-view-qr-${qr.id}`}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      View & Print
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(qr.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-qr-${qr.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center bg-white p-2 rounded">
                  <img
                    src={qr.code}
                    alt="QR Code Preview"
                    className="w-24 h-24"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Printable QR Code Dialog */}
        <Dialog open={!!selectedQRCode} onOpenChange={(open) => !open && setSelectedQRCode(null)}>
          <DialogContent className="max-w-4xl bg-purple-900 border-purple-700">
            <DialogHeader>
              <DialogTitle className="text-purple-100">Printable QR Code</DialogTitle>
              <DialogDescription className="text-purple-300">
                Print this QR code to place on the tombstone or memorial
              </DialogDescription>
            </DialogHeader>
            
            {selectedQRCode && (
              <PrintableQRCode
                qrCodeDataUrl={selectedQRCode.code}
                memorialName={memorialName}
                purpose={getPurposeLabel(selectedQRCode.purpose)}
                instructions={getPurposeInstructions(selectedQRCode.purpose)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
