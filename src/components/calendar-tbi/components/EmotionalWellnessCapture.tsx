import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mic, Heart, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface EmotionOption {
  id: string;
  emoji: string;
  label: string;
  category: 'positive' | 'neutral' | 'challenging';
  color: string;
}

interface EmotionalWellnessCaptureProps {
  onEmotionCapture?: (emotion: string, note?: string, gratitude?: string) => void;
  context?: string; // 'daily' | 'activity' | 'achievement' | 'therapy'
  disabled?: boolean;
}

const emotionOptions: EmotionOption[] = [
  // Positive emotions
  { id: 'joyful', emoji: '😊', label: 'Joyful', category: 'positive', color: 'bg-yellow-100 border-yellow-300' },
  { id: 'proud', emoji: '😌', label: 'Proud', category: 'positive', color: 'bg-green-100 border-green-300' },
  { id: 'grateful', emoji: '🙏', label: 'Grateful', category: 'positive', color: 'bg-blue-100 border-blue-300' },
  { id: 'excited', emoji: '🤗', label: 'Excited', category: 'positive', color: 'bg-purple-100 border-purple-300' },
  { id: 'calm', emoji: '😌', label: 'Calm', category: 'positive', color: 'bg-teal-100 border-teal-300' },
  
  // Neutral emotions
  { id: 'okay', emoji: '😐', label: 'Okay', category: 'neutral', color: 'bg-gray-100 border-gray-300' },
  { id: 'curious', emoji: '🤔', label: 'Curious', category: 'neutral', color: 'bg-indigo-100 border-indigo-300' },
  { id: 'focused', emoji: '🎯', label: 'Focused', category: 'neutral', color: 'bg-orange-100 border-orange-300' },
  
  // Challenging emotions (reframed positively)
  { id: 'processing', emoji: '🧠', label: 'Processing', category: 'challenging', color: 'bg-pink-100 border-pink-300' },
  { id: 'tired', emoji: '😴', label: 'Resting', category: 'challenging', color: 'bg-slate-100 border-slate-300' },
  { id: 'overwhelmed', emoji: '😅', label: 'Challenged', category: 'challenging', color: 'bg-red-100 border-red-300' },
];

const contextPrompts = {
  daily: "How are you feeling right now?",
  activity: "How did this activity make you feel?",
  achievement: "Celebrate this moment! How do you feel?",
  therapy: "How are you feeling about your session?",
  default: "What's in your heart today?"
};

const gratitudePrompts = [
  "What made you smile today?",
  "What small win can you celebrate?",
  "Who or what are you grateful for?",
  "What progress did you notice?",
  "What gave you strength today?"
];

export function EmotionalWellnessCapture({ 
  onEmotionCapture, 
  context = 'daily', 
  disabled = false 
}: EmotionalWellnessCaptureProps) {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionalNote, setEmotionalNote] = useState('');
  const [showGratitude, setShowGratitude] = useState(false);
  const [gratitudeNote, setGratitudeNote] = useState('');

  const currentPrompt = contextPrompts[context as keyof typeof contextPrompts] || contextPrompts.default;
  const randomGratitudePrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    if (emotionOptions.find(e => e.id === emotionId)?.category === 'positive') {
      setShowGratitude(true);
    }
  };

  const handleCapture = () => {
    if (!selectedEmotion) {
      toast.error("Please select how you're feeling");
      return;
    }

    const emotion = emotionOptions.find(e => e.id === selectedEmotion);
    const message = `Feeling ${emotion?.label.toLowerCase()} ${emotionalNote ? '- ' + emotionalNote : ''}`;
    
    onEmotionCapture?.(selectedEmotion, emotionalNote, gratitudeNote);
    
    // Show encouraging feedback
    toast.success("Your feelings matter! Thank you for sharing ✨", {
      description: "Every emotion is valid and helps you grow stronger."
    });

    // Reset form
    setSelectedEmotion(null);
    setEmotionalNote('');
    setGratitudeNote('');
    setShowGratitude(false);
  };

  const selectedEmotionOption = emotionOptions.find(e => e.id === selectedEmotion);

  return (
    <div className="flex-1">
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
          <Heart className="h-4 w-4 text-red-500" />
          My Feelings
        </h3>
        <p className="text-xs text-muted-foreground">{currentPrompt}</p>
      </div>

      {/* Quick Emotion Selection */}
      <div className="grid grid-cols-4 gap-1 mb-3">
        {emotionOptions.slice(0, 8).map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => handleEmotionSelect(emotion.id)}
            disabled={disabled}
            className={`
              p-1.5 rounded-lg border transition-all duration-200 text-center
              ${selectedEmotion === emotion.id 
                ? `${emotion.color} scale-105 shadow-sm` 
                : 'bg-background border-border hover:bg-accent'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
            `}
          >
            <div className="text-sm">{emotion.emoji}</div>
            <div className="text-xs font-medium text-foreground truncate">
              {emotion.label}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Emotion & Notes */}
      {selectedEmotion && (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {selectedEmotionOption?.emoji} {selectedEmotionOption?.label}
            </Badge>
          </div>

          <Textarea
            placeholder="What's behind this feeling? (optional)"
            value={emotionalNote}
            onChange={(e) => setEmotionalNote(e.target.value)}
            className="text-xs min-h-[60px] resize-none"
            disabled={disabled}
          />

          {/* Gratitude prompt for positive emotions */}
          {showGratitude && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {randomGratitudePrompt}
              </p>
              <Textarea
                placeholder="Something I'm grateful for..."
                value={gratitudeNote}
                onChange={(e) => setGratitudeNote(e.target.value)}
                className="text-xs min-h-[50px] resize-none"
                disabled={disabled}
              />
            </div>
          )}

          <Button 
            onClick={handleCapture}
            disabled={disabled}
            size="sm"
            className="w-full text-xs h-8"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Capture Feelings
          </Button>
        </div>
      )}

      {/* Voice note option */}
      {!selectedEmotion && (
        <div className="mt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs h-8"
            disabled={disabled}
            onClick={() => toast.info("Voice feelings capture coming soon!")}
          >
            <Mic className="h-3 w-3 mr-1" />
            Voice Note
          </Button>
        </div>
      )}
    </div>
  );
}