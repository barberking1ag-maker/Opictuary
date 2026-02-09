import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart, Calendar, QrCode, Crown, GraduationCap, Shield,
  Users, MapPin, Lock, PartyPopper, Cake, Gift, Music,
  ShoppingBag, FileText, Sparkles, Trophy, PawPrint,
  TreeDeciduous, Video, Mail, Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  href: string;
  icon: typeof Heart;
  label: string;
  color: string;
  testId: string;
}

const quickActions: QuickAction[] = [
  { href: "/create-memorial", icon: FileText, label: "Create Memorial", color: "text-primary", testId: "action-create-memorial" },
  { href: "/celebrations", icon: PartyPopper, label: "Celebrations", color: "text-primary", testId: "action-celebrations" },
  { href: "/products", icon: ShoppingBag, label: "Products", color: "text-primary", testId: "action-products" },
  { href: "/ai-holiday-cards", icon: Gift, label: "Holiday Cards", color: "text-primary", testId: "action-holiday-cards" },
  { href: "/ai-card-maker", icon: Sparkles, label: "AI Cards", color: "text-primary", testId: "action-ai-cards" },
];

interface FeatureItem {
  href: string;
  icon: typeof Heart;
  label: string;
  testId: string;
}

const memorialFeatures: FeatureItem[] = [
  { href: "/celebrity-memorials", icon: Crown, label: "Celebrity Memorials", testId: "feature-celebrity" },
  { href: "/alumni-memorials", icon: GraduationCap, label: "Alumni Memorials", testId: "feature-alumni" },
  { href: "/sports-memorials", icon: Trophy, label: "Sports Memorials", testId: "feature-sports" },
  { href: "/pet-memorials", icon: PawPrint, label: "Pet Memorials", testId: "feature-pets" },
  { href: "/essential-workers", icon: Shield, label: "Essential Workers", testId: "feature-essential" },
  { href: "/hood-memorials", icon: Users, label: "Hood Memorials", testId: "feature-hood" },
  { href: "/self-obituary", icon: Heart, label: "Self Obituary", testId: "feature-self-obit" },
  { href: "/living-legacy", icon: Sparkles, label: "Living Legacy", testId: "feature-living-legacy" },
];

const celebrationFeatures: FeatureItem[] = [
  { href: "/celebrations?tab=birthdays", icon: Cake, label: "Birthdays", testId: "feature-birthdays" },
  { href: "/celebrations?tab=weddings", icon: Gift, label: "Wedding Registry", testId: "feature-weddings" },
  { href: "/baby-shower", icon: Heart, label: "Baby Shower", testId: "feature-baby-shower" },
  { href: "/holiday-timeline", icon: Calendar, label: "Holiday Timeline", testId: "feature-holidays" },
  { href: "/event-planner", icon: Calendar, label: "Event Planner", testId: "feature-events" },
  { href: "/live-celebration", icon: Video, label: "Live Stream", testId: "feature-live" },
  { href: "/shared-music", icon: Music, label: "Shared Music", testId: "feature-music" },
  { href: "/virtual-reactions", icon: PartyPopper, label: "Reactions", testId: "feature-reactions" },
];

const toolFeatures: FeatureItem[] = [
  { href: "/qr-designer", icon: QrCode, label: "QR Designer", testId: "feature-qr" },
  { href: "/family-tree", icon: TreeDeciduous, label: "Family Tree", testId: "feature-tree" },
  { href: "/upcoming-messages", icon: Mail, label: "Future Messages", testId: "feature-messages" },
  { href: "/multi-faith-templates", icon: Sparkles, label: "Multi-Faith", testId: "feature-faith" },
  { href: "/neighborhoods", icon: MapPin, label: "Neighborhoods", testId: "feature-neighborhoods" },
  { href: "/prison-access", icon: Lock, label: "Prison Access", testId: "feature-prison" },
  { href: "/about", icon: Smartphone, label: "About Us", testId: "feature-about" },
  { href: "/support", icon: Shield, label: "Support", testId: "feature-support" },
];

function FeatureGrid({ items, title, testId }: { items: FeatureItem[]; title: string; testId: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1" data-testid={testId}>
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href + item.label} href={item.href} data-testid={item.testId}>
              <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-colors w-full">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                </div>
                <span className="text-[11px] text-foreground font-medium text-center leading-tight">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileHome() {
  return (
    <div className="pb-4">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-primary/8 to-background px-5 py-6">
        <h1 className="text-xl font-serif font-bold text-foreground mb-1" data-testid="text-mobile-welcome">
          Welcome to Opictuary
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          Honor every life, in every dimension.
        </p>

        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} data-testid={action.testId}>
                <Card className="transition-colors">
                  <CardContent className="flex flex-col items-center justify-center p-3">
                    <Icon className={cn("w-6 h-6 mb-1.5", action.color)} strokeWidth={1.75} />
                    <span className="text-[10px] font-medium text-foreground text-center leading-tight">
                      {action.label}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-5">
        <FeatureGrid items={memorialFeatures} title="Memorial Types" testId="section-memorials" />
        <FeatureGrid items={celebrationFeatures} title="Celebrations & Events" testId="section-celebrations" />
        <FeatureGrid items={toolFeatures} title="Tools & Resources" testId="section-tools" />
      </div>
    </div>
  );
}
