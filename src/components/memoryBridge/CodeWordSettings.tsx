import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useCodeWordDetection } from '@/hooks/useCodeWordDetection';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  TestTube,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeWordSettingsProps {
  onCodeWordDetected: () => void;
}

export function CodeWordSettings({ onCodeWordDetected }: CodeWordSettingsProps) {
  const {
    isListening,
    isCodeWordDetected,
    settings,
    updateSettings,
    testCodeWord
  } = useCodeWordDetection(onCodeWordDetected);

  const handleCodeWordChange = (value: string) => {
    updateSettings({ codeWord: value });
  };

  const handleSensitivityChange = (value: number[]) => {
    updateSettings({ sensitivity: value[0] });
  };

  const suggestionWords = [
    'Memory Bridge',
    'Promise Keeper',
    'Trust Builder',
    'Family Time',
    'Remember This',
    'Start Recording'
  ];

  return (
    <Card className="border-2 border-memory-emerald/30 bg-gradient-to-br from-memory-emerald/5 to-brain-health/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Crown className="h-6 w-6 text-memory-emerald" />
            {isCodeWordDetected && (
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-brain-health animate-pulse" />
              </div>
            )}
          </div>
          <span className="bg-gradient-to-r from-memory-emerald to-brain-health bg-clip-text text-transparent">
            Personal Code Word Activation
          </span>
          <Badge 
            variant={isListening ? "default" : "secondary"}
            className={isListening ? "bg-gradient-to-r from-memory-emerald to-brain-health text-white" : ""}
          >
            {isListening ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Set up a personal trigger phrase to automatically start recording when you speak it
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg border border-memory-emerald/20 bg-memory-emerald/5">
          <div className="space-y-1">
            <Label htmlFor="enable-codeword" className="flex items-center gap-2 font-semibold">
              <Zap className="h-4 w-4 text-memory-emerald" />
              Enable Voice Activation
            </Label>
            <p className="text-sm text-muted-foreground">
              Always listen for your personal code word in the background
            </p>
          </div>
          <Switch
            id="enable-codeword"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSettings({ enabled: checked })}
          />
        </div>

        {/* Code Word Input */}
        <div className="space-y-3">
          <Label htmlFor="code-word" className="font-semibold">Your Personal Code Word</Label>
          <Input
            id="code-word"
            value={settings.codeWord}
            onChange={(e) => handleCodeWordChange(e.target.value)}
            placeholder="Enter your trigger phrase..."
            className="border-memory-emerald/30 focus:border-memory-emerald focus:ring-memory-emerald"
          />
          
          {/* Suggestion Buttons */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Quick Suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {suggestionWords.map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCodeWordChange(word)}
                  className="text-xs border-memory-emerald/30 hover:bg-memory-emerald/10 hover:border-memory-emerald/50"
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sensitivity Slider */}
        <div className="space-y-3">
          <Label className="font-semibold">Detection Sensitivity</Label>
          <div className="space-y-2">
            <Slider
              value={[settings.sensitivity]}
              onValueChange={handleSensitivityChange}
              max={1}
              min={0.3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less Sensitive</span>
              <span className="font-medium text-memory-emerald">
                {Math.round(settings.sensitivity * 100)}%
              </span>
              <span>More Sensitive</span>
            </div>
          </div>
        </div>

        {/* Feedback Options */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-brain-health/20 bg-brain-health/5">
            <div className="flex items-center gap-2">
              {settings.visualFeedback ? <Eye className="h-4 w-4 text-brain-health" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              <Label htmlFor="visual-feedback" className="text-sm font-medium">Visual</Label>
            </div>
            <Switch
              id="visual-feedback"
              checked={settings.visualFeedback}
              onCheckedChange={(checked) => updateSettings({ visualFeedback: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg border border-brain-health/20 bg-brain-health/5">
            <div className="flex items-center gap-2">
              {settings.soundFeedback ? <Volume2 className="h-4 w-4 text-brain-health" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
              <Label htmlFor="sound-feedback" className="text-sm font-medium">Sound</Label>
            </div>
            <Switch
              id="sound-feedback"
              checked={settings.soundFeedback}
              onCheckedChange={(checked) => updateSettings({ soundFeedback: checked })}
            />
          </div>
        </div>

        {/* Test Button */}
        <div className="pt-4 border-t border-memory-emerald/20">
          <Button
            onClick={testCodeWord}
            variant="outline"
            className="w-full border-2 border-memory-emerald/50 hover:bg-gradient-to-r hover:from-memory-emerald/10 hover:to-brain-health/10 hover:border-memory-emerald"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Test Code Word Detection
          </Button>
        </div>

        {/* Status Indicator */}
        {isListening && (
          <div className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-memory-emerald/10 to-brain-health/10 border border-memory-emerald/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Mic className="h-5 w-5 text-memory-emerald" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-memory-emerald rounded-full animate-pulse" />
              </div>
              <span className="font-medium text-memory-emerald">
                Listening for "{settings.codeWord}"...
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}