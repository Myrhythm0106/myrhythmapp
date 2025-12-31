import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users, Sparkles, Loader2, Eye, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PostExtractionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionsCount: number;
  meetingTitle: string;
  onAcceptAndScheduleAll: (notifyCircle: boolean) => Promise<void>;
  onReviewIndividually: () => void;
}

export function PostExtractionDialog({
  isOpen,
  onClose,
  actionsCount,
  meetingTitle,
  onAcceptAndScheduleAll,
  onReviewIndividually
}: PostExtractionDialogProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [notifyCircle, setNotifyCircle] = useState(true);

  const handleAcceptAll = async () => {
    setIsScheduling(true);
    try {
      await onAcceptAndScheduleAll(notifyCircle);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleReview = () => {
    onReviewIndividually();
    onClose();
  };

  if (!isOpen || actionsCount === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white/98 to-gray-50/98 backdrop-blur-xl border border-white/40 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="80" cy="20" r="12" fill="currentColor" className="text-memory-emerald-500" />
            <circle cx="60" cy="40" r="6" fill="currentColor" className="text-brand-orange-500" />
            <path d="M80,20 Q70,30 60,40" stroke="currentColor" strokeWidth="2" className="text-memory-emerald-400" fill="none" />
          </svg>
        </div>

        <DialogHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-400 to-clarity-teal-400 rounded-full animate-pulse opacity-50 blur-md" />
              <div className="relative p-4 bg-gradient-to-br from-memory-emerald-500 to-clarity-teal-500 rounded-full shadow-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            {actionsCount} Actions Extracted!
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            From "{meetingTitle}"
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Primary CTA - Accept & Schedule All */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange-50/90 to-brand-orange-100/70 border border-brand-orange-200/50 shadow-lg p-5">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-brand-orange-500 rounded-xl shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-orange-800">Accept & Schedule All</h3>
                  <p className="text-xs text-brand-orange-600">Add all actions to your calendar with AI-suggested dates</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-2 bg-white/60 rounded-lg">
                <Checkbox 
                  id="notify-circle" 
                  checked={notifyCircle} 
                  onCheckedChange={(checked) => setNotifyCircle(checked as boolean)}
                />
                <label 
                  htmlFor="notify-circle" 
                  className="text-sm text-brand-orange-700 cursor-pointer flex items-center gap-1"
                >
                  <Users className="h-3.5 w-3.5" />
                  Notify your Support Circle
                </label>
              </div>

              <Button
                onClick={handleAcceptAll}
                disabled={isScheduling}
                className="w-full bg-gradient-to-r from-brand-orange-500 to-brand-orange-600 hover:from-brand-orange-600 hover:to-brand-orange-700 text-white shadow-lg shadow-brand-orange-500/30 py-5"
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Scheduling {actionsCount} Actions...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Accept & Schedule All ({actionsCount})
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
            <span className="text-xs text-muted-foreground font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
          </div>

          {/* Secondary option - Review Individually */}
          <Button
            variant="outline"
            onClick={handleReview}
            className="w-full py-5 border-2 border-muted-foreground/20 hover:bg-muted/50"
          >
            <Eye className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Review Actions Individually</span>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            You can always edit dates and add watchers later
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
