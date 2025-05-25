
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useUserData } from "@/hooks/use-user-data";
import { Badge } from "@/components/ui/badge";

// Import widget components
import { PersonalizedWelcomeWidget } from "./widgets/PersonalizedWelcomeWidget";
import { TodayFocusWidget } from "./widgets/TodayFocusWidget";
import { BrainGamesWidget } from "./widgets/BrainGamesWidget";
import { MoodEnergyWidget } from "./widgets/MoodEnergyWidget";
import { UpcomingEventsWidget } from "./widgets/UpcomingEventsWidget";
import { MotivationalStatement } from "./MotivationalStatement";

// Define available widgets
const availableWidgets = [
  {
    id: "welcome",
    name: "Personalized Welcome",
    component: PersonalizedWelcomeWidget,
    description: "Dynamic greeting and quick actions"
  },
  {
    id: "motivational",
    name: "Daily Affirmation",
    component: MotivationalStatement,
    description: "Motivational statements and positive affirmations"
  },
  {
    id: "todayFocus",
    name: "Today's Focus",
    component: TodayFocusWidget,
    description: "Priority tasks and daily objectives"
  },
  {
    id: "brainGames",
    name: "Brain Games",
    component: BrainGamesWidget,
    description: "Quick access to cognitive training"
  },
  {
    id: "moodEnergy",
    name: "Mood & Energy",
    component: MoodEnergyWidget,
    description: "Track your current mood and energy levels"
  },
  {
    id: "upcomingEvents",
    name: "Upcoming Events",
    component: UpcomingEventsWidget,
    description: "Your next scheduled events and appointments"
  }
];

export function CustomizableDashboard() {
  const userData = useUserData();
  
  // Load widget order and visibility from localStorage
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('dashboardWidgetOrder');
    return saved ? JSON.parse(saved) : availableWidgets.map(w => w.id);
  });
  
  const [widgetVisibility, setWidgetVisibility] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('dashboardWidgetVisibility');
    return saved ? JSON.parse(saved) : availableWidgets.reduce((acc, widget) => {
      acc[widget.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(widgetOrder));
  }, [widgetOrder]);
  
  useEffect(() => {
    localStorage.setItem('dashboardWidgetVisibility', JSON.stringify(widgetVisibility));
  }, [widgetVisibility]);
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(widgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setWidgetOrder(items);
  };
  
  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };
  
  const visibleWidgets = widgetOrder.filter(widgetId => widgetVisibility[widgetId]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title={`Welcome back, ${userData.name}`}
        subtitle="Your personalized dashboard - drag to reorder widgets"
      >
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Customizable Layout
          </Badge>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                <Settings className="h-3.5 w-3.5 mr-1" />
                Customize Widgets
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Customize Dashboard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Toggle widgets on/off to customize your dashboard view.
                </p>
                {availableWidgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">{widget.name}</Label>
                      <p className="text-xs text-muted-foreground">{widget.description}</p>
                    </div>
                    <Switch
                      checked={widgetVisibility[widget.id]}
                      onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {visibleWidgets.map((widgetId, index) => {
                const widget = availableWidgets.find(w => w.id === widgetId);
                if (!widget) return null;
                
                const WidgetComponent = widget.component;
                
                return (
                  <Draggable key={widgetId} draggableId={widgetId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group relative ${
                          snapshot.isDragging ? 'opacity-50' : ''
                        }`}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="absolute -left-8 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <WidgetComponent />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {visibleWidgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No widgets are currently visible.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use the "Customize Widgets" button to enable some widgets.
          </p>
        </div>
      )}
    </div>
  );
}
