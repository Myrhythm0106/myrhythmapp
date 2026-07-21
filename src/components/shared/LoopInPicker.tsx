import React, { useState } from 'react';
import { z } from 'zod';
import { Users, Plus, X, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { cn } from '@/lib/utils';

const emailSchema = z.string().trim().toLowerCase().email();

export interface AdhocLoopIn {
  email: string;
  name?: string;
}

interface LoopInPickerProps {
  /** Support Circle member IDs currently attached */
  circleMemberIds: string[];
  /** Ad-hoc email loop-ins currently attached */
  adhocLoopIns: AdhocLoopIn[];
  onChange: (next: { circleMemberIds: string[]; adhocLoopIns: AdhocLoopIn[] }) => void;
  /** Max total loop-ins across both lists */
  max?: number;
  /** Trigger button label */
  triggerLabel?: string;
  className?: string;
}

/**
 * Reusable "Loop someone in" control.
 * - Picks from the user's Support Circle (writes IDs into the caller's `assigned_watchers`)
 * - Or adds an email loop-in (writes into `adhoc_loop_ins` on the caller's row)
 */
export function LoopInPicker({
  circleMemberIds,
  adhocLoopIns,
  onChange,
  max = 5,
  triggerLabel = 'Loop someone in',
  className,
}: LoopInPickerProps) {
  const { supportCircle, isLoading } = useAccountabilitySystem();
  const [open, setOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const total = circleMemberIds.length + adhocLoopIns.length;
  const atMax = total >= max;

  const toggleMember = (id: string) => {
    if (circleMemberIds.includes(id)) {
      onChange({
        circleMemberIds: circleMemberIds.filter((x) => x !== id),
        adhocLoopIns,
      });
    } else {
      if (atMax) return;
      onChange({
        circleMemberIds: [...circleMemberIds, id],
        adhocLoopIns,
      });
    }
  };

  const addEmail = () => {
    setEmailError(null);
    const parsed = emailSchema.safeParse(emailDraft);
    if (!parsed.success) {
      setEmailError('Enter a valid email');
      return;
    }
    if (adhocLoopIns.some((l) => l.email === parsed.data)) {
      setEmailError('Already added');
      return;
    }
    if (atMax) {
      setEmailError(`Up to ${max} in the loop`);
      return;
    }
    onChange({
      circleMemberIds,
      adhocLoopIns: [...adhocLoopIns, { email: parsed.data }],
    });
    setEmailDraft('');
  };

  const removeEmail = (email: string) => {
    onChange({
      circleMemberIds,
      adhocLoopIns: adhocLoopIns.filter((l) => l.email !== email),
    });
  };

  const removeMember = (id: string) => toggleMember(id);

  const memberName = (id: string) =>
    supportCircle.find((m) => m.id === id)?.member_name || 'Circle member';

  return (
    <div className={cn('space-y-2', className)}>
      {/* Current chips */}
      {(circleMemberIds.length > 0 || adhocLoopIns.length > 0) && (
        <div className="flex flex-wrap gap-1.5" aria-label="in the loop">
          {circleMemberIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-full bg-brand-emerald-50 text-brand-emerald-700 px-2 py-0.5 text-xs font-medium border border-brand-emerald-200"
            >
              <Users className="h-3 w-3" />
              {memberName(id)}
              <button
                type="button"
                onClick={() => removeMember(id)}
                className="ml-0.5 hover:bg-brand-emerald-100 rounded-full p-0.5"
                aria-label={`Remove ${memberName(id)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {adhocLoopIns.map((l) => (
            <span
              key={l.email}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium border border-blue-200"
            >
              <Mail className="h-3 w-3" />
              {l.email}
              <button
                type="button"
                onClick={() => removeEmail(l.email)}
                className="ml-0.5 hover:bg-blue-100 rounded-full p-0.5"
                aria-label={`Remove ${l.email}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={atMax && total === 0}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {triggerLabel}
            {total > 0 && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({total}/{max})
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                From your Support Circle
              </p>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : supportCircle.length === 0 ? (
                <a
                  href="/launch/support"
                  className="text-sm text-brand-emerald-600 hover:underline"
                >
                  Add someone to your Support Circle →
                </a>
              ) : (
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {supportCircle.map((m) => {
                    const selected = circleMemberIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMember(m.id)}
                        disabled={!selected && atMax}
                        className={cn(
                          'w-full flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors',
                          selected
                            ? 'bg-brand-emerald-50 text-brand-emerald-800'
                            : 'hover:bg-muted',
                          !selected && atMax && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold',
                              selected
                                ? 'bg-brand-emerald-500 text-white'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {selected ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              (m.member_name || '?').charAt(0).toUpperCase()
                            )}
                          </span>
                          <span className="text-left">
                            <span className="block font-medium leading-tight">
                              {m.member_name}
                            </span>
                            {m.relationship && (
                              <span className="block text-[10px] text-muted-foreground leading-tight">
                                {m.relationship}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Or by email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                  className="h-9 text-sm"
                  disabled={atMax}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addEmail}
                  disabled={atMax || !emailDraft.trim()}
                >
                  Add
                </Button>
              </div>
              {emailError && (
                <p className="text-xs text-red-600 mt-1">{emailError}</p>
              )}
              {atMax && (
                <p className="text-xs text-muted-foreground mt-1">
                  Max {max} people in the loop.
                </p>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
