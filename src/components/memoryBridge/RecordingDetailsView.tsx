import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  FileText, 
  Brain, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ExtractedAction } from '@/types/memoryBridge';

interface RecordingDetailsViewProps {
  recordingId: string;
  meetingTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onPlayRecording?: () => void;
}

interface MeetingData {
  id: string;
  meeting_title: string;
  transcript: string;
  created_at: string;
  participants: any;  // Json type from Supabase
  meeting_context: string;
}

export function RecordingDetailsView({ 
  recordingId, 
  meetingTitle, 
  isOpen, 
  onClose, 
  onPlayRecording 
}: RecordingDetailsViewProps) {
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [extractedActions, setExtractedActions] = useState<ExtractedAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !recordingId) return;

    const fetchRecordingDetails = async () => {
      setIsLoading(true);
      try {
        // Get meeting data
        const { data: meetingRecording } = await supabase
          .from('meeting_recordings')
          .select('*')
          .eq('recording_id', recordingId)
          .single();

        if (meetingRecording) {
          setMeetingData(meetingRecording);

          // Get extracted actions
          const { data: actions } = await supabase
            .from('extracted_actions')
            .select('*')
            .eq('meeting_recording_id', meetingRecording.id)
            .order('priority_level', { ascending: true });

          setExtractedActions((actions || []) as ExtractedAction[]);
        }
      } catch (error) {
        console.error('Error fetching recording details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordingDetails();
  }, [recordingId, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'on_hold':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'confirmed':
      case 'pending':
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'on_hold':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const formatACTSAction = (action: ExtractedAction) => {
    return {
      assign: action.assigned_to || 'Not specified',
      complete: action.due_context || action.scheduled_date || 'No deadline set',
      track: generateTrackingMessage(action),
      status: action.status || 'planned'
    };
  };

  const generateTrackingMessage = (action: ExtractedAction) => {
    const baseMessages = [
      "You've got this! Check in daily to see your progress building momentum.",
      "Small steps lead to big wins. Track your progress to celebrate each milestone.",
      "Your brain is rebuilding pathways with each completed step. Keep going!",
      "Progress tracking isn't about perfection - it's about showing up consistently.",
      "Each check-in strengthens your follow-through muscle. You're building something powerful."
    ];
    
    // Use action ID to get consistent message per action
    const messageIndex = action.id ? parseInt(action.id.slice(-1), 16) % baseMessages.length : 0;
    return baseMessages[messageIndex];
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {meetingTitle || meetingData?.meeting_title || 'Recording Details'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Recording Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recording Information
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
                
                {onPlayRecording && (
                  <Button 
                    onClick={onPlayRecording} 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play Recording
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Transcript */}
            {meetingData?.transcript && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 w-full rounded border p-4 text-sm">
                    <p className="whitespace-pre-wrap">{meetingData.transcript}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* ACTS Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  ACTS Report ({extractedActions.length} items)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Actionable Closing Tasks with empowering progress tracking
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading extracted actions...
                  </div>
                ) : extractedActions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No actions extracted from this recording.
                  </div>
                ) : (
                  extractedActions.map((action, index) => {
                    const actsData = formatACTSAction(action);
                    return (
                      <Card key={action.id || index} className="border-l-4 border-l-primary">
                        <CardContent className="pt-6">
                          {/* Action Title */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-lg mb-2">{action.action_text}</h4>
                            {action.relationship_impact && (
                              <p className="text-sm text-muted-foreground">
                                {action.relationship_impact}
                              </p>
                            )}
                          </div>

                          <Separator className="mb-4" />

                          {/* ACTS Framework */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Assign */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4 text-blue-500" />
                                <span className="text-blue-700">A - Assign</span>
                              </div>
                              <p className="text-sm pl-6">{actsData.assign}</p>
                            </div>

                            {/* Complete */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                <span className="text-orange-700">C - Complete</span>
                              </div>
                              <p className="text-sm pl-6">{actsData.complete}</p>
                            </div>

                            {/* Track */}
                            <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-700">T - Track</span>
                              </div>
                              <p className="text-sm pl-6 font-medium text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                                {actsData.track}
                              </p>
                            </div>

                            {/* Status */}
                            <div className="space-y-2 md:col-span-2">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Target className="h-4 w-4 text-purple-500" />
                                <span className="text-purple-700">S - Status</span>
                              </div>
                              <div className="pl-6">
                                <Badge className={`${getStatusColor(actsData.status)} border`}>
                                  {getStatusIcon(actsData.status)}
                                  <span className="ml-2 capitalize">
                                    {actsData.status.replace('_', ' ')}
                                  </span>
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Confidence & Priority */}
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                            <Badge variant="outline">
                              Confidence: {Math.round((action.confidence_score || 0) * 100)}%
                            </Badge>
                            <Badge variant="outline">
                              Priority: {action.priority_level <= 2 ? 'High' : action.priority_level <= 3 ? 'Medium' : 'Low'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}