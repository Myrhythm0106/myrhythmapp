import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/hooks/useAuth';
import { processSavedRecording } from '@/utils/processSavedRecording';
import { RecordingDetailsView } from './RecordingDetailsView';
import { TranscriptViewer } from './TranscriptViewer';
import { ActionsViewer } from './ActionsViewer';
import { 
  Mic, 
  Play, 
  Brain,
  Clock,
  FileAudio,
  ChevronRight,
  Loader2,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RecordingsTabProps {
  onProcessComplete?: (meetingId: string, actionsCount: number) => void;
}

export function RecordingsTab({ onProcessComplete }: RecordingsTabProps) {
  const { recordings, fetchRecordings, getRecordingUrl } = useVoiceRecorder();
  const { user } = useAuth();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processedRecordings, setProcessedRecordings] = useState<Set<string>>(new Set());
  const [viewingRecording, setViewingRecording] = useState<{ id: string; title: string } | null>(null);
  const [viewingTranscript, setViewingTranscript] = useState<{ recordingId: string; title: string } | null>(null);
  const [viewingActions, setViewingActions] = useState<{ recordingId: string; title: string } | null>(null);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  useEffect(() => {
    // Check which recordings have been processed by looking for meeting_recordings with actual actions
    const checkProcessedRecordings = async () => {
      if (!user) return;
      
      const { data: meetingRecordings } = await supabase
        .from('meeting_recordings')
        .select('recording_id, id')
        .eq('user_id', user.id)
        .not('recording_id', 'is', null);
      
      if (meetingRecordings && meetingRecordings.length > 0) {
        // Check which ones actually have extracted actions
        const { data: actionsData } = await supabase
          .from('extracted_actions')
          .select('meeting_recording_id')
          .in('meeting_recording_id', meetingRecordings.map(mr => mr.id));
        
        const meetingsWithActions = new Set(actionsData?.map(a => a.meeting_recording_id) || []);
        const processedIds = new Set(
          meetingRecordings
            .filter(mr => meetingsWithActions.has(mr.id))
            .map(mr => mr.recording_id)
        );
        setProcessedRecordings(processedIds);
      }
    };

    checkProcessedRecordings();
  }, [user, recordings]);

  const handleProcessRecording = async (recording: any) => {
    if (!user) return;

    setProcessingId(recording.id);
    try {
      const result = await processSavedRecording(recording.id, user.id);
      
      if (result.success && result.meetingId && result.actionsCount !== undefined) {
        setProcessedRecordings(prev => new Set([...prev, recording.id]));
        onProcessComplete?.(result.meetingId, result.actionsCount);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const handlePlayRecording = async (recording: any) => {
    const url = await getRecordingUrl(recording.file_path);
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  const handleViewRecording = (recording: any) => {
    setViewingRecording({
      id: recording.id,
      title: recording.title
    });
  };

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const meetingRecordings = recordings.filter(r => r.category === 'meeting');

  if (meetingRecordings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileAudio className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Recordings Yet</h3>
          <p className="text-muted-foreground">
            Complete your first recording to see it here and process it into ACTs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Your Recordings ({meetingRecordings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {meetingRecordings.map((recording) => {
            const isProcessed = processedRecordings.has(recording.id);
            const isProcessing = processingId === recording.id;

            return (
              <Card key={recording.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        <FileAudio className="h-5 w-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{recording.title}</h4>
                        {recording.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {recording.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(recording.duration_seconds)}
                          </div>
                          <span>
                            {new Date(recording.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {isProcessed ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            <Brain className="h-3 w-3 mr-1" />
                            Processed
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingTranscript({
                              recordingId: recording.id,
                              title: recording.title
                            })}
                            className="flex items-center gap-1"
                          >
                            <FileAudio className="h-3 w-3" />
                            Transcript
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingActions({
                              recordingId: recording.id,
                              title: recording.title
                            })}
                            className="flex items-center gap-1"
                          >
                            <Brain className="h-3 w-3" />
                            ACTS
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePlayRecording(recording)}
                            className="flex items-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            Play
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => handleProcessRecording(recording)}
                            disabled={isProcessing}
                            className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white"
                          >
                            {isProcessing ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Brain className="h-3 w-3 mr-1" />
                                Process to ACTs
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Transcript Viewer Modal */}
      {viewingTranscript && (
        <TranscriptViewer
          recordingId={viewingTranscript.recordingId}
          meetingTitle={viewingTranscript.title}
          isOpen={!!viewingTranscript}
          onClose={() => setViewingTranscript(null)}
        />
      )}

      {/* Actions Viewer Modal */}
      {viewingActions && (
        <ActionsViewer
          recordingId={viewingActions.recordingId}
          meetingTitle={viewingActions.title}
          isOpen={!!viewingActions}
          onClose={() => setViewingActions(null)}
        />
      )}
    </div>
  );
}