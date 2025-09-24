import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwipeableContainer } from '@/components/ui/SwipeableContainer';
import { MemoryBridgeCommentsSection } from './MemoryBridgeCommentsSection';
import { SwipeHint } from '@/components/gratitude/journal/components/SwipeHint';
import { PriorityPicker } from './PriorityPicker';
import { TodaysPriorityBanner } from './TodaysPriorityBanner';
import { ActionSchedulingModal } from './ActionSchedulingModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { NextStepsItem } from '@/types/memoryBridge';
import { convertActionToCalendarEvent, scheduleConfirmedActions } from '@/utils/calendarIntegration';
import { smartScheduler } from '@/utils/smartScheduler';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, Share2, Calendar, Users, Brain, Heart, Clock, AlertTriangle, Star, MessageCircle, Crown, Lock, TrendingUp, Sparkles, Edit3, Target, Eye, Link } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';
import { WatcherSelectionModal } from './WatcherSelectionModal';
import { EmptyACTsState } from './EmptyACTsState';

interface NextStepsReviewProps {
  meetingId?: string;
  onActionConfirm?: (actionId: string, status: 'confirmed' | 'modified' | 'rejected') => void;
  onShareWithFamily?: (actionId: string) => void;
  tier?: 'free' | 'taste-see' | 'pro';
}

