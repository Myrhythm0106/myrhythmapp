import React, { useState } from 'react';
import { QuickCaptureRecorder } from '@/components/memoryBridge/QuickCaptureRecorder';
import { QuickCaptureResultsScreen } from '@/components/memoryBridge/QuickCaptureResultsScreen';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { MVPPageHeader } from '@/components/mvp/MVPPageHeader';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedSmartScheduling, EnhancedSmartSuggestion } from '@/hooks/useEnhancedSmartScheduling';
import { ArrowLeft, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NextStepsItem } from '@/types/memoryBridge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function QuickCapture() {
  const navigate = useNavigate();
  const { user, loading, emailVerificationStatus } = useAuth();
  const { generateSmartSuggestions, scheduleAction } = useEnhancedSmartScheduling();
  
  const [showResults, setShowResults] = useState(false);
  const [extractedActions, setExtractedActions] = useState<NextStepsItem[]>([]);
  const [suggestions, setSuggestions] = useState<Map<string, EnhancedSmartSuggestion[]>>(new Map());
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleComplete = async (data: { meetingId: string; actionsCount: number }) => {
    // PHASE 1: Fetch extracted actions and generate suggestions
    try {
      setIsGeneratingSuggestions(true);
      
      const { data: actions, error } = await supabase
        .from('extracted_actions')
        .select('*')
        .eq('meeting_recording_id', data.meetingId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      if (actions && actions.length > 0) {
        setExtractedActions(actions as NextStepsItem[]);
        
        // Generate suggestions for all actionable items
        const newSuggestions = new Map<string, EnhancedSmartSuggestion[]>();
        
        for (const action of actions) {
          if (action.category === 'action' && action.status !== 'completed') {
            const actionSuggestions = await generateSmartSuggestions(
              action.action_text,
              action.completion_date || undefined,
              action.priority_level || 3,
              60,
              action.verb_category
            );
            newSuggestions.set(action.id, actionSuggestions);
          }
        }
        
        setSuggestions(newSuggestions);
        setShowResults(true);
        
        toast.success(`${actions.length} actions extracted with smart scheduling ready!`);
      }
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load results');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // PHASE 3: Bulk schedule selected actions
  const handleScheduleSelected = async (
    actionIds: string[],
    selectedSuggestions: Map<string, EnhancedSmartSuggestion>
  ) => {
    setIsScheduling(true);
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (const actionId of actionIds) {
        const suggestion = selectedSuggestions.get(actionId);
        const action = extractedActions.find(a => a.id === actionId);
        
        if (suggestion && action) {
          const success = await scheduleAction(
            suggestion,
            actionId,
            action.action_text
          );
          
          if (success) {
            successCount++;
          } else {
            failCount++;
          }
        }
      }
      
      if (successCount > 0) {
        toast.success(
          `🎉 ${successCount} action${successCount !== 1 ? 's' : ''} scheduled to your calendar!`,
          {
            description: 'You\'re building momentum!'
          }
        );
        
        // Navigate to Next Steps Hub
        setTimeout(() => {
          navigate('/memory-bridge', { state: { tab: 'nextsteps' } });
        }, 1500);
      }
      
      if (failCount > 0) {
        toast.error(`${failCount} action${failCount !== 1 ? 's' : ''} failed to schedule`);
      }
    } catch (error) {
      console.error('Error scheduling actions:', error);
      toast.error('Failed to schedule actions');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCancel = () => {
    navigate('/memory-bridge');
  };

  const handleViewInHub = () => {
    navigate('/memory-bridge', { state: { tab: 'nextsteps' } });
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

          {/* Quick Capture Interface or Results */}
          {!showResults ? (
            <>
              <QuickCaptureRecorder 
                onComplete={handleComplete}
                onCancel={handleCancel}
              />
              
              {isGeneratingSuggestions && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating smart scheduling suggestions...</p>
                </div>
              )}
            </>
          ) : (
            <QuickCaptureResultsScreen
              actions={extractedActions}
              suggestions={suggestions}
              onScheduleSelected={handleScheduleSelected}
              onViewInHub={handleViewInHub}
              isScheduling={isScheduling}
            />
          )}

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
