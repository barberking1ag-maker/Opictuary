import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FONT_OPTIONS } from "@/components/FontSelector";
import { SYMBOL_OPTIONS } from "@/components/SymbolSelector";
import { Palette } from "lucide-react";

export default function CustomizationDemo() {
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-serif font-bold">
            Memorial Customization Options
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Personalize your memorial with meaningful fonts and symbols
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Available Typography Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FONT_OPTIONS.map((font) => (
              <Card key={font.value} className="hover-elevate">
                <CardHeader>
                  <CardTitle style={{ fontFamily: font.family }}>
                    {font.label}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs">
                    {font.family}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ fontFamily: font.family }} className="space-y-2">
                    <p className="text-lg">In Loving Memory</p>
                    <p className="text-sm text-muted-foreground">
                      Gone but never forgotten. Your spirit lives on in our hearts forever.
                    </p>
                    <p className="text-xs text-muted-foreground">1950 - 2024</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Memorial Symbols</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SYMBOL_OPTIONS.map((symbol) => {
              const Icon = symbol.icon;
              return (
                <Card key={symbol.value} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{symbol.label.split('(')[0].trim()}</CardTitle>
                        <CardDescription className="text-xs">
                          {symbol.label.includes('(') ? symbol.label.match(/\(([^)]+)\)/)?.[1] : 'Universal'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg flex items-center gap-3">
                      <Icon className="w-8 h-8 text-primary" />
                      <p className="text-sm text-muted-foreground flex-1">
                        A meaningful symbol to represent faith, values, and legacy
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">How Customization Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Choose Your Style</h3>
              <p className="text-sm text-muted-foreground">
                Select a typography that reflects the personality and values of your loved one
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2. Pick a Symbol</h3>
              <p className="text-sm text-muted-foreground">
                Choose a meaningful icon that represents faith, beliefs, or personal significance
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3. Apply to Memorial</h3>
              <p className="text-sm text-muted-foreground">
                Your selections will be beautifully applied to the memorial page
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
