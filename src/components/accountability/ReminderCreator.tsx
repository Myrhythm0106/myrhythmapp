
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Clock, Plus, Calendar, Bell, AlertTriangle } from 'lucide-react';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function ReminderCreator() {
  const { reminders, supportCircle, createReminder } = useAccountabilitySystem();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [newReminder, setNewReminder] = useState({
    created_by_member_id: 'self',
    title: '',
    description: '',
    reminder_type: 'custom' as const,
    frequency: 'daily' as const,
    reminder_time: '09:00',
    reminder_days: [] as number[],
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    escalation_enabled: false,
    escalation_delay_minutes: 30,
    escalation_members: [] as string[]
  });

  const handleCreateReminder = async () => {
    if (!newReminder.title || !newReminder.reminder_time) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      await createReminder(newReminder);
      setIsCreateDialogOpen(false);
      setNewReminder({
        created_by_member_id: 'self',
        title: '',
        description: '',
        reminder_type: 'custom',
        frequency: 'daily',
        reminder_time: '09:00',
        reminder_days: [],
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true,
        escalation_enabled: false,
        escalation_delay_minutes: 30,
        escalation_members: []
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDayToggle = (day: number, checked: boolean) => {
    setNewReminder(prev => ({
      ...prev,
      reminder_days: checked 
        ? [...prev.reminder_days, day].sort()
        : prev.reminder_days.filter(d => d !== day)
    }));
  };

  const getFrequencyDisplay = (reminder: any) => {
    switch (reminder.frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly${reminder.reminder_days && reminder.reminder_days.length > 0 
          ? ` (${reminder.reminder_days.map((d: number) => 
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]
            ).join(', ')})` 
          : ''}`;
      case 'monthly':
        return 'Monthly';
      case 'once':
        return 'Once';
      default:
        return reminder.frequency;
    }
  };

  const getReminderTypeColor = (type: string) => {
    switch (type) {
      case 'medication': return 'bg-red-100 text-red-800';
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'activity': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Take medication, Exercise, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={newReminder.reminder_type} 
                    onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, reminder_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details about this reminder..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select 
                    value={newReminder.frequency} 
                    onValueChange={(value: any) => setNewReminder(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.reminder_time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, reminder_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newReminder.start_date}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>
              </div>

              {newReminder.frequency === 'weekly' && (
                <div className="space-y-3">
                  <Label>Days of the Week</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${index}`}
                          checked={newReminder.reminder_days.includes(index)}
                          onCheckedChange={(checked) => handleDayToggle(index, checked as boolean)}
                        />
                        <Label htmlFor={`day-${index}`} className="text-xs">
                          {day.substring(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="escalation">Enable Escalation</Label>
                  <Switch
                    id="escalation"
                    checked={newReminder.escalation_enabled}
                    onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, escalation_enabled: checked }))}
                  />
                </div>

                {newReminder.escalation_enabled && (
                  <div>
                    <Label htmlFor="escalation-delay">Escalation Delay (minutes)</Label>
                    <Input
                      id="escalation-delay"
                      type="number"
                      value={newReminder.escalation_delay_minutes}
                      onChange={(e) => setNewReminder(prev => ({ 
                        ...prev, 
                        escalation_delay_minutes: parseInt(e.target.value) || 30 
                      }))}
                      placeholder="30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      If you don't respond, support circle members will be notified after this delay
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="end-date">End Date (Optional)</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newReminder.end_date}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateReminder}>
                Create Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{reminder.title}</h3>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {reminder.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getReminderTypeColor(reminder.reminder_type)}>
                        {reminder.reminder_type}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {reminder.reminder_time} • {getFrequencyDisplay(reminder)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {reminder.escalation_enabled && (
                    <Badge variant="outline" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Escalation
                    </Badge>
                  )}
                  
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(reminder.start_date), 'MMM d')}
                    {reminder.end_date && ` - ${format(new Date(reminder.end_date), 'MMM d')}`}
                  </div>

                  <Switch
                    checked={reminder.is_active}
                    onCheckedChange={(checked) => {
                      // Handle toggle active state
                      toast.info('Reminder status updated');
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {reminders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Reminders Set</h3>
              <p className="text-muted-foreground mb-4">
                Create reminders to help you stay on track with medications, appointments, and activities.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
