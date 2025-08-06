
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Mic, 
  Square, 
  Play, 
  Users, 
  Calendar, 
  Target, 
  CheckCircle,
  Clock,
  AlertTriangle 
} from 'lucide-react';
import { useMemoryBridge } from '@/hooks/useMemoryBridge';

export function PACTRecordingTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [notes, setNotes] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const { extractedActions, processMeetingAudio } = useMemoryBridge();

  // Mock recording functionality
  const handleStartRecording = () => {
    setIsRecording(true);
    // Start recording timer
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    // Store timer reference (in real app)
    (window as any).recordingTimer = timer;
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    clearInterval((window as any).recordingTimer);
    
    // In real app, process the actual audio
    const mockAudioData = "mock-audio-data";
    const meetingId = `meeting-${Date.now()}`;
    
    await processMeetingAudio(mockAudioData, meetingId);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            PACT Recording Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title</Label>
              <Input
                id="meeting-title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Weekly team sync, Family dinner, etc."
              />
            </div>
            <div>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="John, Sarah, Mom, Dad"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Pre-meeting Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any context or expectations for this conversation..."
              rows={3}
            />
          </div>

          {/* Recording Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {isRecording ? (
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-4 h-4 bg-gray-300 rounded-full" />
              )}
              <span className="font-medium">
                {isRecording ? 'Recording Active' : 'Ready to Record'}
              </span>
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(recordingDuration)}
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              {!isRecording ? (
                <Button onClick={handleStartRecording} className="bg-red-500 hover:bg-red-600">
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={handleStopRecording} variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Stop & Process
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Follow-Through Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Follow-Through Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {extractedActions.length > 0 ? (
            <div className="space-y-4">
              {extractedActions.map((action, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{action.action_text}</h4>
                      <p className="text-sm text-muted-foreground">
                        Priority: {action.priority_level}/10 • Due: {action.due_date || 'Not specified'}
                      </p>
                    </div>
                    <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                      {action.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {action.assigned_to || 'Unassigned'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {action.context || 'General'}
                    </span>
                  </div>

                  {/* Support Group Visibility */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Support group can track this commitment
                    </span>
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No PACTs Recorded Yet
              </h3>
              <p className="text-muted-foreground">
                Start recording conversations to capture promises, actions, commitments, and tasks
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
