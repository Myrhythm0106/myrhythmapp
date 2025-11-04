import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Download, 
  Clock, 
  AlertTriangle,
  Calendar,
  Users,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { TranscriptViewer } from './TranscriptViewer';

interface MeetingRecording {
  id: string;
  recording_id: string;
  meeting_title: string;
  transcript: string;
  created_at: string;
  participants: any;
  meeting_context: string;
}

export function TranscriptsTab() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<MeetingRecording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingTranscript, setViewingTranscript] = useState<{
    recordingId: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      fetchRecordings();
    }
  }, [user]);

  const fetchRecordings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('meeting_recordings')
        .select('*')
        .eq('user_id', user?.id)
        .not('transcript', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data || []);
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHoursLeft = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursElapsed = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
    return Math.max(0, 48 - hoursElapsed);
  };

  const downloadTranscript = (recording: MeetingRecording) => {
    if (!recording.transcript) return;

    const content = `Meeting: ${recording.meeting_title}\nDate: ${new Date(recording.created_at).toLocaleString()}\nParticipants: ${
      recording.participants && Array.isArray(recording.participants)
        ? recording.participants.map(p => typeof p === 'string' ? p : p.name || 'Unknown').join(', ')
        : recording.participants || 'Not specified'
    }\nContext: ${recording.meeting_context || 'No context provided'}\n\n--- TRANSCRIPT ---\n\n${recording.transcript}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${recording.meeting_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatParticipants = (participants: any) => {
    if (Array.isArray(participants)) {
      return participants.map(p => typeof p === 'string' ? p : p.name || 'Unknown').join(', ');
    }
    return participants || 'Not specified';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground animate-pulse" />
        <p className="text-muted-foreground">Loading transcripts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Transcripts
          </h2>
          <p className="text-muted-foreground">
            Full conversation transcripts (available for 48 hours)
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {recordings.length} transcripts
        </Badge>
      </div>

      {/* 48-Hour Policy Alert */}
      <Alert className="border-amber-200 bg-amber-50">
        <Clock className="h-4 w-4 text-amber-500" />
        <AlertDescription className="text-amber-700">
          <strong>Privacy Policy:</strong> Transcripts are automatically deleted after 48 hours for your privacy and security. 
          Download any transcripts you need to keep before they expire.
        </AlertDescription>
      </Alert>

      {/* Transcripts List */}
      {recordings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No transcripts available</h3>
            <p className="text-sm text-muted-foreground">
              Transcripts will appear here after you record and process conversations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recordings.map((recording) => {
            const hoursLeft = getHoursLeft(recording.created_at);
            const isExpired = hoursLeft <= 0;
            const isCritical = hoursLeft <= 3 && hoursLeft > 0;
            const isExpiringSoon = hoursLeft < 24 && hoursLeft > 0;

            return (
              <Card key={recording.id} className={`transition-colors ${isExpired ? 'opacity-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{recording.meeting_title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(recording.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatParticipants(recording.participants)}
                        </div>
                      </div>
                      {recording.meeting_context && (
                        <p className="text-sm text-muted-foreground">{recording.meeting_context}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Expiration Status */}
                      {isExpired ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      ) : isCritical ? (
                        <Badge variant="destructive" className="text-xs animate-pulse bg-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1 animate-bounce" />
                          {Math.floor(hoursLeft)}h {Math.floor((hoursLeft % 1) * 60)}m left!
                        </Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(hoursLeft)}h left
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.round(hoursLeft)}h left
                        </Badge>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setViewingTranscript({
                            recordingId: recording.recording_id,
                            title: recording.meeting_title
                          })}
                          variant="outline"
                          size="sm"
                          disabled={isExpired}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          onClick={() => downloadTranscript(recording)}
                          variant="outline"
                          size="sm"
                          disabled={isExpired || !recording.transcript}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}

      {/* Transcript Viewer Modal */}
      {viewingTranscript && (
        <TranscriptViewer
          recordingId={viewingTranscript.recordingId}
          meetingTitle={viewingTranscript.title}
          isOpen={!!viewingTranscript}
          onClose={() => setViewingTranscript(null)}
        />
      )}
    </div>
  );
}