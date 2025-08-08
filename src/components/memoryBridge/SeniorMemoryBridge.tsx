import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { useVoiceRecorder } from '@/hooks/voiceRecording/useVoiceRecorder';
import { SeniorRecordingControls } from './SeniorRecordingControls';
import { MyRecordings } from './MyRecordings';
import { InControlLogTable } from './InControlLogTable';
import { Mic, Play, Pause, Volume2, Heart, Clock, CheckCircle, Star, Phone, ZoomIn, ZoomOut, Sun, Moon, FolderOpen, Archive, Target } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'record' | 'recordings' | 'incontrol'>('record');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleRecordingComplete = async (blob: Blob) => {
    setAudioBlob(blob);
    try {
      const setupData: MeetingSetupData = {
        title: 'InControl Recording',
        participants: [{
          name: 'Me',
          relationship: 'self'
        }],
        meetingType: 'informal'
      };

      // Start and immediately stop meeting recording with the blob
      const meetingRecord = await startMeetingRecording(setupData, null);
      if (meetingRecord) {
        await stopMeetingRecording(blob);
        toast.success('✨ Recording processed! Looking for your InControl items...', {
          duration: 5000,
          style: {
            fontSize: `${fontSize}px`
          }
        });
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Problem processing recording. Please try again.', {
        style: {
          fontSize: `${fontSize}px`
        }
      });
    }
  };
  const handleSavedRecording = (recording: any) => {
    toast.success('Recording saved to "My Recordings"!', {
      style: {
        fontSize: `${fontSize}px`
      }
    });
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
            style: {
              fontSize: `${fontSize}px`
            }
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
        style: {
          fontSize: `${fontSize}px`
        }
      });
    }
  };
  const handleConfirmPromise = async (actionId: string, isConfirmed: boolean) => {
    try {
      await confirmAction(actionId, isConfirmed ? 'confirmed' : 'rejected');
      if (isConfirmed) {
        // Show celebration
        toast.success('🎉 Item confirmed! You\'re in complete control!', {
          duration: 6000,
          style: {
            fontSize: `${fontSize}px`,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white'
          }
        });
      } else {
        toast.success('Item removed. No worries!', {
          style: {
            fontSize: `${fontSize}px`
          }
        });
      }
    } catch (error) {
      toast.error('Could not update item', {
        style: {
          fontSize: `${fontSize}px`
        }
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
  const totalItems = extractedActions.length;
  const keptItems = extractedActions.filter(a => a.status === 'confirmed' || a.status === 'completed').length;
  const controlStars = Math.min(5, Math.ceil(keptItems / Math.max(totalItems, 1) * 5));

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
  const darkModeClasses = isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
  return <div className={`min-h-screen p-6 ${darkModeClasses}`} style={{
    fontSize: `${fontSize}px`
  }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Accessibility Controls */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Button onClick={() => setFontSize(Math.max(16, fontSize - 2))} size="lg" variant="outline" className="h-16 w-16">
              <ZoomOut className="h-8 w-8" />
            </Button>
            <Button onClick={() => setFontSize(Math.min(32, fontSize + 2))} size="lg" variant="outline" className="h-16 w-16">
              <ZoomIn className="h-8 w-8" />
            </Button>
            <Button onClick={() => setIsDarkMode(!isDarkMode)} size="lg" variant="outline" className="h-16 w-16">
              {isDarkMode ? <Sun className="h-8 w-8" /> : <Moon className="h-8 w-8" />}
            </Button>
          </div>
          
          {/* Emergency Button */}
          <Button onClick={emergencyCall} size="lg" className="h-16 bg-red-500 hover:bg-red-600 text-white px-8">
            <Phone className="h-8 w-8 mr-4" />
            Call Family
          </Button>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-6">
          <h1 className="font-bold leading-relaxed" style={{
          fontSize: `${fontSize + 24}px`
        }}>Memory Capture</h1>
          <p className="font-medium" style={{
          fontSize: `${fontSize + 8}px`
        }}>Never forget what's important</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-2 shadow-sm border">
            <div className="flex gap-2">
              <Button 
                onClick={() => setActiveTab('record')} 
                variant={activeTab === 'record' ? 'default' : 'ghost'} 
                size="lg" 
                className="text-lg px-6 h-16 whitespace-nowrap"
              >
                <Mic className="h-6 w-6 mr-2" />
                Record
              </Button>
              <Button 
                onClick={() => setActiveTab('recordings')} 
                variant={activeTab === 'recordings' ? 'default' : 'ghost'} 
                size="lg" 
                className="text-lg px-6 h-16 whitespace-nowrap"
              >
                <FolderOpen className="h-6 w-6 mr-2" />
                My Recordings
              </Button>
              <Button 
                onClick={() => setActiveTab('incontrol')} 
                variant={activeTab === 'incontrol' ? 'default' : 'ghost'} 
                size="lg" 
                className="text-lg px-6 h-16 whitespace-nowrap"
              >
                <Target className="h-6 w-6 mr-2" />
                InControl Log
              </Button>
            </div>
          </div>
        </div>

        {/* Control Score Display */}
        {totalItems > 0 && <Card className="border-4 border-green-200 bg-green-50">
            <CardContent className="text-center py-8">
              <div className="space-y-4">
                <div className="text-6xl font-bold text-green-600">
                  {keptItems}
                </div>
                <p className="text-2xl font-semibold text-green-800">
                  Items Completed
                </p>
                <div className="flex justify-center gap-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className={`h-12 w-12 ${i < controlStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                </div>
                <p className="text-xl text-green-700 font-medium">
                  You're in complete control! 
                </p>
              </div>
            </CardContent>
          </Card>}

        {/* Tab Content */}
        {activeTab === 'record' && <Card className="border-4 border-blue-300 bg-blue-50">
            <CardContent className="py-12">
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold text-blue-800">
                  InControl Recording
                </h2>
                <p className="text-xl text-blue-600">
                  Complete Life Management System
                </p>
                
                <SeniorRecordingControls onRecordingComplete={handleRecordingComplete} onSavedRecording={handleSavedRecording} />
              </div>
            </CardContent>
          </Card>}

        {activeTab === 'recordings' && <Card className="border-4 border-purple-300 bg-purple-50">
            <CardContent className="py-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-purple-800">
                  My Recordings
                </h2>
                <MyRecordings onSelectRecording={recording => {
              console.log('Selected recording:', recording);
              toast.success(`Playing: ${recording.title}`, {
                style: {
                  fontSize: `${fontSize}px`
                }
              });
            }} />
              </div>
            </CardContent>
          </Card>}

        {activeTab === 'incontrol' && <Card className="border-4 border-[hsl(var(--brain-health))]/30 bg-[hsl(var(--brain-health))]/5">
            <CardContent className="py-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-[hsl(var(--brain-health))]">
                  InControl Log
                </h2>
                <InControlLogTable 
                  items={extractedActions}
                  onUpdateItem={(itemId, updates) => {
                    console.log('Update item:', itemId, updates);
                    toast.success('Item updated successfully', {
                      style: {
                        fontSize: `${fontSize}px`
                      }
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>}

        {/* Your InControl Items */}
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-center">Your InControl Items</h2>
          
          {extractedActions.length === 0 ? <Card className="border-4 border-gray-200">
              <CardContent className="text-center py-12">
                <Heart className="h-24 w-24 mx-auto mb-6 text-gray-400" />
                <p className="text-2xl text-gray-600">
                  No InControl items yet. Start recording to see them here!
                </p>
              </CardContent>
            </Card> : <div className="space-y-6">
              {extractedActions.map(action => <Card key={action.id} className="border-4 border-purple-200 bg-purple-50">
                  <CardContent className="py-8">
                    <div className="space-y-6">
                      {/* Item Text */}
                      <div className="text-center">
                        <p className="text-2xl font-semibold text-purple-900 leading-relaxed">
                          {action.action_text}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex justify-center">
                        <Badge className={`text-xl px-6 py-2 ${action.status === 'confirmed' ? 'bg-green-200 text-green-800' : action.status === 'completed' ? 'bg-blue-200 text-blue-800' : 'bg-orange-200 text-orange-800'}`}>
                          {action.status === 'confirmed' ? '✓ Confirmed' : action.status === 'completed' ? '✓ Done' : 'Needs Your Review'}
                        </Badge>
                      </div>

                      {/* Priority Hearts */}
                      <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => <Heart key={i} className={`h-8 w-8 ${i < Math.ceil(action.priority_level / 2) ? 'text-red-500 fill-current' : 'text-gray-300'}`} />)}
                      </div>

                      {/* Audio Playback */}
                      {action.transcript_excerpt && <div className="flex justify-center">
                          <Button onClick={() => handlePlayRecording(action.id, 'audio-placeholder')} size="lg" variant="outline" className="h-16 px-8 text-xl">
                            {playingAudio === action.id ? <>
                                <Pause className="h-8 w-8 mr-4" />
                                Stop Playback
                              </> : <>
                                <Play className="h-8 w-8 mr-4" />
                                Listen Again
                              </>}
                          </Button>
                        </div>}

                      {/* Confirmation Buttons */}
                      {action.status === 'pending' && <div className="space-y-4">
                          <p className="text-2xl text-center text-purple-800 font-medium">
                            Is this InControl item correct?
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button onClick={() => handleConfirmPromise(action.id, true)} size="lg" className="h-20 bg-green-500 hover:bg-green-600 text-white text-2xl">
                              <CheckCircle className="h-8 w-8 mr-4" />
                              Yes, Confirm This
                            </Button>
                            <Button onClick={() => handleConfirmPromise(action.id, false)} size="lg" variant="outline" className="h-20 text-red-600 border-red-300 hover:bg-red-50 text-2xl">
                              Not Right
                            </Button>
                          </div>
                        </div>}

                      {/* Success Message */}
                      {action.status === 'confirmed' && <div className="text-center p-6 bg-green-100 rounded-lg">
                          <p className="text-2xl text-green-800 font-semibold">
                            ✨ Item confirmed! You're in control of your life!
                          </p>
                        </div>}
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </div>

        {/* Daily Encouragement */}
        {keptItems > 0 && <Card className="border-4 border-yellow-200 bg-yellow-50">
            <CardContent className="text-center py-8">
              <Star className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <p className="text-3xl font-bold text-yellow-800 mb-2">
                Amazing Work!
              </p>
              <p className="text-2xl text-yellow-700">
                You've kept {keptItems} {keptItems === 1 ? 'commitment' : 'commitments'}. 
                Your family feels so supported!
              </p>
            </CardContent>
          </Card>}
      </div>
    </div>;
}