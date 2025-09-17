import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Download, 
  Share2, 
  TrendingUp, 
  Clock, 
  Target,
  Users,
  FileText,
  Heart,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { generatePDFReport } from '@/utils/reportGeneration';
import { ShareWithCareTeam } from './ShareWithCareTeam';
import { CognitiveImpactVisualization } from './CognitiveImpactVisualization';
import { PersonalizedProjections } from './PersonalizedProjections';

interface EnhancedAssessmentResultsProps {
  assessmentResult: {
    overallScore: number;
    categoryScores: Record<string, number>;
    recommendations: string[];
    riskLevel: 'low' | 'moderate' | 'high';
    primaryRhythm: string;
    lockedInsights: string[];
    cognitiveImpact: {
      memoryRetention: number;
      processingSpeed: number;
      attentionSpan: number;
      executiveFunction: number;
      emotionalRegulation: number;
    };
    recoveryProjections: {
      thirtyDay: string[];
      sixtyDay: string[];
      ninetyDay: string[];
    };
    optimalTimes: {
      bestFocusTime: string;
      preferredMeetingTime: string;
      sustainedAttentionTime: string;
    };
  };
  userType?: string;
  onUpgrade?: () => void;
  onShareWithCareTeam?: (data: any) => void;
  isPaid?: boolean;
}

