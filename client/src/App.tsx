import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/Home";
import CelebrityMemorials from "@/pages/CelebrityMemorials";
import PrisonAccessRequest from "@/pages/PrisonAccessRequest";
import EssentialWorkers from "@/pages/EssentialWorkers";
import SelfObituary from "@/pages/SelfObituary";
import CustomizationDemo from "@/pages/CustomizationDemo";
import AdvertiserSubmission from "@/pages/AdvertiserSubmission";
import PartnerSignup from "@/pages/PartnerSignup";
import PartnerDashboard from "@/pages/PartnerDashboard";
import BadgePreview from "@/pages/BadgePreview";
import DesignReference from "@/pages/DesignReference";
import NotFound from "@/pages/not-found";
import { Star, Home as HomeIcon, Shield, Heart, FileText, Palette, Megaphone, HandshakeIcon, Image, Layout } from "lucide-react";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="flex items-center gap-3 hover-elevate px-3 py-2 rounded-md transition-colors cursor-pointer" data-testid="link-home">
                <h1 className="text-2xl font-serif font-bold text-foreground relative">
                  <span className="relative inline-block">
                    <svg 
                      className="absolute -top-1.5 left-1/2 -translate-x-1/2" 
                      width="24" 
                      height="8" 
                      viewBox="0 0 24 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse 
                        cx="12" 
                        cy="4" 
                        rx="11" 
                        ry="3" 
                        fill="none" 
                        stroke="#FFD700" 
                        strokeWidth="1.5" 
                        opacity="0.9"
                      />
                      <ellipse 
                        cx="12" 
                        cy="4" 
                        rx="11" 
                        ry="3" 
                        fill="#FFD700" 
                        opacity="0.15"
                      />
                    </svg>
                    O
                  </span>pictuary
                </h1>
                <span className="text-xs text-muted-foreground tracking-wide hidden md:block">
                  Honoring Life · Preserving Legacy
                </span>
              </div>
            </Link>
            <div className="hidden lg:flex gap-1">
              <Link href="/celebrity-memorials">
                <Button variant="ghost" size="sm" data-testid="nav-celebrity" className="text-sm">
                  <Star className="w-4 h-4 mr-1.5" />
                  Celebrity
                </Button>
              </Link>
              <Link href="/essential-workers">
                <Button variant="ghost" size="sm" data-testid="nav-essential-workers" className="text-sm">
                  <Heart className="w-4 h-4 mr-1.5" />
                  Essential Workers
                </Button>
              </Link>
              <Link href="/self-obituary">
                <Button variant="ghost" size="sm" data-testid="nav-self-obituary" className="text-sm">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Create Memorial
                </Button>
              </Link>
              <Link href="/partner-signup">
                <Button variant="ghost" size="sm" data-testid="nav-partner" className="text-sm">
                  <HandshakeIcon className="w-4 h-4 mr-1.5" />
                  Partners
                </Button>
              </Link>
            </div>
            <div className="lg:hidden">
              <Link href="/self-obituary">
                <Button size="sm" data-testid="nav-mobile-create">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/" component={Home} />
        <Route path="/celebrity-memorials" component={CelebrityMemorials} />
        <Route path="/prison-access" component={PrisonAccessRequest} />
        <Route path="/essential-workers" component={EssentialWorkers} />
        <Route path="/self-obituary" component={SelfObituary} />
        <Route path="/customization" component={CustomizationDemo} />
        <Route path="/advertise" component={AdvertiserSubmission} />
        <Route path="/partner-signup" component={PartnerSignup} />
        <Route path="/partner-dashboard/:partnerId" component={PartnerDashboard} />
        <Route path="/badge-preview" component={BadgePreview} />
        <Route path="/design-reference" component={DesignReference} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
