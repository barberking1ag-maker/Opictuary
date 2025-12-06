import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function OriginalWorldLogoSVG() {
  return (
    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-[280px]">
      <defs>
        <linearGradient id="previewBgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0f29"/>
          <stop offset="50%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#1a0f29"/>
        </linearGradient>
        <linearGradient id="previewGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <radialGradient id="previewGlobeGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a90d9"/>
          <stop offset="70%" stopColor="#2d5a8a"/>
          <stop offset="100%" stopColor="#1a3a5c"/>
        </radialGradient>
        <radialGradient id="previewHaloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect width="300" height="300" rx="15" fill="url(#previewBgGradient)"/>
      
      {/* Halo glow */}
      <ellipse cx="150" cy="80" rx="80" ry="25" fill="url(#previewHaloGlow)"/>
      
      {/* Golden halo ring */}
      <ellipse cx="150" cy="80" rx="65" ry="20" fill="none" stroke="url(#previewGoldGradient)" strokeWidth="4"/>
      
      {/* Large O with globe inside */}
      <circle cx="150" cy="150" r="70" fill="none" stroke="url(#previewGoldGradient)" strokeWidth="8"/>
      
      {/* Earth globe */}
      <circle cx="150" cy="150" r="50" fill="url(#previewGlobeGradient)"/>
      <path d="M150 100 Q175 125 150 150 Q125 175 150 200" stroke="#2e8b57" strokeWidth="2" fill="none" opacity="0.6"/>
      <ellipse cx="150" cy="150" rx="50" ry="15" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      
      {/* Feature icons */}
      <circle cx="90" cy="120" r="8" fill="#FFD700" opacity="0.8"/>
      <circle cx="210" cy="120" r="8" fill="#FF6B6B" opacity="0.8"/>
      <circle cx="90" cy="180" r="8" fill="#4ECDC4" opacity="0.8"/>
      <circle cx="210" cy="180" r="8" fill="#95E1D3" opacity="0.8"/>
      
      {/* Opictuary text */}
      <text x="150" y="260" textAnchor="middle" fill="url(#previewGoldGradient)" fontSize="28" fontFamily="serif" fontWeight="bold">
        Opictuary
      </text>
    </svg>
  );
}

const logos = [
  {
    id: "original-world",
    name: "Original O with World & Features",
    description: "The original Opictuary O with Earth globe inside, surrounded by feature icons: messages, birthdays, family trees, QR codes, athletic honors, and memorial flames - all within the O",
    component: OriginalWorldLogoSVG,
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
                  <logo.component />
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
