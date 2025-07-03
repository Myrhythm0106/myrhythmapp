
export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
}

class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSupported = false;

  constructor() {
    this.init();
  }

  private init() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    
    this.voices = this.synth.getVoices();
    
    // If voices aren't loaded yet, wait for the event
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', () => {
        this.voices = this.synth!.getVoices();
      });
    }
  }

  public speak(text: string, options: SpeechOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported || !this.synth) {
        console.warn('Speech synthesis not supported');
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      if (options.voice) {
        utterance.voice = options.voice;
      } else {
        // Try to find a clear, natural voice
        const preferredVoice = this.voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.lang.startsWith('en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      this.synth.speak(utterance);
    });
  }

  public cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public isAvailable(): boolean {
    return this.isSupported;
  }
}

export const speechService = new SpeechSynthesisService();
