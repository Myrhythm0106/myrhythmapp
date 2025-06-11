
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, LayoutDashboard, Monitor, Smartphone, Eye } from "lucide-react";

interface DashboardLayoutStepProps {
  onComplete: (data: any) => void;
  assessmentResult: any;
}

export function DashboardLayoutStep({ onComplete, assessmentResult }: DashboardLayoutStepProps) {
  const [layoutData, setLayoutData] = useState({
    viewPreference: "balanced",
    priorityWidgets: ["upcoming", "mood", "goals"] as string[],
    informationDensity: "medium",
    quickAccessTools: ["checkin", "calendar", "symptoms"] as string[]
  });

  const viewOptions = [
    {
      id: "simple",
      title: "Simple & Clean",
      description: "Minimal information, large text, easy navigation",
      icon: Eye
    },
    {
      id: "balanced", 
      title: "Balanced View",
      description: "Good mix of information and simplicity",
      icon: Monitor
    },
    {
      id: "comprehensive",
      title: "Information Rich",
      description: "Maximum information, detailed views",
      icon: LayoutDashboard
    }
  ];

  const widgetOptions = [
    { id: "upcoming", label: "Upcoming events & reminders" },
    { id: "mood", label: "Mood & energy tracking" },
    { id: "goals", label: "Goal progress" },
    { id: "gratitude", label: "Gratitude practice" },
    { id: "symptoms", label: "Symptom tracking" },
    { id: "community", label: "Community updates" },
    { id: "braingames", label: "Brain games & exercises" },
    { id: "wins", label: "Recent wins & celebrations" }
  ];

  const quickAccessOptions = [
    { id: "checkin", label: "Daily check-in" },
    { id: "calendar", label: "Calendar" },
    { id: "symptoms", label: "Log symptoms" },
    { id: "mood", label: "Track mood" },
    { id: "goals", label: "View goals" },
    { id: "emergency", label: "Emergency resources" }
  ];

  const toggleWidget = (widgetId: string) => {
    setLayoutData(prev => ({
      ...prev,
      priorityWidgets: prev.priorityWidgets.includes(widgetId)
        ? prev.priorityWidgets.filter(id => id !== widgetId)
        : [...prev.priorityWidgets, widgetId]
    }));
  };

  const toggleQuickAccess = (toolId: string) => {
    setLayoutData(prev => ({
      ...prev,
      quickAccessTools: prev.quickAccessTools.includes(toolId)
        ? prev.quickAccessTools.filter(id => id !== toolId)
        : [...prev.quickAccessTools, toolId]
    }));
  };

  const handleContinue = () => {
    onComplete(layoutData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          Personalize Your Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* View Preference */}
        <div className="space-y-4">
          <Label className="text-base font-medium">How would you prefer your dashboard to look?</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {viewOptions.map((option) => (
              <div key={option.id} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                layoutData.viewPreference === option.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`} onClick={() => setLayoutData(prev => ({ ...prev, viewPreference: option.id }))}>
                <div className="text-center space-y-2">
                  <option.icon className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-medium">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Widgets */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Which information is most important to see at a glance? (Select 3-5)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {widgetOptions.map((widget) => (
              <div key={widget.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={widget.id}
                  checked={layoutData.priorityWidgets.includes(widget.id)}
                  onCheckedChange={() => toggleWidget(widget.id)}
                />
                <Label htmlFor={widget.id} className="text-sm">{widget.label}</Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {layoutData.priorityWidgets.length} | Recommended: 3-5 for optimal experience
          </p>
        </div>

        {/* Information Density */}
        <div className="space-y-3">
          <Label className="text-base font-medium">How much information do you like to see at once?</Label>
          <RadioGroup value={layoutData.informationDensity} onValueChange={(value) => setLayoutData(prev => ({ ...prev, informationDensity: value }))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low-density" />
              <Label htmlFor="low-density">Less information - I prefer focus on one thing at a time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium-density" />
              <Label htmlFor="medium-density">Balanced - A good overview without overwhelming me</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high-density" />
              <Label htmlFor="high-density">More information - I like to see lots of details at once</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Quick Access Tools */}
        <div className="space-y-3">
          <Label className="text-base font-medium">What tools do you want quick access to? (Select 3-4)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickAccessOptions.map((tool) => (
              <div key={tool.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={tool.id}
                  checked={layoutData.quickAccessTools.includes(tool.id)}
                  onCheckedChange={() => toggleQuickAccess(tool.id)}
                />
                <Label htmlFor={tool.id} className="text-sm">{tool.label}</Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selected: {layoutData.quickAccessTools.length} | Recommended: 3-4 for easy access
          </p>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={handleContinue} className="w-full">
            Complete Foundation Setup
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
