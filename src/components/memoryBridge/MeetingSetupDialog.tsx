import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Users, MapPin, Heart, Battery } from 'lucide-react';
import { MeetingSetupData } from '@/types/memoryBridge';

interface MeetingSetupDialogProps {
  onStartMeeting: (setupData: MeetingSetupData) => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export function MeetingSetupDialog({ onStartMeeting, onClose, isLoading }: MeetingSetupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState<{ name: string; relationship: string }[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', relationship: '' });
  const [meetingType, setMeetingType] = useState<'formal' | 'informal' | 'family' | 'medical'>('informal');
  const [context, setContext] = useState('');
  const [location, setLocation] = useState('');
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [emotionalContext, setEmotionalContext] = useState('');

  const relationshipTypes = [
    'spouse', 'child', 'parent', 'sibling', 'friend', 'colleague', 
    'healthcare', 'neighbor', 'family_friend', 'other'
  ];

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.relationship) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant({ name: '', relationship: '' });
    }
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleStartMeeting = () => {
    if (!title) return;

    const setupData: MeetingSetupData = {
      title,
      participants,
      meetingType,
      context: context || undefined,
      location: location || undefined,
      energyLevel: energyLevel || undefined,
      emotionalContext: emotionalContext || undefined,
    };

    onStartMeeting(setupData);
    setIsOpen(false);
    
    // Reset form
    setTitle('');
    setParticipants([]);
    setContext('');
    setLocation('');
    setEnergyLevel(3);
    setEmotionalContext('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary-glow text-white shadow-elegant hover:shadow-glow transition-all duration-300 flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Start PACT Recording
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-6 w-6 text-primary" />
            PACT Recording Setup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Family planning meeting, Doctor visit with Mom, Promise to help John"
              className="w-full"
            />
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <Label>Meeting Type</Label>
            <Select value={meetingType} onValueChange={(value) => setMeetingType(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informal">Informal (casual conversation)</SelectItem>
                <SelectItem value="family">Family (family discussion)</SelectItem>
                <SelectItem value="formal">Formal (structured meeting)</SelectItem>
                <SelectItem value="medical">Medical (healthcare appointment)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Who's Participating?
            </Label>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    placeholder="Name"
                    value={newParticipant.name}
                    onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  />
                  <Select
                    value={newParticipant.relationship}
                    onValueChange={(value) => setNewParticipant({ ...newParticipant, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationshipTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={addParticipant} 
                    variant="outline" 
                    disabled={!newParticipant.name || !newParticipant.relationship}
                  >
                    Add
                  </Button>
                </div>

                {participants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {participants.map((participant, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeParticipant(index)}
                      >
                        {participant.name} ({participant.relationship})
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Context & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location (optional)
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Home, restaurant, office..."
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                Energy Level
              </Label>
              <Select value={energyLevel.toString()} onValueChange={(value) => setEnergyLevel(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Very Low</SelectItem>
                  <SelectItem value="2">2 - Low</SelectItem>
                  <SelectItem value="3">3 - Medium</SelectItem>
                  <SelectItem value="4">4 - High</SelectItem>
                  <SelectItem value="5">5 - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context */}
          <div className="space-y-2">
            <Label htmlFor="context">What promises or commitments might come up? (optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What are you hoping to accomplish? What commitments might you make? Who is counting on you?"
              rows={2}
            />
          </div>

          {/* Emotional Context */}
          <div className="space-y-2">
            <Label htmlFor="emotional-context">Why This Matters (optional)</Label>
            <Textarea
              id="emotional-context"
              value={emotionalContext}
              onChange={(e) => setEmotionalContext(e.target.value)}
              placeholder="Who is this important to? What relationships are at stake? How will keeping promises here impact your life?"
              rows={2}
            />
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartMeeting}
            disabled={!title || isLoading}
            className="w-full bg-gradient-to-r from-primary to-primary-glow text-white"
          >
            {isLoading ? 'Starting PACT Recording...' : 'Start Promise Keeper Recording'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}