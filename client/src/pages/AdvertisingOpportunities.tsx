import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp, Users, Target, Megaphone } from "lucide-react";

const AD_PLACEMENTS = [
  {
    name: "Memorial Page Sidebar",
    description: "Featured placement on memorial pages with high visibility",
    price: "$299/month",
    impressions: "50,000+",
    features: [
      "Prime sidebar placement",
      "Discount code integration",
      "Click tracking & analytics",
      "Appears on all memorials",
    ],
  },
  {
    name: "Category Spotlight",
    description: "Exclusive placement in specific product categories",
    price: "$199/month",
    impressions: "25,000+",
    features: [
      "Category-specific targeting",
      "Percentage-off badge display",
      "Custom discount codes",
      "Detailed conversion tracking",
    ],
  },
  {
    name: "Partner Directory",
    description: "Featured listing in partner directory with referral tracking",
    price: "$149/month",
    impressions: "15,000+",
    features: [
      "Directory page presence",
      "Referral code system",
      "Commission tracking",
      "Monthly performance reports",
    ],
  },
];

const BUSINESS_TYPES = [
  {
    icon: "⚰️",
    title: "Funeral Homes",
    description: "Connect with families planning memorial services",
    discount: "Offer 10-20% off services",
  },
  {
    icon: "⛪",
    title: "Churches & Religious Centers",
    description: "Provide space for memorial services and grief support",
    discount: "Special venue packages",
  },
  {
    icon: "🌳",
    title: "Cemetery & Land",
    description: "Promote burial plots, cremation gardens, and memorial spaces",
    discount: "Up to 15% off plots",
  },
  {
    icon: "💐",
    title: "Florists",
    description: "Offer sympathy arrangements and memorial flowers",
    discount: "10-25% off arrangements",
  },
  {
    icon: "📸",
    title: "Memorial Services",
    description: "Photography, video tributes, and memory preservation",
    discount: "Package discounts available",
  },
  {
    icon: "🎨",
    title: "Custom Products",
    description: "Urns, caskets, memorial jewelry, and personalized items",
    discount: "20% off custom orders",
  },
];

export default function AdvertisingOpportunities() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Advertising Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with families during their time of need. Offer meaningful discounts and grow your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Reach Families</CardTitle>
              <CardDescription>
                Connect with thousands of families creating memorials for loved ones
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Targeted Exposure</CardTitle>
              <CardDescription>
                Your ads appear to visitors when they're actively planning services
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Track Results</CardTitle>
              <CardDescription>
                Detailed analytics on impressions, clicks, and conversions
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">
            Perfect For These Businesses
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUSINESS_TYPES.map((business, i) => (
              <Card key={i} className="hover-elevate" data-testid={`business-type-${i}`}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="text-3xl" data-testid={`business-icon-${i}`}>{business.icon}</div>
                    <div>
                      <CardTitle className="text-lg" data-testid={`business-title-${i}`}>
                        {business.title}
                      </CardTitle>
                      <CardDescription className="mt-1" data-testid={`business-description-${i}`}>
                        {business.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="gap-1" data-testid={`business-discount-${i}`}>
                    <span className="font-semibold">{business.discount}</span>
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">
            Advertising Packages
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {AD_PLACEMENTS.map((placement, i) => (
              <Card key={i} className="hover-elevate" data-testid={`ad-package-${i}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle data-testid={`package-name-${i}`}>{placement.name}</CardTitle>
                    <Badge variant="outline" data-testid={`package-impressions-${i}`}>
                      {placement.impressions}
                    </Badge>
                  </div>
                  <CardDescription data-testid={`package-description-${i}`}>
                    {placement.description}
                  </CardDescription>
                  <div className="text-3xl font-bold text-primary mt-4" data-testid={`package-price-${i}`}>
                    {placement.price}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {placement.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2" data-testid={`feature-${i}-${j}`}>
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            How Discount Links Work
          </h2>
          <div className="max-w-3xl mx-auto mb-8 space-y-4 text-left">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1">Submit Your Ad</h3>
                <p className="text-muted-foreground">
                  Create an advertisement with your discount percentage (10%, 15%, 20%, etc.)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1">Get Your Discount Code</h3>
                <p className="text-muted-foreground">
                  We generate a unique discount code that tracks all referrals from our platform
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ads Appear with Discount Badge</h3>
                <p className="text-muted-foreground">
                  Your ad displays prominently with a percentage-off badge ("15% OFF" etc.)
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold mb-1">Track Every Click</h3>
                <p className="text-muted-foreground">
                  Monitor impressions, clicks, and conversions through your partner dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/advertise">
              <Button size="lg" data-testid="button-submit-ad">
                <Megaphone className="w-4 h-4 mr-2" />
                Submit an Advertisement
              </Button>
            </Link>
            <Link href="/partner-signup">
              <Button size="lg" variant="outline" data-testid="button-become-partner">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-4">Questions about advertising?</h3>
          <p className="text-muted-foreground mb-6">
            Contact us at <a href="mailto:advertising@opictuary.com" className="text-primary hover:underline">advertising@opictuary.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
