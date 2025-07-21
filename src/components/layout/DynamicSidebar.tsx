
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Brain, Calendar, Target, Heart, BarChart3, Gamepad2, Users, User, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DevelopmentNavigation } from "@/components/demo/DevelopmentNavigation";

const mainNavItems = [
  { title: "Dashboard", url: "/dashboard", icon: Brain },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Gratitude", url: "/gratitude", icon: Heart },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Brain Games", url: "/brain-games", icon: Gamepad2 },
  { title: "Accountability", url: "/accountability", icon: Users },
];

const settingsNavItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Support", url: "/support", icon: HelpCircle },
];

interface DynamicSidebarProps {
  isCollapsed: boolean;
}

export function DynamicSidebar({ isCollapsed }: DynamicSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={cn(
      "bg-white/95 backdrop-blur-sm border-r border-purple-200/50",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <SidebarContent className="p-4">
        {/* App Header in Sidebar */}
        {!isCollapsed && (
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  MyRhythm
                </h1>
                <p className="text-xs text-gray-500">Memory-First Design</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-gray-600", isCollapsed && "sr-only")}>
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors",
                        isActive(item.url) && "bg-purple-100 text-purple-800 font-medium",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-gray-600", isCollapsed && "sr-only")}>
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors",
                        isActive(item.url) && "bg-purple-100 text-purple-800 font-medium",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Development Navigation - Only visible in development */}
        {!isCollapsed && <DevelopmentNavigation />}
      </SidebarContent>
    </Sidebar>
  );
}
