
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ReminderEscalationProps {
  escalationEnabled: boolean;
  escalationDelayMinutes: number;
  onEscalationToggle: (enabled: boolean) => void;
  onDelayChange: (minutes: number) => void;
}

export function ReminderEscalation({
  escalationEnabled,
  escalationDelayMinutes,
  onEscalationToggle,
  onDelayChange
}: ReminderEscalationProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="escalation">Get extra support if needed?</Label>
        <Switch
          id="escalation"
          checked={escalationEnabled}
          onCheckedChange={onEscalationToggle}
        />
      </div>

      {escalationEnabled && (
        <div>
          <Label htmlFor="escalation-delay">How long should we wait before reaching out to your support team? (minutes)</Label>
          <Input
            id="escalation-delay"
            type="number"
            value={escalationDelayMinutes}
            onChange={(e) => onDelayChange(parseInt(e.target.value) || 30)}
            placeholder="30"
          />
          <p className="text-xs text-muted-foreground mt-1">
            If you don't respond, we'll gently let your support circle know you might need a check-in
          </p>
        </div>
      )}
    </div>
  );
}
