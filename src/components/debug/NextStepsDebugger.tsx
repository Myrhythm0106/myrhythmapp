import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DebugResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export function NextStepsDebugger() {
  const { toast } = useToast();
  const [results, setResults] = useState<Record<string, DebugResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const updateResult = (key: string, result: DebugResult) => {
    setResults(prev => ({ ...prev, [key]: result }));
    setLoading(prev => ({ ...prev, [key]: false }));
  };

  const setTestLoading = (key: string, isLoading: boolean) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  // Test 1: Check API Keys Configuration
  const testApiKeys = async () => {
    setTestLoading('apiKeys', true);
    try {
      const { data, error } = await supabase.functions.invoke('debug-keys');
      
      if (error) {
        updateResult('apiKeys', {
          success: false,
          message: 'Failed to check API keys',
          error: error.message
        });
        return;
      }

      updateResult('apiKeys', {
        success: data?.success || false,
        message: `API Keys Status: OpenAI ${data?.results?.openai?.present ? '✅' : '❌'}, AssemblyAI ${data?.results?.assemblyai?.present ? '✅' : '❌'}`,
        data: data?.results
      });
    } catch (err) {
      updateResult('apiKeys', {
        success: false,
        message: 'API key test failed',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Test 2: Check Recent Recordings Status
  const checkRecordings = async () => {
    setTestLoading('recordings', true);
    try {
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('id, meeting_title, processing_status, processing_error, transcript, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const pendingCount = data?.filter(r => r.processing_status === 'pending').length || 0;
      const completedCount = data?.filter(r => r.processing_status === 'completed').length || 0;
      const errorCount = data?.filter(r => r.processing_status === 'error').length || 0;

      updateResult('recordings', {
        success: true,
        message: `Recent recordings: ${pendingCount} pending, ${completedCount} completed, ${errorCount} failed`,
        data: { recordings: data, counts: { pendingCount, completedCount, errorCount } }
      });
    } catch (err) {
      updateResult('recordings', {
        success: false,
        message: 'Failed to check recordings',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Test 3: Check Extracted Actions Quality
  const checkActions = async () => {
    setTestLoading('actions', true);
    try {
      const { data, error } = await supabase
        .from('extracted_actions')
        .select('id, action_text, category, status, confidence_score, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const goodActions = data?.filter(a => a.confidence_score && a.confidence_score > 0.7).length || 0;
      const totalActions = data?.length || 0;

      updateResult('actions', {
        success: totalActions > 0,
        message: `Actions found: ${totalActions} total, ${goodActions} high-quality (>0.7 confidence)`,
        data: { actions: data, quality: { good: goodActions, total: totalActions } }
      });
    } catch (err) {
      updateResult('actions', {
        success: false,
        message: 'Failed to check extracted actions',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Test 4: Test Processing Function Directly
  const testProcessingFunction = async () => {
    setTestLoading('processing', true);
    try {
      // Create a test transcript
      const testTranscript = "I need to call Dr. Smith tomorrow to schedule my next appointment. Also, let me remember to pick up my prescription at the pharmacy this week.";
      
      const { data, error } = await supabase.functions.invoke('extract-acts-incremental', {
        body: {
          transcript: testTranscript,
          meetingId: 'test-debug-meeting',
          userId: 'test-user-id'
        }
      });

      if (error) {
        updateResult('processing', {
          success: false,
          message: 'Processing function test failed',
          error: error.message,
          data: error
        });
        return;
      }

      updateResult('processing', {
        success: true,
        message: `Processing function works! Extracted ${data?.actionsCount || 0} actions`,
        data
      });
    } catch (err) {
      updateResult('processing', {
        success: false,
        message: 'Processing function test failed',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  // Test 5: Force Process a Pending Recording
  const forceProcessPending = async () => {
    setTestLoading('forceProcess', true);
    try {
      // Get the most recent pending recording
      const { data: pendingRecordings, error: fetchError } = await supabase
        .from('meeting_recordings')
        .select('id, recording_id')
        .eq('processing_status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) throw fetchError;
      
      if (!pendingRecordings || pendingRecordings.length === 0) {
        updateResult('forceProcess', {
          success: false,
          message: 'No pending recordings found to process',
        });
        return;
      }

      const recording = pendingRecordings[0];
      
      // Get the voice recording file path
      const { data: voiceRecording, error: voiceError } = await supabase
        .from('voice_recordings')
        .select('file_path, user_id')
        .eq('id', recording.recording_id)
        .single();

      if (voiceError) throw voiceError;

      // Force process it
      const { data, error } = await supabase.functions.invoke('process-meeting-audio', {
        body: {
          filePath: voiceRecording.file_path,
          meetingId: recording.id,
          userId: voiceRecording.user_id,
          meetingData: {
            title: 'Force processed recording'
          }
        }
      });

      if (error) {
        updateResult('forceProcess', {
          success: false,
          message: 'Force processing failed',
          error: error.message,
          data: error
        });
        return;
      }

      updateResult('forceProcess', {
        success: true,
        message: `Force processing initiated for recording ${recording.id}`,
        data
      });
    } catch (err) {
      updateResult('forceProcess', {
        success: false,
        message: 'Force processing failed',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    }
  };

  const runAllTests = async () => {
    await testApiKeys();
    await checkRecordings();
    await checkActions();
    await testProcessingFunction();
  };

  const getIcon = (result?: DebugResult, isLoading?: boolean) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (!result) return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    return result.success ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Next Steps Feature Debugger</CardTitle>
          <div className="flex gap-2">
            <Button onClick={runAllTests} variant="default" size="sm">
              Run All Tests
            </Button>
            <Button onClick={forceProcessPending} variant="outline" size="sm">
              Force Process Pending
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test 1: API Keys */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getIcon(results.apiKeys, loading.apiKeys)}
              <div>
                <h4 className="font-medium">API Keys Configuration</h4>
                <p className="text-sm text-muted-foreground">{results.apiKeys?.message || 'Not tested'}</p>
                {results.apiKeys?.data && (
                  <div className="text-xs mt-1">
                    <Badge variant={results.apiKeys.data.openai?.present ? 'default' : 'secondary'}>
                      OpenAI: {results.apiKeys.data.openai?.length || 0} chars
                    </Badge>
                    <Badge variant={results.apiKeys.data.assemblyai?.present ? 'default' : 'secondary'} className="ml-1">
                      AssemblyAI: {results.apiKeys.data.assemblyai?.length || 0} chars
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <Button onClick={testApiKeys} size="sm" variant="outline" disabled={loading.apiKeys}>
              Test
            </Button>
          </div>

          {/* Test 2: Recordings Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getIcon(results.recordings, loading.recordings)}
              <div>
                <h4 className="font-medium">Recent Recordings Status</h4>
                <p className="text-sm text-muted-foreground">{results.recordings?.message || 'Not checked'}</p>
              </div>
            </div>
            <Button onClick={checkRecordings} size="sm" variant="outline" disabled={loading.recordings}>
              Check
            </Button>
          </div>

          {/* Test 3: Actions Quality */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getIcon(results.actions, loading.actions)}
              <div>
                <h4 className="font-medium">Extracted Actions Quality</h4>
                <p className="text-sm text-muted-foreground">{results.actions?.message || 'Not checked'}</p>
              </div>
            </div>
            <Button onClick={checkActions} size="sm" variant="outline" disabled={loading.actions}>
              Check
            </Button>
          </div>

          {/* Test 4: Processing Function */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getIcon(results.processing, loading.processing)}
              <div>
                <h4 className="font-medium">Processing Function Test</h4>
                <p className="text-sm text-muted-foreground">{results.processing?.message || 'Not tested'}</p>
              </div>
            </div>
            <Button onClick={testProcessingFunction} size="sm" variant="outline" disabled={loading.processing}>
              Test
            </Button>
          </div>

          {/* Error Details */}
          {Object.values(results).some(r => !r.success && r.error) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
              {Object.entries(results).map(([key, result]) => 
                !result.success && result.error && (
                  <div key={key} className="text-sm text-red-700 mb-1">
                    <strong>{key}:</strong> {result.error}
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}