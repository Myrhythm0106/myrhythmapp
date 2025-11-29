import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuidedFirstRecording } from './GuidedFirstRecording';
import { FirstVictoryCelebration } from './FirstVictoryCelebration';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Briefcase, Heart, Users, ArrowRight, Check } from 'lucide-react';
import { PersonaType, getPersonaLanguage } from '@/utils/personaLanguage';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ExtractedAction {
  id: string;
  action_text: string;
  proposed_date?: string;
  proposed_time?: string;
  priority_level?: number;
}

const personaOptions = [
  { id: 'student', label: 'Student', icon: GraduationCap, color: 'from-blue-500 to-indigo-600', description: 'Homework, exams, projects' },
  { id: 'executive', label: 'Professional', icon: Briefcase, color: 'from-slate-600 to-slate-800', description: 'Meetings, deadlines, follow-ups' },
  { id: 'recovery', label: 'Recovery', icon: Heart, color: 'from-rose-400 to-pink-600', description: 'Wellness, appointments, self-care' },
  { id: 'caregiver', label: 'Caregiver', icon: Users, color: 'from-teal-500 to-emerald-600', description: 'Care tasks, appointments, coordination' }
] as const;

type Step = 'persona' | 'question' | 'recording' | 'victory';

export function StreamlinedFirstExperience() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('persona');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [extractedAction, setExtractedAction] = useState<ExtractedAction | null>(null);

  const personaLang = selectedPersona ? getPersonaLanguage(selectedPersona) : null;

  const handlePersonaSelect = async (persona: PersonaType) => {
    setSelectedPersona(persona);
    
    // Save persona to profile
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ persona_mode: persona, user_type: persona })
        .eq('id', user.id);
    }
    
    // Store in localStorage for immediate use
    localStorage.setItem('myrhythm_persona', persona);
    
    setStep('question');
  };

  const handleQuestionAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    localStorage.setItem('myrhythm_quick_answer', answer);
    setStep('recording');
  };

  const handleRecordingComplete = (action: ExtractedAction) => {
    setExtractedAction(action);
    setStep('victory');
  };

  const handleSkipToRecording = () => {
    setStep('recording');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brain-health-50 via-white to-clarity-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Persona Selection */}
          {step === 'persona' && (
            <motion.div
              key="persona"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome to MyRhythm
                </h1>
                <p className="text-muted-foreground text-lg">
                  What best describes you? This helps us speak your language.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {personaOptions.map((persona) => (
                  <motion.div
                    key={persona.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer border-2 hover:border-primary/50 transition-all h-full"
                      onClick={() => handlePersonaSelect(persona.id as PersonaType)}
                    >
                      <CardContent className="p-6 text-center space-y-3">
                        <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center`}>
                          <persona.icon className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{persona.label}</h3>
                          <p className="text-sm text-muted-foreground">{persona.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Takes about 3 minutes to get your first reminder set up
              </p>
            </motion.div>
          )}

          {/* Step 2: Quick Question */}
          {step === 'question' && personaLang && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {personaLang.quickQuestion}
                </h2>
                <p className="text-muted-foreground">
                  This helps us personalize your experience
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {personaLang.quickQuestionOptions.map((option) => (
                  <motion.div
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-auto py-4 px-4 text-left justify-start"
                      onClick={() => handleQuestionAnswer(option)}
                    >
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full"
                onClick={handleSkipToRecording}
              >
                Skip this step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Guided Recording */}
          {step === 'recording' && (
            <motion.div
              key="recording"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GuidedFirstRecording
                persona={selectedPersona || 'general'}
                onActionExtracted={handleRecordingComplete}
              />
            </motion.div>
          )}

          {/* Step 4: Victory Celebration */}
          {step === 'victory' && extractedAction && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <FirstVictoryCelebration
                action={extractedAction}
                persona={selectedPersona || 'general'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {(['persona', 'question', 'recording', 'victory'] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                step === s ? 'w-8 bg-primary' : 
                (['persona', 'question', 'recording', 'victory'] as Step[]).indexOf(step) > i 
                  ? 'w-2 bg-primary/60' 
                  : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
