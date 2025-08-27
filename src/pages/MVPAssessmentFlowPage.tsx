import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Brain, Clock, Target, Info } from 'lucide-react';
import { MVPAssessmentFlow } from '@/components/mvp/MVPAssessmentFlow';
import { useAuth } from '@/contexts/AuthContext';
import { ConsentDialog } from '@/components/onboarding/ConsentDialog';
import { toast } from 'sonner';

export default function MVPAssessmentFlowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  
  const assessmentType = searchParams.get('type') as 'brief' | 'comprehensive' || 'brief';
  const selectedPath = searchParams.get('path') as 'guided' | 'explorer' || 'guided';
  const flow = searchParams.get('flow'); // 'post-payment' or null

  useEffect(() => {
    // Check if user has given consent
    const hasConsent = localStorage.getItem('myrhythm_consent') === 'true';
    if (!hasConsent) {
      setShowConsent(true);
    } else {
      setConsentGiven(true);
    }
  }, []);

  const handleConsentAccept = () => {
    localStorage.setItem('myrhythm_consent', 'true');
    setConsentGiven(true);
    setShowConsent(false);
  };

  const handleConsentDecline = () => {
    navigate('/subscribe/success');
  };

  const handleBack = () => {
    if (flow === 'post-payment') {
      navigate('/subscribe/success');
    } else {
      navigate('/dashboard');
    }
  };

  const handleAssessmentComplete = () => {
    if (flow === 'post-payment') {
      // Go to setup wizard for paid users
      navigate('/setup-wizard?from=assessment');
    } else {
      // Show results immediately
      navigate('/mvp-assessment-results');
    }
  };

  if (!consentGiven) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center p-8">
              <Brain className="h-12 w-12 text-teal-600 mb-4" />
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Ready to Start Your Assessment</h2>
              <p className="text-sm text-slate-600 text-center mb-4">
                Before we begin, we need your consent to collect and process your assessment data securely.
              </p>
              <Button onClick={() => setShowConsent(true)}>
                Review Privacy & Continue
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <ConsentDialog 
          open={showConsent}
          onAccept={handleConsentAccept}
          onDecline={handleConsentDecline}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="h-8 w-8 text-teal-600" />
              <h1 className="text-3xl font-bold text-slate-800">
                {assessmentType === 'brief' ? 'Brief' : 'Comprehensive'} Assessment
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-slate-500 hover:text-slate-700"
                onClick={() => toast.info('This is your MyRhythm Foundation assessment - designed to understand your unique cognitive patterns and daily rhythms to create your personalized support plan.')}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{assessmentType === 'brief' ? '5-10 minutes' : '15-20 minutes'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 text-slate-400 hover:text-slate-600"
                  onClick={() => toast.info(`${assessmentType === 'brief' ? 'Brief Assessment: Quick cognitive wellness check focusing on key areas like memory, focus, and daily rhythms.' : 'Comprehensive Assessment: In-depth analysis covering all aspects of cognitive function, emotional well-being, and personalized recovery planning.'}`)}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Target className="h-4 w-4" />
                <span>{selectedPath === 'guided' ? 'Guided Approach' : 'Explorer Mode'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 text-slate-400 hover:text-slate-600"
                  onClick={() => toast.info(`${selectedPath === 'guided' ? 'Guided Approach: Step-by-step support with detailed explanations and personalized guidance throughout your journey.' : 'Explorer Mode: Freedom to navigate features at your own pace, perfect for those who prefer self-directed discovery.'}`)}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {assessmentType === 'brief' 
                ? 'Quick insights into your cognitive patterns and daily rhythms - your MyRhythm Foundation'
                : 'Comprehensive analysis of your cognitive wellness and personalized recommendations - your complete MyRhythm Foundation'
              }
            </p>
        </div>

        {/* Assessment Component */}
        <MVPAssessmentFlow />
      </div>
    </div>
  );
}