import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  X, 
  Lightbulb,
  Users
} from 'lucide-react';
import { useStatusManagement, ActionStatus } from '@/hooks/useStatusManagement';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionId: string;
  actionTitle: string;
  currentStatus: ActionStatus;
  onStatusUpdated?: (newStatus: ActionStatus) => void;
}

const statusOptions = [
  {
    value: 'not_started' as ActionStatus,
    label: 'Not Started',
    icon: Clock,
    description: 'Ready to begin when you are',
    color: 'text-gray-500'
  },
  {
    value: 'in_progress' as ActionStatus,
    label: 'In Progress',
    icon: Play,
    description: 'Currently working on this',
    color: 'text-blue-500'
  },
  {
    value: 'completed' as ActionStatus,
    label: 'Completed',
    icon: CheckCircle,
    description: 'Successfully finished!',
    color: 'text-green-500'
  },
  {
    value: 'on_hold' as ActionStatus,
    label: 'On Hold',
    icon: Pause,
    description: 'Temporarily paused',
    color: 'text-yellow-500'
  },
  {
    value: 'cancelled' as ActionStatus,
    label: 'Cancelled',
    icon: X,
    description: 'No longer needed',
    color: 'text-red-500'
  }
];

export function StatusUpdateDialog({
  open,
  onOpenChange,
  actionId,
  actionTitle,
  currentStatus,
  onStatusUpdated,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<ActionStatus>(currentStatus);
  const [note, setNote] = useState('');
  const [notifySupport, setNotifySupport] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { updateActionStatus, getStatusSuggestions } = useStatusManagement();
  const { hasFeature, tier } = useSubscription();

  useEffect(() => {
    if (open && (tier === 'stretch' || tier === 'leap')) {
      loadStatusSuggestions();
    }
  }, [open, actionId, tier]);

  const loadStatusSuggestions = async () => {
    try {
      const suggestions = await getStatusSuggestions(actionId);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading status suggestions:', error);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus && !note.trim()) {
      onOpenChange(false);
      return;
    }

    try {
      setIsLoading(true);
      await updateActionStatus(
        actionId,
        selectedStatus,
        note.trim() || undefined,
        notifySupport && hasFeature('supportCircle')
      );

      onStatusUpdated?.(selectedStatus);
      onOpenChange(false);
      
      // Reset form
      setSelectedStatus(currentStatus);
      setNote('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: any) => {
    setSelectedStatus(suggestion.status);
    setNote(suggestion.reason);
    toast.info('Applied AI suggestion');
  };

  const getStatusIcon = (status: ActionStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.icon : Clock;
  };

  const getStatusColor = (status: ActionStatus) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : 'text-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Update Status
            {hasFeature('supportCircle') && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                Support Circle
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-left">
            Update the status for: <span className="font-medium">"{actionTitle}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Suggestions (MyStretch/MyLeap) */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Smart Suggestions
              </Label>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs">
                        {statusOptions.find(opt => opt.value === suggestion.status)?.label}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Selection */}
          <div className="space-y-3">
            <Label>New Status</Label>
            <RadioGroup value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ActionStatus)}>
              {statusOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label
                      htmlFor={option.value}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <Icon className={`w-4 h-4 ${option.color}`} />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (Optional)</Label>
            <Textarea
              id="note"
              placeholder="Add any additional context or comments..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          {/* Support Circle Notification */}
          {hasFeature('supportCircle') && (
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <div className="font-medium text-sm">Notify Support Circle</div>
                  <div className="text-xs text-muted-foreground">
                    Keep your care team updated on your progress
                  </div>
                </div>
              </div>
              <Switch
                checked={notifySupport}
                onCheckedChange={setNotifySupport}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}