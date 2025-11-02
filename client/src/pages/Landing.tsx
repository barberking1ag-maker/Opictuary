import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Smartphone, Calendar, DollarSign, Music, MessageSquare, QrCode } from "lucide-react";
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
              Love doesn't end.
              <br />
              <span className="text-primary">Neither should remembrance.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Create beautiful, lasting memorials for those who shaped your life. 
              Share their story, preserve their legacy, and find support when you need it most.
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
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground" data-testid="text-intro-title">
            A Space Built on Compassion
          </h2>
          
          <div className="text-base sm:text-lg text-muted-foreground space-y-4 leading-relaxed">
            <p data-testid="text-intro-p1">
              Losing someone you love changes everything. The grief is real. The memories are precious. 
              And the need to honor their life in a meaningful way becomes deeply important.
            </p>
            
            <p data-testid="text-intro-p2">
              <strong className="text-foreground">Opictuary was created for this exact moment.</strong>
            </p>
            
            <p data-testid="text-intro-p3">
              We understand that remembering someone isn't just about marking a date or sharing a photo. 
              It's about preserving the fullness of who they were – their laughter, their wisdom, 
              the way they made you feel, the mark they left on this world.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-card/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground mb-4" data-testid="text-features-title">
              What Makes Opictuary Different
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-description">
              A platform designed with dignity, compassion, and care at its core
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Link href="/about" className="block" data-testid="link-feature-dignity">
              <Card className="hover-elevate h-full" data-testid="card-feature-dignity">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Dignity First</h3>
                  <p className="text-muted-foreground">
                    Every memorial is designed with respect and grace. No intrusive ads, no distractions – 
                    just a beautiful space to honor your loved one.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 2 */}
            <Link href="/self-obituary" className="block" data-testid="link-feature-everyone">
              <Card className="hover-elevate h-full" data-testid="card-feature-everyone">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Made for Everyone</h3>
                  <p className="text-muted-foreground">
                    Whether honoring a parent, child, friend, or partner – whether they passed recently or years ago – 
                    Opictuary adapts to your needs and beliefs.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 3 */}
            <Link href="/about" className="block" data-testid="link-feature-accessible">
              <Card className="hover-elevate h-full" data-testid="card-feature-accessible">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Accessible Anywhere</h3>
                  <p className="text-muted-foreground">
                    Desktop, phone, tablet – even offline. Your loved one's memorial is always there 
                    when you need to feel close to them.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 4 */}
            <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81" className="block" data-testid="link-feature-community">
              <Card className="hover-elevate h-full" data-testid="card-feature-community">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Share Memories Together</h3>
                  <p className="text-muted-foreground">
                    Friends and family can share photos, videos, and stories about their experiences with your loved one. 
                    Interactive galleries let everyone react, comment, and preserve precious memories forever.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 5 */}
            <Link href="/about" className="block" data-testid="link-feature-fundraising">
              <Card className="hover-elevate h-full" data-testid="card-feature-fundraising">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Practical Help</h3>
                  <p className="text-muted-foreground">
                    Organize fundraisers for funeral costs or causes, plan memorial events, 
                    and access professional grief resources.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Feature 6 */}
            <Link href="/upcoming-messages" className="block" data-testid="link-feature-legacy">
              <Card className="hover-elevate h-full" data-testid="card-feature-legacy">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Legacy Features</h3>
                  <p className="text-muted-foreground">
                    Schedule future messages, create music playlists, plan memorial events, 
                    and preserve their story for generations to come.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
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
