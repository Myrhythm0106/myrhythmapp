
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EnhancedGlobalSearch } from "@/components/navigation/EnhancedGlobalSearch";
import { DynamicSidebar } from "./DynamicSidebar";
import { useSidebar } from "./Sidebar/SidebarContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Brain, Menu, User, LogOut, Crown } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { useUserData } from "@/hooks/use-user-data";
import { Badge } from "@/components/ui/badge";
import { EmpowermentProvider } from '@/contexts/EmpowermentContext';
import { EmpowermentNugget } from '@/components/empowerment/EmpowermentNugget';
import { GlobalQuickActions } from './GlobalQuickActions';

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
    <EmpowermentProvider>
      <div className="h-full flex w-full bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/20 to-clarity-teal-50/15 p-2">
      <div className="h-[calc(100vh-16px)] w-full border border-brain-health-200/20 rounded-lg bg-background/50 backdrop-blur-sm flex">
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
          "flex-1 flex flex-col h-full overflow-hidden transition-all duration-300",
          isCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}>
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-brain-health-200/50 shadow-sm">
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
            <BackButton 
              variant="ghost" 
              size="sm" 
              className="text-brain-health-600 hover:bg-brain-health-50"
            />
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-memory-emerald-500 via-brain-health-500 to-clarity-teal-500 rounded-md flex items-center justify-center lg:hidden">
                <Brain className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
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
            
            {/* Single Search Component and Empowerment Nugget */}
            <div className="flex items-center gap-4">
              <EmpowermentNugget className="hidden lg:flex" variant="compact" />
              <EnhancedGlobalSearch variant="input" size="sm" className="hidden md:flex max-w-xs" />
              <EnhancedGlobalSearch variant="icon" className="md:hidden" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-memory-emerald-500 via-brain-health-500 to-clarity-teal-500 text-white">
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
      
      {/* Global Quick Actions - Available on all pages */}
      <GlobalQuickActions />
    </div>
    </EmpowermentProvider>
  );
}

export default MainLayout;
