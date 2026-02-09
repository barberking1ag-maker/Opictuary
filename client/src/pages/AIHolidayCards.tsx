import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, ArrowRight, ArrowLeft, Palette, Wand2, Download, RefreshCw, Star, Calendar, Heart, Sun, Moon, Flame, TreePine, Gift, Globe } from "lucide-react";
import { handleMobileLogin } from "@/lib/mobileUtils";

interface HolidayCategory {
  id: string;
  name: string;
  icon: typeof Star;
  description: string;
  samplePrompts: string[];
}

const holidayCategories: HolidayCategory[] = [
  {
    id: "christmas",
    name: "Christmas",
    icon: TreePine,
    description: "Warm holiday greetings with festive spirit",
    samplePrompts: [
      "A snowy winter scene with a glowing Christmas tree and warm golden lights",
      "A peaceful nativity scene with soft candlelight and a starry sky",
      "Vintage Christmas card with holly, bells, and a wreath on a red door",
    ],
  },
  {
    id: "hanukkah",
    name: "Hanukkah",
    icon: Flame,
    description: "Beautiful Festival of Lights designs",
    samplePrompts: [
      "A glowing menorah with all candles lit against a deep blue background with gold accents",
      "Star of David surrounded by soft blue and silver lights",
      "Dreidels and gelt on a festive table with menorah in background",
    ],
  },
  {
    id: "eid",
    name: "Eid",
    icon: Moon,
    description: "Elegant Eid al-Fitr and Eid al-Adha cards",
    samplePrompts: [
      "A crescent moon and stars over a beautiful mosque silhouette at twilight",
      "Elegant geometric Islamic pattern with gold and green lanterns",
      "Festive Eid table with traditional sweets and decorations",
    ],
  },
  {
    id: "diwali",
    name: "Diwali",
    icon: Flame,
    description: "Vibrant Festival of Lights celebrations",
    samplePrompts: [
      "Rows of glowing clay diyas along a decorated pathway at night",
      "Beautiful rangoli design with vibrant colors and lit candles",
      "Fireworks over a decorated home with lanterns and flower garlands",
    ],
  },
  {
    id: "easter",
    name: "Easter",
    icon: Sun,
    description: "Spring-themed Easter greetings",
    samplePrompts: [
      "A peaceful spring garden with pastel Easter eggs nestled in green grass",
      "Beautiful sunrise over a cross on a hilltop with blooming flowers",
      "Easter bunny in a field of wildflowers with decorated eggs",
    ],
  },
  {
    id: "kwanzaa",
    name: "Kwanzaa",
    icon: Flame,
    description: "Celebrate African heritage and culture",
    samplePrompts: [
      "A kinara with seven candles glowing warmly, surrounded by African cloth patterns",
      "Harvest celebration with fruits, corn, and the unity cup",
      "Beautiful African-inspired patterns with red, black, and green colors",
    ],
  },
  {
    id: "thanksgiving",
    name: "Thanksgiving",
    icon: Heart,
    description: "Grateful and warm Thanksgiving designs",
    samplePrompts: [
      "A warm autumn harvest table with pumpkins, leaves, and golden light",
      "Beautiful fall landscape with colorful trees and a cozy cabin",
      "Family gathering table with traditional Thanksgiving dishes",
    ],
  },
  {
    id: "newyear",
    name: "New Year",
    icon: Globe,
    description: "Ring in the new year with style",
    samplePrompts: [
      "Spectacular fireworks display over a city skyline at midnight",
      "Elegant gold and silver celebration with confetti and champagne",
      "Beautiful sunrise on the first day of the new year over the ocean",
    ],
  },
  {
    id: "valentines",
    name: "Valentine's Day",
    icon: Heart,
    description: "Cards of love and remembrance",
    samplePrompts: [
      "A heart made of red roses on a soft pink background",
      "Two doves carrying a ribbon over a garden of flowers",
      "Elegant watercolor hearts with soft pastel colors and gold accents",
    ],
  },
  {
    id: "mothers-day",
    name: "Mother's Day",
    icon: Heart,
    description: "Honor mothers with beautiful cards",
    samplePrompts: [
      "A bouquet of flowers in soft watercolor with butterflies",
      "A peaceful garden scene with a bench and blooming flowers",
      "Elegant floral frame surrounding a heartfelt message space",
    ],
  },
  {
    id: "fathers-day",
    name: "Father's Day",
    icon: Star,
    description: "Celebrate fathers with heartfelt designs",
    samplePrompts: [
      "A peaceful mountain landscape at sunset with warm tones",
      "Classic vintage style card with nautical theme and anchors",
      "A serene fishing scene on a calm lake at golden hour",
    ],
  },
  {
    id: "memorial",
    name: "Remembrance",
    icon: Calendar,
    description: "Honor loved ones during holidays",
    samplePrompts: [
      "A single candle glowing in a window with soft snowfall outside",
      "A peaceful garden memorial with butterflies and white flowers",
      "A starry night sky with a single bright star and gentle clouds",
    ],
  },
];

