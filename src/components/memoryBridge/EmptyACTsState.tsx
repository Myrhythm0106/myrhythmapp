import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Target, Clock, User, Lightbulb, RefreshCw, Volume2, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmptyACTsStateProps {
  onRefresh?: () => void;
  onStartRecording?: () => void;
  isLoading?: boolean;
}

const SAMPLE_PATTERNS = [
  {
    type: 'action',
    good: "Action: I will call Dr. Smith by Friday at 2pm to schedule my follow-up appointment",
    bad: "We should probably call the doctor sometime",
    icon: Target,
    color: 'text-green-600'
  },
  {
    type: 'decision', 
    good: "Decision: We decided to switch to the new medication because the current one isn't working",
    bad: "Maybe we'll try something different",
    icon: CheckCircle2,
    color: 'text-blue-600'
  },
  {
    type: 'issue',
    good: "Issue: The medication causes nausea every morning - high priority, need alternative",
    bad: "The medication doesn't feel right",
    icon: Lightbulb,
    color: 'text-orange-600'
  }
];

export function EmptyACTsState({ onRefresh, onStartRecording, isLoading }: EmptyACTsStateProps) {
  const [selectedPattern, setSelectedPattern] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const currentPattern = SAMPLE_PATTERNS[selectedPattern];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary/50" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-xs font-bold text-orange-600">0</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-primary">No SMART ACTs Found</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your recording didn't contain structured actions, decisions, or issues. 
            Let's help you create better content for extraction.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onStartRecording}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary"
            >
              <Mic className="h-4 w-4" />
              Try Recording Again
            </Button>
            <Button 
              onClick={onRefresh}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Results
            </Button>
            <Button 
              onClick={() => setShowGuide(!showGuide)}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Voice Guide
            </Button>
          </div>

          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Interactive Pattern Selector */}
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-blue-900">
                        Learn the SMART Pattern
                      </h4>
                      <div className="flex gap-1">
                        {SAMPLE_PATTERNS.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedPattern(index)}
                            className={`w-2 h-2 rounded-full ${
                              selectedPattern === index ? 'bg-blue-600' : 'bg-blue-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <currentPattern.icon className={`h-4 w-4 ${currentPattern.color}`} />
                        <Badge variant="outline" className="text-xs">
                          {currentPattern.type.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-semibold text-green-800">GOOD EXAMPLE</span>
                          </div>
                          <p className="text-sm text-green-700">{currentPattern.good}</p>
                        </div>

                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-red-800">AVOID</span>
                          </div>
                          <p className="text-sm text-red-700">{currentPattern.bad}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SMART Criteria Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { letter: 'S', word: 'Specific', tip: 'Use clear action words', icon: Target },
                    { letter: 'M', word: 'Measurable', tip: 'Include quantity/outcome', icon: CheckCircle2 },
                    { letter: 'A', word: 'Assignable', tip: 'Name who will do it', icon: User },
                    { letter: 'R', word: 'Relevant', tip: 'Explain why it matters', icon: Lightbulb },
                    { letter: 'T', word: 'Time-bound', tip: 'Set a deadline/timeframe', icon: Clock }
                  ].map((item) => (
                    <Card key={item.letter} className="bg-white/80 border border-primary/20">
                      <CardContent className="p-3 text-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground mx-auto mb-2 flex items-center justify-center">
                          <span className="text-sm font-bold">{item.letter}</span>
                        </div>
                        <h5 className="font-semibold text-xs text-primary mb-1">{item.word}</h5>
                        <p className="text-xs text-muted-foreground">{item.tip}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Tips */}
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm text-amber-900 mb-2">
                      💡 Pro Tips for Better Extraction
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-800">
                      <li>• Start with "Action:", "Decision:", or "Issue:"</li>
                      <li>• Use names: "John will..." instead of "someone will..."</li>
                      <li>• Include specific times: "by Friday at 3pm"</li>
                      <li>• Explain the impact: "...because it's important for..."</li>
                      <li>• Speak clearly and pause between different items</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}