import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Shield, Smartphone, Calendar, DollarSign, Music, MessageSquare } from "lucide-react";
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
              <OpictuaryLogo variant="classic" showTagline={false} className="scale-150" />
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link href="/self-obituary">
                <Button size="lg" className="min-w-[200px]" data-testid="button-create-memorial">
                  <Heart className="w-5 h-5 mr-2" />
                  Create a Memorial
                </Button>
              </Link>
              <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81">
                <Button size="lg" variant="outline" className="min-w-[200px]" data-testid="button-view-demo">
                  View Demo Memorial
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="ghost" className="min-w-[200px]" data-testid="button-learn-more">
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
            <Card className="hover-elevate" data-testid="card-feature-dignity">
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

            {/* Feature 2 */}
            <Card className="hover-elevate" data-testid="card-feature-everyone">
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

            {/* Feature 3 */}
            <Card className="hover-elevate" data-testid="card-feature-accessible">
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

            {/* Feature 4 */}
            <Card className="hover-elevate" data-testid="card-feature-community">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Community Support</h3>
                <p className="text-muted-foreground">
                  You're not alone. Friends and family can contribute memories, share condolences, 
                  and rally together to support one another.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="hover-elevate" data-testid="card-feature-fundraising">
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

            {/* Feature 6 */}
            <Card className="hover-elevate" data-testid="card-feature-legacy">
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
          </div>
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
