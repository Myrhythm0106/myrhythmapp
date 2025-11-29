import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Link2, 
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MicroTask {
  text: string;
  completed: boolean;
}

interface ExtractedACT {
  id: string;
  action_text: string;
  category: 'action' | 'watch_out' | 'depends_on' | 'note';
  assigned_to: string | null;
  due_context: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  priority_level: number;
  micro_tasks: MicroTask[];
  success_criteria: string | null;
  motivation_statement: string | null;
  status: string;
}

interface VoiceRecordingACTsProps {
  acts: ExtractedACT[];
  onSchedule?: (act: ExtractedACT) => void;
  onRefresh?: () => void;
}

const categoryConfig = {
  action: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', label: 'Action ✅' },
  watch_out: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Watch Out ⚠️' },
  depends_on: { icon: Link2, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Depends On 🔗' },
  note: { icon: FileText, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Note 📝' }
};

const priorityColors: Record<number, string> = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-gray-500'
};

export function VoiceRecordingACTs({ acts, onSchedule, onRefresh }: VoiceRecordingACTsProps) {
  const [expandedActs, setExpandedActs] = React.useState<Set<string>>(new Set());
  const [scheduling, setScheduling] = React.useState<string | null>(null);

  const toggleExpanded = (actId: string) => {
    setExpandedActs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actId)) {
        newSet.delete(actId);
      } else {
        newSet.add(actId);
      }
      return newSet;
    });
  };

  const handleAddToCalendar = async (act: ExtractedACT) => {
    if (!act.proposed_date) {
      toast.error('No suggested date for this action');
      return;
    }

    setScheduling(act.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create calendar event
      const { error: eventError } = await supabase
        .from('calendar_events')
        .insert({
          user_id: user.id,
          title: act.action_text,
          date: act.proposed_date,
          time: act.proposed_time || '09:00',
          type: 'task',
          description: `${act.success_criteria || ''}\n\n${act.motivation_statement || ''}`.trim(),
          is_system_generated: true
        });

      if (eventError) throw eventError;

      // Update action status
      await supabase
        .from('extracted_actions')
        .update({ 
          status: 'scheduled',
          scheduled_date: act.proposed_date,
          scheduled_time: act.proposed_time || '09:00'
        })
        .eq('id', act.id);

      toast.success('Added to calendar! 🎉');
      onSchedule?.(act);
      onRefresh?.();
    } catch (error) {
      console.error('Error scheduling:', error);
      toast.error('Failed to add to calendar');
    } finally {
      setScheduling(null);
    }
  };

  if (!acts || acts.length === 0) {
    return null;
  }

  // Group ACTs by category
  const groupedActs = acts.reduce((acc, act) => {
    const category = act.category || 'action';
    if (!acc[category]) acc[category] = [];
    acc[category].push(act);
    return acc;
  }, {} as Record<string, ExtractedACT[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Extracted ACTs</h3>
        <Badge variant="secondary">{acts.length}</Badge>
      </div>

      {Object.entries(groupedActs).map(([category, categoryActs]) => {
        const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.action;
        const Icon = config.icon;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${config.color}`} />
              <span className="text-sm font-medium">{config.label}</span>
              <Badge variant="outline" className="text-xs">{categoryActs.length}</Badge>
            </div>

            {categoryActs.map((act) => (
              <Card key={act.id} className={`border-l-4 ${config.bg} border-l-current`}>
                <Collapsible 
                  open={expandedActs.has(act.id)}
                  onOpenChange={() => toggleExpanded(act.id)}
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${priorityColors[act.priority_level] || priorityColors[3]}`} />
                          <CardTitle className="text-sm font-medium leading-tight">
                            {act.action_text}
                          </CardTitle>
                        </div>
                        
                        {act.proposed_date && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(act.proposed_date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            {act.proposed_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {act.proposed_time}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {act.status !== 'scheduled' && act.proposed_date && category === 'action' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCalendar(act);
                            }}
                            disabled={scheduling === act.id}
                            className="text-xs h-7"
                          >
                            {scheduling === act.id ? 'Adding...' : 'Add to Calendar'}
                          </Button>
                        )}
                        {act.status === 'scheduled' && (
                          <Badge variant="secondary" className="text-xs">Scheduled</Badge>
                        )}
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            {expandedActs.has(act.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 space-y-3">
                      {act.motivation_statement && (
                        <p className="text-sm text-primary italic">
                          {act.motivation_statement}
                        </p>
                      )}

                      {act.micro_tasks && act.micro_tasks.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Quick Start Steps:</p>
                          <ul className="space-y-1">
                            {act.micro_tasks.map((task, idx) => (
                              <li key={idx} className="text-sm flex items-center gap-2">
                                <div className="w-4 h-4 border rounded flex items-center justify-center text-xs">
                                  {task.completed ? '✓' : idx + 1}
                                </div>
                                {task.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {act.success_criteria && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Done when:</p>
                          <p className="text-sm">{act.success_criteria}</p>
                        </div>
                      )}

                      {act.assigned_to && act.assigned_to !== 'me' && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Assigned to: {act.assigned_to}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
}
