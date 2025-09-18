import React, { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/shared/PageLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays, Filter } from 'lucide-react';
import { CalendarViewSlider } from '@/components/calendar/CalendarViewSlider';
import { TodaysFocusBanner } from '@/components/calendar/TodaysFocusBanner';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { UnifiedCalendarView } from '@/components/calendar/UnifiedCalendarView';

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Parse URL parameters
  useEffect(() => {
    const view = searchParams.get('view');
    const dateParam = searchParams.get('date');
    const filter = searchParams.get('filter');

    // Set date from URL parameter if provided
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (error) {
        console.error('Invalid date parameter:', dateParam);
      }
    }

    // Log the deep link parameters for debugging
    if (view || dateParam || filter) {
      console.log('Calendar deep link params:', { view, date: dateParam, filter });
    }
  }, [searchParams]);

  const currentView = (searchParams.get('view') as "day" | "week" | "month" | "year" | "goals") || "day";
  const filterType = searchParams.get('filter');

  const handleViewChange = (view: "day" | "week" | "month" | "year" | "goals") => {
    const params = new URLSearchParams(searchParams);
    params.set('view', view);
    setSearchParams(params);
  };

  return (
    <PageLayout 
      title="Calendar & Events" 
      description="View and manage your daily schedule, events, and important dates"
    >
      <div className="space-y-6">
        
        {/* Header with View Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Schedule</h2>
              {filterType && (
                <div className="flex items-center gap-1 ml-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground capitalize">
                    Filtered: {filterType}
                  </span>
                </div>
              )}
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
          
          {/* View Toggle */}
          <CalendarViewSlider 
            view={currentView} 
            onViewChange={handleViewChange}
            className="self-center"
          />
        </div>

        {/* Today's Focus Banner */}
        <TodaysFocusBanner />

        {/* Unified Calendar View */}
        <UnifiedCalendarView />
      </div>
    </PageLayout>
  );
}