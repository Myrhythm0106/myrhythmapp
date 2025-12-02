import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Timer, HelpCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ReminderConfirmationProps {
  title: string;
  onConfirm: (note?: string) => void;
  onSnooze: (minutes: number, reason?: string) => void;
  onNeedHelp: (reason?: string) => void;
  showReasonInput?: boolean;
}

const QUICK_SNOOZE_OPTIONS = [
  { minutes: 5, label: '5 min', emoji: '⏱️' },
  { minutes: 15, label: '15 min', emoji: '☕' },
  { minutes: 60, label: '1 hour', emoji: '🕐' }
];

export function ReminderConfirmation({
  title,
  onConfirm,
  onSnooze,
  onNeedHelp,
  showReasonInput = false
}: ReminderConfirmationProps) {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [showSnoozeReason, setShowSnoozeReason] = useState(false);
  const [snoozeReason, setSnoozeReason] = useState('');
  const [selectedSnooze, setSelectedSnooze] = useState<number | null>(null);

  const handleConfirm = () => {
    onConfirm(note || undefined);
  };

  const handleSnooze = (minutes: number) => {
    if (showReasonInput) {
      setSelectedSnooze(minutes);
      setShowSnoozeReason(true);
    } else {
      onSnooze(minutes);
    }
  };

  const confirmSnooze = () => {
    if (selectedSnooze) {
      onSnooze(selectedSnooze, snoozeReason || undefined);
      setShowSnoozeReason(false);
      setSnoozeReason('');
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            How did it go?
          </p>
        </div>

        {/* Main completion button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleConfirm}
            size="lg"
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Done! ✓
          </Button>
        </motion.div>

        {/* Optional note toggle */}
        {!showNote ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setShowNote(true)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Add a note (optional)
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did it feel? Any challenges?"
              className="resize-none"
              rows={2}
            />
          </motion.div>
        )}

        {/* Snooze section */}
        {!showSnoozeReason ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">
              Not ready yet? Snooze:
            </p>
            <div className="flex gap-2">
              {QUICK_SNOOZE_OPTIONS.map(option => (
                <Button
                  key={option.minutes}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleSnooze(option.minutes)}
                >
                  <span className="mr-1">{option.emoji}</span>
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground">
              Quick note on why (helps us understand your patterns):
            </p>
            <Textarea
              value={snoozeReason}
              onChange={(e) => setSnoozeReason(e.target.value)}
              placeholder="e.g., 'In a meeting', 'Low energy right now'..."
              className="resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowSnoozeReason(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={confirmSnooze}
              >
                <Timer className="h-4 w-4 mr-1" />
                Snooze {selectedSnooze} min
              </Button>
            </div>
          </motion.div>
        )}

        {/* Help button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onNeedHelp()}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          I'm Stuck - Need Support
        </Button>
      </CardContent>
    </Card>
  );
}
