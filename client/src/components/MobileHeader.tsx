import { Link } from "wouter";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { UserMenu } from "@/components/UserMenu";

export function MobileHeader() {
  return (
    <header 
      className="lg:hidden sticky top-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border/50"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        <Link href="/">
          <OpictuaryLogo variant="classic" showTagline={false} className="scale-90" />
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            data-testid="button-mobile-notifications"
          >
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
            >
              3
            </Badge>
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
