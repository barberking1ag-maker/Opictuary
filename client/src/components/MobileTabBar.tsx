import { useLocation, Link } from "wouter";
import { Home, Plus, Heart, User, Menu } from "lucide-react";
import { useHaptics } from "@/hooks/useHaptics";
import { cn } from "@/lib/utils";

interface TabItem {
  path: string;
  icon: typeof Home;
  label: string;
  testId: string;
}

const tabs: TabItem[] = [
  { path: "/", icon: Home, label: "Home", testId: "tab-home" },
  { path: "/celebrations", icon: Heart, label: "Celebrate", testId: "tab-celebrations" },
  { path: "/create-memorial", icon: Plus, label: "Create", testId: "tab-create" },
  { path: "/my-memorials", icon: Menu, label: "Memorials", testId: "tab-memorials" },
  { path: "/profile", icon: User, label: "Profile", testId: "tab-profile" },
];

export function MobileTabBar() {
  const [location] = useLocation();
  const { selection } = useHaptics();

  const handleTabPress = () => {
    selection();
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border/50 pb-safe"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
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
                  "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200",
                  "active:scale-95",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-transform duration-200",
                      isActive && "scale-110"
                    )} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-0.5 transition-all duration-200",
                  isActive && "font-semibold"
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