export function NextStepsReview({ 
  meetingId, 
  onActionConfirm, 
  onShareWithFamily, 
  tier = 'free' 
}: NextStepsReviewProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { fetchExtractedActions, confirmAction } = useMemoryBridge();
  const [nextSteps, setNextSteps] = useState<NextStepsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [actionToReject, setActionToReject] = useState<string | null>(null);
  const [showWatcherSelection, setShowWatcherSelection] = useState(false);
  const [actionForWatchers, setActionForWatchers] = useState<string | null>(null);
  const [showSmartScheduling, setShowSmartScheduling] = useState(false);
  const [editingPriority, setEditingPriority] = useState<string | null>(null);

  const commentLimits = { free: 1, 'taste-see': 7, pro: Infinity };

  useEffect(() => {
    loadNextSteps();
  }, [meetingId]);

  const loadNextSteps = async () => {
    try {
      setIsLoading(true);
      const extractedActions = await fetchExtractedActions(meetingId);
      setNextSteps(extractedActions || []);
    } catch (error) {
      console.error('Failed to load next steps:', error);
      toast.error('Failed to load next steps');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipeComplete = async (actionId: string) => {
    try {
      await confirmAction(actionId, 'confirmed');
      setNextSteps(prev => 
        prev.map(step => 
          step.id === actionId 
            ? { ...step, status: 'confirmed' as const }
            : step
        )
      );
      if (onActionConfirm) onActionConfirm(actionId, 'confirmed');
      toast.success("Next step confirmed! 💪", {
        description: "You're building stronger relationships with every commitment kept"
      });
    } catch (error) {
      toast.error("Failed to confirm next step");
    }
  };

  const handleSwipeShare = (actionId: string) => {
    const currentComments = commentCounts[actionId] || 0;
    const limit = commentLimits[tier];
    
    if (currentComments >= limit) {
      toast.error(`Comment limit reached (${limit}). Upgrade for unlimited family sharing!`);
      return;
    }
    
    if (onShareWithFamily) onShareWithFamily(actionId);
    setCommentCounts(prev => ({ ...prev, [actionId]: currentComments + 1 }));
    toast.success("Shared with your Support Circle! 💜", {
      description: "No one walks alone - your circle is here to support you"
    });
  };

  const handleScheduleAction = async (actionId: string) => {
    setActionForWatchers(actionId);
    setShowWatcherSelection(true);
  };

  const handleScheduleWithWatchers = async (actionId: string, watcherIds: string[], watcherNames: string[], selectedDate?: string, selectedTime?: string) => {
    if (!user) return;
    
    try {
      const step = nextSteps.find(a => a.id === actionId);
      if (!step) return;

      // Update step with watchers and smart scheduling
      const updatedStep = { ...step, assigned_watchers: watcherIds };
      await convertActionToCalendarEvent(updatedStep, user.id, watcherNames, selectedDate, selectedTime);
      
      setNextSteps(prev => 
        prev.map(a => 
          a.id === actionId 
            ? { ...a, status: 'scheduled' as const, assigned_watchers: watcherIds }
            : a
        )
      );
      
      setShowWatcherSelection(false);
      setShowSmartScheduling(false);
      setActionForWatchers(null);
      
      toast.success("Next step scheduled with SMART suggestions! 📅💜", {
        description: `${watcherNames.length > 0 ? watcherNames.join(', ') + ' will' : 'Your circle will'} be notified of this empowering commitment`
      });
    } catch (error) {
      toast.error("Failed to schedule next step");
    }
  };

  const handleScheduleAllConfirmed = async () => {
    if (!user) return;
    await scheduleConfirmedActions(user.id);
    toast.success("All confirmed next steps scheduled! 🚀", {
      description: "You're empowered and organized - every commitment matters"
    });
  };

  const handleUpdatePriority = async (actionId: string, newPriority: number) => {
    try {
      // Update in database
      const { error } = await supabase
        .from('extracted_actions')
        .update({ priority_level: newPriority })
        .eq('id', actionId);

      if (error) throw error;

      // Update local state
      setNextSteps(prev => 
        prev.map(step => 
          step.id === actionId 
            ? { ...step, priority_level: newPriority }
            : step
        )
      );
      
      setEditingPriority(null);
      toast.success("Priority updated! 💪", {
        description: "Your priorities reflect your empowered choices"
      });
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleRejectAction = (actionId: string) => {
    setActionToReject(actionId);
    setShowRejectConfirm(true);
  };

  const confirmRejectAction = async () => {
    if (!actionToReject) return;
    
    try {
      await confirmAction(actionToReject, 'rejected');
      setNextSteps(prev => 
        prev.map(step => 
          step.id === actionToReject 
            ? { ...step, status: 'rejected' as const }
            : step
        )
      );
      toast.info("Next step respectfully declined", {
        description: "It's okay to set boundaries - you know what's best for you"
      });
    } catch (error) {
      toast.error("Failed to decline next step");
    } finally {
      setShowRejectConfirm(false);
      setActionToReject(null);
    }
  };

  const categorizeNextSteps = (steps: NextStepsItem[]) => {
    return {
      actions: steps.filter(s => s.category === 'action'),
      watch_outs: steps.filter(s => s.category === 'watch_out'),
      depends_on: steps.filter(s => s.category === 'depends_on'),
      notes: steps.filter(s => s.category === 'note')
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'action': return <Target className="h-4 w-4" />;
      case 'watch_out': return <Eye className="h-4 w-4" />;
      case 'depends_on': return <Link className="h-4 w-4" />;
      case 'note': return <MessageCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string, type: 'bg' | 'border' | 'text') => {
    const colors = {
      action: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
      watch_out: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
      depends_on: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800' },
      note: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800' }
    };
    return colors[category as keyof typeof colors]?.[type] || colors.action[type];
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'action': return 'ACTIONS';
      case 'watch_out': return 'WATCH-OUTS';
      case 'depends_on': return 'DEPENDS ON';
      case 'note': return 'NOTES';
      default: return 'ACTIONS';
    }
  };

  const categorizedSteps = categorizeNextSteps(nextSteps);
  const confirmedCount = nextSteps.filter(s => s.status === 'confirmed').length;

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading your next steps...</p>
        </div>
      </div>
    );
  }

  if (nextSteps.length === 0) {
    return (
      <EmptyACTsState 
        onRefresh={loadNextSteps}
        onStartRecording={() => window.location.hash = '#recording'}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Today's Priority Banner */}
      <TodaysPriorityBanner />
      
      {/* Premium Upgrade Banner */}
      <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Crown className="h-8 w-8 text-amber-600" />
              <div>
                <h3 className="text-lg font-bold text-amber-900">Unlock Premium Next Steps Features</h3>
                <p className="text-sm text-amber-700">Advanced categorization, unlimited family sharing, and smart scheduling</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Your Next Steps Framework
            </CardTitle>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground">Empowering your conversations into actionable progress</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary font-medium">No One Walks Alone</span>
            <Heart className="h-4 w-4 text-primary" />
          </div>
          {confirmedCount > 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleScheduleAllConfirmed} className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary">
                <Calendar className="h-4 w-4" />
                Schedule {confirmedCount} Empowered Next Steps
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['actions', 'watch_outs', 'depends_on', 'notes'] as const).map(categoryKey => {
          const category = categoryKey === 'actions' ? 'action' : 
                          categoryKey === 'watch_outs' ? 'watch_out' : 
                          categoryKey === 'depends_on' ? 'depends_on' : 'note';
          
          return (
            <div key={categoryKey} className="space-y-3">
              <div className={`text-center p-3 rounded-lg border-2 ${getCategoryColor(category, 'bg')} ${getCategoryColor(category, 'border')}`}>
                <div className="flex items-center justify-center gap-2">
                  {getCategoryIcon(category)}
                  <h3 className={`font-bold ${getCategoryColor(category, 'text')}`}>
                    {getCategoryLabel(category)}
                  </h3>
                </div>
              </div>
              
              {categorizedSteps[categoryKey].map(step => (
                <SwipeableContainer
                  key={step.id}
                  enableHorizontalSwipe={isMobile}
                  onSwipeLeft={{
                    label: "Confirm",
                    icon: <CheckCircle className="h-4 w-4" />,
                    color: "#22c55e",
                    action: () => handleSwipeComplete(step.id!)
                  }}
                  onSwipeRight={{
                    label: "Share Circle",
                    icon: <Share2 className="h-4 w-4" />,
                    color: "#3b82f6", 
                    action: () => handleSwipeShare(step.id!)
                  }}
                  onPullToRefresh={() => handleRejectAction(step.id!)}
                  enablePullToRefresh={isMobile}
                >
                  <Card className="bg-gradient-to-br from-white to-gray-50 hover:shadow-md transition-shadow border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-sm mb-1">{step.action_text}</h4>
                      {step.relationship_impact && (
                        <p className="text-xs text-muted-foreground mb-2 italic">
                          💜 {step.relationship_impact}
                        </p>
                      )}
                      
                      {/* Priority Section with Editing */}
                      <div className="mb-2">
                        {editingPriority === step.id ? (
                          <div className="space-y-2">
                            <PriorityPicker
                              value={step.priority_level}
                              onChange={(priority) => handleUpdatePriority(step.id!, priority)}
                              showLabel={false}
                            />
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => setEditingPriority(null)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs cursor-pointer hover:bg-memory-emerald-50 ${
                                step.priority_level && step.priority_level >= 4 ? 'border-red-300 text-red-700' : 
                                step.priority_level && step.priority_level >= 3 ? 'border-orange-300 text-orange-700' :
                                'border-blue-300 text-blue-700'
                              }`}
                              onClick={() => setEditingPriority(step.id!)}
                            >
                              Priority {step.priority_level || 3}
                              <Edit3 className="h-2 w-2 ml-1" />
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{step.category}</Badge>
                            {step.owner && (
                              <Badge variant="outline" className="text-xs">{step.owner}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 hover:bg-green-100" 
                            onClick={() => handleSwipeComplete(step.id!)}
                            disabled={step.status === 'confirmed'}
                            title="Confirm next step"
                          >
                            <CheckCircle className={`h-3 w-3 ${step.status === 'confirmed' ? 'text-green-600' : 'text-gray-400'}`} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 hover:bg-blue-100" 
                            onClick={() => {
                              setActionForWatchers(step.id!);
                              setShowSmartScheduling(true);
                            }}
                            title="Smart schedule with circle"
                          >
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 hover:bg-purple-100" 
                            onClick={() => handleSwipeShare(step.id!)}
                            title="Share with circle"
                          >
                            <MessageCircle className="h-3 w-3 text-purple-600" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {step.status === 'confirmed' && (
                          <Badge className="text-xs bg-green-100 text-green-800">✓ Confirmed</Badge>
                        )}
                        {step.status === 'scheduled' && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">📅 Scheduled</Badge>
                        )}
                        {step.status === 'rejected' && (
                          <Badge className="text-xs bg-gray-100 text-gray-800">❌ Declined</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SwipeableContainer>
              ))}
            </div>
          );
        })}
      </div>

      {isMobile && (
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20">
          <SwipeHint isMobile={true} />
          <p className="text-xs text-muted-foreground mt-2">
            ← Swipe left to confirm • → Swipe right to share with circle • ↑ Pull to decline respectfully
          </p>
          <p className="text-xs text-primary mt-1 font-medium">
            Remember: You're empowered to choose what works for you 💜
          </p>
        </div>
      )}

      {/* Empowerment Message */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">Building Stronger Relationships</span>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Every next step you take strengthens the bonds with those you care about
          </p>
          <p className="text-xs text-primary mt-2 italic">
            "Progress over perfection - you're never alone on this journey"
          </p>
        </CardContent>
      </Card>

      {/* Smart Scheduling Modal */}
      {showSmartScheduling && actionForWatchers && (
        <ActionSchedulingModal
          isOpen={showSmartScheduling}
          onClose={() => {
            setShowSmartScheduling(false);
            setActionForWatchers(null);
          }}
          actions={nextSteps.filter(a => a.id === actionForWatchers)}
          onScheduleComplete={(results) => {
            if (results.length > 0 && actionForWatchers) {
              const result = results[0];
              handleScheduleWithWatchers(
                actionForWatchers, 
                result.assigned_watchers || [], 
                result.assigned_watchers?.map(id => `Watcher ${id}`) || [],
                result.scheduled_date || '',
                result.scheduled_time || ''
              );
            }
          }}
        />
      )}

      {/* Legacy Watcher Selection Modal */}
      <WatcherSelectionModal
        isOpen={showWatcherSelection}
        onClose={() => {
          setShowWatcherSelection(false);
          setActionForWatchers(null);
        }}
        actionIds={actionForWatchers ? [actionForWatchers] : []}
        onComplete={(watcherIds, watcherNames) => {
          if (actionForWatchers) {
            handleScheduleWithWatchers(actionForWatchers, watcherIds, watcherNames);
          }
        }}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRejectConfirm}
        onConfirm={confirmRejectAction}
        onCancel={() => {
          setShowRejectConfirm(false);
          setActionToReject(null);
        }}
        title="Decline this next step?"
        description="It's completely okay to set boundaries and choose what works best for you. You're empowered to make decisions that support your wellbeing."
        confirmText="Yes, decline respectfully"
        cancelText="Keep next step"
        variant="default"
      />
      
      {/* Family Comments Section */}
      {meetingId && (
        <div className="mt-6">
          <MemoryBridgeCommentsSection recordingId={meetingId} />
        </div>
      )}
    </div>
  );
}