import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar, Users, MessageSquare, Clock, Tag } from 'lucide-react';
import { useSupportCircle } from '@/hooks/use-support-circle';
import { useDailyActions } from '@/contexts/DailyActionsContext';
import { toast } from 'sonner';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  events: any[];
  prefilledTime?: string | null;
}

export function DayDetailsModal({ isOpen, onClose, selectedDate, events, prefilledTime }: DayDetailsModalProps) {
  const { members, addMessage } = useSupportCircle();
  const { createAction } = useDailyActions();
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDetails, setActivityDetails] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [activityType, setActivityType] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [feelings, setFeelings] = useState('');
  const [startTime, setStartTime] = useState('');

  // Set prefilled time when modal opens
  React.useEffect(() => {
    if (prefilledTime && isOpen) {
      setStartTime(prefilledTime);
    }
  }, [prefilledTime, isOpen]);

  const handleSave = async () => {
    if (!activityTitle.trim()) {
      toast.error('Please add an activity title');
      return;
    }

    try {
      // Create the activity in the database
      await createAction({
        title: activityTitle.trim(),
        description: activityDetails.trim() || undefined,
        date: format(selectedDate, 'yyyy-MM-dd'),
        action_type: 'regular',
        focus_area: activityType === 'therapy' ? 'physical' :
                   activityType === 'exercise' ? 'physical' :
                   activityType === 'cognitive' ? 'cognitive' : 
                   activityType === 'social' ? 'social' : 
                   activityType === 'rest' ? 'emotional' : 'cognitive',
        duration_minutes: timeSpent ? parseInt(timeSpent) : undefined,
        start_time: startTime || undefined,
        status: 'pending'
      });

      // If sharing with support circle member
      if (selectedMember && activityTitle.trim()) {
        const member = members.find(m => m.id === selectedMember);
        if (member) {
          const message = `Daily activity update for ${format(selectedDate, 'MMM d, yyyy')}: ${activityTitle}${activityDetails ? ` - ${activityDetails}` : ''}`;
          addMessage(selectedMember, message);
          toast.success(`Activity shared with ${member.name}`);
        }
      }

      toast.success('Activity saved successfully!');
      
      // Reset form
      setActivityTitle('');
      setActivityDetails('');
      setSelectedMember('');
      setActivityType('');
      setTimeSpent('');
      setFeelings('');
      setStartTime('');
      onClose();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity. Please try again.');
    }
  };

  const dayEvents = events.filter(event => 
    format(event.startTime, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Activity Details - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Events for the Day */}
          {dayEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Scheduled Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dayEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{event.title}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {format(event.startTime, 'h:mm a')}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Details Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Add Activity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Activity Title */}
              <div className="space-y-2">
                <Label htmlFor="activity-title">Activity Title *</Label>
                <Input
                  id="activity-title"
                  placeholder="Brief headline for your calendar (e.g., 'Physical Therapy', 'Team Meeting')"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  className="font-medium"
                />
                <p className="text-xs text-muted-foreground">This will appear as the headline in your calendar views</p>
              </div>

              {/* Activity Type */}
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapy">Therapy Session</SelectItem>
                    <SelectItem value="exercise">Exercise/Physical Activity</SelectItem>
                    <SelectItem value="medication">Medication/Treatment</SelectItem>
                    <SelectItem value="social">Social Activity</SelectItem>
                    <SelectItem value="cognitive">Cognitive Exercise</SelectItem>
                    <SelectItem value="rest">Rest/Recovery</SelectItem>
                    <SelectItem value="work">Work/Productivity</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {prefilledTime && (
                  <p className="text-xs text-muted-foreground">
                    Pre-filled from selected time slot: {prefilledTime}
                  </p>
                )}
              </div>

              {/* Time Spent */}
              <div className="space-y-2">
                <Label htmlFor="time-spent">Time Spent (minutes)</Label>
                <Input
                  id="time-spent"
                  type="number"
                  placeholder="30"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                />
              </div>

              {/* Activity Details */}
              <div className="space-y-2">
                <Label htmlFor="details">Activity Details (Optional)</Label>
                <Textarea
                  id="details"
                  placeholder="Describe what you did, how it went, any challenges or successes..."
                  value={activityDetails}
                  onChange={(e) => setActivityDetails(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">Additional details for your personal tracking</p>
              </div>

              {/* How You're Feeling */}
              <div className="space-y-2">
                <Label htmlFor="feelings">How are you feeling?</Label>
                <Textarea
                  id="feelings"
                  placeholder="Share your emotions, energy level, any concerns or positive thoughts..."
                  value={feelings}
                  onChange={(e) => setFeelings(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Support Circle Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Share with Support Circle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Share this update with someone from your support circle</Label>
                <Select value={selectedMember} onValueChange={setSelectedMember}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a support circle member (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedMember && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> This activity update will be shared with{' '}
                    {members.find(m => m.id === selectedMember)?.name} to help them support your progress.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Save Activity Details
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
