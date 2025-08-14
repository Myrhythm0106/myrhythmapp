import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Target, 
  Brain, 
  Heart, 
  TrendingUp, 
  Plus,
  Zap,
  Award,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function QuickActionZone() {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "calendar",
      title: "Daily Planning",
      description: "Plan & track your day",
      icon: Calendar,
      color: "blue",
      action: () => navigate("/calendar"),
      badge: "3 pending"
    },
    {
      id: "goals",
      title: "Goals & Dreams",
      description: "Track your progress",
      icon: Target,
      color: "purple",
      action: () => navigate("/goals"),
      badge: "2 active"
    },
    {
      id: "brain-games",
      title: "Brain Training",
      description: "Boost cognitive power",
      icon: Brain,
      color: "teal",
      action: () => navigate("/brain-games"),
      badge: "New session"
    },
    {
      id: "gratitude",
      title: "Daily Gratitude",
      description: "Daily reflection",
      icon: Heart,
      color: "rose",
      action: () => navigate("/gratitude"),
      badge: "Today's entry"
    },
    {
      id: "capture",
      title: "Capture",
      description: "Never forget anything",
      icon: FileText,
      color: "indigo",
      action: () => navigate("/memory-bridge"),
      badge: "Instant save"
    },
    {
      id: "memory-bank",
      title: "Memory Bank",
      description: "Store your wins",
      icon: TrendingUp,
      color: "green",
      action: () => navigate("/gratitude"),
      badge: "Build confidence"
    },
    {
      id: "quick-add",
      title: "Quick Add",
      description: "Add new action",
      icon: Plus,
      color: "amber",
      action: () => {
        toast.success("Quick add feature coming soon!");
      },
      badge: "Fast"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:shadow-blue-200/50",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700 hover:shadow-purple-200/50",
      teal: "from-teal-50 to-teal-100 border-teal-200 text-teal-700 hover:shadow-teal-200/50",
      indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-700 hover:shadow-indigo-200/50",
      rose: "from-rose-50 to-rose-100 border-rose-200 text-rose-700 hover:shadow-rose-200/50",
      green: "from-green-50 to-green-100 border-green-200 text-green-700 hover:shadow-green-200/50",
      amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-700 hover:shadow-amber-200/50"
    };
    return colorMap[color] || colorMap.blue;
  };

  const getIconBgColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100",
      purple: "bg-purple-100",
      teal: "bg-teal-100",
      indigo: "bg-indigo-100",
      rose: "bg-rose-100",
      green: "bg-green-100",
      amber: "bg-amber-100"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <Zap className="h-6 w-6 text-amber-500" />
          <h2 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              QUICK ACTION ZONE
            </span>
          </h2>
          <Award className="h-6 w-6 text-amber-500" />
        </div>
        <p className="text-gray-600">Take immediate action to build momentum and achieve your goals</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={action.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${getColorClasses(action.color)} border-2`}
              onClick={action.action}
            >
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative">
                  <div className={`w-12 h-12 ${getIconBgColor(action.color)} rounded-xl flex items-center justify-center mx-auto`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  {action.badge && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-1 -right-2 text-xs px-2 py-0.5 bg-white/90 text-gray-700 border"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.title}</h3>
                  <p className="text-xs opacity-80">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empowerment Message */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-50/80 via-blue-50/60 to-teal-50/80 rounded-xl border-2 border-purple-200/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">Momentum Builder</span>
        </div>
        <p className="text-sm text-purple-800">
          Every action you take builds momentum toward your goals. Start with one quick action and watch your progress accelerate!
        </p>
      </div>
    </div>
  );
}