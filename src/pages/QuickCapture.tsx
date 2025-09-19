import React from 'react';
import { QuickCaptureRecorder } from '@/components/memoryBridge/QuickCaptureRecorder';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { MVPPageHeader } from '@/components/mvp/MVPPageHeader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function QuickCapture() {
  const navigate = useNavigate();
  const { user, loading, emailVerificationStatus } = useAuth();

  const handleComplete = (data: { meetingId: string; actionsCount: number }) => {
    // Navigate to actions view with the results
    navigate('/memory-bridge', { 
      state: { 
        showResults: true, 
        meetingId: data.meetingId, 
        actionsCount: data.actionsCount 
      } 
    });
  };

  const handleCancel = () => {
    navigate('/memory-bridge');
  };

  return (
    <MVPThemeWrapper>
      <MVPTopNav />
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto space-y-6 p-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Memory Bridge
          </Button>

          {/* Page Header */}
          <MVPPageHeader 
            title="Quick Capture"
            subtitle="3-tap recording: Start → Stop → View Results"
          />

          {/* Authentication Status */}
          <div className="flex items-center justify-center gap-2 py-2">
            {loading ? (
              <Badge variant="outline">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                Checking authentication...
              </Badge>
            ) : user ? (
              <Badge className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Signed in as {user.email}
                {emailVerificationStatus === 'pending' && (
                  <span className="ml-2 text-orange-600">(Email verification pending)</span>
                )}
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not signed in - Please sign in to record
              </Badge>
            )}
          </div>

          {/* Quick Capture Interface */}
          <QuickCaptureRecorder 
            onComplete={handleComplete}
            onCancel={handleCancel}
          />

          {/* Quick Tips */}
          <div className="bg-brain-health-50/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-brain-health-900">Quick Tips:</h4>
            <ul className="text-sm text-brain-health-700 space-y-1">
              <li>• Speak clearly and mention specific commitments</li>
              <li>• Include names and deadlines for better ACT extraction</li>
              <li>• Recording automatically processes when you stop</li>
            </ul>
          </div>
        </div>
      </div>
    </MVPThemeWrapper>
  );
}