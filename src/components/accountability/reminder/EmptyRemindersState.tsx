
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Plus } from 'lucide-react';

interface EmptyRemindersStateProps {
  onCreateClick: () => void;
}

export function EmptyRemindersState({ onCreateClick }: EmptyRemindersStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Reminders Set</h3>
        <p className="text-muted-foreground mb-4">
          Create reminders to help you stay on track with medications, appointments, and activities.
        </p>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Reminder
        </Button>
      </CardContent>
    </Card>
  );
}
