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
import CreateCelebrityMemorial from "@/pages/CreateCelebrityMemorial";
import PrisonAccessRequest from "@/pages/PrisonAccessRequest";
import EssentialWorkers from "@/pages/EssentialWorkers";
import CreateEssentialWorkerMemorial from "@/pages/CreateEssentialWorkerMemorial";
import HoodMemorials from "@/pages/HoodMemorials";
import CreateHoodMemorial from "@/pages/CreateHoodMemorial";
import SelfObituary from "@/pages/SelfObituary";
import CreateMemorial from "@/pages/CreateMemorial";
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
import ManageMemorial from "@/pages/ManageMemorial";
import ObituaryPage from "@/pages/ObituaryPage";
import FuneralProgramEditor from "@/pages/FuneralProgramEditor";
import FuneralProgramViewer from "@/pages/FuneralProgramViewer";
import QRCodeGenerator from "@/pages/QRCodeGenerator";
import MemorialEvents from "@/pages/MemorialEvents";
import FuneralProgramCreator from "@/pages/FuneralProgramCreator";
import CelebrityEstateContent from "@/pages/CelebrityEstateContent";
import FutureMessages from "@/pages/FutureMessages";
import UpcomingMessages from "@/pages/UpcomingMessages";
import NotFound from "@/pages/not-found";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Star, Home as HomeIcon, Shield, Heart, FileText, Palette, Megaphone, HandshakeIcon, Image, Layout, Bell, Calendar } from "lucide-react";
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
      {/* Skip to main content link for screen readers and keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
        data-testid="link-skip-to-content"
      >
        Skip to main content
      </a>
      
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/">
              <div className="hover-elevate px-3 py-2 rounded-md transition-colors cursor-pointer" data-testid="link-home" role="link" aria-label="Opictuary home page">
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
              <Link href="/upcoming-messages">
                <Button variant="ghost" size="sm" data-testid="nav-legacy-messages" className="text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  Legacy Messages
                </Button>
              </Link>
              <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81">
                <Button variant="ghost" size="sm" data-testid="nav-photo-gallery" className="text-sm">
                  <Image className="w-4 h-4 mr-1.5" />
                  Photo Gallery
                </Button>
              </Link>
              <Link href="/create-memorial">
                <Button variant="ghost" size="sm" data-testid="nav-create-memorial" className="text-sm">
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
                aria-label="Notifications - 3 unread"
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  aria-label="3 notifications"
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
              <Link href="/create-memorial">
                <Button size="sm" className="lg:hidden" data-testid="nav-mobile-create">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main id="main-content" role="main">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/obituary/:memorialId" component={ObituaryPage} />
          <Route path="/memorial/:code/upload" component={MemorialUpload} />
          <Route path="/memorial/:id" component={Home} />
          <Route path="/about" component={About} />
        <Route path="/celebrity-memorials" component={CelebrityMemorials} />
        <Route path="/create-celebrity-memorial" component={CreateCelebrityMemorial} />
        <Route path="/prison-access" component={PrisonAccessRequest} />
        <Route path="/essential-workers" component={EssentialWorkers} />
        <Route path="/create-essential-worker" component={CreateEssentialWorkerMemorial} />
        <Route path="/hood-memorials" component={HoodMemorials} />
        <Route path="/create-hood-memorial" component={CreateHoodMemorial} />
        <Route path="/self-obituary" component={SelfObituary} />
        <Route path="/create-memorial" component={CreateMemorial} />
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
        <Route path="/memorials/:id/manage" component={ManageMemorial} />
        <Route path="/memorials/:id/program-edit" component={FuneralProgramEditor} />
        <Route path="/memorial/:id/program" component={FuneralProgramViewer} />
        <Route path="/memorial/:id/events" component={MemorialEvents} />
        <Route path="/memorial/:id/funeral-program" component={FuneralProgramCreator} />
        <Route path="/memorial/:id/future-messages" component={FutureMessages} />
        <Route path="/upcoming-messages" component={UpcomingMessages} />
        <Route path="/celebrity/:id/estate-content" component={CelebrityEstateContent} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/screenshots" component={AdminScreenshots} />
        <Route path="/admin/qr-code" component={QRCodeGenerator} />
        <Route path="/qr-code" component={QRCodeGenerator} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/support" component={SupportHub} />
        <Route component={NotFound} />
        </Switch>
      </main>

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
