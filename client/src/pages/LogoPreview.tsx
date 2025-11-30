import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import originalWithWorld from "@assets/generated_images/original_o_with_world_and_feature_icons.png";

const logos = [
  {
    id: "original-world",
    name: "Original O with World & Features",
    description: "The original Opictuary O with Earth globe inside, surrounded by feature icons: messages, birthdays, family trees, QR codes, athletic honors, and memorial flames - all within the O",
    image: originalWithWorld,
  },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-logo-preview-title">
            Opictuary Continuum Logo Options
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-logo-preview-subtitle">
            Original O with world globe and feature icons inside
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {logos.map((logo) => (
            <Card key={logo.id} className="overflow-hidden" data-testid={`card-logo-${logo.id}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl" data-testid={`text-logo-name-${logo.id}`}>{logo.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="max-w-full max-h-[280px] object-contain rounded-lg"
                    data-testid={`img-logo-${logo.id}`}
                  />
                </div>
                <p className="text-sm text-muted-foreground" data-testid={`text-logo-description-${logo.id}`}>
                  {logo.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
