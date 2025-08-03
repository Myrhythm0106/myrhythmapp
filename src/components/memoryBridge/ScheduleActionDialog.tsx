import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { ExtractedAction } from '@/types/memoryBridge';
import { format, addDays, addHours, setHours, setMinutes } from 'date-fns';
import { toast } from 'sonner';

interface ScheduleActionDialogProps {
  action: ExtractedAction | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (actionId: string, scheduleData: ScheduleData) => void;
}

export interface ScheduleData {
  title: string;
  description: string;
  date: string;
  time: string;
  reminderMinutes: number;
}

export const ScheduleActionDialog: React.FC<ScheduleActionDialogProps> = ({
  action,
  isOpen,
  onClose,
  onSchedule
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    reminderMinutes: 30
  });

  const [suggestedTimes, setSuggestedTimes] = useState<Array<{
    date: string;
    time: string;
    label: string;
    reason: string;
  }>>([]);

  React.useEffect(() => {
    if (action) {
      setScheduleData({
        title: action.action_text,
        description: `Priority: ${getPriorityText(action.priority_level)}\nConfidence: ${Math.round((action.confidence_score || 0) * 100)}%${action.emotional_stakes ? `\nImpact: ${action.emotional_stakes}` : ''}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        reminderMinutes: action.priority_level >= 7 ? 60 : 30
      });

      // Generate smart suggestions based on action context
      generateSmartSuggestions(action);
    }
  }, [action]);

  const getPriorityText = (level: number) => {
    if (level >= 8) return 'Critical';
    if (level >= 6) return 'High';
    if (level >= 4) return 'Medium';
    return 'Low';
  };

  const generateSmartSuggestions = (action: ExtractedAction) => {
    const suggestions = [];
    const now = new Date();

    // Based on due context
    if (action.due_context?.toLowerCase().includes('today')) {
      suggestions.push({
        date: format(now, 'yyyy-MM-dd'),
        time: '14:00',
        label: 'This Afternoon',
        reason: 'Due context mentions "today"'
      });
    } else if (action.due_context?.toLowerCase().includes('tomorrow')) {
      suggestions.push({
        date: format(addDays(now, 1), 'yyyy-MM-dd'),
        time: '10:00',
        label: 'Tomorrow Morning',
        reason: 'Due context mentions "tomorrow"'
      });
    } else if (action.due_context?.toLowerCase().includes('week')) {
      suggestions.push({
        date: format(addDays(now, 7), 'yyyy-MM-dd'),
        time: '09:00',
        label: 'Next Week',
        reason: 'Due context mentions "week"'
      });
    }

    // Based on priority level
    if (action.priority_level >= 8) {
      suggestions.push({
        date: format(now, 'yyyy-MM-dd'),
        time: format(addHours(now, 2), 'HH:mm'),
        label: 'In 2 Hours (Critical)',
        reason: 'High priority item needs immediate attention'
      });
    } else if (action.priority_level >= 6) {
      suggestions.push({
        date: format(addDays(now, 1), 'yyyy-MM-dd'),
        time: '09:00',
        label: 'Tomorrow (High Priority)',
        reason: 'High priority - schedule soon'
      });
    }

    // Based on action type
    if (action.action_type === 'reminder') {
      suggestions.push({
        date: format(addDays(now, 3), 'yyyy-MM-dd'),
        time: '18:00',
        label: 'In 3 Days (Evening)',
        reason: 'Reminders work well with some lead time'
      });
    }

    setSuggestedTimes(suggestions.slice(0, 3)); // Limit to 3 suggestions
  };

  const handleSchedule = () => {
    if (!action || !scheduleData.title.trim()) {
      toast.error('Please provide a title for the scheduled action');
      return;
    }

    onSchedule(action.id, scheduleData);
    onClose();
    toast.success('Action scheduled successfully!');
  };

  const applySuggestion = (suggestion: any) => {
    setScheduleData(prev => ({
      ...prev,
      date: suggestion.date,
      time: suggestion.time
    }));
  };

  if (!action) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule P.A.C.T. Action
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{action.action_text}</h4>
              <Badge variant="outline" className="ml-2">
                {action.action_type.toUpperCase()}
              </Badge>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Priority: {getPriorityText(action.priority_level)}</span>
              <span>Confidence: {Math.round((action.confidence_score || 0) * 100)}%</span>
              {action.assigned_to && <span>Assigned to: {action.assigned_to}</span>}
            </div>
            {action.due_context && (
              <p className="text-sm text-muted-foreground mt-2">
                Due: {action.due_context}
              </p>
            )}
          </div>

          {/* Smart Suggestions */}
          {suggestedTimes.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Smart Suggestions</Label>
              <div className="grid grid-cols-1 gap-2">
                {suggestedTimes.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{suggestion.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(suggestion.date), 'MMMM d')} at {suggestion.time}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground max-w-40">
                        {suggestion.reason}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Scheduling */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Manual Scheduling</Label>
            
            <div>
              <Label htmlFor="title">Action Title</Label>
              <Input
                id="title"
                value={scheduleData.title}
                onChange={(e) => setScheduleData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <Label htmlFor="description">Notes</Label>
              <Textarea
                id="description"
                value={scheduleData.description}
                onChange={(e) => setScheduleData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Additional details or context..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduleData.date}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduleData.time}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                value={scheduleData.reminderMinutes}
                onChange={(e) => setScheduleData(prev => ({ ...prev, reminderMinutes: parseInt(e.target.value) || 30 }))}
                min="0"
                max="1440"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Schedule Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};