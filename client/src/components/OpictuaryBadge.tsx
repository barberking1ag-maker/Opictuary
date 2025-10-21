import badgeImage from "@assets/IMG_0102_1760999703535.jpeg";

interface OpictuaryBadgeProps {
  variant?: "classic" | "halo-tech";
  size?: "small" | "medium" | "large";
  className?: string;
}

export function OpictuaryBadge({ 
  variant = "classic", 
  size = "medium",
  className = ""
}: OpictuaryBadgeProps) {
  const dimensions = {
    small: { width: 60, height: 80 },
    medium: { width: 90, height: 120 },
    large: { width: 300, height: 400 }
  };

  const { width, height } = dimensions[size];
  const scale = width / 300;

  return (
    <div 
      className={`relative rounded-md overflow-hidden shadow-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <img 
        src={badgeImage} 
        alt="Opictuary Badge"
        className="w-full h-full object-cover"
      />
      
      {variant === "classic" ? (
        <ClassicBadgeOverlay scale={scale} />
      ) : (
        <HaloTechBadgeOverlay scale={scale} />
      )}
    </div>
  );
}

function ClassicBadgeOverlay({ scale }: { scale: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <circle cx="150" cy="140" r="70" fill="url(#haloGlow)"/>
      
      <text
        x="150"
        y="170"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '140px',
          fontFamily: 'serif',
          fontWeight: '700',
          filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
        }}
      >
        O
      </text>
      
      <ellipse 
        cx="150" 
        cy="75" 
        rx="70" 
        ry="22" 
        fill="none" 
        stroke="#FFD700" 
        strokeWidth="3.5" 
        opacity="0.95"
      />
      <ellipse 
        cx="150" 
        cy="75" 
        rx="70" 
        ry="22" 
        fill="#FFD700" 
        opacity="0.25"
      />
      
      <text
        x="150"
        y="205"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '42px',
          fontFamily: 'serif',
          fontWeight: '600',
          letterSpacing: '2px',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.9))'
        }}
      >
        pictuary
      </text>
      
      <text
        x="150"
        y="320"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          fontWeight: '500',
          letterSpacing: '0.5px',
          filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.9))'
        }}
      >
        obituary app inspired to help
      </text>
      <text
        x="150"
        y="340"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          fontWeight: '500',
          letterSpacing: '0.5px',
          filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.9))'
        }}
      >
        families through times of need
      </text>
    </svg>
  );
}

function HaloTechBadgeOverlay({ scale }: { scale: number }) {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 300 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="techGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8"/>
          <stop offset="50%" stopColor="#0066FF" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#0033CC" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0"/>
          <stop offset="50%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#B0B0B0"/>
        </linearGradient>
        <linearGradient id="goldTech" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700"/>
          <stop offset="50%" stopColor="#FFA500"/>
          <stop offset="100%" stopColor="#FF8C00"/>
        </linearGradient>
      </defs>
      
      <circle cx="150" cy="140" r="80" fill="url(#techGlow)"/>
      
      <circle 
        cx="150" 
        cy="140" 
        r="95" 
        fill="none" 
        stroke="url(#goldTech)" 
        strokeWidth="3"
        opacity="0.8"
      />
      <circle 
        cx="150" 
        cy="140" 
        r="95" 
        fill="none" 
        stroke="#00D4FF" 
        strokeWidth="1"
        opacity="0.6"
        strokeDasharray="5,5"
      />
      
      <circle 
        cx="150" 
        cy="140" 
        r="75" 
        fill="none" 
        stroke="url(#metalGradient)" 
        strokeWidth="2"
        opacity="0.7"
      />
      
      <text
        x="150"
        y="170"
        textAnchor="middle"
        fill="url(#metalGradient)"
        style={{
          fontSize: '140px',
          fontFamily: 'sans-serif',
          fontWeight: '900',
          filter: 'drop-shadow(0px 0px 10px rgba(0,212,255,0.8)) drop-shadow(3px 3px 6px rgba(0,0,0,0.9))'
        }}
      >
        O
      </text>
      
      <path
        d="M 85 70 Q 150 50 215 70"
        stroke="url(#goldTech)"
        strokeWidth="4"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M 85 70 Q 150 50 215 70"
        stroke="#00D4FF"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
        strokeDasharray="3,3"
      />
      
      <line x1="80" y1="140" x2="100" y2="140" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      <line x1="200" y1="140" x2="220" y2="140" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
      
      <text
        x="150"
        y="215"
        textAnchor="middle"
        fill="url(#metalGradient)"
        style={{
          fontSize: '42px',
          fontFamily: 'sans-serif',
          fontWeight: '700',
          letterSpacing: '4px',
          filter: 'drop-shadow(0px 0px 8px rgba(0,212,255,0.6)) drop-shadow(2px 2px 4px rgba(0,0,0,0.9))'
        }}
      >
        PICTUARY
      </text>
      
      <line 
        x1="100" 
        y1="240" 
        x2="200" 
        y2="240" 
        stroke="url(#goldTech)" 
        strokeWidth="2"
        opacity="0.7"
      />
      
      <text
        x="150"
        y="320"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          fontWeight: '600',
          letterSpacing: '1px',
          filter: 'drop-shadow(0px 0px 5px rgba(0,212,255,0.8)) drop-shadow(1px 1px 3px rgba(0,0,0,0.9))'
        }}
      >
        OBITUARY APP INSPIRED
      </text>
      <text
        x="150"
        y="340"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          fontWeight: '600',
          letterSpacing: '1px',
          filter: 'drop-shadow(0px 0px 5px rgba(0,212,255,0.8)) drop-shadow(1px 1px 3px rgba(0,0,0,0.9))'
        }}
      >
        TO HELP FAMILIES
      </text>
      <text
        x="150"
        y="360"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: '13px',
          fontFamily: 'sans-serif',
          fontWeight: '600',
          letterSpacing: '1px',
          filter: 'drop-shadow(0px 0px 5px rgba(0,212,255,0.8)) drop-shadow(1px 1px 3px rgba(0,0,0,0.9))'
        }}
      >
        THROUGH TIMES OF NEED
      </text>
      
      <circle cx="20" cy="20" r="3" fill="#00D4FF" opacity="0.8"/>
      <circle cx="280" cy="20" r="3" fill="#00D4FF" opacity="0.8"/>
      <circle cx="20" cy="380" r="3" fill="#00D4FF" opacity="0.8"/>
      <circle cx="280" cy="380" r="3" fill="#00D4FF" opacity="0.8"/>
    </svg>
  );
}
