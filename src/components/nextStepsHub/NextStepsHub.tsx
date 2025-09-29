import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Zap, 
  Calendar,
  Target,
  Users,
  Filter,
  Search,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { fetchExtractedActions } from '@/utils/memoryBridgeApi';
import { NextStepsItem } from '@/types/memoryBridge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthRequiredMessage } from '@/components/ui/AuthRequiredMessage';
import { DisclosureCard } from '@/components/ui/DisclosureCard';
import { SmartSuggestionCard } from '@/components/ui/SmartSuggestionCard';
import { useEnhancedSmartScheduling } from '@/hooks/useEnhancedSmartScheduling';
import { EnhancedActionCard } from '@/components/nextStepsHub/EnhancedActionCard';

export function NextStepsHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actions, setActions] = useState<NextStepsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'action' | 'watch_out' | 'depends_on' | 'note'>('all');
  const [selectedAction, setSelectedAction] = useState<NextStepsItem | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { generateSmartSuggestions, scheduleAction, isGenerating, isScheduling } = useEnhancedSmartScheduling();

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
      const actionsData = await fetchExtractedActions(user.id);
      setActions(actionsData);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast.error('Failed to load your next steps');
    } finally {
      setLoading(false);
    }
  };

  // Show auth required message if user is not authenticated
  if (authChecked && !user) {
    return (
      <AuthRequiredMessage
        title="Sign in to access your Next Steps Hub"
        message="Your AI-powered personal assistant is ready to help you organize, prioritize, and schedule your actions with intelligent suggestions and conflict detection."
        features={[
          "Smart scheduling with calendar conflict detection",
          "AI-powered action extraction from recordings",
          "Personalized priority recommendations",
          "Seamless calendar integration across devices",
          "Empowering progress tracking and celebrations"
        ]}
      />
    );
  }

  const filteredActions = actions.filter(action => {
    const matchesSearch = searchQuery === '' || 
      action.action_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || action.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'action':
        return { 
          icon: Target, 
          color: 'bg-emerald-500', 
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          label: 'Action' 
        };
      case 'watch_out':
        return { 
          icon: AlertCircle, 
          color: 'bg-amber-500', 
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          label: 'Watch Out' 
        };
      case 'depends_on':
        return { 
          icon: Clock, 
          color: 'bg-blue-500', 
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Depends On' 
        };
      case 'note':
        return { 
          icon: Brain, 
          color: 'bg-purple-500', 
          textColor: 'text-purple-600',
          bgColor: 'bg-purple-50',
          label: 'Note' 
        };
      default:
        return { 
          icon: Target, 
          color: 'bg-gray-500', 
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Item' 
        };
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'not_started': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center py-20"
          >
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <Sparkles className="w-6 h-6 text-yellow-500 absolute top-0 right-0 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-800">Loading Your Next Steps</h3>
                <p className="text-gray-600">Organizing your empowering journey...</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Next Steps Hub</h1>
                <p className="text-gray-600">Your empowering action center</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
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
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.label} {filter.count > 0 && `(${filter.count})`}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
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
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Target className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Action Journey Awaits</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery || selectedFilter !== 'all' 
                ? "No actions match your current filters. Try adjusting your search to discover more opportunities." 
                : "Ready to transform your thoughts into action? Start by making a recording to capture your goals, commitments, and brilliant ideas."
              }
            </p>
            {(!searchQuery && selectedFilter === 'all') && (
              <Button 
                onClick={() => navigate('/quick-capture')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Your First Recording
                <ArrowRight className="w-4 w-4 ml-2" />
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredActions.map((action, index) => {
                const config = getCategoryConfig(action.category || 'action');
                const IconComponent = config.icon;
                
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <EnhancedActionCard
                      action={action}
                      onViewDetails={() => setSelectedAction(action)}
                      onSchedule={async (suggestion) => {
                        await scheduleAction(suggestion, action.id, action.action_text);
                        await loadActions(); // Refresh actions
                      }}
                      isScheduling={isScheduling}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Action Detail Modal */}
      <AnimatePresence>
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const config = getCategoryConfig(selectedAction.category || 'action');
                      const IconComponent = config.icon;
                      return (
                        <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 ${config.textColor}`} />
                        </div>
                      );
                    })()}
                    <div>
                      <Badge variant="secondary" className={`text-sm ${getCategoryConfig(selectedAction.category || 'action').textColor} ${getCategoryConfig(selectedAction.category || 'action').bgColor} border-0 mb-2`}>
                        {getCategoryConfig(selectedAction.category || 'action').label}
                      </Badge>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedAction.action_text}
                      </h2>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedAction(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </Button>
                </div>

                {/* Detail Content */}
                <div className="space-y-6">
                  {selectedAction.motivation_statement && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Why This Matters</h4>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-xl">
                        {selectedAction.motivation_statement}
                      </p>
                    </div>
                  )}

                  {selectedAction.success_criteria && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Success Criteria</h4>
                      <p className="text-gray-700">{selectedAction.success_criteria}</p>
                    </div>
                  )}

                  {selectedAction.how_steps && selectedAction.how_steps.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">How to Complete</h4>
                      <ul className="space-y-2">
                        {selectedAction.how_steps.map((step, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <Badge className={`block mt-1 w-fit ${getStatusColor(selectedAction.status || 'not_started')}`}>
                        {selectedAction.status?.replace('_', ' ') || 'Not Started'}
                      </Badge>
                    </div>
                    {selectedAction.priority_level && (
                      <div>
                        <span className="text-sm text-gray-500">Priority</span>
                        <Badge className={`block mt-1 w-fit border ${getPriorityColor(selectedAction.priority_level)}`}>
                          Priority {selectedAction.priority_level}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={() => setSelectedAction(null)}>
                    Close
                  </Button>
                  {selectedAction.category === 'action' && selectedAction.status !== 'completed' && (
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}