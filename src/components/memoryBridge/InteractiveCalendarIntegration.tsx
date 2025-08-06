import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Bell, CheckCircle, Target } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { toast } from 'sonner';

interface InteractiveCalendarIntegrationProps {
  action: ExtractedAction;
  onScheduled: () => void;
  onCancel: () => void;
}

export function InteractiveCalendarIntegration({ 
  action, 
  onScheduled, 
  onCancel 
}: InteractiveCalendarIntegrationProps) {
  const [title, setTitle] = useState(action.action_text);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState(action.intent_behind || '');
  const [priority, setPriority] = useState(action.priority_level.toString());
  const [reminderTime, setReminderTime] = useState('15');
  const [inviteSupport, setInviteSupport] = useState(false);

  const handleSchedule = async () => {
    if (!date || !time) {
      toast.error('Please select date and time');
      return;
    }

    try {
      // Create calendar event (would integrate with actual calendar API)
      const scheduleData = {
        title,
        date,
        time,
        duration: parseInt(duration),
        location,
        notes,
        priority: parseInt(priority),
        reminderTime: parseInt(reminderTime),
        inviteSupport,
        actionId: action.id
      };

      // Simulate calendar integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Action successfully scheduled!');
      onScheduled();
    } catch (error) {
      toast.error('Failed to schedule action');
    }
  };

  return (
    <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-brain-health" />
          <span className="bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
            Schedule Action
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {action.action_type}
          </Badge>
          <Badge variant={action.priority_level >= 4 ? "destructive" : action.priority_level >= 3 ? "default" : "secondary"}>
            Priority {action.priority_level}/5
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Action Preview */}
        <div className="p-4 rounded-lg bg-muted/30 border border-muted">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-brain-health mt-0.5" />
            <div>
              <p className="font-medium text-sm">{action.action_text}</p>
              {action.due_context && (
                <p className="text-xs text-muted-foreground mt-1">Due: {action.due_context}</p>
              )}
            </div>
          </div>
        </div>

        {/* Scheduling Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Meeting location or virtual link..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low Priority</SelectItem>
                  <SelectItem value="2">Normal</SelectItem>
                  <SelectItem value="3">Important</SelectItem>
                  <SelectItem value="4">High Priority</SelectItem>
                  <SelectItem value="5">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reminder">Reminder</Label>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes before</SelectItem>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="1440">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Support Circle</Label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="invite-support"
                  checked={inviteSupport}
                  onChange={(e) => setInviteSupport(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="invite-support" className="text-sm">
                  Notify my support circle
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional context or details..."
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Smart Suggestions */}
        {action.relationship_impact && (
          <div className="p-4 rounded-lg bg-brain-health/10 border border-brain-health/20">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-brain-health mt-0.5" />
              <div>
                <p className="font-medium text-brain-health text-sm">Relationship Impact</p>
                <p className="text-xs text-muted-foreground mt-1">{action.relationship_impact}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!date || !time}
            className="flex-1 bg-gradient-to-r from-brain-health to-emerald-500 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Schedule Action
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}