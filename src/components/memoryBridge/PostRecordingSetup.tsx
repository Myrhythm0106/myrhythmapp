import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Users, 
  MapPin, 
  Heart, 
  Battery, 
  Plus, 
  X,
  Save,
  Edit
} from 'lucide-react';
import { MeetingRecording, Participant } from '@/types/memoryBridge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PostRecordingSetupProps {
  meeting: MeetingRecording;
  onUpdate: (meeting: MeetingRecording) => void;
  onClose: () => void;
}

export function PostRecordingSetup({ meeting, onUpdate, onClose }: PostRecordingSetupProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(meeting.meeting_title);
  const [context, setContext] = useState(meeting.meeting_context || '');
  const [location, setLocation] = useState(meeting.location || '');
  const [emotionalContext, setEmotionalContext] = useState(meeting.emotional_context || '');
  const [energyLevel, setEnergyLevel] = useState(meeting.energy_level || 5);
  const [meetingType, setMeetingType] = useState(meeting.meeting_type);
  const [participants, setParticipants] = useState<Participant[]>(
    meeting.participants as Participant[] || []
  );
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantRelationship, setNewParticipantRelationship] = useState('');

  const addParticipant = () => {
    if (newParticipantName.trim() && newParticipantRelationship.trim()) {
      setParticipants([
        ...participants,
        {
          name: newParticipantName.trim(),
          relationship: newParticipantRelationship.trim()
        }
      ]);
      setNewParticipantName('');
      setNewParticipantRelationship('');
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedMeeting = {
        ...meeting,
        meeting_title: title,
        meeting_context: context,
        location,
        emotional_context: emotionalContext,
        energy_level: energyLevel,
        meeting_type: meetingType,
        participants: participants
      };

      const { error } = await supabase
        .from('meeting_recordings')
        .update({
          meeting_title: title,
          meeting_context: context,
          location,
          emotional_context: emotionalContext,
          energy_level: energyLevel,
          meeting_type: meetingType,
          participants: participants as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', meeting.id)
        .eq('user_id', user.id);

      if (error) throw error;

      onUpdate(updatedMeeting as MeetingRecording);
      toast.success('Meeting context updated successfully!');
      onClose();

    } catch (error) {
      console.error('Error updating meeting context:', error);
      toast.error('Failed to update meeting context');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-primary" />
          Add Context to Recording
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Help us better understand your conversation by adding context and details.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meeting Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Meeting Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this conversation a meaningful name"
          />
        </div>

        {/* Meeting Type */}
        <div className="space-y-2">
          <Label>Meeting Type</Label>
          <Select value={meetingType} onValueChange={(value) => setMeetingType(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select meeting type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal Meeting</SelectItem>
              <SelectItem value="informal">Informal Chat</SelectItem>
              <SelectItem value="family">Family Discussion</SelectItem>
              <SelectItem value="medical">Medical Appointment</SelectItem>
              <SelectItem value="planning">Planning Session</SelectItem>
              <SelectItem value="unplanned">Unplanned Conversation</SelectItem>
              <SelectItem value="emergency">Emergency Discussion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Participants */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participants
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {participants.map((participant, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {participant.name} ({participant.relationship})
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeParticipant(index)}
                />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Participant name"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Relationship"
              value={newParticipantRelationship}
              onChange={(e) => setNewParticipantRelationship(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={addParticipant}
              size="sm"
              disabled={!newParticipantName.trim() || !newParticipantRelationship.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Context */}
        <div className="space-y-2">
          <Label htmlFor="context">What was discussed?</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the main topics, decisions made, or key points discussed..."
            rows={3}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location (Optional)
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Where did this conversation take place?"
          />
        </div>

        {/* Emotional Context */}
        <div className="space-y-2">
          <Label htmlFor="emotional-context" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Emotional Context (Optional)
          </Label>
          <Textarea
            id="emotional-context"
            value={emotionalContext}
            onChange={(e) => setEmotionalContext(e.target.value)}
            placeholder="How did everyone feel? Any tensions, celebrations, or important emotional moments?"
            rows={2}
          />
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            Energy Level: {energyLevel}/10
          </Label>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low Energy</span>
            <span>High Energy</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading || !title.trim()} 
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Context'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}