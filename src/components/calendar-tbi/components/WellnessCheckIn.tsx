import React from 'react';
import { Card } from '@/components/ui/card';
import { EnergyLevelInput } from './EnergyLevelInput';
import { EmotionalWellnessCapture } from './EmotionalWellnessCapture';
import { EnergyLevel } from '../types/calendarTypes';

interface WellnessCheckInProps {
  currentEnergyLevel?: EnergyLevel;
  onEnergyLevelChange: (level: EnergyLevel) => void;
  onEmotionCapture?: (emotion: string, note?: string, gratitude?: string) => void;
  disabled?: boolean;
  context?: string;
}

export function WellnessCheckIn({ 
  currentEnergyLevel, 
  onEnergyLevelChange, 
  onEmotionCapture,
  disabled = false,
  context = 'daily'
}: WellnessCheckInProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Wellness Check-In</h3>
        <p className="text-sm text-gray-600">How are you doing right now?</p>
      </div>
      
      <div className="flex gap-4">
        {/* Energy Level - Left Half */}
        <EnergyLevelInput 
          currentLevel={currentEnergyLevel}
          onLevelChange={onEnergyLevelChange}
          disabled={disabled}
          compact={true}
        />
        
        {/* Emotional Wellness - Right Half */}
        <EmotionalWellnessCapture 
          onEmotionCapture={onEmotionCapture}
          context={context}
          disabled={disabled}
        />
      </div>
    </Card>
  );
}