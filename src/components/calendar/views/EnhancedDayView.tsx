import React, { useState, useEffect } from "react";
import { format, addDays, subDays, isToday, isSameDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Clock, 
  MapPin, 
  Brain,
  Zap,
  Target,
  Users,
  Plus,
  Sun,
  Moon,
  Sunrise
} from "lucide-react";
import { toast } from "sonner";
import { Action } from "../ActionItem";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyActions } from "@/contexts/DailyActionsContext";

interface EnhancedDayViewProps {
  date: Date;
  events?: Action[];
  onEventClick?: (event: Action) => void;
  onQuickActionCreate?: (type: 'memory-bridge' | 'support-checkin' | 'brain-task') => void;
}

export function EnhancedDayView({ 
  date, 
  events = [], 
  onEventClick,
  onQuickActionCreate 
}: EnhancedDayViewProps) {
  const [currentDate, setCurrentDate] = useState(date);
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { actions: memoryBridgeActions } = useDailyActions();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePreviousDay = () => {
    setCurrentDate(subDays(currentDate, 1));
    if (isMobile) {
      toast.success("Previous day", { duration: 1000 });
    }
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
    if (isMobile) {
      toast.success("Next day", { duration: 1000 });
    }
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Day refreshed - new neural pathways loading!", { duration: 2000 });
  };

  // Get greeting based on time of day
  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "Champion";
    
    if (hour < 12) {
      return `Good morning, ${userName}! Take control of your day! ☀️`;
    } else if (hour < 17) {
      return `Good afternoon, ${userName}! Keep building momentum! 🌤️`;
    } else {
      return `Good evening, ${userName}! Reflect and prepare! 🌙`;
    }
  };

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return <Sunrise className="h-5 w-5" />;
    if (hour < 17) return <Sun className="h-5 w-5" />;
    return <Moon className="h-5 w-5" />;
  };

  // Get events for the current date
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.date), currentDate)
  );

  // Get today's Memory Bridge actions
  const todayMemoryActions = memoryBridgeActions.filter(action =>
    isSameDay(new Date(action.date), currentDate)
  );

  // Group events by time
  const groupedEvents = dayEvents.reduce((acc, event) => {
    const timeKey = event.time || "All day";
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(event);
    return acc;
  }, {} as Record<string, Action[]>);

  return (
    <div className="space-y-6">
      {/* Empowerment Header */}
      <Card className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200">
        <CardContent className="pt-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              {getTimeIcon()}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                {getTimeBasedGreeting()}
              </h1>
            </div>
            <p className="text-brain-health-600">
              {isToday(currentDate) ? "Today" : format(currentDate, "EEEE, MMMM d")} • Your rhythm, your power
            </p>
          </div>

          {/* Current Time Display */}
          {isToday(currentDate) && (
            <div className="text-center p-4 bg-white/50 rounded-lg border border-brain-health-200 mb-4">
              <div className="text-3xl font-bold text-brain-health-600 mb-1">
                {format(currentTime, 'h:mm a')}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(currentTime, 'EEEE, MMMM do, yyyy')}
              </div>
            </div>
          )}

          {/* Quick Start Your Day Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              size="sm"
              onClick={() => onQuickActionCreate?.('memory-bridge')}
              className="bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700 text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              Add Memory Anchor
            </Button>
            <Button
              size="sm"
              onClick={() => onQuickActionCreate?.('support-checkin')}
              className="bg-gradient-to-r from-brain-health-500 to-brain-health-600 hover:from-brain-health-600 hover:to-brain-health-700 text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Support Check-in
            </Button>
            <Button
              size="sm"
              onClick={() => onQuickActionCreate?.('brain-task')}
              className="bg-gradient-to-r from-clarity-teal-500 to-clarity-teal-600 hover:from-clarity-teal-600 hover:to-clarity-teal-700 text-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Brain-Building Task
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {format(currentDate, "EEEE, MMMM d")}
          </h2>
          {isToday(currentDate) && (
            <Badge variant="default" className="mt-1 bg-gradient-to-r from-brain-health-500 to-clarity-teal-500">
              Today
            </Badge>
          )}
        </div>
        {!isMobile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextDay}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Memory Bridge Integration */}
      {todayMemoryActions.length > 0 && (
        <Card className="border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50 to-memory-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-memory-emerald-700">
              <Brain className="h-5 w-5" />
              Memory Bridge Commitments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todayMemoryActions.slice(0, 3).map(action => (
                <div key={action.id} className="p-3 bg-white/70 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-memory-emerald-800">{action.title}</span>
                    <Badge 
                      variant={action.status === 'completed' ? 'default' : 'secondary'}
                      className={action.status === 'completed' 
                        ? 'bg-memory-emerald-500 text-white' 
                        : 'bg-memory-emerald-200 text-memory-emerald-700'
                      }
                    >
                      {action.status}
                    </Badge>
                  </div>
                  {action.description && (
                    <p className="text-sm text-memory-emerald-600 mt-1">{action.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced swipeable day content */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile}
        enablePullToRefresh={isMobile}
        onSwipeLeft={{
          label: "Next Day",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNextDay
        }}
        onSwipeRight={{
          label: "Previous Day", 
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePreviousDay
        }}
        onPullToRefresh={handleRefresh}
        className="min-h-[400px]"
      >
        <div className="space-y-4">
          {Object.keys(groupedEvents).length > 0 ? (
            Object.entries(groupedEvents).map(([time, timeEvents]) => (
              <Card key={time} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brain-health-500" />
                    {time}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {timeEvents.map(event => (
                      <SwipeableContainer
                        key={event.id}
                        enableHorizontalSwipe={isMobile}
                        onSwipeLeft={{
                          label: "Complete",
                          icon: <ChevronRight className="h-4 w-4" />,
                          color: "#22c55e",
                          action: () => {
                            toast.success(`✅ Completed: ${event.title}! Neural pathway strengthened! 🧠`);
                          }
                        }}
                        onSwipeRight={{
                          label: "Edit",
                          icon: <ChevronLeft className="h-4 w-4" />,
                          color: "#3b82f6",
                          action: () => toast.info(`Edit: ${event.title}`)
                        }}
                      >
                        <div
                          className="p-3 bg-gradient-to-r from-brain-health-50/50 to-clarity-teal-50/50 rounded-lg cursor-pointer hover:from-brain-health-100/50 hover:to-clarity-teal-100/50 transition-all border border-brain-health-200/50"
                          onClick={() => onEventClick?.(event)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-brain-health-800">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {event.description}
                                </p>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                            <Badge 
                              variant={event.status === 'completed' ? 'default' : 'secondary'}
                              className={event.status === 'completed' 
                                ? 'bg-gradient-to-r from-memory-emerald-500 to-memory-emerald-600 text-white' 
                                : ''
                              }
                            >
                              {event.status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      </SwipeableContainer>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200">
              <CardContent className="py-8 text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-brain-health-400 to-clarity-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-brain-health-700 mb-2">
                  Ready to build your day?
                </h3>
                <p className="text-brain-health-600 mb-4">
                  No events scheduled - perfect time to plan something meaningful!
                </p>
                <Button 
                  size="sm"
                  onClick={() => onQuickActionCreate?.('brain-task')}
                  className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Start Building Your Day
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </SwipeableContainer>

      {/* Mobile swipe hints */}
      {isMobile && (
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to navigate days • Pull down to refresh
          </p>
          {dayEvents.length > 0 && (
            <p className="text-xs text-muted-foreground">
              📱 Swipe events left to complete, right to edit
            </p>
          )}
        </div>
      )}

      {/* Empowerment Footer */}
      {isToday(currentDate) && (
        <Card className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border-memory-emerald-200">
          <CardContent className="pt-4 text-center">
            <div className="text-2xl mb-2">🌟</div>
            <p className="text-sm text-brain-health-700 font-medium">
              Every action you take builds stronger neural pathways. You're literally rewiring your brain for success!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}