import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CheckInData {
  energy: number;
  stress: number;
  focus: number;
  memoryConfidence: number;
  sleepQuality: number;
}

interface AssessmentPartialResultsProps {
  checkIn: CheckInData;
  onUnlock: () => void;
  onFreeTrial: () => void;
}

export function AssessmentPartialResults({ checkIn, onUnlock, onFreeTrial }: AssessmentPartialResultsProps) {
  // Calculate insights
  const overallScore = Math.round((checkIn.energy + checkIn.stress + checkIn.focus + checkIn.memoryConfidence + checkIn.sleepQuality) / 5);
  
  const metrics = [
    { label: 'Energy', value: checkIn.energy, key: 'energy' },
    { label: 'Stress', value: checkIn.stress, key: 'stress' },
    { label: 'Focus', value: checkIn.focus, key: 'focus' },
    { label: 'Memory', value: checkIn.memoryConfidence, key: 'memory' },
    { label: 'Sleep', value: checkIn.sleepQuality, key: 'sleep' },
  ];
  
  const lowestMetric = metrics.reduce((min, metric) => metric.value < min.value ? metric : min);
  
  const energyPattern = checkIn.energy >= 7 ? 'High Energy' : checkIn.energy >= 4 ? 'Balanced Energy' : 'Low Energy';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-brain-health-600 rounded-lg flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-display-md font-bold text-foreground">
          Assessment Preview
        </h2>
        <p className="text-body-lg text-muted-foreground">
          Here's what we discovered about your current state
        </p>
      </div>

      {/* Overall Score */}
      <Card className="border-brain-health-200 bg-brain-health-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-brain-health-900">{overallScore}</div>
            <p className="text-body text-brain-health-700">Overall Wellness Score</p>
            <Progress value={overallScore * 10} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Preview Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-brain-health-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brain-health-600" />
              Energy Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-brain-health-100 text-brain-health-700 text-base">
              {energyPattern}
            </Badge>
            <p className="text-caption text-muted-foreground mt-2">
              Based on your energy level assessment
            </p>
          </CardContent>
        </Card>

        <Card className="border-brain-health-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-body-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-brain-health-600" />
              Primary Focus Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-brain-health-100 text-brain-health-700 text-base">
              {lowestMetric.label}
            </Badge>
            <p className="text-caption text-muted-foreground mt-2">
              This area scored lowest and needs attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Locked Full Report */}
      <Card className="border-2 border-brain-health-200 bg-white shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Lock className="w-12 h-12 text-brain-health-400 mx-auto" />
            <h3 className="text-title font-bold text-foreground">
              Full Assessment Report
            </h3>
            <p className="text-body text-muted-foreground max-w-xl mx-auto">
              Unlock your complete cognitive wellness analysis with:
            </p>
            <ul className="text-body text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brain-health-400" />
                <span>Detailed energy optimization recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brain-health-400" />
                <span>Personalized daily routines based on your patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brain-health-400" />
                <span>Smart scheduling aligned with your cognitive rhythms</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brain-health-400" />
                <span>Progress tracking and trend analysis</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* CTAs */}
      <div className="space-y-4">
        <Button
          onClick={onUnlock}
          size="lg"
          variant="premium"
          className="w-full"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Unlock Full Report + 7-Day Free Trial
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button
          onClick={onFreeTrial}
          size="lg"
          variant="outline"
          className="w-full"
        >
          Start Free (Limited Features)
        </Button>

        <div className="text-center">
          <p className="text-caption text-muted-foreground">
            7-day free trial • Cancel anytime • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}