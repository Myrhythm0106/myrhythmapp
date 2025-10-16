// @version 0.1
// @feature Next Steps Hub - ACT Management with Bulk Scheduling

import React, { useState, useEffect } from 'react';
import { useMemoryBridge } from '@/hooks/memoryBridge/useMemoryBridge';
import { EnhancedActionCard } from './EnhancedActionCard';
import { ACTConfirmationPanel } from './ACTConfirmationPanel';
import { BulkActionBar } from './BulkActionBar';
import { ActionSchedulingModal } from '@/components/memoryBridge/ActionSchedulingModal';
import { ExtractedAction } from '@/types/memoryBridge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Search, 
  Filter,
  ListChecks,
  Plus,
  ArrowRight,
  AlertCircle,
  Clock,
  Brain,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthRequiredMessage } from '@/components/ui/AuthRequiredMessage';
import { toast } from '@/hooks/use-toast';

export function NextStepsHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    extractedActions, 
    fetchExtractedActions, 
    confirmAction,
    isProcessing 
  } = useMemoryBridge();

  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'action' | 'watch_out' | 'depends_on' | 'note'>('all');
  
  // Bulk selection state
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Confirmation panel state
  const [showConfirmationPanel, setShowConfirmationPanel] = useState(false);
  const [selectedActionForConfirmation, setSelectedActionForConfirmation] = useState<ExtractedAction | null>(null);
  
  // Scheduling modal state
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
        title="Sign in to access your Next Steps Hub"
        message="Your AI-powered personal assistant is ready to help you organize, prioritize, and schedule your actions with intelligent suggestions."
        features={[
          "Smart ACT confirmation with 'Why this matters' context",
          "Bulk scheduling for multiple actions at once",
          "AI-powered action extraction from recordings",
          "Seamless calendar integration",
          "Progress tracking and celebrations"
        ]}
      />
    );
  }

  const actions = extractedActions || [];

  const filteredActions = actions.filter(action => {
    const matchesSearch = searchQuery === '' || 
      action.action_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || action.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

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

  const handleToggleSelection = (actionId: string) => {
    setSelectedActionIds(prev =>
      prev.includes(actionId) ? prev.filter(id => id !== actionId) : [...prev, actionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedActionIds.length === filteredActions.length) {
      setSelectedActionIds([]);
    } else {
      setSelectedActionIds(filteredActions.map(a => a.id!).filter(Boolean));
    }
  };

  const handleBulkSchedule = () => {
    const selectedActions = actions.filter(a => selectedActionIds.includes(a.id!));
    if (selectedActions.length > 0) {
      setActionsToSchedule(selectedActions);
      setIsSchedulingModalOpen(true);
      toast({
        title: "Bulk Scheduling",
        description: `Preparing to schedule ${selectedActions.length} actions with smart suggestions...`,
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedActionIds([]);
    setSelectionMode(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'action': return Target;
      case 'watch_out': return AlertCircle;
      case 'depends_on': return Clock;
      case 'note': return Brain;
      default: return Target;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                <Sparkles className="w-6 h-6 text-primary absolute top-0 right-0 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Loading Your Next Steps</h3>
                <p className="text-muted-foreground">Organizing your empowering journey...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Next Steps Hub</h1>
                <p className="text-muted-foreground">Your empowering actions, organized and ready</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>
              
              <Button
                variant={selectionMode ? "default" : "outline"}
                onClick={() => setSelectionMode(!selectionMode)}
              >
                <ListChecks className="w-4 h-4 mr-2" />
                {selectionMode ? "Exit Selection" : "Select Mode"}
              </Button>
            </div>
          </motion.div>

          {/* Select All Checkbox */}
          {selectionMode && filteredActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 mt-4 p-3 bg-muted rounded-lg"
            >
              <Checkbox
                checked={selectedActionIds.length === filteredActions.length}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Select All ({filteredActions.length} actions)
              </span>
            </motion.div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mt-4 bg-muted rounded-xl p-1">
            {[
              { value: 'all', label: 'All', count: actions.length },
              { value: 'action', label: 'Actions', count: actions.filter(a => a.category === 'action').length },
              { value: 'watch_out', label: 'Watch Outs', count: actions.filter(a => a.category === 'watch_out').length },
              { value: 'depends_on', label: 'Dependencies', count: actions.filter(a => a.category === 'depends_on').length },
              { value: 'note', label: 'Notes', count: actions.filter(a => a.category === 'note').length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFilter === filter.value
                    ? 'bg-background shadow-sm text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredActions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Your Action Journey Begins Here</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery || selectedFilter !== 'all' 
                ? "No actions match your filters. Adjust your search to find what you're looking for." 
                : "Start by recording a conversation to automatically discover action items and schedule them at your best times."
              }
            </p>
            {(!searchQuery && selectedFilter === 'all') && (
              <Button 
                onClick={() => navigate('/memory-bridge')}
                className="px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Your First Recording
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EnhancedActionCard
                    action={action}
                    onClick={() => handleActionClick(action)}
                    onSchedule={handleSchedule}
                    showCheckbox={selectionMode}
                    isSelected={selectedActionIds.includes(action.id!)}
                    onToggleSelect={() => handleToggleSelection(action.id!)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
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
            title: "Actions Scheduled!",
            description: `Successfully scheduled ${scheduledActions.length} actions.`,
          });
          setIsSchedulingModalOpen(false);
          setActionsToSchedule([]);
          setSelectedActionIds([]);
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

      <BulkActionBar
        selectedCount={selectedActionIds.length}
        onScheduleAll={handleBulkSchedule}
        onClearSelection={handleClearSelection}
        isProcessing={isProcessing}
      />
    </div>
  );
}
