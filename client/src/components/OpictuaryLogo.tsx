interface OpictuaryLogoProps {
  variant?: "classic" | "halo-tech";
  showTagline?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function OpictuaryLogo({ 
  variant = "classic",
  showTagline = true,
  className = "",
  size = "md"
}: OpictuaryLogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  
  const textSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`relative ${sizeClasses[size]} rounded-xl overflow-hidden shadow-lg`}>
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B3FA0"/>
              <stop offset="30%" stopColor="#5A3490"/>
              <stop offset="70%" stopColor="#4A2D7A"/>
              <stop offset="100%" stopColor="#3D2468"/>
            </linearGradient>
            <linearGradient id="haloGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A227"/>
              <stop offset="50%" stopColor="#E6C229"/>
              <stop offset="100%" stopColor="#C9A227"/>
            </linearGradient>
            <filter id="haloGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="100" height="100" rx="18" fill="url(#purpleGradient)"/>
          
          <ellipse 
            cx="50" 
            cy="22" 
            rx="24" 
            ry="8" 
            fill="none" 
            stroke="url(#haloGold)" 
            strokeWidth="3.5"
            filter="url(#haloGlow)"
          />
          
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fill="white"
            style={{
              fontSize: '58px',
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontWeight: '400',
              letterSpacing: '-0.02em',
            }}
          >
            O
          </text>
        </svg>
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className={`${textSizes[size]} font-serif font-bold text-foreground leading-tight`}>
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

export function OpictuaryIcon({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
    >
      <defs>
        <linearGradient id="iconPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B3FA0"/>
          <stop offset="30%" stopColor="#5A3490"/>
          <stop offset="70%" stopColor="#4A2D7A"/>
          <stop offset="100%" stopColor="#3D2468"/>
        </linearGradient>
        <linearGradient id="iconHaloGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A227"/>
          <stop offset="50%" stopColor="#E6C229"/>
          <stop offset="100%" stopColor="#C9A227"/>
        </linearGradient>
        <filter id="iconHaloGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="100" height="100" rx="18" fill="url(#iconPurpleGradient)"/>
      
      <ellipse 
        cx="50" 
        cy="22" 
        rx="24" 
        ry="8" 
        fill="none" 
        stroke="url(#iconHaloGold)" 
        strokeWidth="3.5"
        filter="url(#iconHaloGlow)"
      />
      
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fill="white"
        style={{
          fontSize: '58px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          letterSpacing: '-0.02em',
        }}
      >
        O
      </text>
    </svg>
  );
}
