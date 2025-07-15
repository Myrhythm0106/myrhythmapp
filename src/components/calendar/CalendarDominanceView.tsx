
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Target, Zap, CheckCircle, Plus, Heart } from "lucide-react";
import { DailyIChooseWidget } from "../dashboard/DailyIChooseWidget";
import { PomodoroTimer } from "../pomodoro/PomodoroTimer";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: number;
  type: 'work' | 'break' | 'personal' | 'health' | 'family';
  completed: boolean;
  watchers?: string[];
}

export function CalendarDominanceView() {
  const userData = useUserData();
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Generate personalized calendar events based on user type and morning ritual
    generatePersonalizedCalendar();
  }, [userData.userType]);

  const generatePersonalizedCalendar = () => {
    const userType = userData.userType || 'wellness';
    const now = new Date();
    const events: CalendarEvent[] = [];

    // Get morning ritual data
    const morningRitual = localStorage.getItem(`morning_ritual_${new Date().toDateString()}`);
    const energyLevel = morningRitual ? JSON.parse(morningRitual).energyLevel : 3;

    // Generate events based on user type and energy level
    const baseEvents = {
      'brain-injury': [
        { title: 'Morning Medication & Gentle Movement', time: '8:00 AM', duration: 30, type: 'health' as const },
        { title: 'Cognitive Exercises - Memory Training', time: '10:00 AM', duration: 20, type: 'work' as const },
        { title: 'Rest & Hydration Break', time: '10:30 AM', duration: 15, type: 'break' as const },
        { title: 'Light Physical Therapy', time: '2:00 PM', duration: 45, type: 'health' as const },
        { title: 'Afternoon Rest', time: '3:00 PM', duration: 30, type: 'break' as const },
        { title: 'Evening Reflection & Gratitude', time: '7:00 PM', duration: 15, type: 'personal' as const }
      ],
      'caregiver': [
        { title: 'Morning Self-Care Routine', time: '6:30 AM', duration: 30, type: 'personal' as const },
        { title: 'Loved One Check-in & Breakfast', time: '8:00 AM', duration: 60, type: 'family' as const },
        { title: 'Personal Work Time', time: '10:00 AM', duration: 90, type: 'work' as const },
        { title: 'Lunch & Connection Break', time: '12:00 PM', duration: 45, type: 'break' as const },
        { title: 'Support Network Check-in', time: '2:00 PM', duration: 30, type: 'family' as const },
        { title: 'Evening Family Time', time: '6:00 PM', duration: 120, type: 'family' as const }
      ],
      'cognitive-optimization': [
        { title: 'Deep Work Block 1', time: '8:00 AM', duration: 90, type: 'work' as const },
        { title: 'Strategic Break & Movement', time: '9:30 AM', duration: 15, type: 'break' as const },
        { title: 'Deep Work Block 2', time: '10:00 AM', duration: 90, type: 'work' as const },
        { title: 'Lunch & Reflection', time: '12:00 PM', duration: 60, type: 'break' as const },
        { title: 'Collaborative Work', time: '2:00 PM', duration: 60, type: 'work' as const },
        { title: 'System Optimization', time: '4:00 PM', duration: 45, type: 'work' as const }
      ],
      'wellness': [
        { title: 'Morning Movement & Meditation', time: '7:00 AM', duration: 45, type: 'personal' as const },
        { title: 'Focused Work Session', time: '9:00 AM', duration: 60, type: 'work' as const },
        { title: 'Mindful Break & Snack', time: '10:30 AM', duration: 20, type: 'break' as const },
        { title: 'Creative Work Time', time: '11:00 AM', duration: 90, type: 'work' as const },
        { title: 'Lunch & Nature Walk', time: '1:00 PM', duration: 60, type: 'break' as const },
        { title: 'Evening Wind-down', time: '8:00 PM', duration: 30, type: 'personal' as const }
      ]
    };

    const userEvents = baseEvents[userType] || baseEvents.wellness;
    
    // Adjust events based on energy level
    const adjustedEvents = userEvents.map((event, index) => ({
      ...event,
      id: `event_${index}`,
      completed: Math.random() > 0.7, // Simulate some completed events
      watchers: Math.random() > 0.6 ? ['Family', 'Support Circle'] : undefined
    }));

    // If low energy, reduce intensive activities
    if (energyLevel <= 2) {
      adjustedEvents.forEach(event => {
        if (event.type === 'work' && event.duration > 60) {
          event.duration = Math.max(30, event.duration - 30);
        }
      });
    }

    setTodayEvents(adjustedEvents);
    setCompletedCount(adjustedEvents.filter(e => e.completed).length);
  };

  const completeEvent = (eventId: string) => {
    setTodayEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, completed: true }
          : event
      )
    );
    
    setCompletedCount(prev => prev + 1);
    toast.success("🎉 Event completed! Great progress!");
    
    // Check for celebration milestones
    const newCompletedCount = completedCount + 1;
    if (newCompletedCount === Math.floor(todayEvents.length / 2)) {
      toast.success("🚀 Halfway through your day! You're doing amazing!");
    }
    if (newCompletedCount === todayEvents.length) {
      toast.success("🏆 Perfect day! All events completed!");
    }
  };

  const handleUpgradeClick = () => {
    toast.success("Upgrade feature coming soon!");
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'work': return <Target className="h-4 w-4" />;
      case 'break': return <Clock className="h-4 w-4" />;
      case 'personal': return <Zap className="h-4 w-4" />;
      case 'health': return <Heart className="h-4 w-4" />;
      case 'family': return <Users className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-focus-100 border-focus-300 text-focus-800';
      case 'break': return 'bg-calm-100 border-calm-300 text-calm-800';
      case 'personal': return 'bg-energy-100 border-energy-300 text-energy-800';
      case 'health': return 'bg-heart-100 border-heart-300 text-heart-800';
      case 'family': return 'bg-community-100 border-community-300 text-community-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Progress Header */}
      <Card className="bg-gradient-to-r from-success-50 to-focus-50 border-success-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-success-800">
                Today's Command Center
              </h2>
              <p className="text-success-700">
                {completedCount} of {todayEvents.length} activities completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-success-600">
                {Math.round((completedCount / todayEvents.length) * 100)}%
              </div>
              <p className="text-sm text-success-700">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Personalized Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    event.completed 
                      ? 'bg-success-50 border-success-200 opacity-75' 
                      : getEventColor(event.type)
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type)}
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm opacity-70">
                          {event.time} • {event.duration} minutes
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {event.watchers && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {event.watchers.length} watching
                        </Badge>
                      )}
                      
                      {event.completed ? (
                        <Badge className="bg-success-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => completeEvent(event.id)}
                          className="bg-success-600 hover:bg-success-700"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.success("Add event feature coming soon!")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Event
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          {/* Daily #IChoose */}
          <DailyIChooseWidget onUpgradeClick={handleUpgradeClick} />
          
          {/* Pomodoro Timer */}
          <div className="space-y-2">
            <Button 
              onClick={() => setShowPomodoro(!showPomodoro)}
              variant="outline"
              className="w-full"
            >
              {showPomodoro ? 'Hide' : 'Show'} Focus Timer
            </Button>
            {showPomodoro && <PomodoroTimer />}
          </div>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Adjust Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
