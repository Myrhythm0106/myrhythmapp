
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { Home, Calendar, User, Users, HeartPulse, HelpCircle, Settings, Menu, X, Heart, Info, Search, Smile, Brain, Target, Palette, Layout, Type, Volume2, Shield, Sliders, ChevronDown, ChevronRight } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();
  const [additionalOpen, setAdditionalOpen] = useState(() => {
    return localStorage.getItem('sidebarAdditionalOpen') !== 'false';
  });
  const [customizationOpen, setCustomizationOpen] = useState(() => {
    return localStorage.getItem('sidebarCustomizationOpen') !== 'false';
  });
  
  // Save preferences to localStorage
  const handleAdditionalToggle = (open: boolean) => {
    setAdditionalOpen(open);
    localStorage.setItem('sidebarAdditionalOpen', open.toString());
  };

  const handleCustomizationToggle = (open: boolean) => {
    setCustomizationOpen(open);
    localStorage.setItem('sidebarCustomizationOpen', open.toString());
  };

  // Essential navigation items - what users need daily
  const essentialNavItems = [
    { to: "/dashboard", icon: <Home />, label: "Dashboard", badge: null },
    { to: "/calendar", icon: <Calendar />, label: "Calendar", badge: null },
    { to: "/mood", icon: <Smile />, label: "Mood Tracking", badge: null },
    { to: "/tracking", icon: <HeartPulse />, label: "Health Tracking", badge: null },
  ];
  
  // Additional navigation items - supporting features
  const additionalNavItems = [
    { to: "/gratitude", icon: <Heart />, label: "Gratitude", badge: null },
    { to: "/", icon: <Brain />, label: "Brain Recovery", badge: null },
    { to: "/profile", icon: <User />, label: "My Profile", badge: null },
    { to: "/community", icon: <Users />, label: "Community", badge: null },
    { to: "/personal-community", icon: <Target />, label: "My Support", badge: null },
    { to: "/useful-info", icon: <Info />, label: "Resources", badge: null },
  ];

  // Customization navigation items
  const customizationNavItems = [
    { to: "/customization", icon: <Sliders />, label: "App Preferences", badge: null },
    { to: "/customization?tab=appearance", icon: <Palette />, label: "Themes & Colors", badge: null },
    { to: "/customization?tab=accessibility", icon: <Type />, label: "Accessibility", badge: null },
    { to: "/settings", icon: <Settings />, label: "General Settings", badge: null },
    { to: "/profile?section=notifications", icon: <Volume2 />, label: "Notifications", badge: null },
    { to: "/profile?section=privacy", icon: <Shield />, label: "Privacy & Security", badge: null },
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

        {/* Search button - prominent at the top */}
        <div className="px-2 pt-3 pb-1">
          <div className={cn("flex", isOpen ? "justify-between" : "justify-center")}>
            {isOpen && <span className="text-sm font-medium text-sidebar-foreground">Quick Search</span>}
            <div className={cn(!isOpen && "w-full flex justify-center")}>
              <GlobalSearch />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto py-4">
          {/* Essential Navigation - Daily essentials */}
          <div className="px-2 mb-6">
            {isOpen && <div className="text-xs font-semibold text-sidebar-foreground/90 px-3 mb-2 uppercase tracking-wider">Essential</div>}
            <nav className="grid gap-1">
              {essentialNavItems.map((item) => (
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
          
          {/* Additional Navigation - Supporting features */}
          <div className="px-2 mb-6">
            <Collapsible open={additionalOpen} onOpenChange={handleAdditionalToggle}>
              <CollapsibleTrigger className="w-full">
                {isOpen && (
                  <div className="flex items-center justify-between text-xs font-semibold text-sidebar-foreground/90 px-3 mb-2 uppercase tracking-wider hover:text-sidebar-foreground cursor-pointer">
                    <span>Additional</span>
                    {additionalOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </div>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav className="grid gap-1">
                  {additionalNavItems.map((item) => (
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
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Customization Navigation */}
          <div className="px-2">
            <Collapsible open={customizationOpen} onOpenChange={handleCustomizationToggle}>
              <CollapsibleTrigger className="w-full">
                {isOpen && (
                  <div className="flex items-center justify-between text-xs font-semibold text-sidebar-foreground/90 px-3 mb-2 uppercase tracking-wider hover:text-sidebar-foreground cursor-pointer">
                    <span>Customization</span>
                    {customizationOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  </div>
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav className="grid gap-1">
                  {customizationNavItems.map((item) => (
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        <div className="border-t py-4 px-2">
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
