
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Users, Clock, Calendar, Target, Heart } from 'lucide-react';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { formatDistanceToNow } from 'date-fns';

export function SeniorRecordingsList() {
  const { meetingHistory, fetchMeetingHistory } = useMemoryBridge();

  useEffect(() => {
    fetchMeetingHistory();
  }, [fetchMeetingHistory]);

  if (!meetingHistory || meetingHistory.length === 0) {
    return (
      <Card className="border-2 border-dashed border-brain-health/30">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-brain-health/10 rounded-full flex items-center justify-center">
              <Play className="h-10 w-10 text-brain-health" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-brain-health mb-3">No Recordings Yet</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
                Start by recording your first conversation. Every promise you make will be captured and organized for you.
              </p>
              <div className="bg-gradient-to-r from-brain-health/10 to-emerald/10 rounded-lg p-6 max-w-lg mx-auto">
                <div className="flex items-center gap-3 justify-center mb-3">
                  <Heart className="h-5 w-5 text-brain-health" />
                  <span className="font-semibold text-brain-health">Your Journey Starts Here</span>
                  <Heart className="h-5 w-5 text-brain-health" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Switch to the Record tab to capture your first meaningful conversation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-brain-health/10 to-emerald/10 border-2 border-brain-health/30">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-brain-health">
            My Conversation History
          </CardTitle>
          <p className="text-lg text-muted-foreground">
            Every conversation captured, every promise remembered
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {meetingHistory.map((meeting) => (
          <Card key={meeting.id} className="border-l-4 border-l-brain-health hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-xl text-brain-health">{meeting.meeting_title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(meeting.created_at), { addSuffix: true })}
                    </div>
                    {meeting.voice_recordings && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.round((meeting.voice_recordings.duration_seconds || 0) / 60)} minutes
                      </div>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className="border-brain-health/30 text-brain-health bg-brain-health/5"
                >
                  {meeting.meeting_type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Participants */}
              <div className="flex items-center gap-2 flex-wrap">
                <Users className="h-4 w-4 text-brain-health" />
                <span className="text-sm font-medium">With:</span>
                {meeting.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {participant.name} ({participant.relationship})
                  </Badge>
                ))}
              </div>

              {/* Context */}
              {meeting.meeting_context && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">{meeting.meeting_context}</p>
                </div>
              )}

              {/* Location */}
              {meeting.location && (
                <div className="text-sm text-muted-foreground">
                  <strong>Location:</strong> {meeting.location}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Listen Again
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Target className="h-4 w-4 mr-2" />
                  View PACTs
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
