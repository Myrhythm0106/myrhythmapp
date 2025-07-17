import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, Vibrate, Eye, Mic, Upload } from 'lucide-react';

interface ReminderVolumeIntensityProps {
  volume: number;
  vibrationEnabled: boolean;
  vibrationIntensity: 'gentle' | 'medium' | 'strong';
  alertTypes: string[];
  voiceNoteUrl?: string;
  onVolumeChange: (volume: number) => void;
  onVibrationToggle: (enabled: boolean) => void;
  onVibrationIntensityChange: (intensity: 'gentle' | 'medium' | 'strong') => void;
  onAlertTypeToggle: (type: string) => void;
  onVoiceNoteUpload: (file: File) => void;
}

export function ReminderVolumeIntensity({
  volume,
  vibrationEnabled,
  vibrationIntensity,
  alertTypes,
  voiceNoteUrl,
  onVolumeChange,
  onVibrationToggle,
  onVibrationIntensityChange,
  onAlertTypeToggle,
  onVoiceNoteUpload
}: ReminderVolumeIntensityProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      onVoiceNoteUpload(file);
    }
  };

  const alertTypeOptions = [
    { id: 'audio', label: 'Audio Alert', icon: Volume2, description: 'Sound notifications' },
    { id: 'vibration', label: 'Vibration', icon: Vibrate, description: 'Tactile alerts' },
    { id: 'visual', label: 'Visual Flash', icon: Eye, description: 'Screen flash alerts' },
    { id: 'voice', label: 'Voice Reminder', icon: Mic, description: 'Spoken reminders' }
  ];

  return (
    <div className="space-y-6 p-4 bg-gradient-to-br from-blue-50/30 to-purple-50/30 rounded-lg border border-blue-200/20">
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Alert Volume & Intensity
        </Label>
        <p className="text-sm text-muted-foreground">
          Customize how you'll be notified to ensure you never miss important reminders
        </p>
      </div>

      {/* Volume Control */}
      <div className="space-y-3">
        <Label htmlFor="volume">Audio Volume: {volume}/10</Label>
        <Slider
          id="volume"
          min={1}
          max={10}
          step={1}
          value={[volume]}
          onValueChange={(value) => onVolumeChange(value[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Gentle</span>
          <span>Loud & Clear</span>
        </div>
      </div>

      {/* Alert Types */}
      <div className="space-y-3">
        <Label>Notification Types</Label>
        <div className="grid grid-cols-2 gap-3">
          {alertTypeOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = alertTypes.includes(option.id);
            
            return (
              <div
                key={option.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 shadow-sm' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onAlertTypeToggle(option.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && <Badge variant="secondary" className="text-xs">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vibration Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="vibration">Vibration Alerts</Label>
          <Switch
            id="vibration"
            checked={vibrationEnabled}
            onCheckedChange={onVibrationToggle}
          />
        </div>

        {vibrationEnabled && (
          <div className="space-y-2">
            <Label>Vibration Intensity</Label>
            <Select value={vibrationIntensity} onValueChange={onVibrationIntensityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gentle">Gentle (for sensitive users)</SelectItem>
                <SelectItem value="medium">Medium (standard)</SelectItem>
                <SelectItem value="strong">Strong (ensure you feel it)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Voice Note Upload */}
      <div className="space-y-3">
        <Label>Personal Voice Reminder</Label>
        <p className="text-sm text-muted-foreground">
          Upload a voice note from someone you trust to make reminders more personal and effective
        </p>
        
        {voiceNoteUrl ? (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
            <Mic className="h-4 w-4 text-primary" />
            <span className="text-sm">Voice reminder uploaded</span>
            <Button size="sm" variant="outline" onClick={() => {
              const audio = new Audio(voiceNoteUrl);
              audio.play();
            }}>
              Test Play
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="voice-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('voice-upload')?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Voice Note
            </Button>
          </div>
        )}
      </div>

      {/* Brain Injury Specific Features */}
      <div className="p-3 bg-yellow-50/50 border border-yellow-200/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
          <span className="text-sm font-medium">Brain Injury Support Features</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Progressive escalation: Starts gentle, increases if no response</p>
          <p>• Multiple backup alerts: Ensures you're always notified</p>
          <p>• Cognitive-friendly design: Clear, simple interface</p>
          <p>• Support circle integration: Automatic help if needed</p>
        </div>
      </div>
    </div>
  );
}