export function EnhancedAssessmentResults({ 
  assessmentResult, 
  userType, 
  onUpgrade, 
  onShareWithCareTeam,
  isPaid = false 
}: EnhancedAssessmentResultsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleGeneratePDFReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generatePDFReport({
        assessmentResult,
        userType: userType || 'individual',
        includeClinicalNotes: isPaid,
        includeProjections: isPaid
      });
      toast.success('Medical report generated and downloaded');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const getCognitiveImpactColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <Card className="border-2 border-brain-health-200/60 bg-gradient-to-r from-brain-health-50 to-clarity-teal-50">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
              <Brain className="h-4 w-4 mr-2" />
              Cognitive Wellness Assessment Complete
            </Badge>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`p-4 rounded-full mx-auto mb-3 w-20 h-20 flex items-center justify-center ${
                  assessmentResult.riskLevel === 'low' ? 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500' :
                  assessmentResult.riskLevel === 'moderate' ? 'bg-gradient-to-r from-sunrise-amber-500 to-clarity-teal-500' :
                  'bg-gradient-to-r from-orange-500 to-red-500'
                } text-white`}>
                  <span className="text-2xl font-bold">{assessmentResult.overallScore}</span>
                </div>
                <p className="text-sm font-medium text-brain-health-700">Overall Wellness Score</p>
                <p className="text-xs text-brain-health-600 mt-1">{assessmentResult.primaryRhythm}</p>
              </div>

              {/* Recovery Potential */}
              <div className="text-center">
                <div className="p-4 rounded-full mx-auto mb-3 w-20 h-20 flex items-center justify-center bg-gradient-to-r from-clarity-teal-500 to-memory-emerald-500 text-white">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-brain-health-700">Recovery Potential</p>
                <p className="text-xs text-brain-health-600 mt-1">
                  {assessmentResult.riskLevel === 'low' ? 'Excellent' :
                   assessmentResult.riskLevel === 'moderate' ? 'Good' : 'Significant'}
                </p>
              </div>

              {/* Optimal Focus Time */}
              <div className="text-center">
                <div className="p-4 rounded-full mx-auto mb-3 w-20 h-20 flex items-center justify-center bg-gradient-to-r from-sunrise-amber-500 to-brain-health-500 text-white">
                  <Clock className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-brain-health-700">Peak Focus Window</p>
                <p className="text-xs text-brain-health-600 mt-1">{assessmentResult.optimalTimes.bestFocusTime}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              onClick={handleGeneratePDFReport}
              disabled={isGeneratingReport}
              className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingReport ? 'Generating...' : 'Medical Report'}
            </Button>
            
            <Button 
              onClick={() => setShowShareDialog(true)}
              variant="outline"
              className="border-brain-health-200"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share with Care Team
            </Button>

            {!isPaid && (
              <Button 
                onClick={onUpgrade}
                className="bg-gradient-to-r from-memory-emerald-500 to-sunrise-amber-500 text-white"
              >
                <Star className="h-4 w-4 mr-2" />
                Unlock Full Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Impact</TabsTrigger>
          <TabsTrigger value="projections">Recovery Path</TabsTrigger>
          <TabsTrigger value="scheduling">Optimal Timing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-brain-health-500" />
                Personalized Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentResult.recommendations.slice(0, isPaid ? assessmentResult.recommendations.length : 3).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-brain-health-50/50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-brain-health-700">{rec}</p>
                </div>
              ))}
              
              {!isPaid && (
                <div className="p-4 bg-gradient-to-r from-sunrise-amber-50 to-memory-emerald-50 rounded-lg border-2 border-dashed border-sunrise-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sunrise-amber-800">Unlock {assessmentResult.lockedInsights.length} Additional Insights</p>
                      <p className="text-sm text-sunrise-amber-600">Get your complete cognitive recovery roadmap</p>
                    </div>
                    <Button onClick={onUpgrade} size="sm" className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500">
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-4">
          <CognitiveImpactVisualization 
            cognitiveImpact={assessmentResult.cognitiveImpact}
            isPaid={isPaid}
          />
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <PersonalizedProjections 
            projections={assessmentResult.recoveryProjections}
            riskLevel={assessmentResult.riskLevel}
            isPaid={isPaid}
            onUpgrade={onUpgrade}
          />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-brain-health-500" />
                Your Optimal Cognitive Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-brain-health-50 to-clarity-teal-50 rounded-lg border border-brain-health-200">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-brain-health-500 mr-2" />
                    <h4 className="font-medium text-brain-health-700">Peak Focus</h4>
                  </div>
                  <p className="text-2xl font-bold text-brain-health-600">{assessmentResult.optimalTimes.bestFocusTime}</p>
                  <p className="text-sm text-brain-health-600">Schedule demanding tasks here</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-memory-emerald-50 to-brain-health-50 rounded-lg border border-memory-emerald-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 text-memory-emerald-500 mr-2" />
                    <h4 className="font-medium text-memory-emerald-700">Best Meetings</h4>
                  </div>
                  <p className="text-2xl font-bold text-memory-emerald-600">{assessmentResult.optimalTimes.preferredMeetingTime}</p>
                  <p className="text-sm text-memory-emerald-600">Ideal for important conversations</p>
                </div>

                <div className="p-4 bg-gradient-to-br from-sunrise-amber-50 to-clarity-teal-50 rounded-lg border border-sunrise-amber-200">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-sunrise-amber-500 mr-2" />
                    <h4 className="font-medium text-sunrise-amber-700">Sustained Focus</h4>
                  </div>
                  <p className="text-2xl font-bold text-sunrise-amber-600">{assessmentResult.optimalTimes.sustainedAttentionTime}</p>
                  <p className="text-sm text-sunrise-amber-600">30+ minute focus blocks</p>
                </div>
              </div>

              <div className="p-4 bg-brain-health-50/50 rounded-lg border border-brain-health-200">
                <h4 className="font-medium text-brain-health-700 mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Personalized Scheduling Tips
                </h4>
                <ul className="space-y-2 text-sm text-brain-health-600">
                  <li>• Schedule Memory Bridge sessions during your peak focus window</li>
                  <li>• Plan important meetings during your preferred meeting time</li>
                  <li>• Use sustained attention periods for cognitive training exercises</li>
                  <li>• Build in recovery breaks between demanding cognitive tasks</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareWithCareTeam 
          assessmentData={assessmentResult}
          userType={userType}
          onClose={() => setShowShareDialog(false)}
          onShare={onShareWithCareTeam}
        />
      )}
    </div>
  );
}