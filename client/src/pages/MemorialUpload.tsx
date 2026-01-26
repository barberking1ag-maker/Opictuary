import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image as ImageIcon, Video, Heart, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";

interface Memorial {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

export default function MemorialUpload() {
  const { code } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [uploaderName, setUploaderName] = useState("");
  const [message, setMessage] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  // Get memorial by invite code
  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials/code", code],
    enabled: !!code,
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/qr-codes/${code}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(error.error || "Upload failed");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload Successful",
        description: "Your photo or video has been shared with the memorial.",
      });
      
      // Reset form
      setUploaderName("");
      setMessage("");
      setMediaUrl("");
      
      // Navigate to memorial view after a brief delay
      setTimeout(() => {
        navigate(`/memorial/${code}`);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scanMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", `/api/qr-codes/${code}/scan`, data);
    },
  });

  useEffect(() => {
    if (code) {
      // Detect device info
      const ua = navigator.userAgent;
      const deviceType = /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 
                        /Tablet|iPad/i.test(ua) ? 'tablet' : 'desktop';
      
      // Detect browser
      let browser = 'Unknown';
      if (ua.includes('Chrome')) browser = 'Chrome';
      else if (ua.includes('Safari')) browser = 'Safari';
      else if (ua.includes('Firefox')) browser = 'Firefox';
      else if (ua.includes('Edge')) browser = 'Edge';
      
      // Detect OS
      let operatingSystem = 'Unknown';
      if (ua.includes('Windows')) operatingSystem = 'Windows';
      else if (ua.includes('Mac')) operatingSystem = 'macOS';
      else if (ua.includes('Linux')) operatingSystem = 'Linux';
      else if (ua.includes('Android')) operatingSystem = 'Android';
      else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) operatingSystem = 'iOS';
      
      // Track scan with geolocation consent
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // User granted geolocation permission
            scanMutation.mutate({
              geolocationConsent: true,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              deviceType,
              browser,
              operatingSystem,
              action: 'view_memorial',
            });
          },
          (error) => {
            // User denied permission or geolocation unavailable
            console.log('Geolocation denied or unavailable:', error.message);
            scanMutation.mutate({ 
              geolocationConsent: false,
              deviceType,
              browser,
              operatingSystem,
              action: 'view_memorial',
            });
          }
        );
      } else {
        // Geolocation API not supported - no consent given
        scanMutation.mutate({ 
          geolocationConsent: false,
          deviceType,
          browser,
          operatingSystem,
          action: 'view_memorial',
        });
      }
    }
  }, [code]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploaderName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim() && !mediaUrl.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter a message or provide a media URL.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      authorName: uploaderName,
      caption: message || "Shared via QR code",
      mediaUrl: mediaUrl || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-200">Loading memorial...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-purple-900/50 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-100">Memorial Not Found</CardTitle>
            <CardDescription className="text-purple-300">
              The memorial you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/")}
              className="w-full"
              data-testid="button-go-home"
            >
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950">
      {/* Header */}
      <header className="border-b border-purple-700/50 bg-purple-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <OpictuaryLogo />
            <Button
              variant="ghost"
              onClick={() => navigate(`/memorial/${code}`)}
              className="text-purple-200 hover:text-purple-100"
              data-testid="button-view-memorial"
            >
              View Memorial
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-gold-400" />
            <h1 className="text-3xl font-serif text-purple-100">
              Share a Memory
            </h1>
          </div>
          <p className="text-xl text-purple-200 mb-2">
            {memorial.firstName} {memorial.lastName}
          </p>
          <p className="text-purple-300">
            Upload a photo or video to honor their memory
          </p>
        </div>

        <Card className="bg-purple-900/50 border-purple-700/50">
          <CardHeader>
            <CardTitle className="text-purple-100 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Photo or Video
            </CardTitle>
            <CardDescription className="text-purple-300">
              Share a cherished moment that will be added to the memorial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Uploader Name */}
              <div className="space-y-2">
                <Label htmlFor="uploaderName" className="text-purple-100">
                  Your Name *
                </Label>
                <Input
                  id="uploaderName"
                  data-testid="input-uploader-name"
                  placeholder="Enter your name"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  required
                  className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
                />
              </div>

              {/* Media URL */}
              <div className="space-y-2">
                <Label htmlFor="mediaUrl" className="text-purple-100">
                  Photo or Video URL (Optional)
                </Label>
                <Input
                  id="mediaUrl"
                  data-testid="input-media-url"
                  placeholder="https://example.com/photo.jpg"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
                />
                <p className="text-xs text-purple-400">
                  Paste a link to your photo or video (hosted on Imgur, Google Photos, etc.)
                </p>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-purple-100">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  data-testid="input-message"
                  placeholder="Share a memory or message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="bg-purple-950/50 border-purple-700/50 text-purple-100 placeholder:text-purple-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={uploadMutation.isPending}
                data-testid="button-upload-submit"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Share Memory
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-purple-400">
            Your upload will be reviewed and added to the memorial shortly.
          </p>
        </div>
      </main>
    </div>
  );
}
