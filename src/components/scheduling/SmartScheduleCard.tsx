import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { smartScheduler } from '@/utils/smartScheduler';
import { convertActionToCalendarEvent } from '@/utils/calendarIntegration';
import { EmailValidator } from '@/utils/security/emailValidator';
import { toast } from 'sonner';
import { 
  Calendar, Check, X, Clock, ChevronDown, ChevronUp, 
  Users, Plus, Sparkles, Brain, Zap, Mail
} from 'lucide-react';
import type { ExtractedAction } from '@/types/memoryBridge';

interface Attendee {
  name?: string;
  email: string;
}

interface ScheduleItem {
  action: ExtractedAction;
  suggestedDate: string;
  suggestedTime: string;
  energyMatch: 'peak' | 'good' | 'off-peak';
  confidence: number;
  reason: string;
  status: 'pending' | 'approved' | 'adjusted' | 'dismissed';
  attendees: Attendee[];
  suggestedAttendees: Attendee[];
}

interface SmartScheduleCardProps {
  actions?: ExtractedAction[];
  onSchedulingComplete?: (scheduledCount: number) => void;
}

export function SmartScheduleCard({ actions = [], onSchedulingComplete }: SmartScheduleCardProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [dismissedCount, setDismissedCount] = useState(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [supportCircleMembers, setSupportCircleMembers] = useState<Attendee[]>([]);

  // Load support circle members
  useEffect(() => {
    if (!user?.id) return;
    
    const loadMembers = async () => {
      const { data } = await supabase
        .from('support_circle_members')
        .select('member_name, member_email')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (data) {
        setSupportCircleMembers(
          data
            .filter(m => m.member_email)
            .map(m => ({ name: m.member_name, email: m.member_email! }))
        );
      }
    };
    loadMembers();
  }, [user?.id]);

  // Load auto-accept preference
  useEffect(() => {
    if (!user?.id) return;
    
    const loadAutoAccept = async () => {
      const { data } = await supabase
        .from('user_schedule_preferences')
        .select('auto_accept_scheduling')
        .eq('user_id', user.id)
        .limit(1);
      
      if (data && data.length > 0 && (data[0] as any).auto_accept_scheduling) {
        setAutoAccept(true);
      }
    };
    loadAutoAccept();
  }, [user?.id]);

  // Generate smart suggestions for all actions
  useEffect(() => {
    if (!user?.id || actions.length === 0) {
      setIsLoading(false);
      return;
    }

    const generateSuggestions = async () => {
      setIsLoading(true);
      const scheduleItems: ScheduleItem[] = [];

      for (const action of actions) {
        try {
          const suggestions = await smartScheduler.generateSmartSuggestions(action, user.id);
          const topSuggestion = suggestions[0];

          if (topSuggestion) {
            const energyMatch = topSuggestion.confidence > 0.7 ? 'peak' 
              : topSuggestion.confidence > 0.5 ? 'good' 
              : 'off-peak';

            // Auto-detect mentioned contacts
            const suggestedAttendees = smartScheduler.extractMentionedContacts(
              action.action_text, 
              supportCircleMembers
            );

            scheduleItems.push({
              action,
              suggestedDate: topSuggestion.date,
              suggestedTime: topSuggestion.time,
              energyMatch,
              confidence: topSuggestion.confidence,
              reason: topSuggestion.reason,
              status: 'pending',
              attendees: [],
              suggestedAttendees,
            });
          }
        } catch (error) {
          console.error('Error generating suggestion for action:', action.id, error);
        }
      }

      setItems(scheduleItems);
      setIsLoading(false);

      // Auto-accept if enabled
      if (autoAccept && scheduleItems.length > 0) {
        handleApproveAll(scheduleItems);
      }
    };

    generateSuggestions();
  }, [user?.id, actions, supportCircleMembers]);

  const handleApproveItem = useCallback(async (index: number) => {
    if (!user?.id) return;
    const item = items[index];
    
    try {
      await convertActionToCalendarEvent(
        item.action,
        user.id,
        item.attendees.map(a => a.name || a.email),
        item.suggestedDate,
        item.suggestedTime,
        [...item.attendees, ...item.suggestedAttendees.filter(sa => 
          !item.attendees.some(a => a.email === sa.email)
        )]
      );
      
      setItems(prev => prev.map((it, i) => 
        i === index ? { ...it, status: 'approved' as const } : it
      ));
    } catch (error) {
      console.error('Failed to schedule item:', error);
      toast.error('Failed to schedule this item');
    }
  }, [user?.id, items]);

  const handleDismissItem = useCallback((index: number) => {
    setItems(prev => prev.map((it, i) => 
      i === index ? { ...it, status: 'dismissed' as const } : it
    ));
  }, []);

  const handleApproveAll = useCallback(async (itemsToApprove?: ScheduleItem[]) => {
    const targetItems = itemsToApprove || items;
    if (!user?.id) return;

    let scheduled = 0;
    let dismissed = 0;

    for (let i = 0; i < targetItems.length; i++) {
      const item = targetItems[i];
      if (item.status === 'dismissed') {
        dismissed++;
        continue;
      }
      if (item.status === 'approved') {
        scheduled++;
        continue;
      }

      try {
        await convertActionToCalendarEvent(
          item.action,
          user.id,
          item.attendees.map(a => a.name || a.email),
          item.suggestedDate,
          item.suggestedTime,
          [...item.attendees, ...item.suggestedAttendees]
        );
        scheduled++;
      } catch (error) {
        console.error('Failed to schedule item:', error);
      }
    }

    setScheduledCount(scheduled);
    setDismissedCount(dismissed);
    setIsComplete(true);
    onSchedulingComplete?.(scheduled);

    toast.success(`✨ ${scheduled} items scheduled to your calendar!`, {
      description: dismissed > 0 ? `${dismissed} dismissed` : undefined
    });
  }, [items, user?.id, onSchedulingComplete]);

  const handleAutoAcceptToggle = useCallback(async (enabled: boolean) => {
    setAutoAccept(enabled);
    if (!user?.id) return;

    try {
      // Update preference in database
      const { data: existing } = await supabase
        .from('user_schedule_preferences')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from('user_schedule_preferences')
          .update({ auto_accept_scheduling: enabled } as any)
          .eq('id', existing[0].id);
      }

      toast.success(enabled 
        ? 'Auto-scheduling enabled — your assistant will handle it!' 
        : 'Auto-scheduling disabled — you\'ll review each item'
      );
    } catch (error) {
      console.error('Failed to update auto-accept:', error);
    }
  }, [user?.id]);

  const addEmailAttendee = useCallback((itemIndex: number) => {
    if (!EmailValidator.isValidEmail(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setItems(prev => prev.map((item, i) => 
      i === itemIndex 
        ? { ...item, attendees: [...item.attendees, { email: emailInput }] }
        : item
    ));
    setEmailInput('');
  }, [emailInput]);

  const addSupportCircleAttendee = useCallback((itemIndex: number, attendee: Attendee) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== itemIndex) return item;
      if (item.attendees.some(a => a.email === attendee.email)) return item;
      return { ...item, attendees: [...item.attendees, attendee] };
    }));
  }, []);

  const removeAttendee = useCallback((itemIndex: number, email: string) => {
    setItems(prev => prev.map((item, i) => 
      i === itemIndex 
        ? { ...item, attendees: item.attendees.filter(a => a.email !== email) }
        : item
    ));
  }, []);

  const acceptSuggestedAttendee = useCallback((itemIndex: number, attendee: Attendee) => {
    setItems(prev => prev.map((item, i) => {
      if (i !== itemIndex) return item;
      return {
        ...item,
        attendees: [...item.attendees, attendee],
        suggestedAttendees: item.suggestedAttendees.filter(a => a.email !== attendee.email),
      };
    }));
  }, []);

  const getEnergyBadge = (match: 'peak' | 'good' | 'off-peak') => {
    switch (match) {
      case 'peak':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-memory-emerald-100 text-memory-emerald-700">
            <Zap className="h-3 w-3" /> Peak
          </span>
        );
      case 'good':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-brand-orange-100 text-brand-orange-700">
            <Brain className="h-3 w-3" /> Good
          </span>
        );
      case 'off-peak':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            <Clock className="h-3 w-3" /> Off-peak
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (actions.length === 0 && !isLoading) return null;

  if (isLoading) {
    return (
      <Card className="border-neural-purple-200 bg-gradient-to-br from-neural-purple-50/50 to-clarity-teal-50/50">
        <CardContent className="p-6 text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-3 text-neural-purple-500 animate-pulse" />
          <p className="text-sm text-muted-foreground">Your assistant is finding the best times...</p>
        </CardContent>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <Card className="border-memory-emerald-200 bg-gradient-to-br from-memory-emerald-50/50 to-clarity-teal-50/50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-memory-emerald-100 flex items-center justify-center">
            <Check className="h-6 w-6 text-memory-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Done!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {scheduledCount} scheduled{dismissedCount > 0 ? `, ${dismissedCount} dismissed` : ''}
            </p>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => window.location.href = '/calendar'}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View in Calendar
          </Button>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = items.filter(i => i.status === 'pending').length;

  return (
    <Card className="border-neural-purple-200 bg-gradient-to-br from-neural-purple-50/30 to-clarity-teal-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-neural-purple-500" />
            <CardTitle className="text-base">
              Your assistant scheduled {items.length} item{items.length !== 1 ? 's' : ''} this week
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Auto-schedule</span>
            <Switch 
              checked={autoAccept} 
              onCheckedChange={handleAutoAcceptToggle}
              aria-label="Toggle auto-scheduling"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {items.map((item, index) => (
          <div 
            key={item.action.id}
            className={`rounded-lg border p-3 transition-all ${
              item.status === 'approved' 
                ? 'bg-memory-emerald-50/50 border-memory-emerald-200 opacity-75' 
                : item.status === 'dismissed'
                ? 'bg-muted/30 border-muted opacity-50'
                : 'bg-card border-border hover:border-neural-purple-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.action.action_text}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.suggestedDate)} at {item.suggestedTime}
                  </span>
                  {getEnergyBadge(item.energyMatch)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 italic">{item.reason}</p>
                
                {/* Suggested attendees */}
                {item.suggestedAttendees.length > 0 && item.status === 'pending' && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.suggestedAttendees.map(sa => (
                      <button
                        key={sa.email}
                        onClick={() => acceptSuggestedAttendee(index, sa)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-neural-purple-100 text-neural-purple-700 hover:bg-neural-purple-200 transition-colors"
                      >
                        <Users className="h-3 w-3" />
                        Invite {sa.name || sa.email}?
                      </button>
                    ))}
                  </div>
                )}

                {/* Confirmed attendees */}
                {item.attendees.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.attendees.map(a => (
                      <span 
                        key={a.email}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-clarity-teal-100 text-clarity-teal-700"
                      >
                        <Mail className="h-3 w-3" />
                        {a.name || a.email}
                        {item.status === 'pending' && (
                          <button 
                            onClick={() => removeAttendee(index, a.email)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              {item.status === 'pending' && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.action.id ? null : item.action.id)}
                    className="p-1.5 rounded-md hover:bg-muted transition-colors"
                    aria-label="Add people"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleApproveItem(index)}
                    className="p-1.5 rounded-md hover:bg-memory-emerald-100 text-memory-emerald-600 transition-colors"
                    aria-label="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDismissItem(index)}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {item.status === 'approved' && (
                <Check className="h-5 w-5 text-memory-emerald-500 shrink-0" />
              )}
            </div>

            {/* Expanded attendee panel */}
            {expandedItem === item.action.id && item.status === 'pending' && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Add people to this event</p>
                
                {/* Support circle quick-add */}
                {supportCircleMembers.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {supportCircleMembers
                      .filter(m => !item.attendees.some(a => a.email === m.email))
                      .map(member => (
                        <button
                          key={member.email}
                          onClick={() => addSupportCircleAttendee(index, member)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-neural-purple-200 hover:bg-neural-purple-50 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          {member.name || member.email}
                        </button>
                      ))}
                  </div>
                )}

                {/* Manual email input */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-1.5 text-xs rounded-md border border-input bg-background"
                    onKeyDown={(e) => e.key === 'Enter' && addEmailAttendee(index)}
                  />
                  <Button 
                    size="xs" 
                    variant="outline" 
                    onClick={() => addEmailAttendee(index)}
                  >
                    Add
                  </Button>
                </div>
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>
            )}
          </div>
        ))}

        {/* Approve all */}
        {pendingCount > 0 && (
          <Button 
            className="w-full"
            variant="healing"
            onClick={() => handleApproveAll()}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve All ({pendingCount})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
