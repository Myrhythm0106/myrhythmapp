import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Plus } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { CreateReminderForm } from './reminder/CreateReminderForm';

export function ReminderCreator() {
  const { reminders } = useAccountabilitySystem();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reminders</h2>
          <p className="text-muted-foreground">
            Stay on track with personalized reminders from your support circle
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <CreateReminderForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Reminders List */}
      {reminders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reminders set yet</h3>
              <p className="text-muted-foreground mb-4">
                Stay on track with gentle reminders from your support circle
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{reminder.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {reminder.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{reminder.reminder_time}</span>
                      <span className="text-sm text-muted-foreground">
                        {reminder.frequency}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {reminder.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}