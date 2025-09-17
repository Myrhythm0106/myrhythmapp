import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Target, 
  Heart, 
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Lock
} from 'lucide-react';

interface CognitiveImpactVisualizationProps {
  cognitiveImpact: {
    memoryRetention: number;
    processingSpeed: number;
    attentionSpan: number;
    executiveFunction: number;
    emotionalRegulation: number;
  };
  isPaid: boolean;
}

export function CognitiveImpactVisualization({ cognitiveImpact, isPaid }: CognitiveImpactVisualizationProps) {
  const cognitiveAreas = [
    {
      key: 'memoryRetention',
      label: 'Memory Retention',
      icon: Brain,
      score: cognitiveImpact.memoryRetention,
      description: 'Ability to encode, store, and retrieve information',
      impact: cognitiveImpact.memoryRetention >= 70 ? 'Strong foundation for learning' : 
              cognitiveImpact.memoryRetention >= 50 ? 'Moderate challenges with recall' : 
              'Significant memory difficulties affecting daily function'
    },
    {
      key: 'processingSpeed',
      label: 'Processing Speed',
      icon: Zap,
      score: cognitiveImpact.processingSpeed,
      description: 'Speed of cognitive processing and mental agility',
      impact: cognitiveImpact.processingSpeed >= 70 ? 'Quick mental processing' : 
              cognitiveImpact.processingSpeed >= 50 ? 'Slower information processing' : 
              'Significant delays in cognitive processing'
    },
    {
      key: 'attentionSpan',
      label: 'Attention & Focus',
      icon: Target,
      score: cognitiveImpact.attentionSpan,
      description: 'Sustained attention and concentration abilities',
      impact: cognitiveImpact.attentionSpan >= 70 ? 'Excellent focus capacity' : 
              cognitiveImpact.attentionSpan >= 50 ? 'Moderate attention difficulties' : 
              'Severe attention and concentration challenges'
    },
    {
      key: 'executiveFunction',
      label: 'Executive Function',
      icon: Settings,
      score: cognitiveImpact.executiveFunction,
      description: 'Planning, organization, and decision-making skills',
      impact: cognitiveImpact.executiveFunction >= 70 ? 'Strong planning and organization' : 
              cognitiveImpact.executiveFunction >= 50 ? 'Mild executive challenges' : 
              'Significant difficulties with planning and organization'
    },
    {
      key: 'emotionalRegulation',
      label: 'Emotional Regulation',
      icon: Heart,
      score: cognitiveImpact.emotionalRegulation,
      description: 'Managing emotions and stress responses',
      impact: cognitiveImpact.emotionalRegulation >= 70 ? 'Well-regulated emotional responses' : 
              cognitiveImpact.emotionalRegulation >= 50 ? 'Moderate emotional volatility' : 
              'Significant emotional regulation challenges'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <CheckCircle className="h-4 w-4" />;
    if (score >= 40) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getImprovementPotential = (score: number) => {
    if (score >= 80) return { label: 'Maintain', potential: '5-10%', timeframe: '3 months' };
    if (score >= 60) return { label: 'Good', potential: '15-25%', timeframe: '2-3 months' };
    if (score >= 40) return { label: 'Significant', potential: '25-40%', timeframe: '3-6 months' };
    return { label: 'Excellent', potential: '40-60%', timeframe: '6-12 months' };
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-2 border-brain-health-200/60">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-brain-health-500" />
            Cognitive Impact Analysis
          </CardTitle>
          <p className="text-sm text-brain-health-600">
            Detailed breakdown of how brain injury has affected your cognitive abilities
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cognitiveAreas.slice(0, isPaid ? cognitiveAreas.length : 3).map((area) => {
              const Icon = area.icon;
              const improvement = getImprovementPotential(area.score);
              
              return (
                <div key={area.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-brain-health-500" />
                      <span className="font-medium text-brain-health-700">{area.label}</span>
                    </div>
                    <Badge className={`${getScoreColor(area.score)} flex items-center space-x-1`}>
                      {getScoreIcon(area.score)}
                      <span>{area.score}%</span>
                    </Badge>
                  </div>
                  
                  <Progress value={area.score} className="h-2" />
                  
                  <div className="space-y-2">
                    <p className="text-xs text-brain-health-600">{area.description}</p>
                    <p className="text-sm font-medium text-brain-health-700">{area.impact}</p>
                    
                    {isPaid && (
                      <div className="p-2 bg-clarity-teal-50 rounded border border-clarity-teal-200">
                        <div className="flex items-center space-x-2 text-xs">
                          <TrendingUp className="h-3 w-3 text-clarity-teal-600" />
                          <span className="font-medium text-clarity-teal-700">
                            {improvement.potential} improvement potential
                          </span>
                        </div>
                        <p className="text-xs text-clarity-teal-600 mt-1">
                          Estimated timeframe: {improvement.timeframe}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {!isPaid && cognitiveAreas.length > 3 && (
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-brain-health-200 rounded-lg bg-brain-health-50/30">
                <Lock className="h-8 w-8 text-brain-health-400 mb-2" />
                <p className="text-sm font-medium text-brain-health-600 text-center mb-2">
                  {cognitiveAreas.length - 3} More Areas
                </p>
                <p className="text-xs text-brain-health-500 text-center">
                  Unlock complete cognitive analysis
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Interpretation */}
      {isPaid && (
        <Card className="border border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/50 to-brain-health-50/50">
          <CardHeader>
            <CardTitle className="text-clarity-teal-700 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Clinical Interpretation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-clarity-teal-700 mb-2">Primary Concerns</h4>
                <ul className="space-y-1 text-sm text-clarity-teal-600">
                  {cognitiveAreas
                    .filter(area => area.score < 50)
                    .map(area => (
                      <li key={area.key} className="flex items-center space-x-2">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        <span>{area.label} - Requires intervention</span>
                      </li>
                    ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-clarity-teal-700 mb-2">Strengths to Leverage</h4>
                <ul className="space-y-1 text-sm text-clarity-teal-600">
                  {cognitiveAreas
                    .filter(area => area.score >= 60)
                    .map(area => (
                      <li key={area.key} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{area.label} - Build upon this strength</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            
            <div className="p-3 bg-white/70 rounded border border-clarity-teal-200">
              <p className="text-sm text-clarity-teal-700 font-medium mb-1">
                🏥 Share with Medical Team
              </p>
              <p className="text-xs text-clarity-teal-600">
                This analysis can be shared with your healthcare providers to inform treatment planning and track recovery progress.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}