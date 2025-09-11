import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MVPProgressTracker } from './MVPProgressTracker';
import { 
  Shield, 
  Lock, 
  Eye,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface MVPPrivacyConsentProps {
  onConsentComplete: () => void;
  onBack?: () => void;
}

export function MVPPrivacyConsent({ onConsentComplete, onBack }: MVPPrivacyConsentProps) {
  const [consents, setConsents] = useState({
    assessment: false,
    dataCollection: false,
    privacyPolicy: false
  });

  const allConsentsGiven = Object.values(consents).every(Boolean);

  const handleConsentChange = (key: keyof typeof consents, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleContinue = () => {
    if (allConsentsGiven) {
      // Store consent in localStorage
      localStorage.setItem('mvp_consent_given', 'true');
      localStorage.setItem('mvp_consent_timestamp', new Date().toISOString());
      onConsentComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      <MVPProgressTracker currentStep="privacy" />
      
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-clarity-teal-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Privacy & Data Protection
          </Badge>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Your Privacy is Our Priority
          </h1>
          
          <p className="text-lg text-brain-health-700 max-w-2xl mx-auto">
            Before we begin your cognitive assessment, we need your consent for data collection and processing.
          </p>
        </div>

        {/* Privacy Overview */}
        <Card className="bg-gradient-to-r from-clarity-teal-50 to-brain-health-50 border-clarity-teal-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-clarity-teal-700">
              <Lock className="h-5 w-5" />
              How We Protect Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <Lock className="h-8 w-8 text-clarity-teal-600 mx-auto mb-2" />
                <div className="font-semibold text-clarity-teal-700 mb-1">Encrypted Storage</div>
                <div className="text-sm text-clarity-teal-600">All data is encrypted at rest and in transit</div>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <Eye className="h-8 w-8 text-brain-health-600 mx-auto mb-2" />
                <div className="font-semibold text-brain-health-700 mb-1">Private by Default</div>
                <div className="text-sm text-brain-health-600">Your data is never shared without consent</div>
              </div>
              <div className="text-center p-4 bg-white/60 rounded-lg">
                <FileText className="h-8 w-8 text-memory-emerald-600 mx-auto mb-2" />
                <div className="font-semibold text-memory-emerald-700 mb-1">Full Control</div>
                <div className="text-sm text-memory-emerald-600">Delete your data anytime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Form */}
        <Card className="border-brain-health-200">
          <CardHeader>
            <CardTitle className="text-brain-health-700">Required Consents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assessment Consent */}
            <div className="flex items-start space-x-3 p-4 bg-memory-emerald-50/50 rounded-lg border border-memory-emerald-200">
              <Checkbox 
                id="assessment-consent"
                checked={consents.assessment}
                onCheckedChange={(checked) => handleConsentChange('assessment', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor="assessment-consent" 
                  className="text-sm font-medium text-brain-health-700 cursor-pointer block mb-2"
                >
                  Cognitive Assessment Consent
                </label>
                <p className="text-sm text-brain-health-600">
                  I consent to participate in the cognitive assessment and understand that this will collect data about my 
                  memory, attention, and cognitive patterns to provide personalized recommendations.
                </p>
              </div>
            </div>

            {/* Data Collection Consent */}
            <div className="flex items-start space-x-3 p-4 bg-brain-health-50/50 rounded-lg border border-brain-health-200">
              <Checkbox 
                id="data-consent"
                checked={consents.dataCollection}
                onCheckedChange={(checked) => handleConsentChange('dataCollection', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor="data-consent" 
                  className="text-sm font-medium text-brain-health-700 cursor-pointer block mb-2"
                >
                  Data Collection & Processing Consent
                </label>
                <p className="text-sm text-brain-health-600">
                  I consent to the collection and processing of my assessment responses, usage data, and preferences 
                  to improve my MyRhythm experience and provide personalized features.
                </p>
              </div>
            </div>

            {/* Privacy Policy Consent */}
            <div className="flex items-start space-x-3 p-4 bg-clarity-teal-50/50 rounded-lg border border-clarity-teal-200">
              <Checkbox 
                id="privacy-consent"
                checked={consents.privacyPolicy}
                onCheckedChange={(checked) => handleConsentChange('privacyPolicy', checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor="privacy-consent" 
                  className="text-sm font-medium text-brain-health-700 cursor-pointer block mb-2"
                >
                  Privacy Policy Agreement
                </label>
                <p className="text-sm text-brain-health-600">
                  I have read and agree to the{' '}
                  <a href="/privacy-policy" target="_blank" className="text-clarity-teal-600 hover:underline font-medium">
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a href="/terms-of-service" target="_blank" className="text-clarity-teal-600 hover:underline font-medium">
                    Terms of Service
                  </a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Note */}
        <Card className="bg-gradient-to-r from-sunrise-amber-50 to-clarity-teal-50 border-sunrise-amber-200 mt-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-sunrise-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sunrise-amber-700 mb-1">Important</div>
                <div className="text-sm text-sunrise-amber-600">
                  All consents are required to proceed with the assessment. You can withdraw consent and delete your data at any time from your account settings.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          
          <div className="flex-1" />
          
          <Button 
            onClick={handleContinue}
            disabled={!allConsentsGiven}
            className={`px-8 py-3 ${
              allConsentsGiven 
                ? 'bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Continue to Assessment
          </Button>
        </div>
      </div>
    </div>
  );
}