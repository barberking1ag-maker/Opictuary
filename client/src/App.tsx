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
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <defs>
                  <radialGradient id="spiritual-light" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.1"/>
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#spiritual-light)"/>
                <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.9"/>
                <ellipse cx="20" cy="6" rx="14" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
                <path d="M6 6 Q 20 4, 34 6" stroke="currentColor" strokeWidth="1" opacity="0.6" fill="none"/>
                <circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.1"/>
              </svg>
              <h1 className="text-xl font-serif font-semibold text-foreground relative">
                <span className="relative inline-block">
                  <span className="absolute -top-3 left-0 right-0 text-center text-xs opacity-60">✦</span>
                  O
                </span>pictuary
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
