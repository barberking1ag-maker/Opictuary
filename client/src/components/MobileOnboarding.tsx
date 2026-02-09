import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Heart, Calendar, QrCode, Users, ShoppingBag, PartyPopper, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingSlide {
  icon: typeof Heart;
  title: string;
  description: string;
  gradient: string;
}

const slides: OnboardingSlide[] = [
  {
    icon: Heart,
    title: "Create Lasting Memorials",
    description: "Build immersive memorial hubs with photos, videos, stories, and AI-guided tributes that honor every chapter of a loved one's life.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: PartyPopper,
    title: "Celebrate Life's Moments",
    description: "Birthday celebrations, wedding registries, baby showers, and 50+ multi-faith holiday observances all in one place.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: QrCode,
    title: "QR-Connected Keepsakes",
    description: "Create physical products with embedded QR codes that link to memorial pages. Scan to remember, anywhere, anytime.",
    gradient: "from-primary/15 to-accent/10",
  },
  {
    icon: Users,
    title: "Family Collaboration",
    description: "Invite family members to contribute stories, photos, and memories. Build family trees and share across generations.",
    gradient: "from-accent/15 to-primary/10",
  },
  {
    icon: Calendar,
    title: "Future Messages & Time Capsules",
    description: "Schedule messages for future dates. Send birthday wishes, anniversary notes, and heartfelt words to loved ones on special days.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: ShoppingBag,
    title: "Memorial Products & Services",
    description: "Custom memorial cards, QR plaques, and keepsakes. AI-designed cards and professional memorial products delivered to your door.",
    gradient: "from-accent/20 to-accent/5",
  },
];

interface MobileOnboardingProps {
  onComplete: () => void;
}

export function MobileOnboarding({ onComplete }: MobileOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  }, [currentSlide]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  const handleComplete = () => {
    localStorage.setItem("opictuary_onboarding_complete", "true");
    onComplete();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 pt-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)' }}>
        <OpictuaryLogo variant="classic" showTagline={false} />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleComplete}
          data-testid="button-skip-onboarding"
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      <div
        className="flex-1 flex flex-col items-center justify-center px-8"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={cn("w-32 h-32 rounded-full flex items-center justify-center mb-8 bg-gradient-to-br", slide.gradient)}>
          <Icon className="w-16 h-16 text-primary" strokeWidth={1.5} />
        </div>

        <h2 className="text-2xl font-serif font-bold text-foreground text-center mb-4" data-testid="text-onboarding-title">
          {slide.title}
        </h2>

        <p className="text-base text-muted-foreground text-center leading-relaxed max-w-sm" data-testid="text-onboarding-description">
          {slide.description}
        </p>
      </div>

      <div className="px-8 pb-8" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}>
        <div className="flex items-center justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30"
              )}
              data-testid={`dot-onboarding-${index}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              data-testid="button-onboarding-previous"
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            data-testid="button-onboarding-next"
            className="flex-1"
          >
            {isLastSlide ? "Get Started" : "Next"}
            {!isLastSlide && <ChevronRight className="w-5 h-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
