import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  QrCode, 
  Navigation, 
  TreeDeciduous, 
  PartyPopper, 
  Crown, 
  Heart,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";

const tourSteps = [
  {
    icon: Heart,
    title: "Welcome to Opictuary",
    description: "The world's first continuum memorial platform. Honor every life, in every dimension.",
    color: "text-purple-500"
  },
  {
    icon: FileText,
    title: "Create Memorials",
    description: "Build beautiful, dignified digital memorials with photos, videos, stories, and music playlists.",
    color: "text-blue-500"
  },
  {
    icon: TreeDeciduous,
    title: "Family Tree",
    description: "Connect generations with interactive family trees that preserve your legacy.",
    color: "text-green-500"
  },
  {
    icon: Navigation,
    title: "Cemetery Navigator",
    description: "Find and navigate to gravesites with GPS-powered cemetery location mapping.",
    color: "text-blue-600"
  },
  {
    icon: QrCode,
    title: "QR Code Memorial Products",
    description: "Create custom QR codes for headstones, plaques, and keepsakes that link to digital memorials.",
    color: "text-purple-600"
  },
  {
    icon: PartyPopper,
    title: "Continuum Celebrations",
    description: "Celebrate birthdays, holidays, and special occasions with live streaming and gift registries.",
    color: "text-yellow-500"
  },
  {
    icon: Crown,
    title: "Celebrity Memorials",
    description: "Honor iconic figures with verified tributes supporting their favorite charities.",
    color: "text-amber-500"
  },
  {
    icon: Users,
    title: "You're Ready!",
    description: "Explore all features and start honoring the lives that matter most to you.",
    color: "text-purple-500"
  }
];

export function AppTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("opictuary_tour_completed");
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem("opictuary_tour_completed", "true");
    setShowTour(false);
  };

  const skipTour = () => {
    localStorage.setItem("opictuary_tour_completed", "true");
    setShowTour(false);
  };

  if (!showTour) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" data-testid="app-tour-overlay">
      <Card className="w-full max-w-md relative overflow-hidden" data-testid="app-tour-card">
        <button
          onClick={skipTour}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
          data-testid="button-skip-tour"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="h-2 bg-muted">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
          />
        </div>
        
        <CardContent className="pt-8 pb-6 px-6 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6 ${step.color}`}>
            <Icon className="w-10 h-10" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3" data-testid="tour-step-title">
            {step.title}
          </h2>
          
          <p className="text-muted-foreground mb-8" data-testid="tour-step-description">
            {step.description}
          </p>
          
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1"
              data-testid="button-prev-step"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-purple-500" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              data-testid="button-next-step"
            >
              {isLastStep ? "Get Started" : "Next"}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          
          <button
            onClick={skipTour}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
            data-testid="button-skip-tour-text"
          >
            Skip tour
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
