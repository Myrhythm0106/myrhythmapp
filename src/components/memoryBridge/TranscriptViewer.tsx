import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Clock, 
  AlertTriangle,
  Calendar,
  Brain
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TranscriptViewerProps {
  recordingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MeetingData {
  id: string;
  meeting_title: string;
  transcript: string;
  created_at: string;
  participants: any;
  meeting_context: string;
}

export function TranscriptViewer({ 
  recordingId, 
  meetingTitle, 
  isOpen, 
  onClose
}: TranscriptViewerProps) {
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hoursLeft, setHoursLeft] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !recordingId) return;

    const fetchTranscript = async () => {
      setIsLoading(true);
      try {
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('*')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          setMeetingData(meetingRecording);
          
          // Calculate hours left (48 hour limit)
          const createdAt = new Date(meetingRecording.created_at);
          const now = new Date();
          const hoursElapsed = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          const remaining = Math.max(0, 48 - hoursElapsed);
          setHoursLeft(remaining);
        }
      } catch (error) {
        console.error('Error fetching transcript:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, [recordingId, isOpen]);

  const downloadTranscript = () => {
    if (!meetingData?.transcript) return;

    const content = `Meeting: ${meetingData.meeting_title}\nDate: ${new Date(meetingData.created_at).toLocaleString()}\nParticipants: ${
      meetingData.participants && Array.isArray(meetingData.participants)
        ? meetingData.participants.map(p => typeof p === 'string' ? p : p.name || 'Unknown').join(', ')
        : meetingData.participants || 'Not specified'
    }\nContext: ${meetingData.meeting_context || 'No context provided'}\n\n--- TRANSCRIPT ---\n\n${meetingData.transcript}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${meetingData.meeting_title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Transcript: {meetingTitle || meetingData?.meeting_title || 'Recording'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 48-Hour Warning */}
          <Alert className={hoursLeft < 24 ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}>
            <AlertTriangle className={`h-4 w-4 ${hoursLeft < 24 ? "text-red-500" : "text-amber-500"}`} />
            <AlertDescription className={hoursLeft < 24 ? "text-red-700" : "text-amber-700"}>
              <div className="flex items-center justify-between">
              <span>
                {hoursLeft > 0 
                  ? `Your transcript remains available for ${Math.round(hoursLeft)} more hours` 
                  : "This transcript has completed its 48-hour availability window"
                }
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3" />
                  48-hour limit
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Meeting Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Meeting Details
                </span>
                <Button 
                  onClick={downloadTranscript}
                  disabled={!meetingData?.transcript || hoursLeft <= 0}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Date:</span>
                  <p className="text-muted-foreground">
                    {meetingData?.created_at ? new Date(meetingData.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Participants:</span>
                  <p className="text-muted-foreground">
                    {meetingData?.participants && Array.isArray(meetingData.participants)
                      ? meetingData.participants.map(p => typeof p === 'string' ? p : p.name || 'Unknown').join(', ')
                      : meetingData?.participants || 'Not specified'
                    }
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Context:</span>
                  <p className="text-muted-foreground">
                    {meetingData?.meeting_context || 'No context provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transcript Content */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Full Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading transcript...
                </div>
              ) : !meetingData?.transcript ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transcript available for this recording.
                </div>
              ) : hoursLeft <= 0 ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Transcript Archive Complete</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      This recording has been successfully processed and archived. All extracted actions and insights remain available in your Next Steps Hub.
                    </p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-96 w-full rounded border p-4">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {meetingData.transcript}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}