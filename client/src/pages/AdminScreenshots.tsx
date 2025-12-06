import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Image, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function AdminScreenshots() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/generate-screenshots');
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: '8 Google Play Store screenshots generated and compiled into PDF',
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate screenshots',
        variant: 'destructive',
      });
      setIsGenerating(false);
    },
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    generateMutation.mutate();
  };

  const handleDownload = () => {
    window.open('/api/admin/download-screenshots', '_blank');
    toast({
      title: 'Download Started',
      description: 'Your Play Store screenshots PDF is downloading',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Google Play Store Screenshots</h1>
        <p className="text-muted-foreground mt-2">
          Generate and download 8 professional screenshots for your Play Store listing
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Screenshot Generator
            </CardTitle>
            <CardDescription>
              Automatically captures 8 key pages of Opictuary at 1080 x 1920 resolution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm">
              <p className="font-medium">Screenshots will include:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Home - Opictuary Memorial Platform</li>
                <li>Browse Memorials</li>
                <li>Celebrity Memorials</li>
                <li>Grief Support Resources</li>
                <li>Memorial Fundraisers</li>
                <li>Create Memorial</li>
                <li>User Profile</li>
                <li>Essential Workers Memorial</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                data-testid="button-generate-screenshots"
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating... (30-60 seconds)
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-4 w-4" />
                    Generate Screenshots
                  </>
                )}
              </Button>

              <Button
                data-testid="button-download-screenshots"
                onClick={handleDownload}
                variant="outline"
                size="lg"
                disabled={isGenerating}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {isGenerating && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-md p-4">
                <p className="text-sm text-foreground">
                  <strong>Please wait...</strong> Capturing screenshots from your live site using professional screenshot API.
                  This takes 30-60 seconds to complete.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
            <CardDescription>After downloading the PDF</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="font-medium">1. Review the screenshots</p>
              <p className="text-muted-foreground ml-4">
                Open the PDF and verify all 8 screenshots look professional and showcase your app's features
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">2. Upload to Google Play Console</p>
              <p className="text-muted-foreground ml-4">
                In your Play Console, navigate to: Store presence → Main store listing → Graphics → Phone screenshots
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium">3. Add captions (optional)</p>
              <p className="text-muted-foreground ml-4">
                Google recommends adding short captions to highlight key features
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Google Play Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✅ <strong>Minimum:</strong> 2 screenshots required</li>
              <li>✅ <strong>Recommended:</strong> 8 screenshots (what we're generating)</li>
              <li>✅ <strong>Dimensions:</strong> 1080 x 1920 pixels (portrait)</li>
              <li>✅ <strong>Format:</strong> PNG (high quality)</li>
              <li>✅ <strong>Compiled:</strong> Single PDF for easy sharing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
