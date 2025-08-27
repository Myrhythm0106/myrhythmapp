import React from 'react';
import { QuickCaptureRecorder } from '@/components/memoryBridge/QuickCaptureRecorder';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { MVPPageHeader } from '@/components/mvp/MVPPageHeader';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function QuickCapture() {
  const navigate = useNavigate();

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