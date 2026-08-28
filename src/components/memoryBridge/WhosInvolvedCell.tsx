import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Mail, Plus, Send, X } from 'lucide-react';
import { z } from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAccountabilitySystem } from '@/hooks/use-accountability-system';
import { ACTION_ROLES, ActionInvolvement, ActionPerson, emailableRecipients, roleDef } from '@/config/actionRoles';
import { NextStepsItem } from '@/types/memoryBridge';

const emailSchema = z.string().trim().toLowerCase().email();

const initials = (name: string) =>
  name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?';

/** Read the stored RACI columns off an action row into the involvement model. */
export function involvementFromAction(action: NextStepsItem): ActionInvolvement {
  const acc = (action as any).accountable as ActionPerson | null | undefined;
  return {
    responsible: {
      name: action.assigned_to?.trim() || 'Me',
      email: (action as any).owner_email || null,
    },
    accountable: acc && acc.name ? acc : null,
    consulted: Array.isArray((action as any).consulted) ? ((action as any).consulted as ActionPerson[]) : [],
    informed: Array.isArray((action as any).informed) ? ((action as any).informed as ActionPerson[]) : [],
  };
}

export interface RaciSavePayload {
  assigned_to: string;
  owner_email: string | null;
  accountable: ActionPerson | null;
  consulted: ActionPerson[];
  informed: ActionPerson[];
}

interface PersonRowEditorProps {
  person: ActionPerson;
  onChange: (p: ActionPerson) => void;
  onRemove?: () => void;
  emailPlaceholder: string;
}

