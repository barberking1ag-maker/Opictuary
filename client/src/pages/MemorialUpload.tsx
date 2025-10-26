import { useState } from "react";
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get memorial by invite code
  const { data: memorial, isLoading } = useQuery<Memorial>({
    queryKey: ["/api/memorials/code", code],
    enabled: !!code,
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/memorials/${memorial?.id}/memories`, {
        method: "POST",
        body: data,
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Upload failed");
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
      setSelectedFile(null);
      setPreviewUrl(null);
      
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

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

    if (!selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a photo or video to upload.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("type", selectedFile.type.startsWith("video") ? "video" : "photo");
    formData.append("caption", message);
    formData.append("submitterName", uploaderName);
    formData.append("file", selectedFile);

    uploadMutation.mutate(formData);
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file" className="text-purple-100">
                  Photo or Video *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    data-testid="input-file"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    required
                    className="bg-purple-950/50 border-purple-700/50 text-purple-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gold-500 file:text-purple-950 hover:file:bg-gold-600"
                  />
                </div>
                <p className="text-xs text-purple-400">
                  Accepted formats: JPG, PNG, GIF, MP4, MOV (max 50MB)
                </p>
              </div>

              {/* Preview */}
              {previewUrl && selectedFile && (
                <div className="space-y-2">
                  <Label className="text-purple-100">Preview</Label>
                  <div className="rounded-lg overflow-hidden border border-purple-700/50 bg-purple-950/50">
                    {selectedFile.type.startsWith("image") ? (
                      <div className="flex items-center justify-center p-4">
                        <ImageIcon className="w-6 h-6 text-gold-400 mr-2" />
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-8">
                        <Video className="w-12 h-12 text-gold-400 mr-3" />
                        <div>
                          <p className="text-purple-100 font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-purple-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-purple-100">
                  Message (Optional)
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
