import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
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
  Brain
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userData = useUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setTheme, theme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const navigationItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Brain, label: "Memory Center", path: "/memory" }, // Added Memory Center
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        navigationItems={navigationItems}
        location={location}
      >
        <div className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={userData?.name || "User Avatar"} />
                  <AvatarFallback>{userData?.name?.slice(0, 2).toUpperCase() || "MR"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/accountability")}>Accountability</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
        </Button>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
