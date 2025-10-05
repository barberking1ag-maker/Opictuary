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
import NotFound from "@/pages/not-found";
import { Star, Home as HomeIcon, Shield, Heart, FileText, Palette, Megaphone, HandshakeIcon } from "lucide-react";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-serif font-semibold text-foreground relative">
                <span className="relative inline-block">
                  <svg 
                    className="absolute -top-2 left-1/2 -translate-x-1/2" 
                    width="20" 
                    height="8" 
                    viewBox="0 0 20 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse 
                      cx="10" 
                      cy="4" 
                      rx="9" 
                      ry="3" 
                      fill="none" 
                      stroke="#FFD700" 
                      strokeWidth="1.5" 
                      opacity="0.9"
                    />
                    <ellipse 
                      cx="10" 
                      cy="4" 
                      rx="9" 
                      ry="3" 
                      fill="#FFD700" 
                      opacity="0.15"
                    />
                  </svg>
                  O
                </span>pictuary
              </h1>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="nav-home">
                  <HomeIcon className="w-4 h-4 mr-1" />
                  Home
                </Button>
              </Link>
              <Link href="/essential-workers">
                <Button variant="ghost" size="sm" data-testid="nav-essential-workers">
                  <Heart className="w-4 h-4 mr-1" />
                  Essential Workers
                </Button>
              </Link>
              <Link href="/self-obituary">
                <Button variant="ghost" size="sm" data-testid="nav-self-obituary">
                  <FileText className="w-4 h-4 mr-1" />
                  Write Yours
                </Button>
              </Link>
              <Link href="/celebrity-memorials">
                <Button variant="ghost" size="sm" data-testid="nav-celebrity">
                  <Star className="w-4 h-4 mr-1" />
                  Celebrity
                </Button>
              </Link>
              <Link href="/prison-access">
                <Button variant="ghost" size="sm" data-testid="nav-prison-access">
                  <Shield className="w-4 h-4 mr-1" />
                  Prison Access
                </Button>
              </Link>
              <Link href="/customization">
                <Button variant="ghost" size="sm" data-testid="nav-customization">
                  <Palette className="w-4 h-4 mr-1" />
                  Customize
                </Button>
              </Link>
              <Link href="/advertise">
                <Button variant="ghost" size="sm" data-testid="nav-advertise">
                  <Megaphone className="w-4 h-4 mr-1" />
                  Advertise
                </Button>
              </Link>
              <Link href="/partner-signup">
                <Button variant="ghost" size="sm" data-testid="nav-partner">
                  <HandshakeIcon className="w-4 h-4 mr-1" />
                  Partner
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
