import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shirt, Frame, Sparkles, ExternalLink } from "lucide-react";

interface MerchandiseServicesProps {
  memorialName: string;
  memorialId?: string;
}

const MERCHANDISE_OPTIONS = [
  {
    id: "tshirts",
    icon: Shirt,
    title: "Memorial T-Shirts",
    description: "Custom t-shirts with photos and memorial text",
    features: ["High-quality printing", "Multiple sizes", "Fast shipping"],
    externalUrl: "https://www.customink.com/",
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    id: "cutouts",
    icon: Frame,
    title: "Life-Size Cardboard Cutouts",
    description: "Professional photo cutouts for memorial services",
    features: ["Full-size or custom dimensions", "Durable material", "Stand included"],
    externalUrl: "https://www.cardboardcutoutstandees.com/",
    color: "from-purple-500/10 to-purple-600/10",
  },
  {
    id: "holograms",
    icon: Sparkles,
    title: "Hologram Memorials",
    description: "Interactive 3D holographic displays",
    features: ["Cutting-edge technology", "Customizable messages", "Unforgettable tribute"],
    externalUrl: "https://www.vntana.com/",
    color: "from-amber-500/10 to-amber-600/10",
  },
];

export function MerchandiseServices({ memorialName, memorialId }: MerchandiseServicesProps) {
  const handleServiceClick = (serviceUrl: string, serviceName: string) => {
    window.open(serviceUrl, "_blank", "noopener,noreferrer");
    
    // Track analytics if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "merchandise_click", {
        service_name: serviceName,
        memorial_id: memorialId,
        memorial_name: memorialName,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">
          Memorial Merchandise & Services
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create lasting tributes with custom merchandise and innovative memorial services
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {MERCHANDISE_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              className="hover-elevate active-elevate-2 transition-all"
              data-testid={`card-merchandise-${option.id}`}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleServiceClick(option.externalUrl, option.title)}
                  data-testid={`button-view-${option.id}`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Service
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <p className="text-sm text-center text-muted-foreground">
            These are third-party services. Opictuary partners with trusted providers to offer you the best memorial merchandise options. 
            Contact the service provider directly for pricing and customization details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