export default function AIHolidayCards() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "AI Holiday Cards - Create Custom Cards | Opictuary";
    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = "Create beautiful, personalized holiday cards with AI. Choose from 12+ holidays across all faiths including Christmas, Hanukkah, Eid, Diwali, and more. Free to generate on Opictuary.";
    if (metaDesc) {
      metaDesc.setAttribute("content", descContent);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descContent;
      document.head.appendChild(meta);
    }
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    setOgTag("og:title", "AI Holiday Cards - Opictuary");
    setOgTag("og:description", descContent);
    setOgTag("og:type", "website");
    setOgTag("og:url", window.location.href);
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<HolidayCategory | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/holiday-cards/generate", {
        prompt,
        holiday: selectedCategory?.id || "general",
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast({ title: "Card Created", description: "Your AI holiday card has been generated." });
      }
    },
    onError: (error: any) => {
      toast({ title: "Generation Failed", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const handleGenerate = () => {
    const prompt = customPrompt || selectedSample;
    if (!prompt) {
      toast({ title: "Describe your card", description: "Please enter a description or pick a suggestion.", variant: "destructive" });
      return;
    }
    if (!isAuthenticated) {
      handleMobileLogin();
      return;
    }
    generateMutation.mutate(prompt);
  };

  const handleSelectSample = (sample: string) => {
    setSelectedSample(sample);
    setCustomPrompt(sample);
  };

  const handleReset = () => {
    setGeneratedImageUrl(null);
    setCustomPrompt("");
    setSelectedSample(null);
  };

  if (generatedImageUrl) {
    return (
      <div className="min-h-screen bg-background" data-testid="ai-holiday-cards-result">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2" data-testid="heading-card-result">
              Your Holiday Card
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory?.name || "Holiday"} card generated with AI
            </p>
          </div>

          <Card className="overflow-hidden mb-6">
            <img
              src={generatedImageUrl}
              alt="AI Generated Holiday Card"
              className="w-full"
              data-testid="img-generated-card"
            />
          </Card>

          <div className="flex flex-col gap-3">
            <a href={generatedImageUrl} download="holiday-card.png" target="_blank" rel="noopener noreferrer">
              <Button className="w-full" data-testid="button-download-card">
                <Download className="w-4 h-4 mr-2" />
                Download Card
              </Button>
            </a>
            <Button variant="outline" onClick={handleReset} className="w-full" data-testid="button-create-another">
              <RefreshCw className="w-4 h-4 mr-2" />
              Create Another Card
            </Button>
            <Link href="/ai-card-maker">
              <Button variant="outline" className="w-full" data-testid="button-memorial-cards">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Memorial Card Designer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-background" data-testid="ai-holiday-cards-design">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <Button variant="ghost" onClick={() => { setSelectedCategory(null); setCustomPrompt(""); setSelectedSample(null); }} className="mb-4" data-testid="button-back-categories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Holidays
          </Button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <selectedCategory.icon className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2" data-testid="heading-holiday-design">
              {selectedCategory.name} Card
            </h1>
            <p className="text-muted-foreground">{selectedCategory.description}</p>
          </div>

          <div className="mb-6">
            <Label className="text-base font-semibold mb-3 block">Describe your card design</Label>
            <Textarea
              value={customPrompt}
              onChange={(e) => { setCustomPrompt(e.target.value); setSelectedSample(null); }}
              placeholder={`Describe your perfect ${selectedCategory.name} card...`}
              className="min-h-[100px] text-base"
              data-testid="input-card-prompt"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block text-muted-foreground">Or pick a suggestion</Label>
            <div className="flex flex-col gap-2">
              {selectedCategory.samplePrompts.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectSample(sample)}
                  className={`text-left p-3 rounded-md border text-sm transition-colors ${
                    customPrompt === sample
                      ? "border-primary bg-primary/5"
                      : "border-border hover-elevate"
                  }`}
                  data-testid={`button-sample-${i}`}
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || (!customPrompt && !selectedSample)}
            className="w-full"
            data-testid="button-generate-card"
          >
            {generateMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Card...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Card
              </>
            )}
          </Button>

          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground text-center mt-3">
              Sign in required to generate cards
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="ai-holiday-cards-page">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-3" data-testid="heading-ai-holiday-cards">
            AI Holiday Cards
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Create beautiful, personalized holiday cards with AI. Choose a holiday, describe your vision, and our AI designs a unique card just for you.
          </p>
          <Badge variant="secondary" className="text-sm" data-testid="badge-holiday-price">
            Free to Generate
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Pick a Holiday</h3>
              <p className="text-sm text-muted-foreground">
                Choose from 12+ holidays across all faiths and traditions
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Describe Your Vision</h3>
              <p className="text-sm text-muted-foreground">
                Write a description or pick from our curated suggestions
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Wand2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">AI Creates It</h3>
              <p className="text-sm text-muted-foreground">
                Our AI generates a unique, stunning card design in seconds
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6" data-testid="heading-choose-holiday">Choose a Holiday</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {holidayCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center p-4 rounded-xl border border-border hover-elevate transition-colors text-center"
                data-testid={`button-holiday-${cat.id}`}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="font-medium text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-muted-foreground mb-3">Looking for printed memorial cards?</p>
          <Link href="/ai-card-maker">
            <Button variant="outline" data-testid="button-memorial-cards-link">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Memorial Card Designer
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
