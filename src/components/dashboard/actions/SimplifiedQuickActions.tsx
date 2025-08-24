import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  TrendingUp, 
  Calendar, 
  Target, 
  Heart, 
  Brain 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "@/contexts/DashboardContext";
import { useQuickActionStats } from "@/hooks/useQuickActionStats";

export function SimplifiedQuickActions() {
  const navigate = useNavigate();
  const { interactionMode } = useDashboard();
  const stats = useQuickActionStats();

  const getActionRoute = (id: string, defaultRoute: string) => {
    if (interactionMode === 'discovery') return defaultRoute;
    
    // Guided mode routes
    switch (id) {
      case 'calendar': return '/calendar?guided=true';
      case 'goals': return '/goals?guided=true';
      case 'capture': return '/memory-bridge?guided=true';
      default: return defaultRoute;
    }
  };

  const actions = [
    {
      id: "capture",
      title: "Quick Capture",
      description: "Never lose a thought",
      icon: FileText,
      color: "brain-health",
      action: () => navigate(getActionRoute("capture", "/memory-bridge")),
      badge: stats.capture.badge,
      priority: true
    },
    {
      id: "memory-bank", 
      title: "Memory Bank",
      description: "Review & reflect",
      icon: TrendingUp,
      color: "memory-emerald",
      action: () => navigate("/memory-bank"),
      badge: stats.memoryBank.badge,
      priority: true
    },
    {
      id: "calendar",
      title: "Today's Plan", 
      description: "Structure your day",
      icon: Calendar,
      color: "clarity-teal",
      action: () => navigate(getActionRoute("calendar", "/calendar")),
      badge: stats.calendar.badge,
      priority: false
    },
    {
      id: "goals",
      title: "Goals & Dreams",
      description: "Track progress", 
      icon: Target,
      color: "beacon",
      action: () => navigate(getActionRoute("goals", "/goals")),
      badge: stats.goals.badge,
      priority: false
    },
    {
      id: "gratitude",
      title: "Daily Gratitude",
      description: "Find the good",
      icon: Heart,
      color: "sunrise-amber",
      action: () => navigate("/gratitude"),
      badge: stats.gratitude.badge,
      priority: false
    },
    {
      id: "brain-games",
      title: "Brain Training",
      description: "5-min exercises",
      icon: Brain,
      color: "brain-health",
      action: () => navigate("/brain-games"),
      badge: stats.brainGames.badge,
      priority: false
    }
  ];

  const getColorClasses = (color: string, priority: boolean) => {
    const baseClasses = priority 
      ? "border-2 shadow-md hover:shadow-lg transform hover:scale-105" 
      : "border hover:shadow-md hover:scale-102";
    
    const colorMap = {
      "brain-health": `${baseClasses} border-brain-health-200 bg-gradient-to-br from-brain-health-50 to-brain-health-100/50`,
      "memory-emerald": `${baseClasses} border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50 to-memory-emerald-100/50`,
      "clarity-teal": `${baseClasses} border-clarity-teal-200 bg-gradient-to-br from-clarity-teal-50 to-clarity-teal-100/50`,
      "sunrise-amber": `${baseClasses} border-sunrise-amber-200 bg-gradient-to-br from-sunrise-amber-50 to-sunrise-amber-100/50`,
      "beacon": `${baseClasses} border-beacon-200 bg-gradient-to-br from-beacon-50 to-beacon-100/50`
    };
    return colorMap[color] || colorMap["brain-health"];
  };

  const getIconColor = (color: string) => {
    const colorMap = {
      "brain-health": "text-brain-health-600",
      "memory-emerald": "text-memory-emerald-600",
      "clarity-teal": "text-clarity-teal-600",
      "sunrise-amber": "text-sunrise-amber-600",
      "beacon": "text-beacon-600"
    };
    return colorMap[color] || colorMap["brain-health"];
  };

  const getTextColor = (color: string) => {
    const colorMap = {
      "brain-health": "text-brain-health-700",
      "memory-emerald": "text-memory-emerald-700",
      "clarity-teal": "text-clarity-teal-700",
      "sunrise-amber": "text-sunrise-amber-700",
      "beacon": "text-beacon-700"
    };
    return colorMap[color] || colorMap["brain-health"];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold gradient-text-brand mb-1">
          Quick Actions
        </h2>
        <p className="text-sm text-brain-health-600">
          Choose what feels right for you right now
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={action.id}
              className={`cursor-pointer transition-all duration-300 ${getColorClasses(action.color, action.priority)}`}
              onClick={action.action}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
                    <IconComponent className={`h-5 w-5 ${getIconColor(action.color)}`} />
                  </div>
                  {action.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-2 text-xs px-1.5 py-0.5 bg-white text-gray-700 border shadow-sm"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${getTextColor(action.color)}`}>
                    {action.title}
                  </h3>
                  <p className={`text-xs opacity-80 ${getTextColor(action.color)}`}>
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gentle encouragement */}
      <div className="text-center p-3 bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg border border-brain-health-100">
        <p className="text-xs text-brain-health-700 font-medium">
          ✨ Every small step builds strength
        </p>
      </div>
    </div>
  );
}