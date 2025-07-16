import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { GrowthMindsetMessage } from '@/components/shared/GrowthMindsetMessage';
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
  const [showEncouragement, setShowEncouragement] = useState(true);

  const handleEmotionCapture = (emotion: string, note?: string, gratitude?: string) => {
    onEmotionCapture?.(emotion, note, gratitude);
    // Show celebration message for positive emotions
    const positiveEmotions = ['joyful', 'proud', 'grateful', 'excited', 'calm'];
    if (positiveEmotions.includes(emotion)) {
      setShowEncouragement(true);
    }
  };

  return (
    <div className="space-y-4">
      {showEncouragement && (
        <GrowthMindsetMessage 
          type="encouragement" 
          context={context}
        />
      )}
      
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Wellness Check-In</h3>
          <p className="text-sm text-gray-600">Your self-awareness is building resilience! 💪</p>
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
            onEmotionCapture={handleEmotionCapture}
            context={context}
            disabled={disabled}
          />
        </div>
      </Card>
    </div>
  );
}