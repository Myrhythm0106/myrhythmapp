import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MeetingSetupData } from '@/types/memoryBridge';
import { X, Plus, Users, MapPin, Heart, Clock } from 'lucide-react';

interface MeetingSetupDialogProps {
  open: boolean;
  onClose: () => void;
  onStart: (setupData: MeetingSetupData) => void;
}

export function MeetingSetupDialog({ open, onClose, onStart }: MeetingSetupDialogProps) {
  const [setupData, setSetupData] = useState<MeetingSetupData>({
    title: '',
    participants: [],
    meetingType: 'informal',
    context: '',
    location: '',
    energyLevel: 5,
    emotionalContext: ''
  });

  const [newParticipant, setNewParticipant] = useState({ name: '', relationship: '' });

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.relationship) {
      setSetupData(prev => ({
        ...prev,
        participants: [...prev.participants, newParticipant]
      }));
      setNewParticipant({ name: '', relationship: '' });
    }
  };

  const removeParticipant = (index: number) => {
    setSetupData(prev => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index)
    }));
  };

  const handleStart = () => {
    if (setupData.title.trim()) {
      onStart(setupData);
      onClose();
      // Reset form
      setSetupData({
        title: '',
        participants: [],
        meetingType: 'informal',
        context: '',
        location: '',
        energyLevel: 5,
        emotionalContext: ''
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Memory Bridge Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Family Check-in, Doctor Visit, Team Sync"
              value={setupData.title}
              onChange={(e) => setSetupData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <Label>Meeting Type</Label>
            <Select 
              value={setupData.meetingType} 
              onValueChange={(value: any) => setSetupData(prev => ({ ...prev, meetingType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informal">Informal</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label>Participants</Label>
            
            <div className="flex gap-2">
              <Input
                placeholder="Name"
                value={newParticipant.name}
                onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1"
              />
              <Input
                placeholder="Relationship"
                value={newParticipant.relationship}
                onChange={(e) => setNewParticipant(prev => ({ ...prev, relationship: e.target.value }))}
                className="flex-1"
              />
              <Button onClick={addParticipant} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {setupData.participants.length > 0 && (
              <div className="space-y-2">
                {setupData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">
                      {participant.name} ({participant.relationship})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParticipant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              placeholder="Where is this meeting taking place?"
              value={setupData.location}
              onChange={(e) => setSetupData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Current Energy Level
            </Label>
            <div className="px-3">
              <Slider
                value={[setupData.energyLevel || 5]}
                onValueChange={([value]) => setSetupData(prev => ({ ...prev, energyLevel: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Low</span>
                <span>{setupData.energyLevel}/10</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <Label htmlFor="context">Meeting Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="What's the purpose or background of this meeting?"
              value={setupData.context}
              onChange={(e) => setSetupData(prev => ({ ...prev, context: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Emotional Context */}
          <div className="space-y-2">
            <Label htmlFor="emotionalContext">Emotional Context (Optional)</Label>
            <Textarea
              id="emotionalContext"
              placeholder="How are you feeling about this meeting? Any concerns or expectations?"
              value={setupData.emotionalContext}
              onChange={(e) => setSetupData(prev => ({ ...prev, emotionalContext: e.target.value }))}
              rows={2}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleStart} 
            disabled={!setupData.title.trim()}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Start Recording
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}