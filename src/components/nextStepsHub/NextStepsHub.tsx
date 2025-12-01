// @version 0.2
// @feature Next Steps Hub - Brain-Injury-First Redesign

import React, { useState, useEffect } from 'react';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { FocusModeView } from './FocusModeView';
import { PriorityOverview } from './PriorityOverview';
import { SimplifiedActionCard } from './SimplifiedActionCard';
import { ACTConfirmationPanel } from './ACTConfirmationPanel';
import { ActionSchedulingModal } from '@/components/memoryBridge/ActionSchedulingModal';
import { ExtractedAction } from '@/types/memoryBridge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Eye,
  List,
  LayoutGrid,
  Plus,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { usePersona } from '@/hooks/usePersona';
import { getPersonaLanguage } from '@/utils/personaLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthRequiredMessage } from '@/components/ui/AuthRequiredMessage';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'focus' | 'overview' | 'all';

export function NextStepsHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { personaMode } = usePersona();
  const language = getPersonaLanguage(personaMode);
  const { 
    extractedActions, 
    fetchExtractedActions, 
    confirmAction,
    isProcessing 
  } = useMemoryBridge();

  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('focus');
  const [selectedFilter, setSelectedFilter] = useState<'pending' | 'scheduled' | 'completed'>('pending');
  
  // Panels
  const [showConfirmationPanel, setShowConfirmationPanel] = useState(false);
  const [selectedActionForConfirmation, setSelectedActionForConfirmation] = useState<ExtractedAction | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [actionsToSchedule, setActionsToSchedule] = useState<ExtractedAction[]>([]);

  useEffect(() => {
    const checkAuthAndLoadActions = async () => {
      if (user) {
        await loadActions();
      }
      setAuthChecked(true);
    };
    
    checkAuthAndLoadActions();
  }, [user]);

  const loadActions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await fetchExtractedActions();
    } catch (error) {
      console.error('Error loading actions:', error);
      toast({
        title: "Error",
        description: "Failed to load your next steps",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Show auth required message if user is not authenticated
  if (authChecked && !user) {
    return (
      <AuthRequiredMessage
        title="Sign in to access your Next Steps"
        message="Your personal space to organize and complete your actions - one step at a time."
        features={[
          "Focus on one thing at a time",
          "See your progress clearly",
          "Schedule at your best times",
          "Celebrate your wins"
        ]}
      />
    );
  }

  const actions = extractedActions || [];

  // Filter actions based on selected filter
  const getFilteredActions = () => {
    switch (selectedFilter) {
      case 'pending':
        return actions.filter(a => 
          a.status !== 'completed' && 
          a.status !== 'done' && 
          a.status !== 'scheduled'
        );
      case 'scheduled':
        return actions.filter(a => a.status === 'scheduled');
      case 'completed':
        return actions.filter(a => 
          a.status === 'completed' || a.status === 'done'
        );
      default:
        return actions;
    }
  };

  const filteredActions = getFilteredActions();
  const pendingCount = actions.filter(a => 
    a.status !== 'completed' && a.status !== 'done' && a.status !== 'scheduled'
  ).length;
  const scheduledCount = actions.filter(a => a.status === 'scheduled').length;
  const completedCount = actions.filter(a => 
    a.status === 'completed' || a.status === 'done'
  ).length;

  const handleActionClick = (action: ExtractedAction) => {
    setSelectedActionForConfirmation(action);
    setShowConfirmationPanel(true);
  };

  const handleConfirmAction = async (actionId: string) => {
    await confirmAction(actionId, 'confirmed');
    await loadActions();
  };

  const handleModifyAction = async (actionId: string, modifications: Record<string, any>) => {
    await confirmAction(actionId, 'modified', modifications);
    await loadActions();
  };

  const handleRejectAction = async (actionId: string, reason: string) => {
    await confirmAction(actionId, 'rejected', {}, reason);
    await loadActions();
    setShowConfirmationPanel(false);
  };

  const handleSchedule = (action: ExtractedAction) => {
    setActionsToSchedule([action]);
    setIsSchedulingModalOpen(true);
  };

  const handleComplete = async (action: ExtractedAction) => {
    await loadActions();
  };

  const handleLater = (action: ExtractedAction) => {
    // Move to next action in focus mode
    toast({
      title: "No problem!",
      description: "We'll keep this for later. Moving to the next step.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                <Heart className="w-6 h-6 text-primary absolute top-0 right-0 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Loading Your Next Steps</h3>
                <p className="text-muted-foreground">Getting everything ready for you...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Simplified Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Next Steps</h1>
                  <p className="text-sm text-muted-foreground">
                    {language.overwhelmSupport || "One step at a time"}
                  </p>
                </div>
              </div>
              
              {/* View Switcher - Simple */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'focus' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('focus')}
                  className="h-8 px-3 gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Focus</span>
                </Button>
                <Button
                  variant={viewMode === 'overview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('overview')}
                  className="h-8 px-3 gap-1.5"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Overview</span>
                </Button>
                <Button
                  variant={viewMode === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('all')}
                  className="h-8 px-3 gap-1.5"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">All</span>
                </Button>
              </div>
            </div>

            {/* Simple Filter Tabs - Only in All view */}
            {viewMode === 'all' && (
              <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setSelectedFilter('pending')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedFilter === 'pending'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Ready to Do
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {pendingCount}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setSelectedFilter('scheduled')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedFilter === 'scheduled'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Scheduled
                  {scheduledCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {scheduledCount}
                    </Badge>
                  )}
                </button>
                <button
                  onClick={() => setSelectedFilter('completed')}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedFilter === 'completed'
                      ? 'bg-background shadow-sm text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 inline mr-1" />
                  Done
                  {completedCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                      {completedCount}
                    </Badge>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-20">
        <AnimatePresence mode="wait">
          {actions.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 px-4"
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {language.warmWelcome || "Ready to Get Started?"}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Record a conversation to discover action items, or add your first step manually.
              </p>
              <Button 
                onClick={() => navigate('/memory-bridge')}
                className="px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Recording
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ) : viewMode === 'focus' ? (
            <motion.div
              key="focus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FocusModeView
                actions={actions}
                onComplete={handleComplete}
                onLater={handleLater}
                onViewAll={() => setViewMode('all')}
                onSchedule={handleSchedule}
                personaType={personaMode}
              />
            </motion.div>
          ) : viewMode === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PriorityOverview
                actions={actions}
                onActionClick={handleActionClick}
                onSchedule={handleSchedule}
                onComplete={handleComplete}
                personaType={personaMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-4 py-6"
            >
              {/* Progress acknowledgment */}
              {completedCount > 0 && selectedFilter === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900"
                >
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language.progressAck || `You've completed ${completedCount} steps. Amazing progress!`}
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Simplified Cards */}
              <div className="space-y-3">
                {filteredActions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {selectedFilter === 'completed' 
                        ? "Complete your first step to see it here! 🎯"
                        : selectedFilter === 'scheduled'
                        ? "Schedule a step to see it here 📅"
                        : "All caught up! Nothing pending right now 🎉"
                      }
                    </p>
                  </div>
                ) : (
                  filteredActions.map((action, index) => (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <SimplifiedActionCard
                        action={action}
                        onSchedule={handleSchedule}
                        onComplete={handleComplete}
                        onViewDetails={handleActionClick}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals and Panels */}
      <ActionSchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => {
          setIsSchedulingModalOpen(false);
          setActionsToSchedule([]);
        }}
        actions={actionsToSchedule}
        onScheduleComplete={async (scheduledActions) => {
          toast({
            title: "Scheduled! 📅",
            description: `${scheduledActions.length} ${scheduledActions.length === 1 ? 'step' : 'steps'} scheduled.`,
          });
          setIsSchedulingModalOpen(false);
          setActionsToSchedule([]);
          await loadActions();
        }}
      />

      <ACTConfirmationPanel
        action={selectedActionForConfirmation}
        isOpen={showConfirmationPanel}
        onClose={() => {
          setShowConfirmationPanel(false);
          setSelectedActionForConfirmation(null);
        }}
        onConfirm={handleConfirmAction}
        onModify={handleModifyAction}
        onReject={handleRejectAction}
        onSchedule={handleSchedule}
      />
    </div>
  );
}
