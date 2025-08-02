import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface CodeWordSettings {
  enabled: boolean;
  codeWord: string;
  sensitivity: number;
  visualFeedback: boolean;
  soundFeedback: boolean;
}

interface UseCodeWordDetectionReturn {
  isListening: boolean;
  isCodeWordDetected: boolean;
  settings: CodeWordSettings;
  startListening: () => Promise<void>;
  stopListening: () => void;
  updateSettings: (newSettings: Partial<CodeWordSettings>) => void;
  testCodeWord: () => void;
}

export function useCodeWordDetection(
  onCodeWordDetected: () => void
): UseCodeWordDetectionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isCodeWordDetected, setIsCodeWordDetected] = useState(false);
  const [settings, setSettings] = useState<CodeWordSettings>({
    enabled: false,
    codeWord: 'Memory Bridge',
    sensitivity: 0.7,
    visualFeedback: true,
    soundFeedback: true
  });

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const playNotificationSound = useCallback(() => {
    if (!settings.soundFeedback) return;
    
    // Create a pleasant notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, [settings.soundFeedback]);

  const triggerCodeWordDetection = useCallback(() => {
    setIsCodeWordDetected(true);
    
    if (settings.visualFeedback) {
      toast.success(`🎯 "${settings.codeWord}" detected! Starting recording...`, {
        duration: 3000,
        style: {
          background: 'linear-gradient(135deg, hsl(158, 85%, 55%), hsl(173, 90%, 50%))',
          color: 'white',
          border: 'none',
          fontWeight: '600'
        }
      });
    }
    
    playNotificationSound();
    onCodeWordDetected();
    
    // Reset detection state after 2 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsCodeWordDetected(false);
    }, 2000);
  }, [settings, onCodeWordDetected, playNotificationSound]);

  const startListening = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Just checking permission
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('🎤 Code word detection started');
      };
      
      recognitionRef.current.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const transcript = lastResult[0].transcript.toLowerCase().trim();
          const codeWord = settings.codeWord.toLowerCase().trim();
          
          console.log('🔍 Transcript:', transcript);
          
          // Fuzzy matching for code word detection
          if (transcript.includes(codeWord)) {
            console.log('✅ Code word detected!', codeWord);
            triggerCodeWordDetection();
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone permission denied. Please allow microphone access.');
        }
      };
      
      recognitionRef.current.onend = () => {
        console.log('🔄 Speech recognition ended, restarting...');
        if (settings.enabled && isListening) {
          // Auto-restart for continuous listening
          setTimeout(() => {
            if (recognitionRef.current && settings.enabled) {
              recognitionRef.current.start();
            }
          }, 1000);
        }
      };
      
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('Failed to start code word detection:', error);
      toast.error('Failed to access microphone for code word detection');
    }
  }, [settings, isListening, triggerCodeWordDetection]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    console.log('🛑 Code word detection stopped');
  }, []);

  const updateSettings = useCallback((newSettings: Partial<CodeWordSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    
    // Restart listening if settings changed while active
    if (isListening && (newSettings.enabled !== undefined || newSettings.codeWord !== undefined)) {
      stopListening();
      if (newSettings.enabled !== false) {
        setTimeout(startListening, 500);
      }
    }
  }, [isListening, startListening, stopListening]);

  const testCodeWord = useCallback(() => {
    toast.info(`Testing code word: "${settings.codeWord}"`, {
      description: 'Say your code word now...',
      duration: 5000
    });
    
    setTimeout(() => {
      triggerCodeWordDetection();
    }, 2000);
  }, [settings.codeWord, triggerCodeWordDetection]);

  // Auto-start listening when enabled
  useEffect(() => {
    if (settings.enabled && !isListening) {
      startListening();
    } else if (!settings.enabled && isListening) {
      stopListening();
    }
  }, [settings.enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    isCodeWordDetected,
    settings,
    startListening,
    stopListening,
    updateSettings,
    testCodeWord
  };
}