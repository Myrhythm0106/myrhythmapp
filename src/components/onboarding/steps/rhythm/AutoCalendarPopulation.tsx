
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Users, Mail, CheckCircle } from "lucide-react";
import { UserType } from "../UserTypeStep";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { toast } from "sonner";

interface AutoCalendarPopulationProps {
  assessmentResult: AssessmentResult;
  userType?: UserType | null;
  selectedBreaks: string[];
  onCalendarSetup: (events: any[]) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  duration: number;
  suggestedTime: string;
  type: "break" | "focus" | "family" | "spiritual";
  canInviteWatchers: boolean;
  autoAccepted: boolean;
  watchers: string[];
}

export function AutoCalendarPopulation({ 
  assessmentResult, 
  userType, 
  selectedBreaks, 
  onCalendarSetup 
}: AutoCalendarPopulationProps) {
  const [suggestedEvents, setSuggestedEvents] = useState<CalendarEvent[]>([]);
  const [watcherEmail, setWatcherEmail] = useState("");

  useEffect(() => {
    // Generate personalized calendar events based on assessment and selected breaks
    const events = generatePersonalizedEvents(assessmentResult, userType, selectedBreaks);
    setSuggestedEvents(events);
  }, [assessmentResult, userType, selectedBreaks]);

  const generatePersonalizedEvents = (assessment: AssessmentResult, userType?: UserType | null, breaks: string[] = []): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    // Morning routine based on user type
    if (userType === 'brain-injury') {
      events.push({
        id: 'morning-gentle-start',
        title: 'Gentle Morning Start',
        description: 'Begin your day with mindful preparation',
        duration: 15,
        suggestedTime: '08:00',
        type: 'break',
        canInviteWatchers: true,
        autoAccepted: true,
        watchers: []
      });
    }

    // Family connection time
    if (breaks.includes('family-check-in') || breaks.includes('family-activity')) {
      events.push({
        id: 'family-connection',
        title: 'Family Connection Time',
        description: 'Quality time with loved ones',
        duration: 20,
        suggestedTime: '17:30',
        type: 'family',
        canInviteWatchers: true,
        autoAccepted: true,
        watchers: []
      });
    }

    // Spiritual/meditation time
    if (breaks.includes('prayer-meditation')) {
      events.push({
        id: 'spiritual-time',
        title: 'Prayer & Reflection Time',
        description: 'Quiet time for spiritual connection',
        duration: 15,
        suggestedTime: '19:00',
        type: 'spiritual',
        canInviteWatchers: false,
        autoAccepted: true,
        watchers: []
      });
    }

    // Afternoon energy break
    events.push({
      id: 'afternoon-recharge',
      title: 'Afternoon Recharge Break',
      description: 'Mid-day energy boost and mental reset',
      duration: 10,
      suggestedTime: '14:30',
      type: 'break',
      canInviteWatchers: true,
      autoAccepted: true,
      watchers: []
    });

    return events;
  };

  const handleEventToggle = (eventId: string) => {
    setSuggestedEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, autoAccepted: !event.autoAccepted }
          : event
      )
    );
  };

  const handleAddWatcher = (eventId: string, email: string) => {
    if (!email.trim()) return;
    
    setSuggestedEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, watchers: [...event.watchers, email.trim()] }
          : event
      )
    );
    
    toast.success(`Added ${email} as a watcher for this activity`);
  };

  const handleContinue = () => {
    const acceptedEvents = suggestedEvents.filter(event => event.autoAccepted);
    onCalendarSetup(acceptedEvents);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Personalized Schedule</h2>
        <p className="text-muted-foreground">
          We've created suggested calendar events based on your assessment. You can accept, modify, or invite watchers.
        </p>
      </div>

      <div className="space-y-4">
        {suggestedEvents.map((event) => (
          <Card key={event.id} className={`${event.autoAccepted ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border">
                    {event.type === 'family' && <Users className="h-4 w-4" />}
                    {event.type === 'spiritual' && <Calendar className="h-4 w-4" />}
                    {event.type === 'break' && <Clock className="h-4 w-4" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {event.suggestedTime}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {event.duration} min
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={event.autoAccepted}
                    onCheckedChange={() => handleEventToggle(event.id)}
                  />
                  {event.autoAccepted && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {event.description}
              </p>
              
              {event.canInviteWatchers && event.autoAccepted && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Invite Watchers (Optional)</h4>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddWatcher(event.id, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        const input = document.querySelector(`input[placeholder="Enter email address"]`) as HTMLInputElement;
                        if (input) {
                          handleAddWatcher(event.id, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                  {event.watchers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {event.watchers.map((watcher, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {watcher}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          {suggestedEvents.filter(e => e.autoAccepted).length} of {suggestedEvents.length} events will be added to your calendar
        </p>
        <Button 
          onClick={handleContinue} 
          size="lg" 
          className="bg-green-600 hover:bg-green-700"
        >
          Add to My Calendar
        </Button>
      </div>
    </div>
  );
}
