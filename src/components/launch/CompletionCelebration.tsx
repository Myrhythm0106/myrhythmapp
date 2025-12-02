import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PartyPopper, Users, Send, X } from 'lucide-react';
import { LaunchButton } from './LaunchButton';
import confetti from 'canvas-confetti';

interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  onNotifySupport?: (note?: string) => void;
  streakCount?: number;
  isPersonalBest?: boolean;
}

export function CompletionCelebration({
  isOpen,
  onClose,
  actionTitle,
  onNotifySupport,
  streakCount,
  isPersonalBest
}: CompletionCelebrationProps) {
  const [note, setNote] = useState('');
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  const handleNotify = () => {
    onNotifySupport?.(note);
    setNotified(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-3xl border-0 bg-gradient-to-br from-brand-emerald-50 to-amber-50 p-0 overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>

        <div className="text-center p-8">
          {/* Celebration Icon */}
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <PartyPopper className="h-10 w-10 text-white" />
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Amazing Work! 🎉
          </h2>
          
          <p className="text-gray-600 mb-4">
            You completed: <span className="font-semibold text-brand-emerald-700">{actionTitle}</span>
          </p>

          {/* Streak Info */}
          {streakCount && streakCount > 1 && (
            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">🔥</span>
              <span className="font-semibold text-orange-600">{streakCount} day streak!</span>
              {isPersonalBest && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  Personal Best!
                </span>
              )}
            </div>
          )}

          {/* Notify Support Circle */}
          {onNotifySupport && !notified && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-500">
                Share this win with your support circle?
              </p>
              
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a personal note (optional)"
                className="w-full p-3 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
                rows={2}
              />
              
              <LaunchButton 
                onClick={handleNotify}
                className="w-full"
              >
                <Users className="h-5 w-5" />
                Share with Support Circle
              </LaunchButton>
            </div>
          )}

          {notified && (
            <div className="mt-6 p-4 bg-brand-emerald-100 rounded-xl">
              <p className="text-brand-emerald-700 font-medium flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                Your support circle has been notified! 💙
              </p>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
