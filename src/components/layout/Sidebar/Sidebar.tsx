
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import { 
  Home, 
  Calendar, 
  Target, 
  Heart, 
  Users, 
  BookOpen, 
  User, 
  Settings,
  Brain,
  MessageCircle,
  Gamepad2,
  TrendingUp,
  BarChart3,
  TestTube,
  FileText
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Brain Games", href: "/brain-games", icon: Brain },
  { name: "Mood Tracking", href: "/mood-tracking", icon: Heart },
  { name: "Gratitude", href: "/gratitude", icon: BookOpen },
  { name: "Accountability", href: "/accountability", icon: Users },
  { name: "Community", href: "/community", icon: MessageCircle },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Decision Journal", href: "/decisions", icon: FileText },
  { name: "Strategy", href: "/strategy", icon: TrendingUp },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Testing", href: "/testing", icon: TestTube },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const { isCollapsed } = useSidebar();
  const location = useLocation();

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MyRhythm
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-2">
          <Link
            to="/settings"
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
