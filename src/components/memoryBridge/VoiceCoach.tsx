import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Mic, Users, Calendar, AlertTriangle, Lightbulb, Target, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCoachProps {
  isRecording: boolean;
  transcript: string;
  onInsertPhrase: (phrase: string) => void;
}

const SMART_INDICATORS = [
  { key: 'specific', label: 'Specific', icon: Target, check: (text: string) => 
    /\b(action|task|call|email|schedule|meet|send|complete|finish|review|update|prepare|organize|plan)\b/i.test(text) },
  { key: 'measurable', label: 'Measurable', icon: CheckCircle2, check: (text: string) => 
    /\b(by|until|before|after|in|within|every|daily|weekly|monthly|once|twice|three times)\b/i.test(text) },
  { key: 'assignable', label: 'Assignable', icon: User, check: (text: string) => 
    /\b(I will|you will|they will|he will|she will|we will|Sam|John|Mary|team|myself|I'll|you'll)\b/i.test(text) },
  { key: 'relevant', label: 'Relevant', icon: Lightbulb, check: (text: string) => 
    /\b(because|since|so that|to|for|important|critical|urgent|priority|needed|required)\b/i.test(text) },
  { key: 'timebound', label: 'Time-bound', icon: Clock, check: (text: string) => 
    /\b(today|tomorrow|next week|friday|monday|january|february|9am|3pm|by the end|deadline|due)\b/i.test(text) }
];

const QUICK_PHRASES = {
  actions: [
    "Action: I will call the doctor by Friday at 2pm because my health is important",
    "Action: Sam will send the report to the team by next Tuesday for the meeting",
    "Action: I'll schedule a family dinner this weekend to reconnect with everyone"
  ],
  decisions: [
    "Decision: We decided to move forward with the new treatment plan because the benefits outweigh the risks",
    "Decision: I've chosen to prioritize my health appointments over work meetings going forward",
    "Decision: The family agreed to have weekly check-ins to stay connected"
  ],
  issues: [
    "Issue: The medication side effects are getting worse - high priority, need immediate attention",
    "Issue: Communication with the care team is unclear - medium priority, affecting coordination",
    "Issue: Transportation to appointments is challenging - need to find solutions"
  ]
};

export function VoiceCoach({ isRecording, transcript, onInsertPhrase }: VoiceCoachProps) {
  const [currentType, setCurrentType] = useState<'actions' | 'decisions' | 'issues'>('actions');
  const [showExamples, setShowExamples] = useState(false);
  
  const smartChecks = SMART_INDICATORS.map(indicator => ({
    ...indicator,
    passed: indicator.check(transcript)
  }));

  const smartScore = smartChecks.filter(check => check.passed).length;
  const isGoodQuality = smartScore >= 3;

  return (
    <div className="space-y-4">
      {/* Live SMART Feedback */}
      <Card className={`transition-all duration-300 ${
        isRecording 
          ? 'border-primary bg-gradient-to-r from-primary/10 to-secondary/10' 
          : 'border-muted bg-muted/30'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mic className={`h-4 w-4 ${isRecording ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
              <span className="font-medium text-sm">Voice Coach</span>
            </div>
            <Badge variant={isGoodQuality ? 'default' : 'secondary'} className="text-xs">
              SMART Score: {smartScore}/5
            </Badge>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-3">
            {smartChecks.map((check) => (
              <div key={check.key} className="text-center">
                <div className={`rounded-full p-2 mx-auto w-8 h-8 flex items-center justify-center ${
                  check.passed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {check.passed ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                </div>
                <span className="text-xs font-medium">{check.label}</span>
              </div>
            ))}
          </div>

          {transcript && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 max-h-20 overflow-y-auto">
              {transcript.slice(-150)}...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Insert Chips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-sm">Quick Insert</span>
            <div className="flex gap-1">
              {(['actions', 'decisions', 'issues'] as const).map((type) => (
                <Button
                  key={type}
                  variant={currentType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentType(type)}
                  className="text-xs px-2 py-1 h-6"
                >
                  {type === 'actions' && <Target className="h-3 w-3 mr-1" />}
                  {type === 'decisions' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {type === 'issues' && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_PHRASES[currentType].slice(0, 2).map((phrase, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => onInsertPhrase(phrase)}
                className="text-xs px-2 py-1 h-auto whitespace-normal text-left border border-dashed border-primary/30 hover:border-primary/60"
              >
                {phrase.split(':')[0]}:{' '}
                <span className="text-muted-foreground">
                  {phrase.split(':')[1].slice(0, 30)}...
                </span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs px-2 py-1 h-6"
            >
              {showExamples ? 'Hide' : 'More'} Examples
            </Button>
          </div>

          <AnimatePresence>
            {showExamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {QUICK_PHRASES[currentType].map((phrase, index) => (
                  <div
                    key={index}
                    className="text-xs p-2 bg-muted/30 rounded border border-dashed cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onInsertPhrase(phrase)}
                  >
                    <div className="font-medium text-primary">
                      {phrase.split(':')[0]}:
                    </div>
                    <div className="text-muted-foreground mt-1">
                      {phrase.split(':')[1]}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Live Guidance */}
      {isRecording && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-3">
            <div className="text-xs space-y-1">
              {smartScore < 2 && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Try: "Action: I will [specific task] by [when] because [why]"</span>
                </div>
              )}
              {smartScore >= 2 && smartScore < 4 && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Lightbulb className="h-3 w-3" />
                  <span>Great! Add timeframe and context for maximum clarity</span>
                </div>
              )}
              {smartScore >= 4 && (
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Perfect! This creates a SMART ACT ✨</span>
                </div>
              )}
              {isRecording && transcript.length > 50 && (
                <div className="mt-2 text-blue-600 text-xs">
                  <span>💡 AI is actively extracting ACTs from your speech patterns</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}