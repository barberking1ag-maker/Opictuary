import { Card } from "@/components/ui/card";
import { OpictuaryBadge } from "@/components/OpictuaryBadge";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function BadgePreview() {
  const [copiedSize, setCopiedSize] = useState<string | null>(null);

  const handleCopySize = (size: string) => {
    setCopiedSize(size);
    setTimeout(() => setCopiedSize(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-4">
          Opictuary App Badges
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Reusable badge components integrated throughout the platform
        </p>

        {/* Logo Component Examples */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Navigation Logo Component</h2>
          <p className="text-muted-foreground mb-6">
            The logo component used in the navigation header - see it at the top of this page!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Classic Angel Halo Logo</h3>
              <div className="flex justify-center p-6 bg-card/50 rounded-lg">
                <OpictuaryLogo variant="classic" showTagline={true} />
              </div>
              <div className="flex justify-center mt-4">
                <OpictuaryLogo variant="classic" showTagline={false} />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                With and without tagline
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Halo-Tech Logo</h3>
              <div className="flex justify-center p-6 bg-card/50 rounded-lg">
                <OpictuaryLogo variant="halo-tech" showTagline={true} />
              </div>
              <div className="flex justify-center mt-4">
                <OpictuaryLogo variant="halo-tech" showTagline={false} />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                With and without tagline
              </p>
            </div>
          </div>
        </Card>

        {/* Full Size Badges */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Classic Angel Halo Badge */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Classic Angel Halo</h2>
              <Badge variant="secondary">Traditional</Badge>
            </div>
            <div className="flex justify-center items-center">
              <OpictuaryBadge variant="classic" size="large" />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Traditional design with golden angel halo - elegant and timeless
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" data-testid="button-download-classic">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>

          {/* Halo-Inspired Tech Badge */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Halo-Inspired Design</h2>
              <Badge variant="secondary">Futuristic</Badge>
            </div>
            <div className="flex justify-center items-center">
              <OpictuaryBadge variant="halo-tech" size="large" />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Futuristic Halo-inspired design with tech elements and metallic styling
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" data-testid="button-download-halo">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </Card>
        </div>

        {/* Badge Sizes */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Badge Sizes</h2>
          <p className="text-muted-foreground mb-6">
            Available in three sizes: small (60x80), medium (90x120), and large (300x400)
          </p>

          <div className="space-y-8">
            {/* Classic Sizes */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                Classic Angel Halo - All Sizes
              </h3>
              <div className="flex flex-wrap items-end justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="classic" size="small" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("small-classic")}
                    data-testid="button-copy-small-classic"
                  >
                    {copiedSize === "small-classic" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Small
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="classic" size="medium" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("medium-classic")}
                    data-testid="button-copy-medium-classic"
                  >
                    {copiedSize === "medium-classic" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Medium
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="classic" size="large" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("large-classic")}
                    data-testid="button-copy-large-classic"
                  >
                    {copiedSize === "large-classic" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Large
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Halo-Tech Sizes */}
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                Halo-Inspired Tech - All Sizes
              </h3>
              <div className="flex flex-wrap items-end justify-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="halo-tech" size="small" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("small-tech")}
                    data-testid="button-copy-small-tech"
                  >
                    {copiedSize === "small-tech" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Small
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="halo-tech" size="medium" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("medium-tech")}
                    data-testid="button-copy-medium-tech"
                  >
                    {copiedSize === "medium-tech" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Medium
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <OpictuaryBadge variant="halo-tech" size="large" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopySize("large-tech")}
                    data-testid="button-copy-large-tech"
                  >
                    {copiedSize === "large-tech" ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Large
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Usage Examples */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Where You'll See These Badges</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-card/50 rounded-lg">
              <h3 className="font-medium mb-2">Navigation Header</h3>
              <p className="text-sm text-muted-foreground">
                The logo component is displayed in the top navigation bar across all pages
              </p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <h3 className="font-medium mb-2">Footer</h3>
              <p className="text-sm text-muted-foreground">
                Small badge displayed in the footer of every page for brand consistency
              </p>
            </div>
            <div className="p-4 bg-card/50 rounded-lg">
              <h3 className="font-medium mb-2">Marketing Materials</h3>
              <p className="text-sm text-muted-foreground">
                Large badges perfect for app store listings, social media, and promotional content
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-serif font-semibold mb-2">Opictuary</h2>
          <p className="text-muted-foreground italic">
            obituary app inspired to help families through times of need
          </p>
        </div>
      </div>
    </div>
  );
}
