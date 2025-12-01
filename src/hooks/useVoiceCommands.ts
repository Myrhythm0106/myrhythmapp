import { useState, useCallback, useEffect } from 'react';
import { speechRecognitionService, SpeechRecognitionResult } from '@/utils/speechRecognition';
import { speechService } from '@/utils/speechSynthesis';
import { toast } from 'sonner';

export interface VoiceCommandCallbacks {
  onDone?: () => void;
  onSkip?: () => void;
  onSchedule?: () => void;
  onRead?: () => void;
  onHelp?: () => void;
}

interface UseVoiceCommandsReturn {
  isListening: boolean;
  isSupported: boolean;
  lastCommand: string | null;
  lastTranscript: string | null;
  startListening: () => void;
  stopListening: () => void;
  speakConfirmation: (message: string) => Promise<void>;
  speakAction: (actionText: string) => Promise<void>;
}

const CONFIRMATION_MESSAGES = {
  done: [
    "Amazing job! You did it!",
    "Wonderful! That's complete!",
    "Great work! Moving forward!",
    "You're incredible! Done!",
  ],
  skip: [
    "No problem. Here's your next step.",
    "That's okay. Moving on.",
    "We'll come back to that later.",
  ],
  notUnderstood: [
    "I didn't catch that. Try saying 'Done' or 'Skip'.",
    "Hmm, I didn't understand. Say 'Help' for options.",
  ],
  help: "You can say: Done to complete, Skip to move on, Schedule to plan it, or Read to hear the action.",
};

export function useVoiceCommands(callbacks: VoiceCommandCallbacks): UseVoiceCommandsReturn {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string | null>(null);

  const isSupported = speechRecognitionService.isAvailable();

  const speakConfirmation = useCallback(async (message: string) => {
    if (speechService.isAvailable()) {
      try {
        await speechService.speak(message, { rate: 0.85, volume: 0.9 });
      } catch (error) {
        console.error('Speech error:', error);
      }
    }
  }, []);

  const speakAction = useCallback(async (actionText: string) => {
    if (speechService.isAvailable()) {
      try {
        await speechService.speak(actionText, { rate: 0.8, volume: 0.9 });
      } catch (error) {
        console.error('Speech error:', error);
      }
    }
  }, []);

  const getRandomMessage = (messages: string[]): string => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleResult = useCallback((result: SpeechRecognitionResult) => {
    setLastTranscript(result.transcript);
    
    if (result.command) {
      setLastCommand(result.command);
      
      switch (result.command) {
        case 'done':
          speakConfirmation(getRandomMessage(CONFIRMATION_MESSAGES.done));
          callbacks.onDone?.();
          break;
        case 'skip':
          speakConfirmation(getRandomMessage(CONFIRMATION_MESSAGES.skip));
          callbacks.onSkip?.();
          break;
        case 'schedule':
          callbacks.onSchedule?.();
          break;
        case 'read':
          callbacks.onRead?.();
          break;
        case 'help':
          speakConfirmation(CONFIRMATION_MESSAGES.help);
          callbacks.onHelp?.();
          break;
      }
    } else {
      // Command not recognized
      speakConfirmation(getRandomMessage(CONFIRMATION_MESSAGES.notUnderstood));
      toast.info(`Heard: "${result.transcript}"`, {
        description: "Try saying 'Done', 'Skip', or 'Help'",
      });
    }
  }, [callbacks, speakConfirmation]);

  const handleError = useCallback((error: string) => {
    setIsListening(false);
    toast.error(error);
  }, []);

  const handleEnd = useCallback(() => {
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error('Voice commands not supported in this browser');
      return;
    }
    
    setIsListening(true);
    setLastCommand(null);
    setLastTranscript(null);
    
    speechRecognitionService.startListening(handleResult, handleError, handleEnd);
  }, [isSupported, handleResult, handleError, handleEnd]);

  const stopListening = useCallback(() => {
    speechRecognitionService.stopListening();
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechRecognitionService.stopListening();
    };
  }, []);

  return {
    isListening,
    isSupported,
    lastCommand,
    lastTranscript,
    startListening,
    stopListening,
    speakConfirmation,
    speakAction,
  };
}
