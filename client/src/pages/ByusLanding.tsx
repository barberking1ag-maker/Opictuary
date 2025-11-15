import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Scale, Users, Brain, Shield, TrendingUp, Award } from "lucide-react";

export default function ByusLanding() {
  return (
    <div className="byus-theme min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            BYUS Mediator
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Be Your Unbiased Self
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            AI-powered mediation platform that helps resolve conflicts fairly by analyzing both perspectives 
            without bias, providing neutral solutions based on facts.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/byus/register">
              <Button size="lg" className="min-w-[150px]" data-testid="button-get-started">
                Get Started Free
              </Button>
            </Link>
            <Link href="/byus/login">
              <Button size="lg" variant="outline" className="min-w-[150px]" data-testid="button-sign-in">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How BYUS Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate" data-testid="card-step-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>1. Present Both Sides</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Each party enters their perspective of the situation. Our platform ensures 
                  both voices are heard equally without interruption or judgment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-step-2">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>2. AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our advanced AI analyzes both perspectives objectively, identifying key points, 
                  emotional factors, and areas of compromise without taking sides.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-step-3">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>3. Fair Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Receive a balanced solution with a fairness score, suggested compromises, 
                  and actionable next steps that consider both parties' needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose BYUS?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4" data-testid="feature-unbiased">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Completely Unbiased</h3>
                <p className="text-muted-foreground text-sm">
                  AI doesn't take sides. It analyzes facts and emotions objectively.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-confidential">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">100% Confidential</h3>
                <p className="text-muted-foreground text-sm">
                  Your mediations are private and secure. We never share your data.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-instant">
              <TrendingUp className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-muted-foreground text-sm">
                  Get analysis and solutions in seconds, not weeks of costly mediation.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-affordable">
              <Award className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Affordable</h3>
                <p className="text-muted-foreground text-sm">
                  Save thousands compared to traditional mediation services.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-types">
              <Users className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">All Conflict Types</h3>
                <p className="text-muted-foreground text-sm">
                  Business disputes, family matters, relationship issues, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4" data-testid="feature-score">
              <Scale className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Fairness Score</h3>
                <p className="text-muted-foreground text-sm">
                  See how balanced the solution is with our transparency metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Perfect For
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="usecase-business">
              <CardHeader>
                <CardTitle>Business Disputes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Partnership disagreements</li>
                  <li>• Contract negotiations</li>
                  <li>• Employee conflicts</li>
                  <li>• Client disputes</li>
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="usecase-personal">
              <CardHeader>
                <CardTitle>Personal Matters</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Relationship conflicts</li>
                  <li>• Family disagreements</li>
                  <li>• Divorce mediation</li>
                  <li>• Roommate disputes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Resolving Conflicts Today
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands who have found fair solutions through BYUS.
            Your first mediation is free.
          </p>
          <Link href="/byus/register">
            <Button size="lg" className="min-w-[200px]" data-testid="button-start-free">
              Start Free Mediation
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}