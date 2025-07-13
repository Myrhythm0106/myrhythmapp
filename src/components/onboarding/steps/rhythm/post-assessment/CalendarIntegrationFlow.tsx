
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, Users, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { UserType } from "../../UserTypeStep";
import { AssessmentResult } from "@/utils/rhythmAnalysis";
import { toast } from "sonner";

interface CalendarIntegrationFlowProps {
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

export function CalendarIntegrationFlow({ 
  assessmentResult, 
  userType, 
  selectedBreaks, 
  onCalendarSetup 
}: CalendarIntegrationFlowProps) {
  const [suggestedEvents, setSuggestedEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("CalendarIntegrationFlow: Initializing with selectedBreaks:", selectedBreaks);
    
    // Simulate loading to show we're processing
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const events = generatePersonalizedEvents(assessmentResult, userType, selectedBreaks);
      console.log("CalendarIntegrationFlow: Generated events:", events);
      setSuggestedEvents(events);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [assessmentResult, userType, selectedBreaks]);

  const generatePersonalizedEvents = (
    assessment: AssessmentResult, 
    userType?: UserType | null, 
    breaks: string[] = []
  ): CalendarEvent[] => {
    console.log("Generating events for userType:", userType, "breaks:", breaks);
    
    const events: CalendarEvent[] = [];
    
    // Always add a morning routine
    events.push({
      id: 'morning-routine',
      title: userType === 'brain-injury' ? 'Gentle Morning Start' : 'Morning Focus Time',
      description: userType === 'brain-injury' 
        ? 'Begin your day with mindful preparation' 
        : 'Start your day with focused intention',
      duration: 15,
      suggestedTime: '08:00',
      type: 'focus',
      canInviteWatchers: false,
      autoAccepted: true,
      watchers: []
    });

    // Add break-specific events
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

    // Always add an afternoon break
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

    console.log("Generated", events.length, "events");
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
    console.log("CalendarIntegrationFlow: Continuing with", acceptedEvents.length, "events");
    onCalendarSetup(acceptedEvents);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">Creating Your Calendar</h2>
        <p className="text-muted-foreground">
          Personalizing your schedule based on your preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Your Personalized Schedule</h2>
        <p className="text-muted-foreground">
          We've created suggested calendar events based on your assessment and selected breaks.
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
                    {(event.type === 'break' || event.type === 'focus') && <Clock className="h-4 w-4" />}
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
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
