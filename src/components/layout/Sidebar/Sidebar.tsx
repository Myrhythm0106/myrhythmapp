
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  Target,
  HeartHandshake,
  Activity,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  Brain,
  Gamepad2,
  BookOpen,
  FileText,
  Shield,
  Smile
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSidebar } from "./SidebarContext";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar & Goals",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Accountability Hub",
    href: "/accountability",
    icon: Users,
  },
  {
    title: "Mood & Wellness",
    href: "/mood-tracking",
    icon: Smile,
  },
  {
    title: "Gratitude Practice",
    href: "/gratitude", 
    icon: HeartHandshake,
  },
  {
    title: "Health Tracking",
    href: "/symptom-tracking",
    icon: Activity,
  }
];

const brainSection = [
  {
    title: "TBI Calendar",
    href: "/tbi-calendar",
    icon: Calendar,
  },
  {
    title: "Brain Games",
    href: "/brain-games",
    icon: Gamepad2,
  },
  {
    title: "Brain Recovery",
    href: "/brain-recovery",
    icon: Brain,
  }
];

const communitySection = [
  {
    title: "Community",
    href: "/community",
    icon: MessageSquare,
  },
  {
    title: "Support Circle",
    href: "/personal-community",
    icon: Users,
  }
];

const resourcesSection = [
  {
    title: "User Guide",
    href: "/user-guide",
    icon: BookOpen,
  },
  {
    title: "Documentation",
    href: "/docs",
    icon: FileText,
  },
  {
    title: "Useful Info",
    href: "/useful-info",
    icon: HelpCircle,
  }
];

const settingsSection = [
  {
    title: "Profile",
    href: "/profile",
    icon: Settings,
  },
  {
    title: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    title: "Customize",
    href: "/customization",
    icon: Settings,
  }
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isCollapsed } = useSidebar();
  const [openSections, setOpenSections] = React.useState({
    brain: false,
    community: false,
    resources: false,
    settings: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const renderNavItem = (item: any, isNested = false) => (
    <NavLink
      key={item.href}
      to={item.href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
          isNested && "ml-4",
          isCollapsed && "justify-center"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {!isCollapsed && <span>{item.title}</span>}
    </NavLink>
  );

  const renderCollapsibleSection = (
    title: string,
    items: any[],
    sectionKey: keyof typeof openSections,
    icon: any
  ) => (
    <Collapsible
      key={sectionKey}
      open={openSections[sectionKey]}
      onOpenChange={() => toggleSection(sectionKey)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-accent-foreground",
            isCollapsed && "justify-center"
          )}
        >
          {React.createElement(icon, { className: "h-4 w-4" })}
          {!isCollapsed && (
            <>
              <span>{title}</span>
              {openSections[sectionKey] ? (
                <ChevronDown className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronRight className="h-4 w-4 ml-auto" />
              )}
            </>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {items.map(item => renderNavItem(item, true))}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
            <HeartHandshake className="h-6 w-6" />
            {!isCollapsed && <span>MyRhythm</span>}
          </NavLink>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {/* Main Navigation */}
            {mainNavItems.map(item => renderNavItem(item))}
            
            <div className="my-2 border-t" />
            
            {/* Brain & Recovery Tools */}
            {renderCollapsibleSection(
              "Brain & Recovery", 
              brainSection, 
              "brain", 
              Brain
            )}
            
            {/* Community & Support */}
            {renderCollapsibleSection(
              "Community & Support", 
              communitySection, 
              "community", 
              Users
            )}
            
            {/* Resources & Help */}
            {renderCollapsibleSection(
              "Resources & Help", 
              resourcesSection, 
              "resources", 
              HelpCircle
            )}
            
            {/* Settings */}
            {renderCollapsibleSection(
              "Settings", 
              settingsSection, 
              "settings", 
              Settings
            )}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className={cn(
              "w-full justify-start gap-2",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
