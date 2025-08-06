
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Square, Heart, Users } from 'lucide-react';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { MeetingSetupData, Participant } from '@/types/memoryBridge';

export function SeniorVoiceRecorder() {
  const { isRecording, startMeetingRecording } = useMemoryBridge();
  const [setupData, setSetupData] = useState<MeetingSetupData>({
    title: '',
    participants: [{ name: '', relationship: '' }],
    meetingType: 'informal',
    context: '',
    location: '',
    energyLevel: 5,
    emotionalContext: ''
  });

  const handleAddParticipant = () => {
    setSetupData(prev => ({
      ...prev,
      participants: [...prev.participants, { name: '', relationship: '' }]
    }));
  };

  const handleParticipantChange = (index: number, field: keyof Participant, value: string) => {
    setSetupData(prev => ({
      ...prev,
      participants: prev.participants.map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleStartRecording = async () => {
    if (setupData.title && setupData.participants.some(p => p.name)) {
      // For now, we'll use a mock voice recording ID
      const mockVoiceRecordingId = `recording-${Date.now()}`;
      await startMeetingRecording(setupData, mockVoiceRecordingId);
    }
  };

  return (
    <Card className="border-2 border-brain-health/30 bg-gradient-to-br from-brain-health/5 to-emerald/5">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold text-brain-health mb-3">
          Record Your Conversation
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-brain-health/80">
          <Heart className="h-5 w-5" />
          <span className="text-lg">Capture every promise that matters</span>
          <Heart className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Meeting Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-lg font-medium">What are we talking about today?</Label>
          <Input
            id="title"
            value={setupData.title}
            onChange={(e) => setSetupData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Family dinner plans, Doctor visit, etc."
            className="text-lg p-4"
          />
        </div>

        {/* Participants */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-5 w-5 text-brain-health" />
            <Label className="text-lg font-medium">Who's joining this conversation?</Label>
          </div>
          
          {setupData.participants.map((participant, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Name</Label>
                <Input
                  value={participant.name}
                  onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                  placeholder="Enter name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Relationship</Label>
                <Input
                  value={participant.relationship}
                  onChange={(e) => handleParticipantChange(index, 'relationship', e.target.value)}
                  placeholder="Wife, Son, Doctor, etc."
                  className="mt-1"
                />
              </div>
            </div>
          ))}
          
          <Button 
            onClick={handleAddParticipant}
            variant="outline" 
            className="w-full mt-3 border-brain-health/30 text-brain-health hover:bg-brain-health/10"
          >
            Add Another Person
          </Button>
        </div>

        {/* Meeting Type */}
        <div className="space-y-2">
          <Label className="text-lg font-medium">What type of conversation is this?</Label>
          <Select 
            value={setupData.meetingType} 
            onValueChange={(value: any) => setSetupData(prev => ({ ...prev, meetingType: value }))}
          >
            <SelectTrigger className="text-lg p-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="family">Family Chat</SelectItem>
              <SelectItem value="medical">Medical Visit</SelectItem>
              <SelectItem value="planning">Planning Session</SelectItem>
              <SelectItem value="informal">Casual Talk</SelectItem>
              <SelectItem value="formal">Formal Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Context */}
        <div className="space-y-2">
          <Label className="text-lg font-medium">Any background context? (Optional)</Label>
          <Textarea
            value={setupData.context}
            onChange={(e) => setSetupData(prev => ({ ...prev, context: e.target.value }))}
            placeholder="What led to this conversation? Any important background..."
            className="min-h-20"
          />
        </div>

        {/* Recording Button */}
        <div className="pt-6">
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              disabled={!setupData.title || !setupData.participants.some(p => p.name)}
              className="w-full h-16 text-xl bg-gradient-to-r from-brain-health to-emerald-600 hover:from-brain-health/90 hover:to-emerald-600/90"
            >
              <Mic className="mr-3 h-6 w-6" />
              Start Recording
            </Button>
          ) : (
            <Button
              variant="destructive"
              className="w-full h-16 text-xl"
            >
              <Square className="mr-3 h-6 w-6" />
              Stop Recording
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
