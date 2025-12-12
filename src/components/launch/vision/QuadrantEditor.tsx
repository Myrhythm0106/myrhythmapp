import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Link, Unlink, Image, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { VisionPillar, UserVision, pillarEmojis } from '@/data/visionPillars';
import { toast } from 'sonner';

interface QuadrantEditorProps {
  open: boolean;
  onClose: () => void;
  pillar: VisionPillar | null;
  vision: UserVision | null;
  onSave: (vision: UserVision) => void;
  onLinkGoal: (vision: UserVision) => void;
  onUnlinkGoal: (visionId: string) => void;
}

export function QuadrantEditor({
  open,
  onClose,
  pillar,
  vision,
  onSave,
  onLinkGoal,
  onUnlinkGoal
}: QuadrantEditorProps) {
  const [title, setTitle] = useState('');
  const [why, setWhy] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (vision && pillar) {
      setTitle(vision.title || '');
      setWhy(vision.why || '');
      setSelectedEmoji(vision.emoji || pillar.icon);
    }
  }, [vision, pillar]);

  const handleSave = () => {
    if (!vision || !pillar) return;
    
    onSave({
      ...vision,
      title,
      why,
      emoji: selectedEmoji || pillar.icon
    });
    
    toast.success('Vision updated!');
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
  };

  const emojis = pillar ? pillarEmojis[pillar.id] || [] : [];

  if (!open || !pillar || !vision) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed inset-x-0 bottom-0 max-h-[90vh] overflow-y-auto bg-card rounded-t-3xl shadow-xl border-t"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Handle Bar */}
          <div className="sticky top-0 bg-card pt-3 pb-2 px-6 border-b z-10">
            <div className="w-12 h-1.5 rounded-full bg-muted mx-auto mb-3" />
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                  pillar.gradientFrom,
                  pillar.gradientTo
                )}>
                  <span className="text-2xl">{selectedEmoji || pillar.icon}</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">{pillar.name}</h2>
                  <p className="text-xs text-muted-foreground">{pillar.question}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Emoji Picker */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Choose an Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={cn(
                      "w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all",
                      selectedEmoji === emoji
                        ? `bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} shadow-md scale-110`
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-neural-purple-500" />
                Suggestions (tap to use, then edit)
              </label>
              <div className="flex flex-wrap gap-2">
                {pillar.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm transition-all",
                      title === suggestion
                        ? `bg-gradient-to-r ${pillar.gradientFrom} ${pillar.gradientTo} text-white`
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Your Dream
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to achieve?"
                className="text-lg font-medium"
              />
            </div>

            {/* Why Input */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Why This Matters (optional)
              </label>
              <Textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Because..."
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Link to Goal */}
            <div className={cn(
              "p-4 rounded-xl border-2 border-dashed",
              vision.linkedGoalId ? "border-brain-health-300 bg-brain-health-50" : "border-border"
            )}>
              {vision.linkedGoalId ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brain-health-500 flex items-center justify-center">
                      <Link className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Linked to Goal</p>
                      <p className="text-xs text-muted-foreground">{vision.linkedGoalTitle}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onUnlinkGoal(vision.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Unlink className="h-4 w-4 mr-1" />
                    Unlink
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Make this a Goal</p>
                    <p className="text-xs text-muted-foreground">Track progress with daily actions</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLinkGoal(vision)}
                    disabled={!title}
                  >
                    <Link className="h-4 w-4 mr-1" />
                    Link Goal
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-0 p-6 bg-card border-t">
            <Button
              onClick={handleSave}
              className={cn(
                "w-full h-14 text-lg font-semibold bg-gradient-to-r",
                pillar.gradientFrom,
                pillar.gradientTo,
                "hover:opacity-90"
              )}
            >
              <Check className="h-5 w-5 mr-2" />
              Save Vision
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
