
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { CreateReminderForm } from './reminder/CreateReminderForm';
import { ReminderCard } from './reminder/ReminderCard';
import { EmptyRemindersState } from './reminder/EmptyRemindersState';

export function ReminderCreator() {
  const { reminders } = useAccountabilitySystem();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reminders</h2>
          <p className="text-muted-foreground">
            Set up reminders to help you stay on track with your goals
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <CreateReminderForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}

        {reminders.length === 0 && (
          <EmptyRemindersState onCreateClick={() => setIsCreateDialogOpen(true)} />
        )}
      </div>
    </div>
  );
}
