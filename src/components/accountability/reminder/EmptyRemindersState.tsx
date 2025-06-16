
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
        <h3 className="text-lg font-semibold mb-2">Ready to Set Yourself Up for Success?</h3>
        <p className="text-muted-foreground mb-4">
          Let's create gentle reminders that help you stay on track with what matters most to you.
        </p>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Set My First Reminder
        </Button>
      </CardContent>
    </Card>
  );
}
