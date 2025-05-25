
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Eye, EyeOff } from "lucide-react";
import { PersonalizedWelcomeWidget } from "./widgets/PersonalizedWelcomeWidget";
import { TodayFocusWidget } from "./widgets/TodayFocusWidget";
import { BrainGamesWidget } from "./widgets/BrainGamesWidget";
import { MoodEnergyWidget } from "./widgets/MoodEnergyWidget";
import { GratitudePracticeWidget } from "./widgets/GratitudePracticeWidget";
import { UpcomingEventsWidget } from "./widgets/UpcomingEventsWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type WidgetType = 'welcome' | 'focus' | 'brainGames' | 'moodEnergy' | 'gratitude' | 'events';

interface Widget {
  id: WidgetType;
  title: string;
  component: React.ComponentType;
  visible: boolean;
}

export function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'welcome', title: 'Welcome', component: PersonalizedWelcomeWidget, visible: true },
    { id: 'focus', title: "Today's Focus", component: TodayFocusWidget, visible: true },
    { id: 'brainGames', title: 'Brain Games', component: BrainGamesWidget, visible: true },
    { id: 'moodEnergy', title: 'Mood & Energy', component: MoodEnergyWidget, visible: true },
    { id: 'gratitude', title: 'Gratitude Practice', component: GratitudePracticeWidget, visible: true },
    { id: 'events', title: 'Upcoming Events', component: UpcomingEventsWidget, visible: true },
  ]);

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboardWidgetOrder');
    const savedVisibility = localStorage.getItem('dashboardWidgetVisibility');
    
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      setWidgets(prev => {
        const reordered = order.map((id: WidgetType) => 
          prev.find(widget => widget.id === id)
        ).filter(Boolean);
        return reordered;
      });
    }
    
    if (savedVisibility) {
      const visibility = JSON.parse(savedVisibility);
      setWidgets(prev => prev.map(widget => ({
        ...widget,
        visible: visibility[widget.id] ?? widget.visible
      })));
    }
  }, []);

  // Save configuration to localStorage
  const saveConfiguration = () => {
    const order = widgets.map(w => w.id);
    const visibility = widgets.reduce((acc, w) => ({ ...acc, [w.id]: w.visible }), {});
    
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(order));
    localStorage.setItem('dashboardWidgetVisibility', JSON.stringify(visibility));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
    setTimeout(saveConfiguration, 100);
  };

  const toggleWidgetVisibility = (widgetId: WidgetType) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ));
    setTimeout(saveConfiguration, 100);
  };

  const visibleWidgets = widgets.filter(widget => widget.visible);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Dashboard</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Customize Widgets
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Customize Dashboard</DialogTitle>
              <DialogDescription>
                Toggle widgets on or off. Drag widgets on the main dashboard to reorder them.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-80">
              <div className="space-y-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={widget.id} className="text-sm font-medium">
                        {widget.title}
                      </Label>
                      {widget.visible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <Switch
                      id={widget.id}
                      checked={widget.visible}
                      onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {visibleWidgets.map((widget, index) => (
                <Draggable key={widget.id} draggableId={widget.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-lg scale-105' : ''
                      }`}
                    >
                      <widget.component />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {visibleWidgets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No widgets visible. Use the customize button to add some widgets to your dashboard.
          </p>
        </div>
      )}
    </div>
  );
}
