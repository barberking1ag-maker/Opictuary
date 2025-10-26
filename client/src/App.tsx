import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import About from "@/pages/About";
import CelebrityMemorials from "@/pages/CelebrityMemorials";
import PrisonAccessRequest from "@/pages/PrisonAccessRequest";
import EssentialWorkers from "@/pages/EssentialWorkers";
import SelfObituary from "@/pages/SelfObituary";
import CustomizationDemo from "@/pages/CustomizationDemo";
import AdvertiserSubmission from "@/pages/AdvertiserSubmission";
import AdvertisementAdmin from "@/pages/AdvertisementAdmin";
import PartnerSignup from "@/pages/PartnerSignup";
import PartnerDashboard from "@/pages/PartnerDashboard";
import BadgePreview from "@/pages/BadgePreview";
import DesignReference from "@/pages/DesignReference";
import GriefSupport from "@/pages/GriefSupport";
import AdvertisingOpportunities from "@/pages/AdvertisingOpportunities";
import UserProfile from "@/pages/UserProfile";
import MyMemorials from "@/pages/MyMemorials";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminScreenshots from "@/pages/AdminScreenshots";
import Privacy from "@/pages/Privacy";
import SupportHub from "@/pages/SupportHub";
import MemorialUpload from "@/pages/MemorialUpload";
import NotFound from "@/pages/not-found";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Star, Home as HomeIcon, Shield, Heart, FileText, Palette, Megaphone, HandshakeIcon, Image, Layout, Bell } from "lucide-react";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Footer } from "@/components/Footer";
import { UserMenu } from "@/components/UserMenu";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  // From blueprint: javascript_google_analytics - Track page views when routes change
  useAnalytics();
  
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="hover-elevate px-3 py-2 rounded-md transition-colors cursor-pointer" data-testid="link-home">
                <OpictuaryLogo variant="classic" showTagline={true} className="hidden md:flex" />
                <OpictuaryLogo variant="classic" showTagline={false} className="flex md:hidden" />
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
              <Link href="/support">
                <Button variant="ghost" size="sm" data-testid="nav-support" className="text-sm">
                  Support
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" size="sm" data-testid="nav-about" className="text-sm">
                  About
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications Bell */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hidden md:flex"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <UserMenu />

              {/* Mobile About Button */}
              <Link href="/about">
                <Button variant="ghost" size="sm" className="lg:hidden" data-testid="nav-mobile-about">
                  About
                </Button>
              </Link>

              {/* Mobile Create Button */}
              <Link href="/self-obituary">
                <Button size="sm" className="lg:hidden" data-testid="nav-mobile-create">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/memorial/:code/upload" component={MemorialUpload} />
        <Route path="/memorial/:id" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/celebrity-memorials" component={CelebrityMemorials} />
        <Route path="/prison-access" component={PrisonAccessRequest} />
        <Route path="/essential-workers" component={EssentialWorkers} />
        <Route path="/self-obituary" component={SelfObituary} />
        <Route path="/grief-support/:memorialId" component={GriefSupport} />
        <Route path="/customization" component={CustomizationDemo} />
        <Route path="/advertise" component={AdvertiserSubmission} />
        <Route path="/advertiser-submission" component={AdvertiserSubmission} />
        <Route path="/advertising" component={AdvertisingOpportunities} />
        <Route path="/advertisement-admin" component={AdvertisementAdmin} />
        <Route path="/partner-signup" component={PartnerSignup} />
        <Route path="/partner-dashboard/:partnerId" component={PartnerDashboard} />
        <Route path="/badge-preview" component={BadgePreview} />
        <Route path="/design-reference" component={DesignReference} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/my-memorials" component={MyMemorials} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/screenshots" component={AdminScreenshots} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/support" component={SupportHub} />
        <Route component={NotFound} />
      </Switch>

      <Footer badgeVariant="classic" />
    </div>
  );
}

function App() {
  // From blueprint: javascript_google_analytics - Initialize Google Analytics when app loads
  useEffect(() => {
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <InstallPrompt />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
