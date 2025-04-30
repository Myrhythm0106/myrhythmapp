
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { 
  Brain, 
  Home, 
  Book, 
  Calendar, 
  User, 
  Users, 
  HeartPulse, 
  HelpCircle,
  MapPin,
  Settings,
  Menu,
  X
} from "lucide-react";

export const Sidebar = () => {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-sidebar transition-transform duration-300 ease-in-out md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full md:w-20"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-beacon-600" />
            {isOpen && (
              <span className="text-lg font-semibold text-sidebar-foreground">
                Brain Beacon
              </span>
            )}
          </div>
          <button
            onClick={toggle}
            className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            <NavItem to="/" icon={<Home />} label="Dashboard" isOpen={isOpen} />
            <NavItem to="/profile" icon={<User />} label="My Profile" isOpen={isOpen} />
            <NavItem to="/resources" icon={<Book />} label="Resources" isOpen={isOpen} />
            <NavItem to="/tracking" icon={<HeartPulse />} label="Symptom Tracking" isOpen={isOpen} />
            <NavItem to="/calendar" icon={<Calendar />} label="Calendar" isOpen={isOpen} />
            <NavItem to="/community" icon={<Users />} label="Community" isOpen={isOpen} />
            <NavItem to="/local-services" icon={<MapPin />} label="Local Services" isOpen={isOpen} />
          </nav>
        </div>

        <div className="border-t py-4 px-2">
          <NavItem to="/settings" icon={<Settings />} label="Settings" isOpen={isOpen} />
          <NavItem to="/help" icon={<HelpCircle />} label="Help & Support" isOpen={isOpen} />
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggle}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        onClick={toggle}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-3 text-primary-foreground shadow-lg md:hidden"
      >
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
}

const NavItem = ({ to, icon, label, isOpen }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item",
          isActive && "nav-item-active"
        )
      }
      title={!isOpen ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {isOpen && <span>{label}</span>}
    </NavLink>
  );
};
