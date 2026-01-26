import { Smartphone, Vibrate, Share2, Bell, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isNativePlatform } from "@/lib/mobileUtils";
import { cn } from "@/lib/utils";

interface NativeFeaturesBadgeProps {
  className?: string;
  showAll?: boolean;
}

export function NativeFeaturesBadge({ className, showAll = false }: NativeFeaturesBadgeProps) {
  const isNative = isNativePlatform();
  
  if (!isNative && !showAll) return null;
  
  const features = [
    { icon: Vibrate, label: "Haptic Feedback", available: true },
    { icon: Share2, label: "Native Share", available: true },
    { icon: Bell, label: "Push Notifications", available: true },
    { icon: Camera, label: "Camera Access", available: true },
  ];
  
  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)} data-testid="native-features-badge">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Smartphone className="h-3.5 w-3.5" />
        <span>Native Features:</span>
      </div>
      {features.map((feature) => (
        <Badge 
          key={feature.label}
          variant="secondary" 
          className="text-xs gap-1 py-0.5"
        >
          <feature.icon className="h-3 w-3" />
          {feature.label}
        </Badge>
      ))}
    </div>
  );
}
