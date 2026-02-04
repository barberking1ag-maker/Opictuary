import opictuaryIcon from "@assets/IMG_0164_1763131894014.jpeg";

interface OpictuaryLogoProps {
  variant?: "classic" | "halo-tech"; // Kept for backward compatibility
  showTagline?: boolean;
  className?: string;
}

export function OpictuaryLogo({ 
  variant = "classic", // This prop is now a no-op but kept for compatibility
  showTagline = true,
  className = ""
}: OpictuaryLogoProps) {
  // Compact horizontal layout for headers (when no tagline)
  if (!showTagline) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative w-10 h-10 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
          <img 
            src={opictuaryIcon} 
            alt="Opictuary"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-lg font-serif font-bold text-foreground leading-tight">
          Opictuary
        </h1>
      </div>
    );
  }

  // Full vertical layout with tagline
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md">
        <img 
          src={opictuaryIcon} 
          alt="Opictuary"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-serif font-bold text-foreground leading-tight">
          Opictuary
        </h1>
        <span className="text-xs text-muted-foreground tracking-wide text-center">
          Honoring Life · Preserving Legacy
        </span>
      </div>
    </div>
  );
}
