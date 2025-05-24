
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { Home, Calendar, User, Users, HeartPulse, HelpCircle, Settings, Menu, X, Heart, Info, Search, Smile } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Badge } from "@/components/ui/badge";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();
  
  // Essential navigation items first
  const primaryNavItems = [
    { to: "/dashboard", icon: <Home />, label: "Dashboard", badge: null },
    { to: "/calendar", icon: <Calendar />, label: "Calendar", badge: null },
    { to: "/tracking", icon: <HeartPulse />, label: "Health Tracking", badge: null },
    { to: "/mood", icon: <Smile />, label: "Mood Tracking", badge: "New" },
  ];
  
  // Secondary navigation items
  const secondaryNavItems = [
    { to: "/profile", icon: <User />, label: "My Profile", badge: null },
    { to: "/community", icon: <Users />, label: "Community", badge: null },
    { to: "/personal-community", icon: <Heart />, label: "My Support", badge: null },
    { to: "/useful-info", icon: <Info />, label: "Resources", badge: null },
  ];

  return (
    <>
      <div className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:relative", isOpen ? "translate-x-0" : "-translate-x-full md:w-20")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-beacon-600" />
            {isOpen && <span className="text-lg font-semibold text-sidebar-foreground">MyRhythm</span>}
          </div>
          <button onClick={toggle} className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent" aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Search button - more prominent at the top for easy access */}
        <div className="px-2 pt-3 pb-1">
          <div className={cn("flex", isOpen ? "justify-between" : "justify-center")}>
            {isOpen && <span className="text-sm font-medium text-sidebar-foreground">Quick Search</span>}
            <div className={cn(!isOpen && "w-full flex justify-center")}>
              <GlobalSearch />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">
          {/* Primary Navigation - Essential Items */}
          <div className="px-2 mb-4">
            {isOpen && <div className="text-xs font-medium text-sidebar-foreground/70 px-3 mb-1">ESSENTIAL</div>}
            <nav className="grid gap-1">
              {primaryNavItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  isOpen={isOpen}
                  badge={item.badge}
                />
              ))}
            </nav>
          </div>
          
          {/* Secondary Navigation */}
          <div className="px-2">
            {isOpen && <div className="text-xs font-medium text-sidebar-foreground/70 px-3 mb-1 mt-2">ADDITIONAL</div>}
            <nav className="grid gap-1">
              {secondaryNavItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to} 
                  icon={item.icon} 
                  label={item.label} 
                  isOpen={isOpen}
                  badge={item.badge}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t py-4 px-2">
          <NavItem to="/settings" icon={<Settings />} label="Settings" isOpen={isOpen} />
          <NavItem to="/help" icon={<HelpCircle />} label="Help & Support" isOpen={isOpen} />
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={toggle} />}

      {/* Toggle button for mobile */}
      <button onClick={toggle} className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg md:hidden" aria-label="Toggle sidebar">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  badge?: string | null;
}

const NavItem = ({ to, icon, label, isOpen, badge }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({isActive}) => cn(
        "nav-item", 
        isActive && "nav-item-active"
      )} 
      title={!isOpen ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && (
        <div className="flex justify-between items-center w-full">
          <span>{label}</span>
          {badge && (
            <Badge variant="outline" className="text-[10px] h-5 bg-primary/10 text-primary border-primary/30">
              {badge}
            </Badge>
          )}
        </div>
      )}
    </NavLink>
  );
};
