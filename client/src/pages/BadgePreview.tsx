import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import imgPath from "@assets/IMG_0052_1759994087086.jpeg";

export default function BadgePreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-8">
          Badge Options Preview
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Option 1: SVG Badge from Scratch</h2>
            <div className="flex justify-center items-center min-h-[400px] bg-muted/30 rounded-lg p-4">
              <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD700" stopOpacity="0.4"/>
                    <stop offset="50%" stopColor="#FFD700" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                
                <rect width="300" height="400" fill="hsl(var(--card))" rx="8"/>
                
                <text
                  x="30"
                  y="60"
                  className="fill-foreground"
                  style={{
                    fontSize: '32px',
                    fontFamily: 'serif',
                    fontWeight: '600',
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright'
                  }}
                >
                  OPICTUARY
                </text>
                
                <circle cx="150" cy="250" r="80" fill="url(#glow)"/>
                <circle cx="150" cy="250" r="60" stroke="hsl(var(--primary))" strokeWidth="4" fill="none"/>
                
                <text
                  x="150"
                  y="270"
                  textAnchor="middle"
                  className="fill-primary"
                  style={{
                    fontSize: '120px',
                    fontFamily: 'serif',
                    fontWeight: '600'
                  }}
                >
                  O
                </text>
                
                <ellipse 
                  cx="150" 
                  cy="190" 
                  rx="65" 
                  ry="20" 
                  fill="none" 
                  stroke="#FFD700" 
                  strokeWidth="3" 
                  opacity="0.9"
                />
                <ellipse 
                  cx="150" 
                  cy="190" 
                  rx="65" 
                  ry="20" 
                  fill="#FFD700" 
                  opacity="0.15"
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Custom SVG design with vertical text and centered O with halo
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Option 2: Your Image with SVG Overlay</h2>
            <div className="flex justify-center items-center min-h-[400px] bg-muted/30 rounded-lg p-4 relative">
              <div className="relative w-[300px] h-[400px]">
                <img 
                  src={imgPath} 
                  alt="Badge background"
                  className="w-full h-full object-cover rounded-lg"
                />
                
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 300 400" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <text
                    x="30"
                    y="60"
                    className="fill-white"
                    style={{
                      fontSize: '32px',
                      fontFamily: 'serif',
                      fontWeight: '700',
                      writingMode: 'vertical-rl',
                      textOrientation: 'upright',
                      filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.8))'
                    }}
                  >
                    OPICTUARY
                  </text>
                  
                  <ellipse 
                    cx="150" 
                    cy="280" 
                    rx="70" 
                    ry="22" 
                    fill="none" 
                    stroke="#FFD700" 
                    strokeWidth="3" 
                    opacity="0.95"
                  />
                  <ellipse 
                    cx="150" 
                    cy="280" 
                    rx="70" 
                    ry="22" 
                    fill="#FFD700" 
                    opacity="0.2"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Your image with vertical text and halo overlay
            </p>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Choose which badge style you prefer, and I'll implement it in the app
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" data-testid="button-choose-option1">
              Choose Option 1
            </Button>
            <Button size="lg" variant="outline" data-testid="button-choose-option2">
              Choose Option 2
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