const PersonRowEditor = ({ person, onChange, onRemove, emailPlaceholder }: PersonRowEditorProps) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          value={person.name}
          onChange={(e) => onChange({ ...person, name: e.target.value })}
          placeholder="Name"
          aria-label="Person name"
          className="h-11"
        />
        <div>
          <Input
            value={person.email || ''}
            type="email"
            onChange={(e) => {
              onChange({ ...person, email: e.target.value });
              setEmailError(null);
            }}
            placeholder={emailPlaceholder}
            aria-label="Person email"
            className="h-11"
          />
          {emailError && <p className="text-xs text-destructive mt-1">{emailError}</p>}
        </div>
      </div>
      {onRemove && (
        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 shrink-0" onClick={onRemove} aria-label="Remove person">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

/** Validate every draft: names required, emails valid when present. Returns first error or null. */
function validateDraft(d: ActionInvolvement): string | null {
  const check = (p: ActionPerson, label: string): string | null => {
    if (!p.name.trim()) return `Add a name for ${label}.`;
    if (p.email && p.email.trim() && !emailSchema.safeParse(p.email.trim()).success)
      return `The email for ${p.name || label} doesn't look right.`;
    return null;
  };
  const r = check(d.responsible, 'the person doing it');
  if (r) return r;
  if (d.accountable) {
    const e = check(d.accountable, 'the sign-off person');
    if (e) return e;
  }
  for (const p of d.consulted) { const e = check(p, 'ask first'); if (e) return e; }
  for (const p of d.informed) { const e = check(p, 'keep in the loop'); if (e) return e; }
  return null;
}

export const WhosInvolvedCell = ({
  action,
  onSave,
  onSend,
}: {
  action: NextStepsItem;
  onSave: (payload: RaciSavePayload) => void;
  /** Sends the details email to everyone with an address. */
  onSend?: (payload: RaciSavePayload) => Promise<void>;
}) => {
  const { supportCircle } = useAccountabilitySystem();
  const [open, setOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendNow, setSendNow] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ActionInvolvement>(() => involvementFromAction(action));

  const saved = useMemo(() => involvementFromAction(action), [action]);
  const notifiedAt = (action as any).raci_notified_at as string | null | undefined;

  useEffect(() => {
    if (open) {
      setDraft(involvementFromAction(action));
      setError(null);
      setSendNow(true);
    }
  }, [open, action]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const circleMembers = useMemo(
    () => supportCircle.filter((m) => m.member_email),
    [supportCircle]
  );

  const pickFromCircle = (member: { member_name: string; member_email: string }, key: 'responsible' | 'accountable' | 'consulted' | 'informed') => {
    const person: ActionPerson = { name: member.member_name, email: member.member_email };
    setDraft((d) => {
      if (key === 'responsible') return { ...d, responsible: person };
      if (key === 'accountable') return { ...d, accountable: person };
      if (key === 'consulted') return { ...d, consulted: [...d.consulted, person] };
      return { ...d, informed: [...d.informed, person] };
    });
  };

  const attemptClose = () => (dirty ? setConfirmClose(true) : setOpen(false));

  const handleSave = async () => {
    const err = validateDraft(draft);
    if (err) {
      setError(err);
      return;
    }
    const norm = (p: ActionPerson): ActionPerson => ({ name: p.name.trim(), email: p.email?.trim().toLowerCase() || null });
    const payload: RaciSavePayload = {
      assigned_to: norm(draft.responsible).name,
      owner_email: norm(draft.responsible).email,
      accountable: draft.accountable ? norm(draft.accountable) : null,
      consulted: draft.consulted.map(norm),
      informed: draft.informed.map(norm),
    };
    onSave(payload);
    if (sendNow && onSend) {
      const hasAnyEmail =
        payload.owner_email || payload.accountable?.email ||
        payload.consulted.some((p) => p.email) || payload.informed.some((p) => p.email);
      if (hasAnyEmail) {
        setSending(true);
        try {
          await onSend(payload);
        } finally {
          setSending(false);
        }
      }
    }
    setOpen(false);
  };

  // --- Collapsed chips ------------------------------------------------------
  const extraCount = saved.consulted.length + saved.informed.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change who's involved"
        className="min-h-[44px] w-full flex items-center gap-2 rounded-[6px] px-2 -mx-2 text-left hover:bg-exhibit-surface transition-colors"
      >
        <div className="flex -space-x-1.5">
          <Avatar className="h-7 w-7 rounded-[6px] ring-2 ring-white">
            <AvatarFallback className="rounded-[6px] font-sora text-[10px] font-semibold bg-exhibit-ink text-white">
              {initials(saved.responsible.name)}
            </AvatarFallback>
          </Avatar>
          {saved.accountable && (
            <Avatar className="h-7 w-7 rounded-[6px] ring-2 ring-white">
              <AvatarFallback className="rounded-[6px] font-sora text-[10px] font-semibold bg-exhibit-moss/12 text-exhibit-ink">
                {initials(saved.accountable.name)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-manrope text-[13px] font-medium text-exhibit-ink truncate max-w-[7rem]">
              {saved.responsible.name}
            </span>
            <span className="h-[16px] px-1 rounded-[4px] font-sora text-[9px] font-semibold leading-none flex items-center bg-white text-exhibit-moss ring-1 ring-inset ring-exhibit-rule">R</span>
            {saved.accountable && (
              <span className="h-[16px] px-1 rounded-[4px] font-sora text-[9px] font-semibold leading-none flex items-center bg-white text-exhibit-moss ring-1 ring-inset ring-exhibit-rule">A</span>
            )}
            {extraCount > 0 && (
              <span className="font-sora text-[10px] tabular-nums text-exhibit-soft">+{extraCount}</span>
            )}
          </div>
          {notifiedAt && (
            <span className="font-sora text-[10px] tabular-nums text-exhibit-soft">
              Sent {format(new Date(notifiedAt), 'd MMM')}
            </span>
          )}
        </div>
      </button>

      <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : attemptClose())}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Who's involved</DialogTitle>
            <DialogDescription className="line-clamp-2">
              {action.action_text}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-1">
            {ACTION_ROLES.map((role) => (
              <div key={role.key} className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{role.label}</span>
                  <Badge variant="outline" className="h-4 px-1 text-[9px] leading-none">{role.letter}</Badge>
                  <span className="text-xs text-muted-foreground">{role.helper}</span>
                </div>

                {/* Does it */}
                {role.key === 'responsible' && (
                  <PersonRowEditor
                    person={draft.responsible}
                    onChange={(p) => setDraft((d) => ({ ...d, responsible: p }))}
                    emailPlaceholder="their@email.com (optional)"
                  />
                )}

                {/* Signs it off */}
                {role.key === 'accountable' && (
                  draft.accountable ? (
                    <PersonRowEditor
                      person={draft.accountable}
                      onChange={(p) => setDraft((d) => ({ ...d, accountable: p }))}
                      onRemove={() => setDraft((d) => ({ ...d, accountable: null }))}
                      emailPlaceholder="their@email.com (optional)"
                    />
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-11"
                      onClick={() => setDraft((d) => ({ ...d, accountable: { name: '', email: null } }))}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add a sign-off person
                    </Button>
                  )
                )}

                {/* Ask first / Keep in the loop */}
                {(role.key === 'consulted' || role.key === 'informed') && (
                  <>
                    {(role.key === 'consulted' ? draft.consulted : draft.informed).map((p, i) => (
                      <PersonRowEditor
                        key={i}
                        person={p}
                        onChange={(next) =>
                          setDraft((d) => {
                            const list = [...(role.key === 'consulted' ? d.consulted : d.informed)];
                            list[i] = next;
                            return role.key === 'consulted' ? { ...d, consulted: list } : { ...d, informed: list };
                          })
                        }
                        onRemove={() =>
                          setDraft((d) => {
                            const list = [...(role.key === 'consulted' ? d.consulted : d.informed)];
                            list.splice(i, 1);
                            return role.key === 'consulted' ? { ...d, consulted: list } : { ...d, informed: list };
                          })
                        }
                        emailPlaceholder="their@email.com (needed to notify)"
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-11"
                      onClick={() =>
                        setDraft((d) =>
                          role.key === 'consulted'
                            ? { ...d, consulted: [...d.consulted, { name: '', email: null }] }
                            : { ...d, informed: [...d.informed, { name: '', email: null }] }
                        )
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add someone
                    </Button>
                  </>
                )}
              </div>
            ))}

            {circleMembers.length > 0 && (
              <div className="space-y-1 rounded-lg border border-border p-3">
                <p className="text-xs font-medium text-muted-foreground">Quick add from my Support Circle</p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {circleMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
                      <div className="min-w-0">
                        <span className="text-sm block truncate">{m.member_name}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{m.member_email}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {ACTION_ROLES.map((r) => (
                          <button
                            key={r.key}
                            type="button"
                            title={r.label}
                            onClick={() => pickFromCircle({ member_name: m.member_name, member_email: m.member_email! }, r.key)}
                            className="h-8 w-8 rounded-md border border-border text-[11px] font-semibold hover:bg-brand-orange-50 hover:border-brand-orange-300 transition-colors"
                          >
                            {r.letter}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-brand-orange-500" />
                <div>
                  <p className="text-sm font-medium">Send details now</p>
                  <p className="text-xs text-muted-foreground">Emails everyone with an address their role and this step.</p>
                </div>
              </div>
              <Switch checked={sendNow} onCheckedChange={setSendNow} aria-label="Send details now" />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1 h-11" onClick={attemptClose}>
                Cancel
              </Button>
              <Button type="button" className="flex-1 h-11" onClick={handleSave} disabled={sending}>
                {sending ? 'Sending…' : sendNow ? 'Save & send' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmClose} onOpenChange={setConfirmClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard your changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You've changed who's involved. Closing now will lose those changes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmClose(false);
                setOpen(false);
              }}
            >
              Discard changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
