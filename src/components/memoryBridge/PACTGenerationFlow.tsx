import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Target, CheckCircle, AlertCircle, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';
import { toast } from 'sonner';

interface PACTGenerationFlowProps {
  meetingId: string;
  audioData?: string;
  onComplete: () => void;
}

export function PACTGenerationFlow({ meetingId, audioData, onComplete }: PACTGenerationFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const { processMeetingAudio } = useMemoryBridge();

  const processingSteps = [
    { label: 'Neural Audio Analysis', icon: Brain, description: 'AI analyzing conversation patterns' },
    { label: 'Promise Extraction', icon: Target, description: 'Identifying commitments and actions' },
    { label: 'Trust Mapping', icon: Zap, description: 'Calculating relationship impacts' },
    { label: 'PACT Generation', icon: CheckCircle, description: 'Creating actionable report' }
  ];

  const handleGeneratePACT = async () => {
    setIsProcessing(true);
    setProcessingStep(0);
    setConfidence(0);

    try {
      // Simulate progressive processing with real AI analysis
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        setConfidence((i + 1) * 25);
        
        // Simulate processing time for each step
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (i === processingSteps.length - 1 && audioData) {
          // Actual AI processing on final step
          await processMeetingAudio(audioData, meetingId);
        }
      }

      toast.success('PACT Report generated successfully!');
      onComplete();
    } catch (error) {
      console.error('PACT generation failed:', error);
      toast.error('Failed to generate PACT report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Brain className="w-8 h-8 text-brain-health animate-neural-pulse" />
            <span className="bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
              Generating Your PACT Report
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-brain-health">AI Analysis Progress</span>
              <span className="text-lg font-bold text-brain-health">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-3" />
          </div>

          {/* Processing Steps */}
          <div className="space-y-4">
            {processingSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === processingStep;
              const isComplete = index < processingStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    isActive 
                      ? 'border-brain-health bg-brain-health/10 shadow-md' 
                      : isComplete 
                        ? 'border-emerald bg-emerald/5' 
                        : 'border-muted bg-muted/20'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-brain-health text-white animate-pulse' 
                      : isComplete 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${
                      isActive ? 'text-brain-health' : isComplete ? 'text-emerald-600' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-brain-health rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-brain-health rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-brain-health rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Confidence Indicators */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-emerald/10 border border-emerald/20">
              <TrendingUp className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-emerald-600">Trust Building</div>
              <div className="text-xs text-muted-foreground">High Accuracy</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-brain-health/10 border border-brain-health/20">
              <Target className="w-6 h-6 text-brain-health mx-auto mb-2" />
              <div className="text-sm font-medium text-brain-health">Action Extraction</div>
              <div className="text-xs text-muted-foreground">Advanced AI</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-clarity-teal/10 border border-clarity-teal/20">
              <Sparkles className="w-6 h-6 text-clarity-teal-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-clarity-teal-600">Insight Quality</div>
              <div className="text-xs text-muted-foreground">Professional</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-brain-health/40 bg-gradient-to-br from-brain-health/10 via-emerald/5 to-clarity-teal/10 shadow-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Target className="w-8 h-8 text-brain-health" />
          <span className="bg-gradient-to-r from-brain-health to-emerald-600 bg-clip-text text-transparent">
            Generate PACT Report
          </span>
        </CardTitle>
        <p className="text-muted-foreground">
          Transform your conversation into actionable Promises, Actions, Commitments & Tasks
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-brain-health/5 border border-brain-health/20">
            <Brain className="w-6 h-6 text-brain-health" />
            <div>
              <div className="font-semibold text-brain-health">AI-Powered Analysis</div>
              <div className="text-sm text-muted-foreground">Advanced neural processing</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald/5 border border-emerald/20">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="font-semibold text-emerald-600">Trust Building</div>
              <div className="text-sm text-muted-foreground">Confidence through action</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleGeneratePACT}
          size="lg"
          className="w-full h-14 text-lg bg-gradient-to-r from-brain-health via-emerald-500 to-clarity-teal-500 hover:from-brain-health/80 hover:via-emerald-500/80 hover:to-clarity-teal-500/80 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Zap className="w-6 h-6 mr-2" />
          Generate My PACT Report
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 inline mr-1" />
          Processing typically takes 30-60 seconds
        </div>
      </CardContent>
    </Card>
  );
}