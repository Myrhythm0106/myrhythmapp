
import React from 'react';
import { Target, Activity, ArrowRight, Lightbulb } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { GoalType } from './GoalTypeSelector';

interface GoalFormFieldsProps {
  goalType: GoalType;
  goalTitle: string;
  setGoalTitle: (value: string) => void;
  goalMeasurement: string;
  setGoalMeasurement: (value: string) => void;
  goalTimeframe: string;
  setGoalTimeframe: (value: string) => void;
  goalWhy: string;
  setGoalWhy: (value: string) => void;
}

export function GoalFormFields({
  goalType,
  goalTitle,
  setGoalTitle,
  goalMeasurement,
  setGoalMeasurement,
  goalTimeframe,
  setGoalTimeframe,
  goalWhy,
  setGoalWhy
}: GoalFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* WHAT - Goal Title */}
      <div>
        <Label htmlFor="goalTitle" className="text-brain-base font-medium flex items-center gap-2">
          <Target className="h-4 w-4 text-memory-emerald-500" />
          What do you want to achieve? *
        </Label>
        <Input
          id="goalTitle"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
          placeholder="e.g., Walk to the mailbox by myself"
          className="mt-2 text-brain-base"
        />
      </div>

      {/* HOW - Measurement */}
      <div>
        <Label htmlFor="goalMeasurement" className="text-brain-base font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-clarity-teal-500" />
          How will you measure success? *
        </Label>
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {goalType.measurementPrompts.map((prompt, idx) => (
              <Badge 
                key={idx}
                variant="outline" 
                className="cursor-pointer hover:bg-clarity-teal-50 text-xs"
                onClick={() => setGoalMeasurement(prompt)}
              >
                {prompt}
              </Badge>
            ))}
          </div>
          <Input
            id="goalMeasurement"
            value={goalMeasurement}
            onChange={(e) => setGoalMeasurement(e.target.value)}
            placeholder="e.g., Walk 100 steps without stopping, Complete 3 times per week"
            className="text-brain-base"
          />
        </div>
      </div>

      {/* WHEN - Timeframe */}
      <div>
        <Label htmlFor="goalTimeframe" className="text-brain-base font-medium flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-brain-health-500" />
          When do you want to achieve this?
        </Label>
        <Input
          id="goalTimeframe"
          value={goalTimeframe}
          onChange={(e) => setGoalTimeframe(e.target.value)}
          placeholder="e.g., Within 4 weeks, By the end of next month"
          className="mt-2 text-brain-base"
        />
      </div>

      {/* WHY - Personal Motivation */}
      <div>
        <Label htmlFor="goalWhy" className="text-brain-base font-medium flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Why is this meaningful to you?
        </Label>
        <Textarea
          id="goalWhy"
          value={goalWhy}
          onChange={(e) => setGoalWhy(e.target.value)}
          placeholder="This will help me feel more independent and confident..."
          className="mt-2 text-brain-sm"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          This helps your brain remember why this goal matters during challenging times
        </p>
      </div>
    </div>
  );
}
