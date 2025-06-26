
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Layout, Eye, EyeOff, Settings } from "lucide-react";
import { FocusArea, focusAreas } from "@/utils/rhythmAnalysis";

interface WidgetConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: "high" | "medium" | "low";
  focusRelevance: number; // 1-5 scale
}

const baseWidgets: Record<string, Omit<WidgetConfig, "enabled">> = {
  focusArea: {
    id: "focusArea",
    name: "My Focus Area",
    description: "Shows your current rhythm focus and personalized actions",
    priority: "high",
    focusRelevance: 5
  },
  activeGoals: {
    id: "activeGoals",
    name: "My Active Goals",
    description: "Track progress on your most important goals",
    priority: "high",
    focusRelevance: 5
  },
  dailyCheckin: {
    id: "dailyCheckin",
    name: "Daily Check-in",
    description: "Quick mood and energy tracking",
    priority: "high",
    focusRelevance: 4
  },
  todaysActions: {
    id: "todaysActions",
    name: "Today's Actions",
    description: "View and complete today's scheduled actions",
    priority: "high",
    focusRelevance: 4
  },
  upcomingReminders: {
    id: "upcomingReminders",
    name: "Upcoming Reminders",
    description: "Important appointments and medication reminders",
    priority: "medium",
    focusRelevance: 3
  },
  assessmentHistory: {
    id: "assessmentHistory",
    name: "Assessment History",
    description: "View your rhythm assessment results and trends",
    priority: "low",
    focusRelevance: 2
  },
  celebrations: {
    id: "celebrations",
    name: "Celebrations & Wins",
    description: "Celebrate your achievements and milestones",
    priority: "medium",
    focusRelevance: 3
  }
};

// Focus area specific widget recommendations
const focusSpecificWidgets: Record<FocusArea, string[]> = {
  memory: ["focusArea", "dailyCheckin", "todaysActions", "activeGoals", "upcomingReminders"],
  structure: ["focusArea", "todaysActions", "upcomingReminders", "dailyCheckin", "activeGoals"],
  emotional: ["focusArea", "dailyCheckin", "celebrations", "activeGoals", "todaysActions"],
  achievement: ["focusArea", "activeGoals", "celebrations", "todaysActions", "assessmentHistory"],
  community: ["focusArea", "activeGoals", "dailyCheckin", "celebrations", "todaysActions"],
  growth: ["focusArea", "assessmentHistory", "activeGoals", "dailyCheckin", "todaysActions"]
};

interface QuickDashboardSetupProps {
  focusArea: FocusArea;
  onConfigComplete: (config: any) => void;
}

export function QuickDashboardSetup({ focusArea, onConfigComplete }: QuickDashboardSetupProps) {
  const focusInfo = focusAreas[focusArea];
  const recommendedWidgets = focusSpecificWidgets[focusArea];
  
  // Initialize widgets with focus area recommendations
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    return Object.values(baseWidgets).map(widget => ({
      ...widget,
      enabled: recommendedWidgets.includes(widget.id)
    }));
  });

  const handleWidgetToggle = (widgetId: string, enabled: boolean) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId ? { ...widget, enabled } : widget
    ));
  };

  const handleComplete = () => {
    const config = {
      focusArea,
      widgets: widgets.filter(w => w.enabled),
      layout: "standard",
      setupAt: new Date().toISOString()
    };
    
    // Store configuration
    localStorage.setItem("myrhythm_dashboard_widgets", JSON.stringify(config.widgets));
    
    onConfigComplete(config);
  };

  React.useEffect(() => {
    // Auto-complete when user has made selections
    handleComplete();
  }, [widgets]);

  const enabledCount = widgets.filter(w => w.enabled).length;
  const recommendedCount = recommendedWidgets.length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${focusInfo.gradient} flex items-center justify-center`}>
          <Layout className="h-8 w-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Customize Your Dashboard</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We've pre-selected widgets that work best for your <strong>{focusInfo.title}</strong> focus. 
            You can adjust these now or change them anytime in your dashboard settings.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-blue-800">Personalized for Your Focus</span>
        </div>
        <p className="text-sm text-blue-700">
          Based on your {focusInfo.title.toLowerCase()}, we recommend these {recommendedCount} widgets to help you stay on track with your recovery goals.
        </p>
      </div>

      <div className="space-y-3">
        {widgets
          .sort((a, b) => {
            // Sort by: recommended first, then by priority, then by focus relevance
            const aRecommended = recommendedWidgets.includes(a.id) ? 1 : 0;
            const bRecommended = recommendedWidgets.includes(b.id) ? 1 : 0;
            
            if (aRecommended !== bRecommended) return bRecommended - aRecommended;
            
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            
            return b.focusRelevance - a.focusRelevance;
          })
          .map((widget) => {
            const isRecommended = recommendedWidgets.includes(widget.id);
            
            return (
              <Card 
                key={widget.id}
                className={`transition-all ${
                  widget.enabled ? 'ring-1 ring-primary bg-primary/5' : ''
                } ${isRecommended ? 'border-blue-300' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{widget.name}</h3>
                        {isRecommended && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Recommended
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {widget.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{widget.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {widget.enabled ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      <Switch
                        checked={widget.enabled}
                        onCheckedChange={(enabled) => handleWidgetToggle(widget.id, enabled)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <span>Enabled Widgets: <strong>{enabledCount}</strong></span>
          <span>•</span>
          <span>Recommended: <strong>{recommendedCount}</strong></span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          You can always customize your dashboard later in Settings
        </p>
      </div>
    </div>
  );
}
