
import React from 'react';
import { Card } from '@/components/ui/card';
import { EnergyLevel } from '../types/calendarTypes';

interface EnergyLevelInputProps {
  currentLevel?: EnergyLevel;
  onLevelChange: (level: EnergyLevel) => void;
  disabled?: boolean;
}

const energyEmojis = {
  1: '😴',
  2: '😑',
  3: '😊',
  4: '😄',
  5: '🚀'
};

const energyLabels = {
  1: 'Very Low',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Great'
};

const energyColors = {
  1: 'bg-red-100 border-red-300',
  2: 'bg-orange-100 border-orange-300',
  3: 'bg-yellow-100 border-yellow-300',
  4: 'bg-green-100 border-green-300',
  5: 'bg-blue-100 border-blue-300'
};

export function EnergyLevelInput({ currentLevel, onLevelChange, disabled = false }: EnergyLevelInputProps) {
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="text-center mb-3">
        <h3 className="text-lg font-medium text-gray-800">My Energy Level</h3>
        <p className="text-sm text-gray-600">How are you feeling right now?</p>
      </div>
      
      <div className="flex justify-center gap-2">
        {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => (
          <button
            key={level}
            onClick={() => !disabled && onLevelChange(level)}
            disabled={disabled}
            className={`
              p-3 rounded-xl border-2 transition-all duration-200 min-w-[60px]
              ${currentLevel === level 
                ? `${energyColors[level]} scale-110 shadow-md` 
                : 'bg-white border-gray-200 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
          >
            <div className="text-2xl mb-1">{energyEmojis[level]}</div>
            <div className="text-xs font-medium text-gray-700">
              {energyLabels[level]}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
