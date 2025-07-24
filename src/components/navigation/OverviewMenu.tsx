import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Calendar, Target, Brain, BarChart, Settings, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MenuSection {
  title: string;
  items: Array<{
    label: string;
    path: string;
    icon: React.ReactNode;
    description: string;
  }>;
}

export function OverviewMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const menuSections: MenuSection[] = [
    {
      title: "Core Features",
      items: [
        {
          label: "Calendar",
          path: "/calendar",
          icon: <Calendar className="h-4 w-4" />,
          description: "Plan your brain-friendly schedule"
        },
        {
          label: "Goals",
          path: "/calendar?view=goals",
          icon: <Target className="h-4 w-4" />,
          description: "Set and track neural growth goals"
        },
        {
          label: "Brain Games",
          path: "/brain-games",
          icon: <Brain className="h-4 w-4" />,
          description: "Cognitive enhancement exercises"
        }
      ]
    },
    {
      title: "Wellness",
      items: [
        {
          label: "Smart Breaks",
          path: "/calendar?addAction=true&type=break",
          icon: <Heart className="h-4 w-4" />,
          description: "Schedule brain-healthy breaks"
        },
        {
          label: "Family Time",
          path: "/calendar?addAction=true&type=family",
          icon: <Heart className="h-4 w-4" />,
          description: "Plan meaningful family moments"
        }
      ]
    },
    {
      title: "Analytics",
      items: [
        {
          label: "Progress",
          path: "/analytics",
          icon: <BarChart className="h-4 w-4" />,
          description: "Track your growth journey"
        },
        {
          label: "Settings",
          path: "/settings",
          icon: <Settings className="h-4 w-4" />,
          description: "Customize your experience"
        }
      ]
    }
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    setIsVisible(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="flex items-center gap-2"
      >
        <Menu className="h-4 w-4" />
        Overview
      </Button>

      {isVisible && (
        <Card 
          className="absolute top-full left-0 w-80 z-50 shadow-lg border"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <CardContent className="p-4">
            <div className="space-y-4">
              {menuSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">
                    {section.title}
                  </h4>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleItemClick(item.path)}
                        className="w-full text-left p-2 rounded-md hover:bg-muted/50 transition-colors flex items-start gap-3"
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}