import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Smartphone, Calendar, QrCode, Video, Crown, GraduationCap, Shield, Users, MapPin, Lock, PartyPopper, Cake, Gift, Music, ShoppingBag, Bluetooth } from "lucide-react";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,165,32,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <OpictuaryLogo variant="classic" showTagline={false} className="scale-125 sm:scale-150" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight" data-testid="text-hero-title">
              Honor every life,
              <br />
              <span className="text-primary">in every dimension.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              The world's first continuum memorial platform. Create immersive memorial hubs with living achievements, 
              AI-guided storytelling, scheduled future messages, and QR-activated touchpoints that honor every chapter of life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 w-full max-w-3xl mx-auto">
              <Link href="/self-obituary" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[200px]" data-testid="button-create-memorial">
                  <Heart className="w-5 h-5 mr-2" />
                  Create a Memorial
                </Button>
              </Link>
              <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:min-w-[200px]" data-testid="button-view-demo">
                  View Demo Memorial
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full sm:min-w-[200px]" data-testid="button-learn-more">
                  Learn More
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4" data-testid="text-free-notice">
              Free to start • Works on all devices • Private or public options
            </p>
            
            {/* Social Proof Band */}
            <div className="mt-12 pt-8 border-t border-border/20">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary" data-testid="text-user-count">160+</div>
                  <div className="text-sm text-muted-foreground">Families Trust Opictuary</div>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block"></div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary" data-testid="text-growth-rate">20+</div>
                  <div className="text-sm text-muted-foreground">New Users Daily</div>
                </div>
                <div className="h-12 w-px bg-border hidden sm:block"></div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary" data-testid="text-memorials-created">100%</div>
                  <div className="text-sm text-muted-foreground">Free Forever</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Celebrations Section */}
      <div className="bg-gradient-to-br from-accent/10 via-primary/5 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4" data-testid="badge-celebrations-new">
              <PartyPopper className="w-3 h-3 mr-1" />
              New Feature
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-4" data-testid="text-celebrations-title">
              Continuum Celebrations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Beyond memorials - celebrate birthdays, holidays, and life events with friends and family
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Birthday Celebrations */}
            <Link href="/celebrations?tab=birthdays" className="block" data-testid="link-birthday-celebrations">
              <Card className="hover-elevate h-full border-2 border-accent/30" data-testid="card-birthday-celebrations">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                    <Cake className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Birthday Celebrations</h3>
                    <p className="text-sm text-muted-foreground">
                      Bluetooth playlists, live streaming with friends, and shopping spree from donations
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">
                      <Music className="w-3 h-3 mr-1" />
                      Playlists
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Video className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <ShoppingBag className="w-3 h-3 mr-1" />
                      Shopping
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Holiday Celebrations */}
            <Link href="/celebrations?tab=holidays" className="block" data-testid="link-holiday-celebrations">
              <Card className="hover-elevate h-full border-2 border-primary/20" data-testid="card-holiday-celebrations">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">All Holidays</h3>
                    <p className="text-sm text-muted-foreground">
                      Multi-faith calendar with 50+ holidays from every tradition and culture
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">Global</Badge>
                    <Badge variant="outline" className="text-xs">Multi-Faith</Badge>
                    <Badge variant="outline" className="text-xs">Custom</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Wedding Gifts */}
            <Link href="/celebrations?tab=weddings" className="block" data-testid="link-wedding-gifts">
              <Card className="hover-elevate h-full border-2 border-primary/20" data-testid="card-wedding-gifts">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Gift className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Wedding Gifts</h3>
                    <p className="text-sm text-muted-foreground">
                      Create gift registries, accept cash gifts, and share your special day
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="text-xs">
                      <Gift className="w-3 h-3 mr-1" />
                      Registry
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      Cash Gifts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center mt-10">
            <Link href="/celebrations">
              <Button size="lg" data-testid="button-explore-celebrations">
                <PartyPopper className="w-5 h-5 mr-2" />
                Explore Celebrations Hub
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground" data-testid="text-intro-title">
            Beyond Obituaries: A Continuum of Remembrance
          </h2>
          
          <div className="text-base sm:text-lg text-muted-foreground space-y-4 leading-relaxed">
            <p data-testid="text-intro-p1">
              Every life is a universe of moments, achievements, connections, and love. 
              Traditional obituaries capture only a fraction. Opictuary captures the whole story.
            </p>
            
            <p data-testid="text-intro-p2">
              <strong className="text-foreground">A memorial operating system that honors every dimension of life.</strong>
            </p>
            
            <p data-testid="text-intro-p3">
              From birthday celebrations to family trees, from Olympic achievements to community tributes, 
              from scheduled future messages to GPS cemetery navigation - we've built the tools to preserve 
              not just who someone was, but the ongoing impact they have on everyone they touched.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid - Simplified to 3 Flagship Features */}
      <div className="bg-card/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-4" data-testid="text-features-title">
              Core Platform Innovations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-description">
              22 patent-protected innovations powering the continuum memorial experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Flagship Feature 1: Future Messages */}
            <Link href="/upcoming-messages" className="block" data-testid="link-feature-future-messages">
              <Card className="hover-elevate h-full border-2 border-primary/20" data-testid="card-feature-future-messages">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                      PATENT PROTECTED
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">Future Messages</h3>
                  </div>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Schedule heartfelt messages to be delivered on birthdays, anniversaries, and special dates. 
                    Keep your love reaching loved ones for years to come – even after you're gone.
                  </p>
                  <div className="pt-4 text-center">
                    <Button variant="outline" size="sm">
                      Learn More →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Flagship Feature 2: QR Memorial System */}
            <Link href="/qr-code" className="block" data-testid="link-feature-qr-memorials">
              <Card className="hover-elevate h-full border-2 border-primary/20" data-testid="card-feature-qr-memorials">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <QrCode className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                      PATENT PROTECTED
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">QR Memorial System</h3>
                  </div>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Place QR codes on tombstones, memorial cards, or funeral programs. Anyone can scan to view the memorial, 
                    upload photos from the gravesite, or share memories – bridging physical and digital remembrance.
                  </p>
                  <div className="pt-4 text-center">
                    <Button variant="outline" size="sm">
                      Generate QR Code →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Flagship Feature 3: Beautiful Memorial Galleries */}
            <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81" className="block" data-testid="link-feature-galleries">
              <Card className="hover-elevate h-full border-2 border-primary/20" data-testid="card-feature-galleries">
                <CardContent className="p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                      INTERACTIVE & COMPASSIONATE
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">Memorial Galleries</h3>
                  </div>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    Stunning photo and video galleries with heart reactions, comments, and easy sharing. 
                    Family and friends contribute memories together, creating a living tribute that grows over time.
                  </p>
                  <div className="pt-4 text-center">
                    <Button variant="outline" size="sm">
                      View Demo →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Specialized Memorial Types Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-4" data-testid="text-specialized-title">
            Life Dimensions: Every Story Deserves Its Canvas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-specialized-description">
            From celebrities to essential workers, athletes to alumni - specialized experiences for every legacy
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Celebrity Memorials */}
          <Link href="/celebrity-memorials" className="block" data-testid="link-celebrity-memorials">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Celebrity Memorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Honor icons and public figures with estate-managed content, charity integrations, and verified family submissions
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Explore Celebrities →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Alumni Memorials */}
          <Link href="/alumni-memorials" className="block" data-testid="link-alumni-memorials">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Alumni Memorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Remember classmates and fellow alumni with school-themed tributes, graduation year filters, and campus memories
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Browse Alumni →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Essential Workers */}
          <Link href="/essential-workers" className="block" data-testid="link-essential-workers">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Essential Workers</h3>
                  <p className="text-sm text-muted-foreground">
                    Honor first responders, healthcare heroes, and essential workers who served their communities with courage
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Honor Heroes →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Hood Memorials */}
          <Link href="/hood-memorials" className="block" data-testid="link-hood-memorials">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Hood Memorials</h3>
                  <p className="text-sm text-muted-foreground">
                    Community-focused tributes celebrating local legends and neighbors who shaped their neighborhoods
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  See Community →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Neighborhoods */}
          <Link href="/neighborhoods" className="block" data-testid="link-neighborhoods">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Neighborhoods</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize memorials by location, connecting families and friends in specific communities and areas
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Explore Areas →
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Prison Access */}
          <Link href="/prison-access" className="block" data-testid="link-prison-access">
            <Card className="hover-elevate h-full">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">Prison Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure, monitored memorial access for incarcerated individuals to stay connected with loved ones' legacies
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Learn More →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* QR Code Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground" data-testid="text-qr-title">
                    Bridge the Physical and Digital
                  </h2>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <p className="text-lg" data-testid="text-qr-description">
                      Our memorial QR codes create a powerful connection between a physical resting place and a living digital memorial.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p><strong className="text-foreground">For Tombstones & Headstones:</strong> Place a QR code on the memorial marker so anyone visiting can instantly access the full life story, photos, and memories.</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p><strong className="text-foreground">For Memorial Cards:</strong> Add QR codes to funeral programs or memorial cards so family and friends can easily visit and contribute memories.</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p><strong className="text-foreground">Share Photos Instantly:</strong> Visitors can scan the code to upload photos and memories directly to the memorial, preserving moments from the service or graveside visits.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link href="/self-obituary">
                      <Button size="lg" variant="outline" data-testid="button-create-qr">
                        <QrCode className="w-5 h-5 mr-2" />
                        Create Your Memorial QR Code
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-background rounded-lg shadow-lg p-8 flex items-center justify-center border-2 border-primary/20">
                      <QrCode className="w-full h-full text-primary/20" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
                      Scan & Remember
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-center text-sm text-muted-foreground" data-testid="text-qr-importance">
                  <strong className="text-foreground">Why QR codes matter:</strong> They transform static memorials into living tributes, allowing future generations 
                  to discover and connect with your loved one's story for years to come. A simple scan unlocks a lifetime of memories.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Promise Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 sm:p-12 space-y-6 text-center">
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground" data-testid="text-promise-title">
                Our Promise to You
              </h2>
              
              <div className="text-base sm:text-lg text-muted-foreground space-y-4 leading-relaxed">
                <p data-testid="text-promise-p1">
                  We promise to treat your memories with the care and dignity they deserve. 
                  We promise to keep this space safe, accessible, and always focused on honoring lives well-lived.
                </p>
                
                <p data-testid="text-promise-p2">
                  We know that grief is not linear. Some days are harder than others. 
                  But wherever you are in your journey, Opictuary is here – a gentle, steady place to remember, 
                  to share, and to heal.
                </p>
                
                <p className="text-foreground font-semibold text-xl pt-4" data-testid="text-promise-p3">
                  Because those we love never truly leave us. They live on in the stories we tell, 
                  the memories we share, and the love we continue to carry.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/self-obituary">
                  <Button size="lg" data-testid="button-start-memorial">
                    <Heart className="w-5 h-5 mr-2" />
                    Start Preserving Their Story
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile App CTA */}
      <div className="bg-card/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Smartphone className="w-16 h-16 text-primary mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground" data-testid="text-mobile-title">
              Take Opictuary Anywhere
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="text-mobile-description">
              Install Opictuary as an app on your phone for instant access, offline viewing, 
              and notifications about new memories and messages.
            </p>
            <p className="text-sm text-muted-foreground" data-testid="text-mobile-instructions">
              Visit Opictuary on your mobile device and tap "Add to Home Screen" to install
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
