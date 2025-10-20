import { Card } from "@/components/ui/card";
import badgeImage from "@assets/IMG_0102_1760999703535.jpeg";

export default function BadgePreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">
          Opictuary App Badge
        </h1>
        
        <Card className="p-8">
          <div className="flex justify-center items-center">
            <div className="relative w-[300px] h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={badgeImage} 
                alt="Opictuary Badge"
                className="w-full h-full object-cover"
              />
              
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 400" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Central O with Halo */}
                <g>
                  {/* Glow effect */}
                  <defs>
                    <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6"/>
                      <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  
                  {/* Background glow */}
                  <circle cx="150" cy="140" r="70" fill="url(#haloGlow)"/>
                  
                  {/* Large O */}
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
                  
                  {/* Golden Halo above O */}
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
                  
                  {/* "pictuary" text below O - matching the app style */}
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
                </g>
                
                {/* Tagline at bottom */}
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
            </div>
          </div>
          
          <div className="text-center mt-8">
            <h2 className="text-2xl font-serif font-semibold mb-2">Opictuary</h2>
            <p className="text-muted-foreground italic">
              obituary app inspired to help families through times of need
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
