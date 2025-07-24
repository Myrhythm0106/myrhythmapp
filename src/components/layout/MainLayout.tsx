
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EnhancedGlobalSearch } from "@/components/navigation/EnhancedGlobalSearch";
import { DynamicSidebar } from "./DynamicSidebar";
import { useSidebar } from "./Sidebar/SidebarContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Brain, Menu, User, LogOut, Crown, ArrowLeft } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { Badge } from "@/components/ui/badge";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isCollapsed } = useSidebar();
  const { trackTimeSpent } = useUserProgress();
  const userData = useUserData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Track session time
  useEffect(() => {
    const startTime = Date.now();
    const trackingInterval = setInterval(() => {
      const currentTime = Date.now();
      const minutesSpent = Math.floor((currentTime - startTime) / 60000);
      if (minutesSpent > 0) {
        trackTimeSpent(1);
      }
    }, 60000);

    return () => clearInterval(trackingInterval);
  }, [trackTimeSpent]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleUpgradeClick = () => {
    navigate("/in-app-purchase");
  };

  const handleBackToWelcome = () => {
    navigate("/");
  };

  const getUserTypeLabel = (userType: string) => {
    const labels = {
      'brain-injury': 'Brain Recovery',
      'caregiver': 'Caregiver Support',
      'cognitive-optimization': 'Peak Performance',
      'wellness': 'Wellness & Growth'
    };
    return labels[userType] || 'General Wellness';
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    const variants = {
      'brain-injury': 'healing',
      'caregiver': 'premium',
      'cognitive-optimization': 'cognitive',
      'wellness': 'clarity'
    };
    return variants[userType] || 'default';
  };

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-2">
      <div className="min-h-[calc(100vh-16px)] w-full border border-border/20 rounded-lg bg-background/50 backdrop-blur-sm">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DynamicSidebar isCollapsed={isCollapsed} />
        </div>
        
        {/* Mobile Sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
            <DynamicSidebar isCollapsed={false} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-purple-200/50 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
                <DynamicSidebar isCollapsed={false} />
              </SheetContent>
            </Sheet>
            
            {/* Back Navigation */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToWelcome}
              className="flex items-center gap-2 text-purple-600 hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Welcome</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-md flex items-center justify-center lg:hidden">
                <Brain className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Role Badge */}
            {userData.userType && (
              <Badge 
                variant={getUserTypeBadgeVariant(userData.userType)}
                className="hidden sm:inline-flex"
              >
                {getUserTypeLabel(userData.userType)}
              </Badge>
            )}
            
            {/* Single Search Component */}
            <EnhancedGlobalSearch variant="input" size="sm" className="hidden md:flex max-w-xs" />
            <EnhancedGlobalSearch variant="icon" className="md:hidden" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 text-white">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.user_metadata?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {userData.userType && (
                      <Badge 
                        variant={getUserTypeBadgeVariant(userData.userType)}
                        className="w-fit text-xs"
                      >
                        {getUserTypeLabel(userData.userType)}
                      </Badge>
                    )}
                  </div>  
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUpgradeClick}>
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Premium
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
