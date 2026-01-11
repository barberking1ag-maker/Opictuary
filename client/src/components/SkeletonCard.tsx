import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "default" | "memorial" | "list" | "profile";
  className?: string;
}

export function SkeletonCard({ variant = "default", className }: SkeletonCardProps) {
  if (variant === "memorial") {
    return (
      <div className={cn("rounded-xl bg-card border border-border/50 overflow-hidden", className)}>
        <div className="aspect-[4/3] bg-muted animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-muted rounded-md w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded-md w-1/2 animate-pulse" />
          <div className="flex gap-2 pt-2">
            <div className="h-8 bg-muted rounded-md w-20 animate-pulse" />
            <div className="h-8 bg-muted rounded-md w-20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50", className)}>
        <div className="w-14 h-14 rounded-full bg-muted animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse" />
          <div className="h-3 bg-muted rounded-md w-1/2 animate-pulse" />
        </div>
        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className={cn("flex flex-col items-center p-6 space-y-4", className)}>
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
        <div className="h-6 bg-muted rounded-md w-32 animate-pulse" />
        <div className="h-4 bg-muted rounded-md w-48 animate-pulse" />
        <div className="flex gap-8 pt-4">
          <div className="text-center space-y-1">
            <div className="h-6 bg-muted rounded-md w-12 animate-pulse mx-auto" />
            <div className="h-3 bg-muted rounded-md w-16 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <div className="h-6 bg-muted rounded-md w-12 animate-pulse mx-auto" />
            <div className="h-3 bg-muted rounded-md w-16 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl bg-card border border-border/50 p-4 space-y-3", className)}>
      <div className="h-4 bg-muted rounded-md w-3/4 animate-pulse" />
      <div className="h-4 bg-muted rounded-md w-full animate-pulse" />
      <div className="h-4 bg-muted rounded-md w-1/2 animate-pulse" />
    </div>
  );
}

export function SkeletonList({ count = 3, variant = "list" as const }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant="memorial" />
      ))}
    </div>
  );
}
