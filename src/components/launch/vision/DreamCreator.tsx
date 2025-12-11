import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, HelpCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { EditablePromptField } from './EditablePromptField';
import { VisionImagePicker } from './VisionImagePicker';
import { 
  dreamTitlePrompt, 
  dreamWhyPrompt, 
  affirmationPrompt,
  dreamCategories,
  dreamEmojis 
} from '@/data/dreamPromptSuggestions';

interface DreamCreatorProps {
  open: boolean;
  onClose: () => void;
  onCreateDream: (dream: {
    title: string;
    why: string;
    affirmation: string;
    emoji: string;
    category: string;
    imageUrl?: string;
  }) => void;
  mode?: 'quick' | 'guided';
}

export function DreamCreator({
  open,
  onClose,
  onCreateDream,
  mode: initialMode = 'quick'
}: DreamCreatorProps) {
  const [mode, setMode] = useState<'quick' | 'guided'>(initialMode);
  const [step, setStep] = useState(0);
  
  // Form state
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [category, setCategory] = useState('personal');
  const [emoji, setEmoji] = useState('✨');
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const totalSteps = 4; // Title, Why, Affirmation, Image/Emoji

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onCreateDream({
      title: title.trim(),
      why: why.trim(),
      affirmation: affirmation.trim(),
      emoji,
      category,
      imageUrl
    });

    // Reset form
    setTitle('');
    setWhy('');
    setAffirmation('');
    setCategory('personal');
    setEmoji('✨');
    setImageUrl(undefined);
    setStep(0);
    onClose();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return title.trim().length > 0;
      case 1: return true; // Why is optional
      case 2: return true; // Affirmation is optional
      case 3: return true; // Image/emoji is optional
      default: return true;
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto max-h-[85vh] overflow-y-auto bg-card rounded-2xl shadow-xl border"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neural-purple-500 to-brain-health-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Create Your Dream</h2>
              {mode === 'guided' && (
                <p className="text-xs text-muted-foreground">Step {step + 1} of {totalSteps}</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mode Selector (only on first step) */}
        {step === 0 && (
          <div className="px-6 pt-4">
            <div className="flex gap-2 p-1 bg-muted rounded-xl">
              <button
                onClick={() => setMode('quick')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                  mode === 'quick'
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                I Know My Dream
              </button>
              <button
                onClick={() => setMode('guided')}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                  mode === 'guided'
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HelpCircle className="h-4 w-4 inline-block mr-1" />
                Help Me Discover
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Dream Title */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {mode === 'guided' ? (
                  <EditablePromptField
                    question={dreamTitlePrompt.question}
                    helpText={dreamTitlePrompt.helpText}
                    suggestions={dreamTitlePrompt.suggestions}
                    value={title}
                    onChange={setTitle}
                    placeholder="Or type your own dream..."
                    maxLength={100}
                    rows={2}
                  />
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        What's your dream?
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Feel stronger and healthier"
                        className="text-lg"
                        autoFocus
                      />
                    </div>
                    
                    {/* Category Selection */}
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {dreamCategories.slice(0, 6).map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setCategory(cat.id);
                              setEmoji(cat.emoji);
                            }}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-xl text-sm",
                              "border-2 transition-all",
                              category === cat.id
                                ? "bg-brain-health-100 border-brain-health-400 text-brain-health-700"
                                : "bg-card border-border hover:border-brain-health-200"
                            )}
                          >
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 1: Why */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EditablePromptField
                  question={dreamWhyPrompt.question}
                  helpText={dreamWhyPrompt.helpText}
                  suggestions={dreamWhyPrompt.suggestions}
                  value={why}
                  onChange={setWhy}
                  placeholder="Why does this dream matter to you?"
                  maxLength={200}
                  rows={3}
                  optional
                />
              </motion.div>
            )}

            {/* Step 2: Affirmation */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <EditablePromptField
                  question={affirmationPrompt.question}
                  helpText={affirmationPrompt.helpText}
                  suggestions={affirmationPrompt.suggestions}
                  value={affirmation}
                  onChange={setAffirmation}
                  placeholder="A phrase to motivate you on hard days..."
                  maxLength={150}
                  rows={2}
                  optional
                />
              </motion.div>
            )}

            {/* Step 3: Image/Emoji */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <VisionImagePicker
                  selectedEmoji={emoji}
                  onEmojiChange={setEmoji}
                  imageUrl={imageUrl}
                  onImageChange={setImageUrl}
                  category={category}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t px-6 py-4 flex items-center justify-between">
          {mode === 'guided' && step > 0 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          )}

          {mode === 'guided' && step < totalSteps - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-brain-health-500 hover:bg-brain-health-600"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="bg-gradient-to-r from-neural-purple-500 to-brain-health-500 hover:from-neural-purple-600 hover:to-brain-health-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Dream
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
