import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function OpictuaryLogoSVG() {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full max-h-[400px]">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a0f29"/>
          <stop offset="50%" stopColor="#2d1b4e"/>
          <stop offset="100%" stopColor="#1a0f29"/>
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
        <radialGradient id="globeGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4a90d9"/>
          <stop offset="70%" stopColor="#2d5a8a"/>
          <stop offset="100%" stopColor="#1a3a5c"/>
        </radialGradient>
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect width="400" height="500" rx="20" fill="url(#bgGradient)"/>
      
      {/* Halo glow */}
      <ellipse cx="200" cy="120" rx="120" ry="40" fill="url(#haloGlow)"/>
      
      {/* Golden halo ring */}
      <ellipse cx="200" cy="120" rx="100" ry="30" fill="none" stroke="url(#goldGradient)" strokeWidth="6"/>
      <ellipse cx="200" cy="120" rx="100" ry="30" fill="#FFD700" fillOpacity="0.2"/>
      
      {/* Large O with globe inside */}
      <circle cx="200" cy="240" r="100" fill="none" stroke="url(#goldGradient)" strokeWidth="12"/>
      
      {/* Earth globe */}
      <circle cx="200" cy="240" r="70" fill="url(#globeGradient)"/>
      <path d="M200 170 Q230 200 200 240 Q170 280 200 310" stroke="#2e8b57" strokeWidth="2" fill="none" opacity="0.6"/>
      <ellipse cx="200" cy="240" rx="70" ry="20" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      
      {/* Feature icons around the O */}
      <circle cx="120" cy="180" r="12" fill="#FFD700" opacity="0.8"/>
      <circle cx="280" cy="180" r="12" fill="#FF6B6B" opacity="0.8"/>
      <circle cx="120" cy="300" r="12" fill="#4ECDC4" opacity="0.8"/>
      <circle cx="280" cy="300" r="12" fill="#95E1D3" opacity="0.8"/>
      <circle cx="100" cy="240" r="10" fill="#F38181" opacity="0.8"/>
      <circle cx="300" cy="240" r="10" fill="#AA96DA" opacity="0.8"/>
      
      {/* Olympic rings */}
      <circle cx="170" cy="350" r="8" fill="none" stroke="#0085C7" strokeWidth="2"/>
      <circle cx="190" cy="350" r="8" fill="none" stroke="#000" strokeWidth="2"/>
      <circle cx="210" cy="350" r="8" fill="none" stroke="#DF0024" strokeWidth="2"/>
      <circle cx="180" cy="360" r="8" fill="none" stroke="#F4C300" strokeWidth="2"/>
      <circle cx="200" cy="360" r="8" fill="none" stroke="#009F3D" strokeWidth="2"/>
      
      {/* Eternal flame */}
      <path d="M230 345 Q235 330 230 320 Q240 330 235 345 Q245 335 240 350 Z" fill="#FF6B35"/>
      
      {/* Opictuary text */}
      <text x="200" y="430" textAnchor="middle" fill="url(#goldGradient)" fontSize="42" fontFamily="serif" fontWeight="bold">
        Opictuary
      </text>
      
      {/* Tagline */}
      <text x="200" y="465" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="sans-serif" opacity="0.8">
        Honoring Life · Preserving Legacy
      </text>
    </svg>
  );
}

export default function BrandLogo2024() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-brand-logo-title">
            New Opictuary Logo Design
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-brand-logo-subtitle">
            O with halo, world globe, varied feature icons, and Opictuary text below
          </p>
        </div>

        <Card className="overflow-hidden" data-testid="card-new-logo">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center" data-testid="text-logo-title">
              Gold Foil Opictuary with Halo & Varied Icons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-8 flex items-center justify-center">
              <OpictuaryLogoSVG />
            </div>
            <p className="text-center text-muted-foreground" data-testid="text-logo-description">
              Golden halo above the O, Earth globe inside with varied feature icons 
              (messages, birthdays, family tree, QR codes, Olympic rings, eternal flame, video, heart, star), 
              and "Opictuary" text at the bottom
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
