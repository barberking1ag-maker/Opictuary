import { useLocation, Link } from "wouter";
import { Home, ScanLine, Heart, User, Bookmark } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { useQRScanner } from "@/hooks/useQRScanner";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabItem {
  path: string;
  icon: typeof Home;
  label: string;
  testId: string;
}

const tabs: TabItem[] = [
  { path: "/", icon: Home, label: "Home", testId: "tab-home" },
  { path: "/celebrations", icon: Heart, label: "Celebrate", testId: "tab-celebrations" },
  { path: "/my-memorials", icon: Bookmark, label: "Saved", testId: "tab-memorials" },
  { path: "/profile", icon: User, label: "Profile", testId: "tab-profile" },
];

export function MobileTabBar() {
  const [location, navigate] = useLocation();
  const { selection, impact, notification } = useHaptics();
  const { scanQRCode, isScanning, isNative } = useQRScanner();
  const { toast } = useToast();
  const [scanPulse, setScanPulse] = useState(false);

  const handleTabPress = () => {
    selection();
  };

  const handleQRScan = async () => {
    impact('medium');
    setScanPulse(true);
    setTimeout(() => setScanPulse(false), 300);

    if (!isNative) {
      toast({
        title: "QR Scanner",
        description: "QR scanning requires the native app. Use this page to generate or view QR codes.",
        duration: 3000,
      });
      navigate("/qr-code");
      return;
    }

    try {
      const result = await scanQRCode();
      if (result) {
        notification('success');
        if (result.includes('/memorial/')) {
          const memorialId = result.split('/memorial/').pop();
          if (memorialId) {
            navigate(`/memorial/${memorialId}`);
            toast({
              title: "Memorial Found",
              description: "Opening memorial...",
            });
          }
        } else if (result.startsWith('http')) {
          window.location.href = result;
        } else {
          toast({
            title: "QR Code Scanned",
            description: result,
          });
        }
      }
    } catch (error) {
      notification('error');
      toast({
        title: "Scan Failed",
        description: "Could not read QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border/30"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-[72px] max-w-md mx-auto px-2">
        {/* Left tabs */}
        {leftTabs.map((tab) => {
          const isActive = location === tab.path || 
            (tab.path !== "/" && location.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.path} 
              href={tab.path}
              onClick={handleTabPress}
              data-testid={tab.testId}
            >
              <button
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200",
                  "active:scale-90",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  isActive && "bg-primary/15"
                )}>
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-all duration-200",
                      isActive && "scale-110"
                    )} 
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                </div>
                <span className={cn(
                  "text-[11px] font-medium mt-1 transition-all duration-200",
                  isActive ? "font-semibold text-primary" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            </Link>
          );
        })}

        {/* Center QR Scanner Button - Elevated iOS-style */}
        <div className="relative -mt-6">
          <button
            onClick={handleQRScan}
            disabled={isScanning}
            data-testid="tab-qr-scanner"
            className={cn(
              "relative flex items-center justify-center w-16 h-16 rounded-full",
              "bg-gradient-to-br from-primary via-primary to-primary/80",
              "shadow-lg shadow-primary/30",
              "transition-all duration-200",
              "active:scale-90 active:shadow-md",
              isScanning && "animate-pulse",
              scanPulse && "scale-95"
            )}
            style={{
              boxShadow: '0 4px 20px rgba(147, 51, 234, 0.35), 0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg -z-10" />
            
            {/* Icon */}
            <ScanLine 
              className={cn(
                "w-7 h-7 text-primary-foreground",
                isScanning && "animate-pulse"
              )} 
              strokeWidth={2.5}
            />
            
            {/* Pulse ring animation */}
            {!isScanning && (
              <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping opacity-30" />
            )}
          </button>
          
          {/* Label */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-primary whitespace-nowrap">
            Scan QR
          </span>
        </div>

        {/* Right tabs */}
        {rightTabs.map((tab) => {
          const isActive = location === tab.path || 
            (tab.path !== "/" && location.startsWith(tab.path));
          const Icon = tab.icon;
          
          return (
            <Link 
              key={tab.path} 
              href={tab.path}
              onClick={handleTabPress}
              data-testid={tab.testId}
            >
              <button
                role="tab"
                aria-selected={isActive}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200",
                  "active:scale-90",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                  isActive && "bg-primary/15"
                )}>
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-all duration-200",
                      isActive && "scale-110"
                    )} 
                    strokeWidth={isActive ? 2.5 : 1.75}
                  />
                </div>
                <span className={cn(
                  "text-[11px] font-medium mt-1 transition-all duration-200",
                  isActive ? "font-semibold text-primary" : "text-muted-foreground"
                )}>
                  {tab.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
