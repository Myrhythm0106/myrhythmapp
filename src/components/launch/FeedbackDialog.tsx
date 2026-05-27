import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Bug, Lightbulb, HelpCircle, Heart, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { EDITION_VERSION, EDITION_SHORT } from '@/config/edition';

type Category = 'bug' | 'idea' | 'confusion' | 'praise';

const CATEGORIES: { id: Category; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'bug', label: 'Something broke', icon: Bug },
  { id: 'idea', label: 'Idea', icon: Lightbulb },
  { id: 'confusion', label: 'I got stuck', icon: HelpCircle },
  { id: 'praise', label: 'Love this', icon: Heart },
];

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [category, setCategory] = useState<Category>('idea');
  const [message, setMessage] = useState('');
  const [okToContact, setOkToContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setCategory('idea');
    setMessage('');
    setOkToContact(false);
  };

  const submit = async () => {
    if (!user) {
      toast.error('Please sign in to send feedback.');
      return;
    }
    const trimmed = message.trim();
    if (trimmed.length < 1 || trimmed.length > 500) {
      toast.error('Message must be 1–500 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('founding_feedback').insert({
        user_id: user.id,
        category,
        message: trimmed,
        route: location.pathname,
        edition_version: EDITION_VERSION,
        ok_to_contact: okToContact,
      });
      if (error) throw error;
      toast.success('Thank you — your feedback shapes the next release.');
      reset();
      onOpenChange(false);
    } catch (err: any) {
      console.error('Feedback submit failed:', err);
      toast.error('Could not send feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            You're using the {EDITION_SHORT}. Your notes go straight to the team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs tracking-wide uppercase text-stone-500 mb-2 block">
              What is this?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm text-left transition-colors min-h-[44px] ${
                      active
                        ? 'border-teal-500 bg-teal-50 text-teal-800'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="fb-msg" className="text-xs tracking-wide uppercase text-stone-500 mb-2 block">
              Your note ({message.length}/500)
            </Label>
            <Textarea
              id="fb-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 500))}
              placeholder="What happened? What would help?"
              rows={4}
              className="resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700 cursor-pointer">
            <Checkbox
              checked={okToContact}
              onCheckedChange={(v) => setOkToContact(v === true)}
            />
            It's OK to reply to me about this
          </label>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={submitting || message.trim().length === 0}
            className="bg-[#0D9488] hover:bg-[#0B7A70] text-white"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              'Send feedback'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
