
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { Brain, Home, Calendar, User, Users, HeartPulse, HelpCircle, Settings, Menu, X, Heart, Info, Search } from "lucide-react";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export const Sidebar = () => {
  const {
    isOpen,
    toggle
  } = useSidebar();
  return <>
      <div className={cn("fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:relative", isOpen ? "translate-x-0" : "-translate-x-full md:w-20")}>
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-beacon-600" />
            {isOpen && <span className="text-lg font-semibold text-sidebar-foreground">MyRhythm</span>}
          </div>
          <button onClick={toggle} className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent">
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
          <nav className="grid gap-1 px-2">
            <NavItem to="/profile" icon={<User />} label="My Profile" isOpen={isOpen} />
            <NavItem to="/dashboard" icon={<Home />} label="Dashboard" isOpen={isOpen} />
            <NavItem to="/calendar" icon={<Calendar />} label="Calendar" isOpen={isOpen} />
            <NavItem to="/tracking" icon={<HeartPulse />} label="Health and Fitness Tracking" isOpen={isOpen} />
            <NavItem to="/community" icon={<Users />} label="Community" isOpen={isOpen} />
            <NavItem to="/personal-community" icon={<Heart />} label="Family Support Circle" isOpen={isOpen} />
            <NavItem to="/useful-info" icon={<Info />} label="Useful Info" isOpen={isOpen} />
          </nav>
        </div>

        <div className="border-t py-4 px-2">
          <NavItem to="/settings" icon={<Settings />} label="Settings" isOpen={isOpen} />
          <NavItem to="/help" icon={<HelpCircle />} label="Help & Support" isOpen={isOpen} />
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={toggle} />}

      {/* Toggle button for mobile */}
      <button onClick={toggle} className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg md:hidden">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>;
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}

const NavItem = ({
  to,
  icon,
  label,
  isOpen
}: NavItemProps) => {
  return <NavLink to={to} className={({
    isActive
  }) => cn("nav-item", isActive && "nav-item-active")} title={!isOpen ? label : undefined}>
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && <span>{label}</span>}
    </NavLink>;
};
