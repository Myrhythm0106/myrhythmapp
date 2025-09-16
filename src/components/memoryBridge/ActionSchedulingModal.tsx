import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ExtractedAction } from '@/types/memoryBridge';

interface ActionSchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  actions: ExtractedAction[];
  onScheduleComplete: (scheduledActions: ExtractedAction[]) => void;
}

export function ActionSchedulingModal({
  isOpen,
  onClose,
  actions,
  onScheduleComplete
}: ActionSchedulingModalProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedWatchers, setSelectedWatchers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleActionSelection = (actionId: string) => {
    setSelectedActions(prev => 
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSchedule = async () => {
    if (selectedActions.length === 0) {
      toast.error('Please select at least one action to schedule');
      return;
    }

    if (!scheduleDate || !scheduleTime) {
      toast.error('Please set both date and time for scheduling');
      return;
    }

    try {
      // Here we would normally update the database
      // For now, we'll just simulate the scheduling
      const scheduledActions = actions.filter(action => 
        selectedActions.includes(action.id)
      ).map(action => ({
        ...action,
        scheduled_date: scheduleDate,
        scheduled_time: scheduleTime,
        assigned_watchers: selectedWatchers
      }));

      onScheduleComplete(scheduledActions);
      toast.success(`Successfully scheduled ${selectedActions.length} actions!`);
      onClose();
    } catch (error) {
      console.error('Error scheduling actions:', error);
      toast.error('Failed to schedule actions. Please try again.');
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 5: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Your Actions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Selection */}
          <div>
            <Label className="text-base font-medium">Select Actions to Schedule</Label>
            <div className="mt-2 space-y-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedActions.includes(action.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleActionSelection(action.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getPriorityColor(action.priority_level)}>
                          Priority {action.priority_level}
                        </Badge>
                        <Badge variant="outline">
                          {action.action_type}
                        </Badge>
                        {action.proposed_date && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {action.proposed_date} {action.proposed_time}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {action.action_text}
                      </p>
                    </div>
                    {selectedActions.includes(action.id) && (
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="schedule-date">Schedule Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="schedule-time">Schedule Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          {/* Watcher Selection */}
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Select Watchers (Optional)
            </Label>
            <Select onValueChange={(value) => setSelectedWatchers([value])}>
              <SelectTrigger>
                <SelectValue placeholder="Choose who should be notified..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accountability-partner">Accountability Partner</SelectItem>
                <SelectItem value="team-lead">Team Lead</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="family">Family Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional context or reminders..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule}
              disabled={selectedActions.length === 0}
            >
              Schedule {selectedActions.length} Action{selectedActions.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}