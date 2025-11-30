import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Shield, Users, Smartphone, Calendar, DollarSign, MessageSquare, Music, Star, UserCheck } from "lucide-react";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <OpictuaryLogo variant="classic" showTagline={false} className="scale-100 sm:scale-125" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground" data-testid="text-about-title">
              About Opictuary
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-about-subtitle">
              The world's first continuum memorial platform - honoring every life, in every dimension
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Mission Statement */}
        <section className="space-y-6">
          <h2 className="text-3xl font-serif font-semibold text-foreground" data-testid="text-mission-title">
            A Memorial Operating System for the Modern Age
          </h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p data-testid="text-mission-p1">
              Traditional obituaries capture a fraction of a life. Opictuary captures the whole story - 
              every achievement, every connection, every dimension of who someone truly was.
            </p>
            
            <p data-testid="text-mission-p2">
              <strong className="text-foreground">We built the world's first continuum memorial platform.</strong>
            </p>
            
            <p data-testid="text-mission-p3">
              From immersive photo and video galleries to AI-powered storytelling, from scheduled future messages 
              that keep your love reaching loved ones to GPS cemetery navigation, from birthday celebrations to 
              Olympian legacy scores - we've reimagined what it means to honor a life in the digital age.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="space-y-8">
          <h2 className="text-3xl font-serif font-semibold text-foreground" data-testid="text-different-title">
            What Makes Opictuary Different
          </h2>
          
          <div className="space-y-6">
            <Card data-testid="card-dignity">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Dignity First</h3>
                    <p className="text-muted-foreground">
                      Every memorial is designed with respect and grace. No intrusive ads, no distractions – 
                      just a beautiful space to honor your loved one.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-inclusive">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Made for Everyone</h3>
                    <p className="text-muted-foreground">
                      Whether you're creating a memorial for a parent, child, friend, or partner – whether they 
                      passed recently or years ago – Opictuary provides a space that adapts to your needs and beliefs. 
                      We honor all faiths and traditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-accessible">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Accessible Anywhere</h3>
                    <p className="text-muted-foreground">
                      Desktop, phone, tablet – even offline. Your loved one's memorial is always there when you 
                      need to feel close to them. Install as a mobile app for instant access.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-community">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Community Support</h3>
                    <p className="text-muted-foreground">
                      You're not alone. Friends and family can contribute memories, share condolences, 
                      and rally together to support one another during difficult times.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-practical">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">Practical Help</h3>
                    <p className="text-muted-foreground">
                      Beyond memories, Opictuary helps with the practical side of loss – organizing fundraisers 
                      for funeral costs or causes, planning memorial events, and accessing professional grief resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-8">
          <h2 className="text-3xl font-serif font-semibold text-foreground" data-testid="text-features-overview-title">
            Platform Features
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex gap-3" data-testid="feature-memories">
              <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Memories & Condolences</h4>
                <p className="text-sm text-muted-foreground">Share stories, photos, and messages of comfort</p>
              </div>
            </div>

            <div className="flex gap-3" data-testid="feature-fundraising">
              <DollarSign className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Fundraising</h4>
                <p className="text-sm text-muted-foreground">Support families with memorial and funeral costs</p>
              </div>
            </div>

            <div className="flex gap-3" data-testid="feature-events">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Legacy Events</h4>
                <p className="text-sm text-muted-foreground">Plan gatherings and memorial services</p>
              </div>
            </div>

            <div className="flex gap-3" data-testid="feature-music">
              <Music className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Music Playlists</h4>
                <p className="text-sm text-muted-foreground">Create soundtracks of their favorite songs</p>
              </div>
            </div>

            <div className="flex gap-3" data-testid="feature-celebrity">
              <Star className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Celebrity Memorials</h4>
                <p className="text-sm text-muted-foreground">Honor public figures with charitable donations</p>
              </div>
            </div>

            <div className="flex gap-3" data-testid="feature-workers">
              <UserCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Essential Workers</h4>
                <p className="text-sm text-muted-foreground">Recognize frontline heroes who gave their lives</p>
              </div>
            </div>
          </div>
        </section>

        {/* Promise */}
        <section className="space-y-6">
          <h2 className="text-3xl font-serif font-semibold text-foreground" data-testid="text-promise-title">
            Our Promise to You
          </h2>
          
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8 space-y-4">
              <p className="text-lg text-muted-foreground" data-testid="text-promise-p1">
                We promise to treat your memories with the care and dignity they deserve. We promise to keep 
                this space safe, accessible, and always focused on honoring lives well-lived.
              </p>
              
              <p className="text-lg text-muted-foreground" data-testid="text-promise-p2">
                We know that grief is not linear. Some days are harder than others. But wherever you are in 
                your journey, Opictuary is here – a gentle, steady place to remember, to share, and to heal.
              </p>
              
              <p className="text-xl font-semibold text-foreground pt-4" data-testid="text-promise-closing">
                Because those we love never truly leave us. They live on in the stories we tell, 
                the memories we share, and the love we continue to carry.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-3xl font-serif font-semibold text-foreground" data-testid="text-cta-title">
            Ready to Honor Their Memory?
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-cta-description">
            Start preserving their story today
          </p>
          <Link href="/self-obituary">
            <Button size="lg" data-testid="button-create-memorial">
              <Heart className="w-5 h-5 mr-2" />
              Create a Memorial
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
}
