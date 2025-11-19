import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, Heart, LogOut, LogIn, UserPlus, BarChart3, Calendar, Image, ShoppingBag } from "lucide-react";

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.location.href = '/api/login'}
          data-testid="button-login"
          className="hidden sm:flex"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button 
          size="sm" 
          onClick={() => window.location.href = '/api/login'}
          data-testid="button-signup"
        >
          <UserPlus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Sign Up</span>
        </Button>
      </div>
    );
  }

  const fullName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.firstName || user?.lastName || undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-10 w-10 rounded-full p-0 hover-elevate" 
          data-testid="button-user-menu"
        >
          <UserAvatar 
            src={user?.profileImageUrl} 
            name={fullName}
            email={user?.email || undefined}
            size="md"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none" data-testid="text-user-name">
              {fullName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-profile">
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/my-memorials">
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-memorials">
            <Heart className="mr-2 h-4 w-4" />
            <span>My Memorials</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/upcoming-messages">
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-upcoming-messages">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Legacy Messages</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/memorial/e94ee1f4-2506-4848-9c7e-97b6d473cf81">
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-photo-gallery">
            <Image className="mr-2 h-4 w-4" />
            <span>Photo Gallery</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/profile?tab=settings">
          <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </Link>
        {user?.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <Link href="/admin">
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-admin">
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/admin/product-orders">
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-item-admin-orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Product Orders</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive" 
          onClick={() => window.location.href = '/api/logout'}
          data-testid="menu-item-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
