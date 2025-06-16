
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReminderBasicInfoProps {
  title: string;
  description: string;
  reminderType: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export function ReminderBasicInfo({
  title,
  description,
  reminderType,
  onTitleChange,
  onDescriptionChange,
  onTypeChange
}: ReminderBasicInfoProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">What would you like to be reminded about? *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Take my medication, Go for a walk, Call mom..."
          />
        </div>
        <div>
          <Label htmlFor="type">What kind of reminder is this?</Label>
          <Select value={reminderType} onValueChange={onTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medication">Medication</SelectItem>
              <SelectItem value="appointment">Appointment</SelectItem>
              <SelectItem value="activity">Activity</SelectItem>
              <SelectItem value="safety">Safety Check</SelectItem>
              <SelectItem value="custom">Something Else</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Want to add more details?</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Any extra details that might help you..."
          rows={3}
        />
      </div>
    </>
  );
}
