
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Target, Zap, Coffee } from 'lucide-react';
import { IntelligentBreakSuggestions } from '@/components/breaks/IntelligentBreakSuggestions';
import { FamilyTimeScheduler } from '@/components/family-time/FamilyTimeScheduler';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrainHealthSidebarProps {
  date?: Date;
}

export function BrainHealthSidebar({ date }: BrainHealthSidebarProps) {
  const selectedDate = date || new Date();
  const todayEvents = [
    {
      id: "1",
      title: "Morning walk practice",
      time: "10:00 AM",
      type: "goal-linked",
      goal: "Walk to mailbox independently"
    },
    {
      id: "2", 
      title: "Physical therapy session",
      time: "2:00 PM",
      type: "appointment"
    }
  ];

  const upcomingReminders = [
    {
      id: "1",
      title: "Take afternoon medication",
      time: "3:00 PM",
      type: "medication"
    },
    {
      id: "2",
      title: "Family dinner time",
      time: "6:00 PM", 
      type: "family-time"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Date Overview */}
      <Card className="border-memory-emerald-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-memory-emerald-600" />
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric'
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Today's Actions</span>
              <Badge variant="outline">{todayEvents.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Reminders Set</span>
              <Badge variant="outline">{upcomingReminders.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Break & Family Features */}
      <Tabs defaultValue="breaks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="breaks" className="text-xs">
            <Coffee className="h-3 w-3 mr-1" />
            Smart Breaks
          </TabsTrigger>
          <TabsTrigger value="family" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Family Time
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="breaks" className="mt-4">
          <IntelligentBreakSuggestions />
        </TabsContent>
        
        <TabsContent value="family" className="mt-4">
          <FamilyTimeScheduler />
        </TabsContent>
      </Tabs>

      {/* Today's Events */}
      <Card className="border-clarity-teal-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-clarity-teal-600" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayEvents.map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-8 bg-clarity-teal-400 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium text-sm">{event.title}</p>
                <p className="text-xs text-gray-600">{event.time}</p>
                {event.goal && (
                  <Badge variant="outline" className="text-xs mt-1 bg-memory-emerald-50 text-memory-emerald-700">
                    Goal: {event.goal}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Reminders */}
      <Card className="border-brain-health-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-brain-health-600" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 bg-brain-health-50 rounded-lg border border-brain-health-200">
              <div>
                <p className="font-medium text-sm text-brain-health-800">{reminder.title}</p>
                <p className="text-xs text-brain-health-600">{reminder.time}</p>
              </div>
              <Badge className={
                reminder.type === 'family-time' 
                  ? "bg-heart-100 text-heart-700 border-heart-200"
                  : "bg-orange-100 text-orange-700 border-orange-200"
              }>
                {reminder.type === 'family-time' ? 'family' : reminder.type}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
