import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/Home";
import CelebrityMemorials from "@/pages/CelebrityMemorials";
import PrisonAccessRequest from "@/pages/PrisonAccessRequest";
import NotFound from "@/pages/not-found";
import { Star, Home as HomeIcon, Shield } from "lucide-react";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M16 2L18 8H14L16 2Z" fill="currentColor" opacity="0.9"/>
                <rect x="14" y="8" width="4" height="16" fill="currentColor" opacity="0.8"/>
                <path d="M16 24C16 24 20 22 20 18V12H12V18C12 22 16 24 16 24Z" fill="currentColor" opacity="0.6"/>
                <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                <circle cx="24" cy="8" r="2" fill="currentColor" opacity="0.7"/>
                <path d="M8 8C8 8 10 6 12 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <path d="M24 8C24 8 22 6 20 8" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <ellipse cx="16" cy="28" rx="12" ry="2" fill="currentColor" opacity="0.3"/>
              </svg>
              <h1 className="text-xl font-serif font-semibold text-foreground">
                Opictuary
              </h1>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="ghost" data-testid="nav-home">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/celebrity-memorials">
                <Button variant="ghost" data-testid="nav-celebrity">
                  <Star className="w-4 h-4 mr-2" />
                  Celebrity Memorials
                </Button>
              </Link>
              <Link href="/prison-access">
                <Button variant="ghost" data-testid="nav-prison-access">
                  <Shield className="w-4 h-4 mr-2" />
                  Prison Access
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
