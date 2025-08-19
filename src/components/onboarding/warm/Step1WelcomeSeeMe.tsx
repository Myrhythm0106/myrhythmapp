import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Users, UserCheck, Briefcase } from 'lucide-react';

interface Step1WelcomeSeeMeProps {
  onComplete: (persona: string, intent: string, additionalInfo: string) => void;
}

const personas = [
  { id: 'me', label: 'Me', icon: Heart, color: 'bg-memory-emerald-100 hover:bg-memory-emerald-200 text-memory-emerald-700' },
  { id: 'loved-one', label: 'Loved one', icon: Users, color: 'bg-brain-health-100 hover:bg-brain-health-200 text-brain-health-700' },
  { id: 'patient', label: 'Patient', icon: UserCheck, color: 'bg-clarity-teal-100 hover:bg-clarity-teal-200 text-clarity-teal-700' },
  { id: 'colleague', label: 'Colleague', icon: Briefcase, color: 'bg-emotional-balance-100 hover:bg-emotional-balance-200 text-emotional-balance-700' }
];

const intents = [
  'Memory slips',
  'Focus & fatigue', 
  'Brain injury recovery',
  'ADHD support',
  'Long COVID',
  'Emotional balance',
  'Caregiver stress',
  'Cognitive wellness'
];

export function Step1WelcomeSeeMe({ onComplete }: Step1WelcomeSeeMeProps) {
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const handleContinue = () => {
    if (selectedPersona && selectedIntent) {
      onComplete(selectedPersona, selectedIntent, additionalInfo);
    }
  };

  const canContinue = selectedPersona && selectedIntent;

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

      <Card className="border-0 shadow-xl bg-white">
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

          {/* What brought you here? */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-brain-health-900">
              What brought you here?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {intents.map((intent) => (
                <button
                  key={intent}
                  onClick={() => setSelectedIntent(intent)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    selectedIntent === intent
                      ? 'bg-brain-health-100 border-brain-health-300 text-brain-health-700'
                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {intent}
                </button>
              ))}
            </div>
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

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
              size="lg"
              className="px-8 py-3 text-lg font-semibold"
            >
              Show me how MyRhythm will support me
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}