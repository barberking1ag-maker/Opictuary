import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import titaniumWorld from "@assets/generated_images/titanium_o_with_world_globe.png";
import titaniumHalo from "@assets/generated_images/titanium_o_with_halo_orbit.png";
import titaniumConstellation from "@assets/generated_images/titanium_o_constellation_network.png";
import titaniumGlobal from "@assets/generated_images/titanium_o_global_network_map.png";

const logos = [
  {
    id: "world",
    name: "Titanium O with World Globe",
    description: "Sleek titanium O with Earth visible behind it, orbital ring with feature icons - messages, birthdays, family trees, QR codes, athletic honors, and memorial flames",
    image: titaniumWorld,
  },
  {
    id: "halo",
    name: "Titanium O with Halo Orbit",
    description: "Polished titanium O with glowing halo orbit, feature symbols floating in the orbital path with cosmic background",
    image: titaniumHalo,
  },
  {
    id: "constellation",
    name: "Titanium O Constellation Network",
    description: "Refined titanium O with constellation-style connected dots radiating outward, each node representing a platform feature",
    image: titaniumConstellation,
  },
  {
    id: "global",
    name: "Titanium O Global Network",
    description: "Majestic titanium O with world map inside, global network lines connecting to feature icons representing worldwide memorial connections",
    image: titaniumGlobal,
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
            New Titanium O designs representing all platform features - choose your favorite
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
