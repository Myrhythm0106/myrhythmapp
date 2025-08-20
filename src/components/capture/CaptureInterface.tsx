import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Save, 
  RefreshCw,
  CheckCircle,
  Clock,
  Brain,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

interface CaptureInterfaceProps {
  onCaptureSaved: (captureData: any) => void;
}

interface CaptureData {
  id: string;
  timestamp: number;
  duration: number;
  transcription: string;
  audioBlob?: Blob;
  isProcessing: boolean;
}

export function CaptureInterface({ onCaptureSaved }: CaptureInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentCapture, setCurrentCapture] = useState<CaptureData | null>(null);
  const [isProcessingACTs, setIsProcessingACTs] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const newCapture: CaptureData = {
          id: `capture-${Date.now()}`,
          timestamp: Date.now(),
          duration,
          transcription: 'Processing transcription...',
          audioBlob,
          isProcessing: true
        };
        
        setCurrentCapture(newCapture);
        // Simulate transcription processing
        setTimeout(() => {
          setCurrentCapture(prev => prev ? {
            ...prev,
            transcription: 'Here is your transcribed conversation. The system has identified key topics and is ready to extract actionable items.',
            isProcessing: false
          } : null);
        }, 2000);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('Recording started');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success('Recording saved');
    }
  };

  const togglePlayback = () => {
    if (!currentCapture?.audioBlob) return;
    
    if (!audioRef.current) {
      const audio = new Audio(URL.createObjectURL(currentCapture.audioBlob));
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
    }
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExtractACTs = () => {
    if (!currentCapture) return;
    
    setIsProcessingACTs(true);
    
    // Simulate ACTS extraction
    setTimeout(() => {
      const actsData = {
        captureId: currentCapture.id,
        extractedACTs: [
          {
            id: 'act-1',
            action: 'Schedule meeting with Dr. Smith',
            context: 'Follow-up appointment needed',
            timeframe: 'This week',
            support: 'None required',
            priority: 'high'
          },
          {
            id: 'act-2',
            action: 'Pick up prescription',
            context: 'New medication from pharmacy',
            timeframe: 'Tomorrow',
            support: 'Ask partner to drive',
            priority: 'medium'
          }
        ],
        captureData: currentCapture
      };
      
      setIsProcessingACTs(false);
      onCaptureSaved(actsData);
      
      // Reset for next capture
      setCurrentCapture(null);
      setDuration(0);
      audioRef.current = null;
      
      toast.success('ACTS extracted successfully!');
    }, 3000);
  };

  const resetCapture = () => {
    setCurrentCapture(null);
    setDuration(0);
    setIsPlaying(false);
    setIsPaused(false);
    audioRef.current = null;
    toast.info('Ready for new capture');
  };

  return (
    <>
      <LoadingOverlay 
        isVisible={isProcessingACTs}
        message="Extracting your ACTS (Actions, Context, Timeframe, Support)..."
      />
      
      <div className="space-y-6">
        {/* Recording Interface */}
        <Card className="border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-memory-emerald-800">
              <Brain className="h-5 w-5" />
              <span>Memory Bridge - Quick Capture</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Recording Controls */}
            <div className="text-center space-y-4">
              {!isRecording && !currentCapture && (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                    onClick={startRecording}
                  >
                    <Mic className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-brain-health-700">Ready to capture</p>
                    <p className="text-sm text-brain-health-600">Tap to start recording</p>
                  </div>
                </div>
              )}
              
              {isRecording && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                      <Square className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-red-100 text-red-700">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(duration)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-red-600">Recording in progress...</p>
                    <p className="text-sm text-brain-health-600">Speak naturally and clearly</p>
                  </div>
                  
                  <Button
                    onClick={stopRecording}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 text-white"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop & Save
                  </Button>
                </div>
              )}
            </div>
            
            {/* Playback & Processing */}
            {currentCapture && (
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-memory-emerald-100 text-memory-emerald-700 mb-4">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Capture Saved ({formatDuration(currentCapture.duration)})
                  </Badge>
                </div>
                
                {/* Playback Controls */}
                <div className="flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePlayback}
                    disabled={currentCapture.isProcessing}
                    className="border-brain-health-200 hover:bg-brain-health-50"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCapture}
                    className="border-brain-health-200 hover:bg-brain-health-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Transcription */}
                <Card className="border-brain-health-100 bg-brain-health-50/30">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-brain-health-600" />
                        <span className="text-sm font-medium text-brain-health-700">Transcription</span>
                        {currentCapture.isProcessing && (
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-brain-health-400 rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-brain-health-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-brain-health-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-brain-health-600 italic">
                        {currentCapture.transcription}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Extract ACTS Button */}
                {!currentCapture.isProcessing && (
                  <div className="text-center">
                    <Button
                      onClick={handleExtractACTs}
                      className="bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 hover:opacity-90 text-white"
                      disabled={isProcessingACTs}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Extract ACTS & Schedule
                    </Button>
                    <p className="text-xs text-brain-health-500 mt-2">
                      We'll identify Actions, Context, Timeframe & Support needed
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Tips */}
        <Card className="border-clarity-teal-200 bg-gradient-to-r from-clarity-teal-50/30 to-brain-health-50/30">
          <CardContent className="p-4">
            <div className="space-y-2">
              <h4 className="font-medium text-clarity-teal-800 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                Brain-Friendly Capture Tips
              </h4>
              <ul className="text-sm text-clarity-teal-700 space-y-1">
                <li>• Speak clearly and at a comfortable pace</li>
                <li>• Include context: "This is about my appointment with..."</li>
                <li>• Mention timeframes: "Need to do this by Friday"</li>
                <li>• Note if you need help: "Ask Sarah to remind me"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}