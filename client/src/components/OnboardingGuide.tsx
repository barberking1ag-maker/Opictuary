import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  FileText, 
  Image, 
  Calendar, 
  QrCode, 
  Users, 
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShoppingBag,
  PartyPopper
} from "lucide-react";

const onboardingSteps = [
  {
    id: 1,
    title: "Welcome to Opictuary",
    description: "The world's first continuum memorial platform. Honor every life, in every dimension.",
    icon: Sparkles,
    details: "Create lasting digital memorials that keep memories alive for generations. Our platform offers comprehensive tools for preserving legacies."
  },
  {
    id: 2,
    title: "Create a Memorial",
    description: "Start by creating a beautiful memorial page for your loved one.",
    icon: FileText,
    details: "Add photos, videos, life stories, and tributes. Choose from multi-faith templates and customize every detail.",
    action: "/create-memorial"
  },
  {
    id: 3,
    title: "Add Photos & Media",
    description: "Upload photos and videos to create an immersive gallery.",
    icon: Image,
    details: "Build a visual timeline of cherished moments. Family and friends can contribute their own memories."
  },
  {
    id: 4,
    title: "Schedule Future Messages",
    description: "Send messages to loved ones on special dates.",
    icon: Calendar,
    details: "Create birthday wishes, anniversary messages, or holiday greetings that deliver automatically on scheduled dates."
  },
  {
    id: 5,
    title: "QR Memorial Products",
    description: "Connect physical memorials to digital ones.",
    icon: QrCode,
    details: "Generate QR codes for headstones, plaques, and keepsakes that link directly to the memorial page.",
    action: "/products"
  },
  {
    id: 6,
    title: "Celebrations Hub",
    description: "Celebrate birthdays, holidays, and special occasions.",
    icon: PartyPopper,
    details: "Our Celebrations Hub includes 50+ multi-faith holidays, birthday celebrations, and wedding gift registries.",
    action: "/celebrations"
  },
  {
    id: 7,
    title: "Connect with Family",
    description: "Invite family members to collaborate and share.",
    icon: Users,
    details: "Build family trees, share memories, and create a collaborative space for everyone to contribute."
  },
  {
    id: 8,
    title: "You're Ready!",
    description: "Start honoring your loved ones today.",
    icon: Heart,
    details: "Explore all features including celebrity memorials, pet memorials, alumni tributes, and more. We're here to help preserve every legacy."
  }
];

export function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("opictuary_onboarding_completed");
    if (!seen) {
      setHasSeenOnboarding(false);
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem("opictuary_onboarding_completed", "true");
    setHasSeenOnboarding(true);
    setIsOpen(false);
  };

  const skipOnboarding = () => {
    localStorage.setItem("opictuary_onboarding_completed", "true");
    setHasSeenOnboarding(true);
    setIsOpen(false);
  };

  const restartOnboarding = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const step = onboardingSteps[currentStep];
  const IconComponent = step.icon;
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (hasSeenOnboarding && !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg" data-testid="onboarding-dialog">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl" data-testid="onboarding-title">
              {step.title}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={skipOnboarding}
              className="h-8 w-8"
              data-testid="button-skip-onboarding"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription data-testid="onboarding-description">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-primary" />
            </div>
          </div>

          <p className="text-center text-muted-foreground" data-testid="onboarding-details">
            {step.details}
          </p>

          {step.action && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  window.location.href = step.action!;
                }}
                data-testid="button-onboarding-action"
              >
                Try it now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            data-testid="onboarding-progress"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground" data-testid="onboarding-step-counter">
            Step {currentStep + 1} of {onboardingSteps.length}
          </div>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                data-testid="button-onboarding-previous"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              data-testid="button-onboarding-next"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  Get Started
                  <Heart className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="text-center mt-2">
          <button 
            onClick={skipOnboarding}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-skip-tour"
          >
            Skip tour
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OnboardingTrigger() {
  const restartOnboarding = () => {
    localStorage.removeItem("opictuary_onboarding_completed");
    window.location.reload();
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={restartOnboarding}
      className="text-xs"
      data-testid="button-restart-onboarding"
    >
      <Sparkles className="w-3 h-3 mr-1" />
      Take Tour
    </Button>
  );
}
