import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import continuumLogo from "@assets/generated_images/continuum_o_with_halo_and_icons.png";
import compassLogo from "@assets/generated_images/life_dimensions_o_compass_design.png";
import constellationLogo from "@assets/generated_images/memory_constellation_o_with_stars.png";
import infinityLogo from "@assets/generated_images/infinity_o_with_subtle_icons.png";

const logos = [
  {
    id: "continuum",
    name: "Continuum O with Halo",
    description: "Golden halo encircling the O with orbiting feature icons representing birthdays, messages, family trees, and more",
    image: continuumLogo,
  },
  {
    id: "compass",
    name: "Life Dimensions Compass",
    description: "Compass rose design with the O at center, directional points leading to different life dimensions",
    image: compassLogo,
  },
  {
    id: "constellation",
    name: "Memory Constellation",
    description: "The O formed by connected stars and nodes, representing interconnected memories and relationships",
    image: constellationLogo,
  },
  {
    id: "infinity",
    name: "Infinity O",
    description: "Infinity symbol integrated with the O, subtle icons woven into the continuous loop",
    image: infinityLogo,
  },
];

export default function LogoPreview() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-logo-preview-title">
            Opictuary Logo Options
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-logo-preview-subtitle">
            Four design variations that retain the iconic "O" while showcasing the platform's expanded capabilities
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
                    className="max-w-full max-h-[280px] object-contain"
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
