import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Users, UserCheck, Briefcase } from 'lucide-react';

interface Step1WelcomeSeeMeProps {
  onComplete: (persona: string, primaryCondition: string, challenges: string[], additionalInfo: string) => void;
  variant?: 'default' | 'mvp';
}

const personas = [
  { id: 'me', label: 'Me', icon: Heart, color: 'bg-memory-emerald-100 hover:bg-memory-emerald-200 text-memory-emerald-700' },
  { id: 'loved-one', label: 'Loved one', icon: Users, color: 'bg-brain-health-100 hover:bg-brain-health-200 text-brain-health-700' },
  { id: 'patient', label: 'Patient', icon: UserCheck, color: 'bg-clarity-teal-100 hover:bg-clarity-teal-200 text-clarity-teal-700' },
  { id: 'colleague', label: 'Colleague', icon: Briefcase, color: 'bg-sunrise-amber-100 hover:bg-sunrise-amber-200 text-sunrise-amber-700' }
];

const primaryConditions = [
  'Brain injury recovery',
  'Long COVID',
  'ADHD support',
  'General cognitive wellness',
  'Professional/Rehab center'
];

const challenges = [
  'Memory challenges',
  'Focus & concentration',
  'Mental fatigue', 
  'Emotional balance',
  'Sleep difficulties',
  'Caregiver stress',
  'Daily routine management',
  'Social reconnection'
];

export function Step1WelcomeSeeMe({ onComplete, variant = 'default' }: Step1WelcomeSeeMeProps) {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition);
    
    // Auto-select "Memory challenges" if "Brain injury recovery" is selected
    if (condition === 'Brain injury recovery' && !selectedChallenges.includes('Memory challenges')) {
      setSelectedChallenges(prev => [...prev, 'Memory challenges']);
    }
  };

  const toggleChallenge = (challenge: string) => {
    setSelectedChallenges(prev => 
      prev.includes(challenge) 
        ? prev.filter(c => c !== challenge)
        : [...prev, challenge]
    );
  };

  const handleContinue = () => {
    if (selectedPersona && selectedCondition && selectedChallenges.length > 0) {
      onComplete(selectedPersona, selectedCondition, selectedChallenges, additionalInfo);
    }
  };

  const canContinue = selectedPersona && selectedCondition && selectedChallenges.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-brain-health-900">
          Welcome, let's see you
        </h1>
        <p className="text-xl text-brain-health-700 max-w-2xl mx-auto">
          Help us understand your journey so we can support you in the best way possible.
        </p>
      </div>

      <Card className={`border-0 shadow-xl ${variant === 'mvp' ? 'bg-gradient-to-br from-white to-brain-health-50/50 border-brain-health-200/50' : 'bg-white'}`}>
        <CardContent className="p-8 space-y-8">
          {/* Who are you here for? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brain-health-900">
              Who are you here for?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {personas.map((persona) => {
                const IconComponent = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(persona.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                      selectedPersona === persona.id
                        ? `${persona.color} border-current`
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <IconComponent className="h-6 w-6" />
                    <span className="font-medium">{persona.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary condition */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brain-health-900">
              What's your primary situation?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {primaryConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => handleConditionSelect(condition)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-sm font-medium text-left ${
                    selectedCondition === condition
                      ? 'bg-brain-health-100 border-brain-health-300 text-brain-health-700'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brain-health-900">
              What challenges are you facing? <span className="text-sm text-gray-500 font-normal">(select all that apply)</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {challenges.map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => toggleChallenge(challenge)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedChallenges.includes(challenge)
                      ? 'bg-memory-emerald-100 border-memory-emerald-300 text-memory-emerald-700'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
            {selectedChallenges.length > 0 && (
              <p className="text-sm text-brain-health-600">
                Selected challenges: {selectedChallenges.join(', ')}
              </p>
            )}
          </div>

          {/* Additional info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-brain-health-900">
              Anything else we should know? <span className="text-sm text-gray-500 font-normal">(optional)</span>
            </h3>
            <Textarea
              placeholder="Share anything that would help us support you better..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col items-center space-y-4 pt-4">
            <Button
              onClick={() => window.location.href = '/subscribe'}
              size="lg"
              className={`px-8 py-3 text-lg font-semibold ${variant === 'mvp' ? 'bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white' : ''}`}
            >
              Choose Plan
            </Button>
            
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              variant="ghost"
              size="sm"
              className="text-brain-health-600 hover:text-brain-health-700 underline"
            >
              Show me how MyRhythm will support me
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}