// Web Speech API wrapper with fuzzy command matching

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  command?: string;
}

// Commands with variations for brain-injury-friendly tolerance
const COMMAND_VARIATIONS: Record<string, string[]> = {
  'done': ['done', 'complete', 'finished', 'completed', 'i did it', 'mark done', 'yes', 'did it'],
  'skip': ['skip', 'later', 'next', 'not now', 'pass', 'move on', 'next one'],
  'schedule': ['schedule', 'plan', 'set time', 'when', 'plan it', 'calendar'],
  'read': ['read', 'what is it', 'say it', 'read it', 'tell me', 'what'],
  'help': ['help', 'commands', 'what can i say', 'options']
};

export class SpeechRecognitionService {
  private recognition: any = null;
  private isSupported: boolean = false;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    }
  }

  isAvailable(): boolean {
    return this.isSupported;
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  // Fuzzy match transcript to known commands
  matchCommand(transcript: string): string | null {
    const lowerTranscript = transcript.toLowerCase().trim();
    
    for (const [command, variations] of Object.entries(COMMAND_VARIATIONS)) {
      for (const variation of variations) {
        // Exact match
        if (lowerTranscript === variation) {
          return command;
        }
        // Contains match (more forgiving)
        if (lowerTranscript.includes(variation) || variation.includes(lowerTranscript)) {
          return command;
        }
      }
    }
    
    return null;
  }

  startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): void {
    if (!this.isSupported || !this.recognition) {
      onError('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0];
      const transcript = result.transcript;
      const confidence = result.confidence;
      const command = this.matchCommand(transcript);
      
      onResult({ transcript, confidence, command: command || undefined });
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      
      if (event.error === 'no-speech') {
        onError("I didn't hear anything. Try again?");
      } else if (event.error === 'audio-capture') {
        onError('Microphone not available');
      } else if (event.error === 'not-allowed') {
        onError('Microphone permission denied');
      } else {
        onError('Something went wrong. Try again?');
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      onError('Could not start listening');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
