import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, QrCode, Sparkles, Bell, Store, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Products() {
  return (
    <div className="min-h-screen bg-background" data-testid="products-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto relative">
            {/* Coming Soon Stamp */}
            <div className="absolute -top-4 -right-4 sm:top-0 sm:right-0 transform rotate-12 z-10">
              <div className="bg-amber-500 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-amber-600">
                <span className="font-bold text-sm uppercase tracking-wider">Coming Soon</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <Package className="w-10 h-10 text-primary" />
              <QrCode className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Memorial Products with QR Technology
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Beautiful physical memorial products that seamlessly connect to digital memorials. Each product features an embedded QR code, allowing visitors to access photos, videos, and memories with a simple scan.
            </p>
            
            <Badge variant="secondary" className="mt-6 text-amber-600 border-amber-500">
              <Sparkles className="w-3 h-3 mr-1" />
              Products launching soon - stay tuned!
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Coming Soon Content */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Partner Products Coming Soon
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            We're partnering with trusted memorial product businesses to bring you high-quality, 
            QR-enabled memorial items. Real products from real businesses will be available here soon.
          </p>
        </div>

        {/* Product Categories Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { name: "Memorial Plaques", icon: Package, description: "Elegant plaques with embedded QR codes" },
            { name: "Headstone Markers", icon: QrCode, description: "Weather-resistant QR markers for gravesites" },
            { name: "Memorial Cards", icon: Mail, description: "Beautiful cards with scannable memories" },
          ].map((category) => (
            <Card key={category.name} className="text-center p-6 bg-muted/30 border-dashed">
              <CardContent className="pt-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <category.icon className="w-8 h-8 text-primary/60" />
                </div>
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                <Badge variant="outline" className="mt-4">Coming Soon</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* For Businesses Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
          <CardContent className="p-8 text-center">
            <Store className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold mb-3">Are You a Memorial Product Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Partner with Opictuary to sell your memorial products with integrated QR technology. 
              Reach families looking for meaningful ways to honor their loved ones.
            </p>
            <Link href="/partner-signup">
              <Button size="lg" data-testid="button-partner-signup">
                <Store className="w-4 h-4 mr-2" />
                Become a Partner
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notify Me Section */}
        <div className="text-center mt-16">
          <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Want to be notified when products are available?
          </p>
          <Link href="/partner-signup">
            <Button variant="outline" className="mt-4" data-testid="button-notify-products">
              <Bell className="w-4 h-4 mr-2" />
              Get Notified
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
