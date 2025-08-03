import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Clock, 
  CheckCircle,
  Star,
  Phone,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon
} from 'lucide-react';
import { MeetingSetupData } from '@/types/memoryBridge';
import { toast } from 'sonner';

export function SeniorMemoryBridge() {
  const { 
    extractedActions, 
    isRecording, 
    isProcessing, 
    currentMeeting, 
    startMeetingRecording, 
    stopMeetingRecording,
    confirmAction 
  } = useMemoryBridge();
  
  const { 
    startRecording: startVoiceRecording, 
    stopRecording: stopVoiceRecording,
    getRecordingUrl 
  } = useVoiceRecorder();
  
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [fontSize, setFontSize] = useState(20); // Default 20px
  const [isDarkMode, setIsDarkMode] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // One-click recording with auto-setup
  const handleQuickRecord = async () => {
    try {
      console.log('Starting simple recording...');
      
      await startVoiceRecording();
      
      const setupData: MeetingSetupData = {
        title: 'My Conversation',
        participants: [{ name: 'Me', relationship: 'self' }],
        meetingType: 'informal'
      };
      
      const meetingRecord = await startMeetingRecording(setupData, null);
      
      if (meetingRecord) {
        const startTime = new Date();
        setRecordingStartTime(startTime);
        
        intervalRef.current = setInterval(() => {
          const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);
          setCurrentDuration(duration);
        }, 1000);
        
        toast.success('Recording started! Speak naturally about your promises.', {
          style: { fontSize: `${fontSize}px` }
        });
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not start recording. Please try again.', {
        style: { fontSize: `${fontSize}px` }
      });
    }
  };

  const handleStopRecording = async () => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      const audioBlob = await stopVoiceRecording();
      if (!audioBlob) {
        toast.error('Could not save recording', {
          style: { fontSize: `${fontSize}px` }
        });
        return;
      }

      await stopMeetingRecording(audioBlob);
      
      setRecordingStartTime(null);
      setCurrentDuration(0);
      
      toast.success('✨ Recording saved! Looking for your promises now...', {
        duration: 5000,
        style: { fontSize: `${fontSize}px` }
      });
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Problem saving recording. Please try again.', {
        style: { fontSize: `${fontSize}px` }
      });
    }
  };

  const handlePlayRecording = async (recordingId: string, filePath: string) => {
    if (playingAudio === recordingId) {
      // Stop current playback
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
      setPlayingAudio(null);
      return;
    }

    try {
      // Stop any current audio
      if (audioElement) {
        audioElement.pause();
      }

      const url = await getRecordingUrl(filePath);
      if (url) {
        const audio = new Audio(url);
        audio.volume = 1.0; // Full volume
        
        audio.onended = () => {
          setPlayingAudio(null);
          setAudioElement(null);
        };
        
        audio.onerror = () => {
          toast.error('Could not play recording', {
            style: { fontSize: `${fontSize}px` }
          });
          setPlayingAudio(null);
          setAudioElement(null);
        };
        
        await audio.play();
        setPlayingAudio(recordingId);
        setAudioElement(audio);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Could not play recording', {
        style: { fontSize: `${fontSize}px` }
      });
    }
  };

  const handleConfirmPromise = async (actionId: string, isConfirmed: boolean) => {
    try {
      await confirmAction(actionId, isConfirmed ? 'confirmed' : 'rejected');
      
      if (isConfirmed) {
        // Show celebration
        toast.success('🎉 Promise confirmed! You\'re building amazing trust!', {
          duration: 6000,
          style: { 
            fontSize: `${fontSize}px`,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white'
          }
        });
      } else {
        toast.success('Promise removed. No worries!', {
          style: { fontSize: `${fontSize}px` }
        });
      }
    } catch (error) {
      toast.error('Could not update promise', {
        style: { fontSize: `${fontSize}px` }
      });
    }
  };

  const emergencyCall = () => {
    toast.success('Emergency contact feature - would call your designated family member', {
      duration: 8000,
      style: { 
        fontSize: `${fontSize + 4}px`,
        background: '#ef4444',
        color: 'white'
      }
    });
  };

  // Calculate simple stats
  const totalPromises = extractedActions.length;
  const keptPromises = extractedActions.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
  const trustStars = Math.min(5, Math.ceil((keptPromises / Math.max(totalPromises, 1)) * 5));

  // Style classes for font sizing
  const textClasses = {
    xs: `text-[${fontSize - 8}px]`,
    sm: `text-[${fontSize - 4}px]`,
    base: `text-[${fontSize}px]`,
    lg: `text-[${fontSize + 4}px]`,
    xl: `text-[${fontSize + 8}px]`,
    '2xl': `text-[${fontSize + 12}px]`,
    '3xl': `text-[${fontSize + 16}px]`,
    '4xl': `text-[${fontSize + 24}px]`
  };

  const darkModeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen p-6 ${darkModeClasses}`} style={{ fontSize: `${fontSize}px` }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Accessibility Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button
              onClick={() => setFontSize(Math.max(16, fontSize - 2))}
              size="lg"
              variant="outline"
              className="h-16 w-16"
            >
              <ZoomOut className="h-8 w-8" />
            </Button>
            <Button
              onClick={() => setFontSize(Math.min(32, fontSize + 2))}
              size="lg"
              variant="outline"
              className="h-16 w-16"
            >
              <ZoomIn className="h-8 w-8" />
            </Button>
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              size="lg"
              variant="outline"
              className="h-16 w-16"
            >
              {isDarkMode ? <Sun className="h-8 w-8" /> : <Moon className="h-8 w-8" />}
            </Button>
          </div>
          
          {/* Emergency Button */}
          <Button
            onClick={emergencyCall}
            size="lg"
            className="h-16 bg-red-500 hover:bg-red-600 text-white px-8"
          >
            <Phone className="h-8 w-8 mr-4" />
            Call Family
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-6">
          <h1 className="font-bold leading-relaxed" style={{ fontSize: `${fontSize + 24}px` }}>
            Memory Helper
          </h1>
          <p className="font-medium" style={{ fontSize: `${fontSize + 8}px` }}>
            Never forget your promises
          </p>
        </div>

        {/* Trust Score Display */}
        {totalPromises > 0 && (
          <Card className="border-4 border-green-200 bg-green-50">
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-green-600">
                  {keptPromises}
                </div>
                <p className="text-2xl font-semibold text-green-800">
                  Promises Kept
                </p>
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-12 w-12 ${i < trustStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-xl text-green-700 font-medium">
                  Your family feels proud! 
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recording Interface */}
        {isRecording ? (
          <Card className="border-4 border-red-300 bg-red-50">
            <CardContent className="text-center py-12">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <Mic className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <div className="text-6xl font-mono font-bold text-red-600">
                  {formatDuration(currentDuration)}
                </div>
                
                <p className="text-2xl font-semibold text-red-800">
                  Recording your conversation...
                </p>
                
                <Button
                  onClick={handleStopRecording}
                  size="lg"
                  className="h-20 px-12 bg-red-500 hover:bg-red-600 text-white text-2xl"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Saving...' : 'Stop Recording'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-4 border-blue-300 bg-blue-50">
            <CardContent className="text-center py-12">
              <div className="space-y-8">
                <Button
                  onClick={handleQuickRecord}
                  size="lg"
                  className="h-32 px-16 bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold"
                  disabled={isProcessing}
                >
                  <Mic className="h-16 w-16 mr-6" />
                  Start Recording
                </Button>
                
                <p className="text-2xl font-medium text-blue-800">
                  Press to capture your promises
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Promises */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">Your Promises</h2>
          
          {extractedActions.length === 0 ? (
            <Card className="border-4 border-gray-200">
              <CardContent className="text-center py-12">
                <Heart className="h-24 w-24 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl text-gray-600">
                  No promises yet. Start recording to see them here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {extractedActions.map((action) => (
                <Card key={action.id} className="border-4 border-purple-200 bg-purple-50">
                  <CardContent className="py-8">
                    <div className="space-y-6">
                      {/* Promise Text */}
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-purple-900 leading-relaxed">
                          {action.action_text}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <Badge 
                          className={`text-xl px-6 py-2 ${
                            action.status === 'confirmed' ? 'bg-green-200 text-green-800' :
                            action.status === 'completed' ? 'bg-blue-200 text-blue-800' :
                            'bg-orange-200 text-orange-800'
                          }`}
                        >
                          {action.status === 'confirmed' ? '✓ Confirmed' :
                           action.status === 'completed' ? '✓ Done' :
                           'Needs Your Review'}
                        </Badge>
                      </div>

                      {/* Priority Hearts */}
                      <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Heart 
                            key={i} 
                            className={`h-8 w-8 ${i < Math.ceil(action.priority_level / 2) ? 'text-red-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>

                      {/* Audio Playback */}
                      {action.transcript_excerpt && (
                        <div className="flex justify-center">
                          <Button
                            onClick={() => handlePlayRecording(action.id, 'audio-placeholder')}
                            size="lg"
                            variant="outline"
                            className="h-16 px-8 text-xl"
                          >
                            {playingAudio === action.id ? (
                              <>
                                <Pause className="h-8 w-8 mr-4" />
                                Stop Playback
                              </>
                            ) : (
                              <>
                                <Play className="h-8 w-8 mr-4" />
                                Listen Again
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Confirmation Buttons */}
                      {action.status === 'pending' && (
                        <div className="space-y-4">
                          <p className="text-2xl text-center text-purple-800 font-medium">
                            Is this promise correct?
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                              onClick={() => handleConfirmPromise(action.id, true)}
                              size="lg"
                              className="h-20 bg-green-500 hover:bg-green-600 text-white text-2xl"
                            >
                              <CheckCircle className="h-8 w-8 mr-4" />
                              Yes, I Promise This
                            </Button>
                            <Button
                              onClick={() => handleConfirmPromise(action.id, false)}
                              size="lg"
                              variant="outline"
                              className="h-20 text-red-600 border-red-300 hover:bg-red-50 text-2xl"
                            >
                              Not Right
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {action.status === 'confirmed' && (
                        <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-2xl text-green-800 font-semibold">
                            ✨ Promise confirmed! Your family trusts you more each day!
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Daily Encouragement */}
        {keptPromises > 0 && (
          <Card className="border-4 border-yellow-200 bg-yellow-50">
            <CardContent className="text-center py-8">
              <Star className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <p className="text-3xl font-bold text-yellow-800 mb-2">
                Amazing Work!
              </p>
              <p className="text-2xl text-yellow-700">
                You've kept {keptPromises} {keptPromises === 1 ? 'promise' : 'promises'}. 
                Your family feels so supported!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}