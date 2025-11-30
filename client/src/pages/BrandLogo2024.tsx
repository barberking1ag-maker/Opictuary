import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import newLogo from "@assets/generated_images/original_o_with_world_and_feature_icons.png";

export default function BrandLogo2024() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-brand-logo-title">
            New Opictuary Logo Design
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-brand-logo-subtitle">
            Original O with world globe and all feature icons
          </p>
        </div>

        <Card className="overflow-hidden" data-testid="card-new-logo">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center" data-testid="text-logo-title">
              Original O with World & Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
              <img
                src={newLogo}
                alt="Opictuary Logo - Original O with World Globe and Feature Icons"
                className="max-w-full max-h-[400px] object-contain rounded-lg"
                data-testid="img-new-logo"
              />
            </div>
            <p className="text-center text-muted-foreground" data-testid="text-logo-description">
              The original Opictuary O with Earth globe inside, surrounded by feature icons: 
              messages, birthdays, family trees, QR codes, athletic honors, and memorial flames
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
