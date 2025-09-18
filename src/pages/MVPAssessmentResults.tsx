import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock, Crown, Download, ArrowRight, Brain, Star } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ShareSummary } from '@/components/ui/ShareSummary';
import { FloatingUpgradeBanner } from '@/components/ui/FloatingUpgradeBanner';
import { EnhancedAssessmentResults } from '@/components/assessment/EnhancedAssessmentResults';
import { ConversionOptimizationModal } from '@/components/assessment/ConversionOptimizationModal';

interface AssessmentResult {
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
}

export default function MVPAssessmentResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { hasFeature } = useSubscription();
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  
  const isPaid = searchParams.get('paid') === 'true' || hasFeature('fullAssessment');
  const assessmentType = searchParams.get('type') || 'brief';

  useEffect(() => {
    // Load or generate assessment results
    const storedResults = localStorage.getItem('lastAssessmentResults');
    if (storedResults) {
      setAssessmentResult(JSON.parse(storedResults));
    } else {
      // Generate enhanced sample results for demo
      const mockResult: AssessmentResult = {
        overallScore: 75,
        categoryScores: {
          memory: 80,
          attention: 70,
          executive: 75,
          mood: 65,
          daily_function: 85
        },
        recommendations: [
          "Memory Bridge will help you capture and organize important information automatically",
          "Your Cognitive Training provides personalized exercises to rebuild focus and attention",
          "Habits & Structure will help you take control of your daily planning and organization",
          "Daily rhythm optimization will stabilize your energy patterns throughout the day",
          "Healing & mindfulness practices will reduce stress and promote cognitive calm"
        ],
        riskLevel: 'moderate',
        primaryRhythm: 'Building Rhythm',
        lockedInsights: [
          "Your executive function scores suggest specific planning strategies would be beneficial",
          "Resilience Building exercises can significantly improve your emotional regulation",
          "Your profile suggests a personalized 90-day recovery protocol would be optimal",
          "Detailed cognitive mapping shows your strongest recovery pathways",
          "Personalized sleep optimization schedule based on your circadian patterns"
        ],
        cognitiveImpact: {
          memoryRetention: 72,
          processingSpeed: 68,
          attentionSpan: 65,
          executiveFunction: 70,
          emotionalRegulation: 78
        },
        recoveryProjections: {
          thirtyDay: [
            "Establish consistent daily Memory Bridge routine",
            "Complete cognitive assessment with healthcare provider",
            "Implement personalized sleep optimization schedule",
            "Begin structured cognitive training exercises"
          ],
          sixtyDay: [
            "Achieve 30% improvement in sustained attention tasks",
            "Master advanced Memory Bridge organizational systems", 
            "Integrate support circle into daily accountability",
            "Complete first month of cognitive rehabilitation protocol"
          ],
          ninetyDay: [
            "Demonstrate measurable cognitive improvement in all domains",
            "Achieve independence in daily executive function tasks",
            "Establish long-term cognitive maintenance routines",
            "Complete comprehensive progress evaluation with medical team"
          ]
        },
        optimalTimes: {
          bestFocusTime: "9:00-11:00 AM",
          preferredMeetingTime: "10:00 AM-12:00 PM", 
          sustainedAttentionTime: "8:30-10:30 AM"
        }
      };
      
      // Show conversion modal for non-paid users after viewing results
      if (!isPaid) {
        setTimeout(() => setShowConversionModal(true), 3000);
      }
      setAssessmentResult(mockResult);
    }
  }, []);

  const handleUpgrade = () => {
    setShowConversionModal(true);
  };

  const handleShareWithCareTeam = (shareData: any) => {
    console.log('Sharing with care team:', shareData);
    // Implement actual sharing logic here
  };

  const handleRetakeAssessment = () => {
    navigate('/mvp-assessment?type=comprehensive');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleStartJourney = () => {
    if (assessmentResult) {
      // Route directly to guided journey without sign-in barrier
      navigate('/guided-journey', { state: { assessmentResult } });
    }
  };

  if (!assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse text-brain-health-500 mx-auto mb-4" />
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
      {/* Floating Upgrade Banner */}
      <FloatingUpgradeBanner show={!isPaid} />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Your MyRhythm Assessment Results
          </h1>
          <p className="text-brain-health-600 text-lg">
            {isPaid ? 'Complete Cognitive Wellness Analysis' : 'Preview Results - Upgrade for Complete Analysis'}
          </p>
        </div>

        {/* Enhanced Assessment Results */}
        <EnhancedAssessmentResults 
          assessmentResult={assessmentResult}
          userType="individual"
          onUpgrade={handleUpgrade}
          onShareWithCareTeam={handleShareWithCareTeam}
          isPaid={isPaid}
        />






        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button 
            onClick={handleStartJourney}
            size="lg"
            className="bg-gradient-to-r from-brain-health-500 to-memory-emerald-500 hover:from-brain-health-600 hover:to-memory-emerald-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🎯 START MY TRANSFORMATION
          </Button>
          
          {!isPaid && (
            <Button 
              onClick={handleUpgrade}
              size="lg"
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold shadow-xl animate-pulse"
            >
              <Crown className="h-5 w-5 mr-2" />
              🎯 UNLOCK MY TRANSFORMATION
            </Button>
          )}
          
          <Button 
            onClick={handleRetakeAssessment}
            variant="outline"
            className="border-brain-health-300 text-brain-health-700"
          >
            Retake Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}