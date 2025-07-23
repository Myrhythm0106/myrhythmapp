import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Home, Calendar, Target, Users, BarChart3, Brain, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function AppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'guide', title: 'Your Guide', icon: BookOpen, path: '/user-guide-view', badge: 'START HERE' },
    { id: 'calendar', title: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'goals', title: 'Goals', icon: Target, path: '/goals' },
    { id: 'brain-games', title: 'Brain Games', icon: Brain, path: '/brain-games' },
    { id: 'analytics', title: 'Progress', icon: BarChart3, path: '/analytics' },
    { id: 'accountability', title: 'Support Circle', icon: Users, path: '/accountability' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-primary">MyRhythm</h1>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <Button
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Button>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 text-xs bg-primary text-white px-1"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </nav>
  );
}