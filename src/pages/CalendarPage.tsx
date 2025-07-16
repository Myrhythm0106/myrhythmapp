import React from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CalendarDays } from 'lucide-react';

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <PageLayout 
      title="Calendar & Events" 
      description="View and manage your daily schedule, events, and important dates"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Your Schedule</h2>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Morning Routine</p>
                  <p className="text-sm text-muted-foreground">8:00 AM - 9:00 AM</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Focus Work Session</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - 12:00 PM</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">Brain Training</p>
                  <p className="text-sm text-muted-foreground">3:00 PM - 3:30 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}