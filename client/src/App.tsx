import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import Neighborhoods from "@/pages/Neighborhoods";
import CreateNeighborhood from "@/pages/CreateNeighborhood";
import NeighborhoodDetail from "@/pages/NeighborhoodDetail";
import BrowseAlumniMemorials from "@/pages/browse-alumni-memorials";
import CreateAlumniMemorial from "@/pages/create-alumni-memorial";
import AlumniMemorialDetail from "@/pages/alumni-memorial";
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
import AdminProductOrders from "@/pages/AdminProductOrders";
import Privacy from "@/pages/Privacy";
import ChildSafety from "@/pages/ChildSafety";
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
import VideoTimeCapsules from "@/pages/VideoTimeCapsules";
import Products from "@/pages/Products";
import ProductCustomize from "@/pages/ProductCustomize";
import MyOrders from "@/pages/MyOrders";
import OrderTracking from "@/pages/OrderTracking";
import EventPlanner from "@/pages/EventPlanner";
import SportsMemorials from "@/pages/SportsMemorials";
import PetMemorials from "@/pages/PetMemorials";
import LogoPreview from "@/pages/LogoPreview";
import BrandLogo2024 from "@/pages/BrandLogo2024";
import CreatePetMemorial from "@/pages/CreatePetMemorial";
import PetMemorialView from "@/pages/PetMemorialView";
import MultiFaithTemplates from "@/pages/MultiFaithTemplates";
import LivingLegacy from "@/pages/LivingLegacy";
import FamilyTree from "@/pages/FamilyTree";
import CemeteryNavigator from "@/pages/CemeteryNavigator";
import CustomQRCodeDesigner from "@/pages/CustomQRCodeDesigner";
import HolidayTimeline from "@/pages/HolidayTimeline";
import BirthdayCelebration from "@/pages/BirthdayCelebration";
import OlympianMemorial from "@/pages/OlympianMemorial";
import CelebrationsHub from "@/pages/CelebrationsHub";
import NotFound from "@/pages/not-found";
import { InstallPrompt } from "@/components/InstallPrompt";
import { AIChat } from "@/components/AIChat";
import { FileText, Image, Layout, Bell, Calendar, Crown, GraduationCap, Shield, Users, MapPin, Lock, ChevronDown, Sparkles, ShoppingBag, Trophy, PawPrint, QrCode, Navigation, Cake, TreeDeciduous, PartyPopper, Heart, Gift } from "lucide-react";
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
              <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81">
                <Button variant="ghost" size="sm" data-testid="nav-demo-memorial" className="text-sm">
                  <Image className="w-4 h-4 mr-1.5" />
                  Demo Memorial
                </Button>
              </Link>
              <Link href="/create-memorial">
                <Button variant="ghost" size="sm" data-testid="nav-create-memorial" className="text-sm">
                  <FileText className="w-4 h-4 mr-1.5" />
                  Create Memorial
                </Button>
              </Link>
              <Link href="/celebrations">
                <Button variant="ghost" size="sm" data-testid="nav-celebrations" className="text-sm">
                  <PartyPopper className="w-4 h-4 mr-1.5" />
                  Celebrations
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="ghost" size="sm" data-testid="nav-products" className="text-sm">
                  <ShoppingBag className="w-4 h-4 mr-1.5" />
                  Products
                </Button>
              </Link>
              
              {/* Features Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid="nav-features-dropdown" className="text-sm">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Features
                    <ChevronDown className="w-3 h-3 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-celebrations">
                    <Link href="/celebrations">
                      <PartyPopper className="w-4 h-4 mr-2" />
                      <span>Celebrations Hub</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-birthdays">
                    <Link href="/celebrations?tab=birthdays">
                      <Cake className="w-4 h-4 mr-2" />
                      <span>Birthday Celebrations</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-weddings">
                    <Link href="/celebrations?tab=weddings">
                      <Heart className="w-4 h-4 mr-2" />
                      <span>Wedding Gifts</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-event-planner">
                    <Link href="/event-planner">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Event Planner</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-future-messages">
                    <Link href="/upcoming-messages">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Future Messages</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-qr-memorials">
                    <Link href="/qr-code">
                      <Layout className="w-4 h-4 mr-2" />
                      <span>QR Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-celebrity-memorials">
                    <Link href="/celebrity-memorials">
                      <Crown className="w-4 h-4 mr-2" />
                      <span>Celebrity Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-alumni-memorials">
                    <Link href="/alumni-memorials">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span>Alumni Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-sports-memorials">
                    <Link href="/sports-memorials">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>Sports Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-pet-memorials">
                    <Link href="/pet-memorials">
                      <PawPrint className="w-4 h-4 mr-2" />
                      <span>Pet Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-multi-faith">
                    <Link href="/multi-faith-templates">
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span>Multi-Faith Templates</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-living-legacy">
                    <Link href="/living-legacy">
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span>Living Legacy</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-qr-designer">
                    <Link href="/qr-designer">
                      <QrCode className="w-4 h-4 mr-2" />
                      <span>QR Code Designer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-essential-workers">
                    <Link href="/essential-workers">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Essential Workers</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-hood-memorials">
                    <Link href="/hood-memorials">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Hood Memorials</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-neighborhoods">
                    <Link href="/neighborhoods">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>Neighborhoods</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-prison-access">
                    <Link href="/prison-access">
                      <Lock className="w-4 h-4 mr-2" />
                      <span>Prison Access</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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

              {/* Mobile Features Dropdown */}
              <div className="lg:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" data-testid="nav-mobile-features-dropdown" className="text-sm">
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      Features
                      <ChevronDown className="w-3 h-3 ml-1.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-celebrations">
                      <Link href="/celebrations">
                        <PartyPopper className="w-4 h-4 mr-2" />
                        <span>Celebrations Hub</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-birthdays">
                      <Link href="/celebrations?tab=birthdays">
                        <Cake className="w-4 h-4 mr-2" />
                        <span>Birthday Celebrations</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-weddings">
                      <Link href="/celebrations?tab=weddings">
                        <Heart className="w-4 h-4 mr-2" />
                        <span>Wedding Gifts</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-event-planner">
                      <Link href="/event-planner">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Event Planner</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-future-messages">
                      <Link href="/upcoming-messages">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Future Messages</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-qr-memorials">
                      <Link href="/qr-code">
                        <Layout className="w-4 h-4 mr-2" />
                        <span>QR Memorials</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-celebrity-memorials">
                      <Link href="/celebrity-memorials">
                        <Crown className="w-4 h-4 mr-2" />
                        <span>Celebrity Memorials</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-alumni-memorials">
                      <Link href="/alumni-memorials">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        <span>Alumni Memorials</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-sports-memorials">
                      <Link href="/sports-memorials">
                        <Trophy className="w-4 h-4 mr-2" />
                        <span>Sports Memorials</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-qr-designer">
                      <Link href="/qr-designer">
                        <QrCode className="w-4 h-4 mr-2" />
                        <span>QR Code Designer</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-essential-workers">
                      <Link href="/essential-workers">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Essential Workers</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-hood-memorials">
                      <Link href="/hood-memorials">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Hood Memorials</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-neighborhoods">
                      <Link href="/neighborhoods">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Neighborhoods</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer" data-testid="dropdown-mobile-prison-access">
                      <Link href="/prison-access">
                        <Lock className="w-4 h-4 mr-2" />
                        <span>Prison Access</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
        <Route path="/neighborhoods" component={Neighborhoods} />
        <Route path="/create-neighborhood" component={CreateNeighborhood} />
        <Route path="/neighborhood/:id" component={NeighborhoodDetail} />
        <Route path="/alumni-memorials" component={BrowseAlumniMemorials} />
        <Route path="/alumni-memorials/create" component={CreateAlumniMemorial} />
        <Route path="/alumni-memorials/:id" component={AlumniMemorialDetail} />
        <Route path="/sports-memorials" component={SportsMemorials} />
        <Route path="/pet-memorials" component={PetMemorials} />
        <Route path="/create-pet-memorial" component={CreatePetMemorial} />
        <Route path="/pet-memorial/:inviteCode" component={PetMemorialView} />
        <Route path="/multi-faith-templates" component={MultiFaithTemplates} />
        <Route path="/living-legacy" component={LivingLegacy} />
        <Route path="/family-tree/:memorialId" component={FamilyTree} />
        <Route path="/cemetery-navigator/:memorialId" component={CemeteryNavigator} />
        <Route path="/qr-designer" component={CustomQRCodeDesigner} />
        <Route path="/holiday-timeline/:memorialId" component={HolidayTimeline} />
        <Route path="/birthday-celebration/:memorialId" component={BirthdayCelebration} />
        <Route path="/olympian-memorial/:athleteId" component={OlympianMemorial} />
        <Route path="/celebrations" component={CelebrationsHub} />
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
        <Route path="/new-logo" component={LogoPreview} />
        <Route path="/brand2024" component={BrandLogo2024} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/my-memorials" component={MyMemorials} />
        <Route path="/memorials/:id/manage" component={ManageMemorial} />
        <Route path="/memorials/:id/program-edit" component={FuneralProgramEditor} />
        <Route path="/memorial/:id/program" component={FuneralProgramViewer} />
        <Route path="/memorial/:id/events" component={MemorialEvents} />
        <Route path="/memorial/:id/funeral-program" component={FuneralProgramCreator} />
        <Route path="/memorial/:id/future-messages" component={FutureMessages} />
        <Route path="/memorial/:id/video-time-capsules" component={VideoTimeCapsules} />
        <Route path="/upcoming-messages" component={UpcomingMessages} />
        <Route path="/event-planner" component={EventPlanner} />
        <Route path="/celebrity/:id/estate-content" component={CelebrityEstateContent} />
        
        {/* Product Routes */}
        <Route path="/products" component={Products} />
        <Route path="/products/:productId/customize" component={ProductCustomize} />
        <Route path="/orders" component={MyOrders} />
        <Route path="/orders/:orderId" component={OrderTracking} />
        
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/screenshots" component={AdminScreenshots} />
        <Route path="/admin/product-orders" component={AdminProductOrders} />
        <Route path="/admin/qr-code" component={QRCodeGenerator} />
        <Route path="/qr-code" component={QRCodeGenerator} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/child-safety" component={ChildSafety} />
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
        <AIChat />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
