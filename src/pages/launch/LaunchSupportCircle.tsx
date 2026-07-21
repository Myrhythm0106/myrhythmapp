import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchHeroBand } from '@/components/launch/LaunchHeroBand';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Button } from '@/components/ui/button';
import {
  Users, UserPlus, Stethoscope, Home, User, HeartHandshake,
  Loader2, Mail, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccountabilitySystem, SupportCircleMember } from '@/hooks/use-accountability-system';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { SimpleInviteForm } from '@/components/support-circle/SimpleInviteForm';

const roleMeta: Record<string, { label: string; Icon: React.ElementType; badge: string }> = {
  viewer:    { label: 'Viewer',    Icon: User,          badge: 'bg-gray-100 text-gray-700' },
  supporter: { label: 'Supporter', Icon: HeartHandshake, badge: 'bg-rose-100 text-rose-700' },
  caregiver: { label: 'Caregiver', Icon: Home,          badge: 'bg-brand-emerald-100 text-brand-emerald-700' },
  medical:   { label: 'Medical',   Icon: Stethoscope,   badge: 'bg-blue-100 text-blue-700' },
};

function statusPill(status: SupportCircleMember['status']) {
  switch (status) {
    case 'active':
      return { label: 'Active', className: 'bg-brand-emerald-100 text-brand-emerald-700', Icon: CheckCircle2 };
    case 'pending':
      return { label: 'Pending invite', className: 'bg-amber-100 text-amber-700', Icon: Clock };
    case 'expired':
      return { label: 'Expired', className: 'bg-gray-100 text-gray-600', Icon: XCircle };
    case 'revoked':
      return { label: 'Revoked', className: 'bg-gray-100 text-gray-600', Icon: XCircle };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-600', Icon: Clock };
  }
}

export default function LaunchSupportCircle() {
  const { supportCircle, isLoading, loadSupportCircle } = useAccountabilitySystem() as any;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'team' | 'invite'>('team');
  const [removingId, setRemovingId] = useState<string | null>(null);

  const active = supportCircle.filter((m: SupportCircleMember) => m.status === 'active');
  const pending = supportCircle.filter((m: SupportCircleMember) => m.status === 'pending');

  const handleRemove = async (id: string) => {
    if (!user) return;
    setRemovingId(id);
    try {
      const { error } = await supabase
        .from('support_circle_members')
        .update({ status: 'revoked', invitation_token: null })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Removed from your circle');
      if (typeof loadSupportCircle === 'function') await loadSupportCircle();
    } catch (err) {
      console.error(err);
      toast.error('Could not remove that person');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <LaunchLayout>
      <LaunchHeroBand
        eyebrow="Reconnect"
        title="Support Circle"
        subtitle="The people who can be in the loop when you need them."
      />

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-6 md:py-10 pb-24">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'team' | 'invite')} className="mb-24">
        <TabsList className="grid grid-cols-2 mb-6 h-12 p-1 bg-launch-ink/5 rounded-2xl">
          <TabsTrigger value="team" className="rounded-xl data-[state=active]:bg-launch-ivory data-[state=active]:text-launch-ink data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2" />
            My circle {supportCircle.length > 0 && `(${supportCircle.length})`}
          </TabsTrigger>
          <TabsTrigger value="invite" className="rounded-xl data-[state=active]:bg-launch-ivory data-[state=active]:text-launch-ink data-[state=active]:shadow-sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite someone
          </TabsTrigger>
        </TabsList>


        <TabsContent value="team" className="space-y-3">
          {isLoading ? (
            <LaunchCard variant="glass" className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-emerald-600 mb-2" />
              <p className="text-sm text-gray-500">Loading your circle…</p>
            </LaunchCard>
          ) : supportCircle.length === 0 ? (
            <LaunchCard variant="glass" className="p-8 text-center">
              <Users className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">No one in your circle yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Invite a family member, friend, carer or clinician. You decide what they can see.
              </p>
              <Button onClick={() => setActiveTab('invite')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite your first person
              </Button>
            </LaunchCard>
          ) : (
            <>
              {pending.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2 mt-1">
                    Pending invitations
                  </p>
                  <div className="space-y-2">
                    {pending.map((m) => {
                      const meta = roleMeta[m.role] ?? roleMeta.viewer;
                      const RoleIcon = meta.Icon;
                      const pill = statusPill(m.status);
                      const PillIcon = pill.Icon;
                      return (
                        <LaunchCard key={m.id} variant="glass" className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-sm font-semibold text-amber-700">
                              {(m.member_name || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{m.member_name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3" /> {m.member_email}
                              </p>
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span className={cn('text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1', meta.badge)}>
                                  <RoleIcon className="h-3 w-3" /> {meta.label}
                                </span>
                                <span className={cn('text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1', pill.className)}>
                                  <PillIcon className="h-3 w-3" /> {pill.label}
                                </span>
                                {m.relationship && (
                                  <span className="text-[10px] text-gray-500">· {m.relationship}</span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemove(m.id)}
                              disabled={removingId === m.id}
                              className="text-gray-500 hover:text-red-600"
                            >
                              {removingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancel'}
                            </Button>
                          </div>
                        </LaunchCard>
                      );
                    })}
                  </div>
                </div>
              )}

              {active.length > 0 && (
                <div className={pending.length > 0 ? 'mt-4' : ''}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-emerald-700 mb-2">
                    Active members
                  </p>
                  <div className="space-y-2">
                    {active.map((m) => {
                      const meta = roleMeta[m.role] ?? roleMeta.viewer;
                      const RoleIcon = meta.Icon;
                      const perms = Object.entries(m.permissions || {})
                        .filter(([, v]) => !!v)
                        .map(([k]) => k);
                      return (
                        <LaunchCard key={m.id} variant="glass" className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-emerald-100 to-brand-teal-100 flex items-center justify-center text-sm font-semibold text-brand-emerald-800">
                              {(m.member_name || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{m.member_name}</p>
                              {m.member_email && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3" /> {m.member_email}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1.5 mt-1.5">
                                <span className={cn('text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1', meta.badge)}>
                                  <RoleIcon className="h-3 w-3" /> {meta.label}
                                </span>
                                {m.relationship && (
                                  <span className="text-[10px] text-gray-500">· {m.relationship}</span>
                                )}
                                {perms.length > 0 && (
                                  <span className="text-[10px] text-gray-500">
                                    · Access: {perms.join(', ')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemove(m.id)}
                              disabled={removingId === m.id}
                              className="text-gray-500 hover:text-red-600"
                            >
                              {removingId === m.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Remove'}
                            </Button>
                          </div>
                        </LaunchCard>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="invite">
          <SimpleInviteForm />
          <p className="text-xs text-center text-gray-500 mt-4">
            Invitations expire in 48 hours. Your circle member decides whether to accept.
          </p>
        </TabsContent>
      </Tabs>
    </LaunchLayout>
  );
}
