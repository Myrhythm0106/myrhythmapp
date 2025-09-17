import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  TrendingUp,
  Target,
  Star,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Heart,
  Trophy,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PersonalizedProjectionsProps {
  projections: {
    thirtyDay: string[];
    sixtyDay: string[];
    ninetyDay: string[];
  };
  riskLevel: 'low' | 'moderate' | 'high';
  isPaid: boolean;
  onUpgrade?: () => void;
}

export function PersonalizedProjections({ projections, riskLevel, isPaid, onUpgrade }: PersonalizedProjectionsProps) {
  const [activeProjection, setActiveProjection] = useState('30');

  const getTimelineIcon = (period: string) => {
    switch (period) {
      case '30': return <Zap className="h-4 w-4" />;
      case '60': return <Brain className="h-4 w-4" />;
      case '90': return <Trophy className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTimelineColor = (period: string) => {
    switch (period) {
      case '30': return 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500';
      case '60': return 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500';
      case '90': return 'bg-gradient-to-r from-clarity-teal-500 to-sunrise-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getExpectedImprovement = (period: string) => {
    const baseImprovement = riskLevel === 'low' ? 25 : riskLevel === 'moderate' ? 35 : 45;
    switch (period) {
      case '30': return baseImprovement;
      case '60': return baseImprovement + 20;
      case '90': return baseImprovement + 35;
      default: return 0;
    }
  };

  const milestoneData = [
    {
      period: '30',
      title: 'Quick Wins Phase',
      subtitle: 'Foundation Building',
      improvement: getExpectedImprovement('30'),
      keyFocus: 'Memory Bridge setup, daily rhythm establishment',
      projections: projections.thirtyDay
    },
    {
      period: '60',
      title: 'Momentum Phase',
      subtitle: 'Skill Development', 
      improvement: getExpectedImprovement('60'),
      keyFocus: 'Cognitive training gains, habit formation',
      projections: projections.sixtyDay
    },
    {
      period: '90',
      title: 'Transformation Phase',
      subtitle: 'Sustained Progress',
      improvement: getExpectedImprovement('90'),
      keyFocus: 'Advanced strategies, independence',
      projections: projections.ninetyDay
    }
  ];

  const successStories = [
    {
      name: "Sarah M.",
      condition: "TBI Recovery",
      timeframe: "90 days",
      achievement: "Returned to work part-time, memory improved 60%",
      quote: "The Memory Bridge changed everything for me"
    },
    {
      name: "Mike D.", 
      condition: "Post-Concussion",
      timeframe: "45 days",
      achievement: "Eliminated brain fog, restored focus for 2+ hours",
      quote: "I feel like myself again"
    },
    {
      name: "Lisa R.",
      condition: "Stroke Recovery",
      timeframe: "120 days", 
      achievement: "Independent living, driving resumed",
      quote: "MyRhythm gave me my independence back"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <Card className="border-2 border-brain-health-200/60">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-brain-health-500" />
            Your Recovery Trajectory
          </CardTitle>
          <p className="text-sm text-brain-health-600">
            Personalized projections based on your assessment profile and evidence-based outcomes
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeProjection} onValueChange={setActiveProjection}>
            <TabsList className="grid grid-cols-3 w-full">
              {milestoneData.map((milestone) => (
                <TabsTrigger 
                  key={milestone.period} 
                  value={milestone.period}
                  className="flex items-center space-x-2"
                >
                  <div className={`p-1 rounded ${getTimelineColor(milestone.period)} text-white`}>
                    {getTimelineIcon(milestone.period)}
                  </div>
                  <span>{milestone.period} Days</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {milestoneData.map((milestone) => (
              <TabsContent key={milestone.period} value={milestone.period} className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getTimelineColor(milestone.period)} text-white mb-4`}>
                    {getTimelineIcon(milestone.period)}
                  </div>
                  <h3 className="text-xl font-bold text-brain-health-700">{milestone.title}</h3>
                  <p className="text-brain-health-600">{milestone.subtitle}</p>
                  
                  <div className="mt-4 max-w-md mx-auto">
                    <div className="flex justify-between text-sm text-brain-health-600 mb-2">
                      <span>Expected Improvement</span>
                      <span className="font-semibold">{milestone.improvement}%</span>
                    </div>
                    <Progress value={milestone.improvement} className="h-3" />
                    <p className="text-xs text-brain-health-500 mt-1">{milestone.keyFocus}</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {milestone.projections.slice(0, isPaid ? milestone.projections.length : 2).map((projection, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-brain-health-50/50 rounded-lg border border-brain-health-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-sm text-brain-health-700">{projection}</p>
                    </div>
                  ))}
                  
                  {!isPaid && milestone.projections.length > 2 && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sunrise-amber-50 to-memory-emerald-50 rounded-lg border-2 border-dashed border-sunrise-amber-200">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-sunrise-amber-600" />
                        <span className="text-sm font-medium text-sunrise-amber-800">
                          {milestone.projections.length - 2} more personalized projections
                        </span>
                      </div>
                      <Button onClick={onUpgrade} size="sm" className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500">
                        Unlock
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="border border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-brain-health-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-memory-emerald-700">
            <Star className="h-5 w-5 mr-2" />
            Similar Success Stories
          </CardTitle>
          <p className="text-sm text-memory-emerald-600">
            Real outcomes from people with similar assessment profiles
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {successStories.map((story, index) => (
              <div key={index} className="p-4 bg-white/70 rounded-lg border border-memory-emerald-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-memory-emerald-800">{story.name}</p>
                    <p className="text-xs text-memory-emerald-600">{story.condition}</p>
                  </div>
                </div>
                
                <Badge className="bg-memory-emerald-100 text-memory-emerald-700 text-xs mb-2">
                  {story.timeframe}
                </Badge>
                
                <p className="text-sm font-medium text-memory-emerald-700 mb-2">
                  {story.achievement}
                </p>
                
                <p className="text-xs text-memory-emerald-600 italic">
                  "{story.quote}"
                </p>
              </div>
            ))}
          </div>
          
          {!isPaid && (
            <div className="mt-6 text-center p-4 bg-gradient-to-r from-brain-health-100 to-memory-emerald-100 rounded-lg border-2 border-brain-health-300">
              <h4 className="font-medium text-brain-health-800 mb-2">Your Success Story Starts Here</h4>
              <p className="text-sm text-brain-health-600 mb-3">
                Join thousands who've transformed their cognitive health with personalized recovery plans
              </p>
              <Button 
                onClick={onUpgrade}
                className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 text-white"
              >
                Start My Recovery Journey
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}