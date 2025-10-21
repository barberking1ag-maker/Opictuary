import { Card } from "@/components/ui/card";
import badgeImage from "@assets/IMG_0102_1760999703535.jpeg";

export default function BadgePreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">
          Opictuary App Badges
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Classic Angel Halo Badge */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Classic Angel Halo</h2>
            <div className="flex justify-center items-center">
              <div className="relative w-[300px] h-[400px] rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={badgeImage} 
                  alt="Opictuary Badge - Classic"
                  className="w-full h-full object-cover"
                />
                
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
                  
                  {/* "pictuary" text below O */}
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
                  
                  {/* Tagline */}
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
            <p className="text-sm text-muted-foreground text-center mt-4">
              Traditional design with golden angel halo
            </p>
          </Card>

          {/* Halo-Inspired Tech Badge */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Halo-Inspired Design</h2>
            <div className="flex justify-center items-center">
              <div className="relative w-[300px] h-[400px] rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={badgeImage} 
                  alt="Opictuary Badge - Halo Inspired"
                  className="w-full h-full object-cover"
                />
                
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
                  
                  {/* Tech background glow */}
                  <circle cx="150" cy="140" r="80" fill="url(#techGlow)"/>
                  
                  {/* Halo Ring - Large outer ring (like Halo installation) */}
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
                  
                  {/* Inner tech ring */}
                  <circle 
                    cx="150" 
                    cy="140" 
                    r="75" 
                    fill="none" 
                    stroke="url(#metalGradient)" 
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  
                  {/* Large O with metallic effect */}
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
                  
                  {/* Top arc with tech segments */}
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
                  
                  {/* Tech detail lines */}
                  <line x1="80" y1="140" x2="100" y2="140" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
                  <line x1="200" y1="140" x2="220" y2="140" stroke="#00D4FF" strokeWidth="2" opacity="0.8"/>
                  
                  {/* "pictuary" text with futuristic styling */}
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
                  
                  {/* Tech divider */}
                  <line 
                    x1="100" 
                    y1="240" 
                    x2="200" 
                    y2="240" 
                    stroke="url(#goldTech)" 
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  
                  {/* Tagline with tech styling */}
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
                  
                  {/* Corner tech details */}
                  <circle cx="20" cy="20" r="3" fill="#00D4FF" opacity="0.8"/>
                  <circle cx="280" cy="20" r="3" fill="#00D4FF" opacity="0.8"/>
                  <circle cx="20" cy="380" r="3" fill="#00D4FF" opacity="0.8"/>
                  <circle cx="280" cy="380" r="3" fill="#00D4FF" opacity="0.8"/>
                </svg>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Futuristic Halo-inspired design with tech elements
            </p>
          </Card>
        </div>

        <div className="text-center mt-8">
          <h2 className="text-2xl font-serif font-semibold mb-2">Opictuary</h2>
          <p className="text-muted-foreground italic">
            obituary app inspired to help families through times of need
          </p>
        </div>
      </div>
    </div>
  );
}
