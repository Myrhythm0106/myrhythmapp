
import React, { useState } from "react";
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
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { EnhancedGlobalSearch } from "@/components/navigation/EnhancedGlobalSearch";
import { GlobalSearch } from "@/components/search/GlobalSearch";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const userData = useUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Brain, label: "Memory Center", path: "/memory" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Heart, label: "Mood & Gratitude", path: "/mood" },
    { icon: Activity, label: "Health & Fitness", path: "/health-fitness" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: Users, label: "My Support Circle", path: "/personal-community" },
    { icon: Bell, label: "Accountability", path: "/accountability" },
    { icon: FileText, label: "Notes", path: "/notes" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Info, label: "Useful Info", path: "/useful-info" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">MyRhythm</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <EnhancedGlobalSearch variant="input" size="sm" />
              <GlobalSearch />
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
