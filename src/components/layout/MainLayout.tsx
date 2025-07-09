
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Heart,
  Activity,
  Target,
  Users,
  Bell,
  FileText,
  User,
  Info,
  Brain,
  Menu,
  Music,
  Smile,
  StickyNote,
  Gamepad2,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { EnhancedGlobalSearch } from "@/components/navigation/EnhancedGlobalSearch";

interface MainLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Music, label: "Personal Empowerment", path: "/personal-empowerment" },
  { icon: Calendar, label: "Calendar & Goals", path: "/calendar" },
  { icon: Target, label: "Goals & Progress", path: "/goals" },
  { icon: Bell, label: "Accountability Hub", path: "/accountability" },
  { icon: Smile, label: "Mood Tracking", path: "/mood-tracking" },
  { icon: Heart, label: "Gratitude Practice", path: "/gratitude" },
  { icon: StickyNote, label: "My Notes", path: "/notes" },
];

const brainSection = [
  { icon: Gamepad2, label: "Brain Games", path: "/brain-games" },
  { icon: Brain, label: "Brain Recovery", path: "/brain-recovery" },
];

const communitySection = [
  { icon: MessageSquare, label: "Community", path: "/community" },
  { icon: Users, label: "Support Circle", path: "/personal-community" },
];

const resourcesSection = [
  { icon: User, label: "Profile", path: "/profile" },
  { icon: HelpCircle, label: "User Guide", path: "/user-guide" },
  { icon: HelpCircle, label: "Useful Resources", path: "/useful-info" },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const renderNavItem = (item: any, isNested = false) => (
    <NavLink
      key={item.path}
      to={item.path}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-teal-100 hover:text-teal-800",
          isActive ? "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 font-medium border-r-2 border-teal-500" : "text-muted-foreground",
          isNested && "ml-4"
        )
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-6 border-b">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-500 via-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
          <Brain className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
            MyRhythm
          </h2>
          <p className="text-xs text-muted-foreground">Memory1st → LEAP</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto px-4 py-6">
        <nav className="space-y-1">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
              Essential
            </h3>
            {navigationItems.map(item => renderNavItem(item))}
          </div>
          
          <div className="my-4 border-t" />
          
          {/* Memory1st Tools */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2 flex items-center gap-2">
              <Brain className="h-3 w-3" />
              Memory1st Tools
            </h3>
            {brainSection.map(item => renderNavItem(item))}
          </div>
          
          <div className="my-4 border-t" />
          
          {/* Community & Support */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2 flex items-center gap-2">
              <Users className="h-3 w-3" />
              Community
            </h3>
            {communitySection.map(item => renderNavItem(item))}
          </div>
          
          <div className="my-4 border-t" />
          
          {/* Resources */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2 flex items-center gap-2">
              <Settings className="h-3 w-3" />
              Settings
            </h3>
            {resourcesSection.map(item => renderNavItem(item))}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-teal-50/30 via-emerald-50/30 to-blue-50/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white/80 backdrop-blur-sm border-r border-teal-200/50 shadow-sm">
        <SidebarContent />
      </div>
      
      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-teal-200/50 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-teal-500 via-emerald-500 to-blue-500 rounded-md flex items-center justify-center lg:hidden">
                <Brain className="h-3 w-3 text-white" />
              </div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                MyRhythm
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Single Search Component */}
            <EnhancedGlobalSearch variant="input" size="sm" className="hidden md:flex max-w-xs" />
            <EnhancedGlobalSearch variant="icon" className="md:hidden" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
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
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
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
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
