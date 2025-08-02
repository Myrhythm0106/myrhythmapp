import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, MicOff, Ear, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';

export function AmbientModeToggle() {
  const [ambientMode, setAmbientMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceActivity, setVoiceActivity] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startAmbientListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setMediaStream(stream);
      setIsListening(true);
      
      // Create audio context for voice activity detection
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Voice activity detection
      const detectVoiceActivity = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        
        // Detect voice activity (threshold can be adjusted)
        const hasVoiceActivity = average > 30;
        setVoiceActivity(hasVoiceActivity);
        
        if (isListening) {
          requestAnimationFrame(detectVoiceActivity);
        }
      };
      
      detectVoiceActivity();
      toast.success('Ambient mode activated - listening for conversations');
      
    } catch (error) {
      console.error('Error starting ambient listening:', error);
      toast.error('Failed to start ambient mode. Please check microphone permissions.');
      setAmbientMode(false);
    }
  };

  const stopAmbientListening = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsListening(false);
    setVoiceActivity(false);
    toast.info('Ambient mode deactivated');
  };

  const handleToggle = async (enabled: boolean) => {
    setAmbientMode(enabled);
    
    if (enabled) {
      await startAmbientListening();
    } else {
      stopAmbientListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ear className="h-5 w-5 text-primary" />
          Ambient Mode
          {isListening && (
            <Badge variant="secondary" className="ml-2">
              {voiceActivity ? (
                <>
                  <Mic className="h-3 w-3 mr-1 text-green-500" />
                  Active
                </>
              ) : (
                <>
                  <MicOff className="h-3 w-3 mr-1 text-muted-foreground" />
                  Listening
                </>
              )}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="ambient-mode"
            checked={ambientMode}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="ambient-mode">
            {ambientMode ? 'Ambient Recording Active' : 'Enable Ambient Recording'}
          </Label>
        </div>

        {ambientMode && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Ambient mode listens for conversations in the background. When voice activity is detected, 
              you'll get a quick notification to start formal recording if needed.
            </AlertDescription>
          </Alert>
        )}

        {!ambientMode && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Enable ambient mode to never miss important conversations. The app will listen for voice 
              activity and prompt you to record when commitments are being discussed.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium">How it works:</p>
          <ul className="space-y-1 text-xs">
            <li>• Listens for voice activity in the background</li>
            <li>• Shows notification when conversation is detected</li>
            <li>• One-tap to start formal PACT recording</li>
            <li>• Perfect for catching unplanned family discussions</li>
            <li>• Automatically pauses when you're away</li>
          </ul>
        </div>

        {isListening && (
          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${voiceActivity ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`}></div>
              <span className="text-xs font-medium">
                {voiceActivity ? 'Voice detected' : 'Listening...'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Ambient mode is active. The app is monitoring for conversations that might contain commitments or promises.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}