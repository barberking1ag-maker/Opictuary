import { useEffect, useState, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

interface NativeHeaderProps {
  title: string;
  largeTitle?: boolean;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
}

export function NativeHeader({ 
  title, 
  largeTitle = true, 
  showBack = false,
  rightAction,
  transparent = false 
}: NativeHeaderProps) {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { impact } = useHaptics();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    impact('light');
    window.history.back();
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          transparent && !isScrolled 
            ? "bg-transparent" 
            : "bg-card/95 backdrop-blur-lg border-b border-border/50",
          isScrolled && "shadow-sm"
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2 min-w-[80px]">
            {showBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="w-10 h-10 -ml-2"
                data-testid="button-back"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
          </div>
          
          <h1 className={cn(
            "font-semibold text-center transition-all duration-300",
            largeTitle && !isScrolled ? "opacity-0" : "opacity-100 text-lg"
          )}>
            {title}
          </h1>
          
          <div className="flex items-center gap-2 min-w-[80px] justify-end">
            {rightAction}
          </div>
        </div>
      </header>

      {largeTitle && (
        <div 
          className={cn(
            "pt-20 px-4 pb-2 transition-all duration-300",
            isScrolled && "opacity-0 -translate-y-4"
          )}
          style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px + 8px)' }}
        >
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
      )}

      {!largeTitle && (
        <div style={{ height: 'calc(env(safe-area-inset-top) + 56px)' }} />
      )}
    </>
  );
}
