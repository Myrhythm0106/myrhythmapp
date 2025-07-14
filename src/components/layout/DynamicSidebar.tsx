
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Lock,
  Zap,
  ChevronRight,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserProgress } from "@/hooks/useUserProgress";

interface SidebarItem {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'core' | 'growth' | 'advanced' | 'community';
  unlockLevel: number;
}

const ALL_SIDEBAR_ITEMS: SidebarItem[] = [
  // Core Features (Always Available)
  { id: 'dashboard', name: "Dashboard", href: "/dashboard", icon: Home, category: 'core', unlockLevel: 0 },
  { id: 'calendar', name: "Calendar", href: "/calendar", icon: Calendar, category: 'core', unlockLevel: 0 },
  { id: 'accountability', name: "Accountability", href: "/accountability", icon: Users, category: 'core', unlockLevel: 0 },
  
  // Growth Features (Unlock Level 1)
  { id: 'goals', name: "Goals", href: "/goals", icon: Target, category: 'growth', unlockLevel: 25 },
  { id: 'mood-tracking', name: "Mood Tracking", href: "/mood-tracking", icon: Heart, category: 'growth', unlockLevel: 35 },
  { id: 'gratitude', name: "Gratitude", href: "/gratitude", icon: BookOpen, category: 'growth', unlockLevel: 30 },
  
  // Advanced Features (Unlock Level 2)
  { id: 'brain-games', name: "Brain Games", href: "/brain-games", icon: Gamepad2, category: 'advanced', unlockLevel: 40 },
  { id: 'analytics', name: "Analytics", href: "/analytics", icon: BarChart3, category: 'advanced', unlockLevel: 75 },
  { id: 'strategy', name: "Strategy", href: "/strategy", icon: TrendingUp, category: 'advanced', unlockLevel: 65 },
  
  // Community Features (Unlock Level 3)
  { id: 'community', name: "Community", href: "/community", icon: MessageCircle, category: 'community', unlockLevel: 60 },
  { id: 'notes', name: "Notes", href: "/notes", icon: BookOpen, category: 'advanced', unlockLevel: 45 },
  
  // Always at bottom
  { id: 'profile', name: "Profile", href: "/profile", icon: User, category: 'core', unlockLevel: 0 },
];

interface DynamicSidebarProps {
  isCollapsed: boolean;
}

export function DynamicSidebar({ isCollapsed }: DynamicSidebarProps) {
  const location = useLocation();
  const { metrics, unlockedFeatures, trackFeatureUse, getNextUnlock } = useUserProgress();
  const [showUnlockHint, setShowUnlockHint] = useState(false);

  // Filter items based on unlock status
  const getVisibleItems = (): SidebarItem[] => {
    return ALL_SIDEBAR_ITEMS.filter(item => {
      // Core items always visible
      if (item.category === 'core') return true;
      
      // Check if unlocked by progress system
      return unlockedFeatures.includes(item.id) || metrics.readinessScore >= item.unlockLevel;
    });
  };

  // Get next item to unlock
  const getNextItemToUnlock = (): SidebarItem | null => {
    const locked = ALL_SIDEBAR_ITEMS.filter(item => 
      item.category !== 'core' && 
      !unlockedFeatures.includes(item.id) && 
      metrics.readinessScore < item.unlockLevel
    );
    
    return locked.length > 0 ? locked.sort((a, b) => a.unlockLevel - b.unlockLevel)[0] : null;
  };

  const visibleItems = getVisibleItems();
  const nextUnlockItem = getNextItemToUnlock();
  const nextUnlock = getNextUnlock();

  const handleNavClick = (item: SidebarItem) => {
    trackFeatureUse(item.id);
  };

  const renderProgressHint = () => {
    if (metrics.engagementLevel === 'advanced' || !nextUnlockItem || !nextUnlock) return null;

    return (
      <Card className="mx-2 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Next Unlock</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <nextUnlockItem.icon className="h-4 w-4 text-gray-600" />
            <span className="text-sm text-gray-700">{nextUnlockItem.name}</span>
            <Lock className="h-3 w-3 text-gray-400" />
          </div>
          
          <p className="text-xs text-blue-600 mb-2">{nextUnlock.description}</p>
          
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((metrics.readinessScore / nextUnlockItem.unlockLevel) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-blue-600">
              {metrics.readinessScore}/{nextUnlockItem.unlockLevel} points
            </span>
            {metrics.readinessScore >= nextUnlockItem.unlockLevel && (
              <Badge className="text-xs bg-green-100 text-green-700">Ready!</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-background border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MyRhythm
              </span>
            )}
          </div>
        </div>

        {/* Progress Hint - Only show when sidebar is expanded */}
        {!isCollapsed && renderProgressHint()}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {/* Engagement Level Badge */}
          {!isCollapsed && (
            <div className="px-3 py-2 mb-2">
              <Badge 
                variant="outline" 
                className={cn(
                  "w-full justify-center",
                  metrics.engagementLevel === 'advanced' && "bg-purple-50 text-purple-700 border-purple-200",
                  metrics.engagementLevel === 'intermediate' && "bg-blue-50 text-blue-700 border-blue-200",
                  metrics.engagementLevel === 'beginner' && "bg-green-50 text-green-700 border-green-200"
                )}
              >
                <Zap className="h-3 w-3 mr-1" />
                {metrics.engagementLevel === 'advanced' && 'Power User'}
                {metrics.engagementLevel === 'intermediate' && 'Growing'}
                {metrics.engagementLevel === 'beginner' && 'Getting Started'}
              </Badge>
            </div>
          )}

          {visibleItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const isNewlyUnlocked = unlockedFeatures.includes(item.id) && 
              metrics.readinessScore >= item.unlockLevel && 
              item.category !== 'core';
            
            return (
              <NavLink
                key={item.id}
                to={item.href}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground relative",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-3">{item.name}</span>
                    {isNewlyUnlocked && (
                      <Badge className="ml-auto text-xs bg-green-100 text-green-700 animate-pulse">
                        New!
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {/* Show More Features Button */}
          {metrics.engagementLevel === 'advanced' && !isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground mt-4"
              onClick={() => setShowUnlockHint(!showUnlockHint)}
            >
              <ChevronRight className="h-4 w-4 mr-2" />
              All Features Unlocked
            </Button>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t p-2">
          <NavLink
            to="/settings"
            onClick={() => trackFeatureUse('settings')}
            className={cn(
              "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center" : "justify-start"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
