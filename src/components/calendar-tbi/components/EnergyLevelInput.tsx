import React from 'react';
import { Card } from '@/components/ui/card';
import { EnergyLevel } from '../types/calendarTypes';
import { EnergyLevelSelector, EnergyValue } from '@/components/sophisticated/EnergyLevelSelector';

interface EnergyLevelInputProps {
  currentLevel?: EnergyLevel;
  onLevelChange: (level: EnergyLevel) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function EnergyLevelInput({ currentLevel, onLevelChange, disabled = false, compact = false }: EnergyLevelInputProps) {
  const handle = (v: EnergyValue) => onLevelChange(v as EnergyLevel);

  if (compact) {
    return (
      <div className="flex-1">
        <div className="text-center mb-2">
          <h3 className="text-sm font-medium text-foreground">Energy Level</h3>
          <p className="text-xs text-muted-foreground">Rate your energy</p>
        </div>
        <EnergyLevelSelector value={currentLevel as EnergyValue} onChange={handle} disabled={disabled} compact />
      </div>
    );
  }

  return (
    <Card className="p-5 bg-gradient-to-br from-card to-muted/40 border-border">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Energy Level</h3>
        <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
      </div>
      <EnergyLevelSelector value={currentLevel as EnergyValue} onChange={handle} disabled={disabled} />
    </Card>
  );
}
