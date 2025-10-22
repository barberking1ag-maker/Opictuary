import badgeImage from "@assets/IMG_0102_1761123956374.jpeg";

interface OpictuaryLogoProps {
  variant?: "classic" | "halo-tech";
  showTagline?: boolean;
  className?: string;
}

export function OpictuaryLogo({ 
  variant = "classic",
  showTagline = true,
  className = ""
}: OpictuaryLogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative w-12 h-12 rounded-md overflow-hidden shadow-md">
        <img 
          src={badgeImage} 
          alt="Opictuary"
          className="w-full h-full object-cover"
        />
        {variant === "classic" ? (
          <ClassicLogoOverlay />
        ) : (
          <HaloTechLogoOverlay />
        )}
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-serif font-bold text-foreground leading-tight">
          Opictuary
        </h1>
        {showTagline && (
          <span className="text-xs text-muted-foreground tracking-wide text-center">
            Honoring Life · Preserving Legacy
          </span>
        )}
      </div>
    </div>
  );
}

function ClassicLogoOverlay() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="logoHaloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <circle cx="50" cy="50" r="30" fill="url(#logoHaloGlow)"/>
      
      <text
        x="50"
        y="65"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '60px',
          fontFamily: 'serif',
          fontWeight: '700',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9))'
        }}
      >
        O
      </text>
      
      <ellipse 
        cx="50" 
        cy="25" 
        rx="30" 
        ry="9" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="2" 
        opacity="0.95"
      />
      <ellipse 
        cx="50" 
        cy="25" 
        rx="30" 
        ry="9" 
        fill="#FFD700" 
        opacity="0.25"
      />
    </svg>
  );
}

function HaloTechLogoOverlay() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="logoTechGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#0066FF" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#0033CC" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="logoMetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#B0B0B0"/>
        </linearGradient>
        <linearGradient id="logoGoldTech" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </linearGradient>
      </defs>
      
      <circle cx="50" cy="50" r="35" fill="url(#logoTechGlow)"/>
      
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="none" 
        stroke="url(#logoGoldTech)" 
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle 
        cx="50" 
        cy="50" 
        r="42" 
        fill="none" 
        stroke="#00D4FF" 
        strokeWidth="0.5"
        opacity="0.6"
        strokeDasharray="3,3"
      />
      
      <text
        x="50"
        y="65"
        textAnchor="middle"
        fill="url(#logoMetalGradient)"
        style={{
          fontSize: '60px',
          fontFamily: 'sans-serif',
          fontWeight: '900',
          filter: 'drop-shadow(0px 0px 5px rgba(0,212,255,0.8)) drop-shadow(2px 2px 4px rgba(0,0,0,0.9))'
        }}
      >
        O
      </text>
      
      <path
        d="M 30 23 Q 50 15 70 23"
        stroke="url(#logoGoldTech)"
        strokeWidth="2"
        fill="none"
        opacity="0.9"
      />
    </svg>
  );
}
