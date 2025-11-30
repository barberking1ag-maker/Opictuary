import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import continuumOImage from "@assets/generated_images/continuum_o_with_halo_and_icons.png";
import lifeDimensionsImage from "@assets/generated_images/life_dimensions_o_compass_design.png";
import constellationOImage from "@assets/generated_images/memory_constellation_o_with_stars.png";
import infinityOImage from "@assets/generated_images/infinity_o_with_subtle_icons.png";

export default function LogoShowcase() {
  const logos = [
    {
      id: 1,
      name: "Continuum O",
      description: "White O with golden halo and orbiting feature icons (cake, tree, photos, clock, location)",
      image: continuumOImage,
      vibe: "Classic with evolution - keeps the halo, shows growth"
    },
    {
      id: 2,
      name: "Life Dimensions O",
      description: "Compass rose design with 4 life dimension segments - modern compass aesthetic, no halo",
      image: lifeDimensionsImage,
      vibe: "Contemporary and directional - guides families through life's journey"
    },
    {
      id: 3,
      name: "Memory Constellation O",
      description: "Golden O surrounded by constellation network of connected stars - celestial and connected",
      image: constellationOImage,
      vibe: "Elegant and interconnected - memories as stars in the universe"
    },
    {
      id: 4,
      name: "Infinity O",
      description: "Infinity symbol blended with O, featuring subtle icons (heart, trees, camera, candle)",
      image: infinityOImage,
      vibe: "Eternal and continuous - legacy that never ends"
    }
  ];

  const handleSelect = (logoName: string) => {
    alert(`You selected: ${logoName}\n\nLet me know and I'll integrate this into the app!`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Opictuary Logo Options</h1>
          <p className="text-lg text-muted-foreground">
            Choose the logo that best represents our expanded memorial platform
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            From obituaries to a comprehensive life continuum
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {logos.map((logo) => (
            <Card key={logo.id} className="hover-elevate flex flex-col" data-testid={`card-logo-${logo.id}`}>
              <CardHeader>
                <CardTitle>{logo.name}</CardTitle>
                <CardDescription>{logo.vibe}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col space-y-4">
                <div className="flex-1 bg-secondary rounded-lg p-8 flex items-center justify-center">
                  <img 
                    src={logo.image} 
                    alt={logo.name}
                    className="max-w-48 max-h-48 object-contain"
                    data-testid={`img-logo-${logo.id}`}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {logo.description}
                </p>
                <Button 
                  onClick={() => handleSelect(logo.name)}
                  className="w-full"
                  data-testid={`button-select-logo-${logo.id}`}
                >
                  Select This Logo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Quick Comparison</h2>
          <ul className="space-y-2 text-sm">
            <li><strong>Continuum O:</strong> Best for continuity - keeps familiar halo while adding new feature indicators</li>
            <li><strong>Life Dimensions:</strong> Best for modern tech aesthetic - compass suggests navigation and journey</li>
            <li><strong>Memory Constellation:</strong> Best for emotional connection - stars represent precious memories linked together</li>
            <li><strong>Infinity O:</strong> Best for legacy message - infinity symbolizes continuous remembrance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
