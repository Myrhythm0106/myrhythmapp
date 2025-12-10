import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Types
export interface VisionItem {
  id: string;
  yearly_theme: string | null;
  vision_statement: string | null;
  priority_1: string | null;
  priority_2: string | null;
  priority_3: string | null;
  year: number;
}

export interface GoalItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  progress_percentage: number;
  target_date: string | null;
  annual_priority_id: string | null;
}

export interface PriorityItem {
  id: string;
  scope: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority_number: number;
  title: string;
  goal_id: string | null;
  date: string | null;
  week_number: number | null;
  month: number | null;
  year: number;
  status: 'active' | 'completed' | 'deferred';
  is_shareable: boolean;
  notes: string | null;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  date: string;
  priority_id: string | null;
  goal_id: string | null;
  is_daily_win: boolean;
}

export interface TraceabilityNode {
  type: 'vision' | 'goal' | 'priority' | 'task';
  item: VisionItem | GoalItem | PriorityItem | TaskItem;
  children: TraceabilityNode[];
  progress?: number;
}

interface TraceabilityContextType {
  // Data
  vision: VisionItem | null;
  goals: GoalItem[];
  priorities: PriorityItem[];
  tasks: TaskItem[];
  traceabilityTree: TraceabilityNode | null;
  
  // Loading states
  isLoading: boolean;
  
  // Linking functions
  linkGoalToVision: (goalId: string, annualPriorityId: string | null) => Promise<void>;
  linkPriorityToGoal: (priorityId: string, goalId: string | null) => Promise<void>;
  linkTaskToPriority: (taskId: string, priorityId: string | null) => Promise<void>;
  linkTaskToGoal: (taskId: string, goalId: string | null) => Promise<void>;
  
  // Priority CRUD (replacing localStorage)
  createPriority: (priority: Omit<PriorityItem, 'id'>) => Promise<PriorityItem | null>;
  updatePriority: (id: string, updates: Partial<PriorityItem>) => Promise<void>;
  deletePriority: (id: string) => Promise<void>;
  
  // Sharing
  shareWithSupportCircle: (memberId: string, viewType: 'full' | 'goals_only' | 'priorities_only') => Promise<void>;
  revokeShare: (memberId: string) => Promise<void>;
  
  // Refresh
  refreshData: () => Promise<void>;
  
  // Get path from task to vision
  getTraceabilityPath: (taskId: string) => { vision?: VisionItem; goal?: GoalItem; priority?: PriorityItem; task: TaskItem } | null;
  
  // Get priorities by scope
  getPrioritiesByScope: (scope: 'daily' | 'weekly' | 'monthly' | 'yearly', date?: Date) => PriorityItem[];
}

const TraceabilityContext = createContext<TraceabilityContextType | undefined>(undefined);

export function TraceabilityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [vision, setVision] = useState<VisionItem | null>(null);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [traceabilityTree, setTraceabilityTree] = useState<TraceabilityNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Build the traceability tree
  const buildTree = useCallback(() => {
    if (!vision) {
      setTraceabilityTree(null);
      return;
    }

    // Helper to calculate progress
    const calculateProgress = (items: { status: string }[]): number => {
      if (items.length === 0) return 0;
      const completed = items.filter(i => i.status === 'completed').length;
      return Math.round((completed / items.length) * 100);
    };

    // Build task nodes
    const buildTaskNodes = (priorityId: string | null, goalId: string | null): TraceabilityNode[] => {
      return tasks
        .filter(t => t.priority_id === priorityId || (priorityId === null && t.goal_id === goalId))
        .map(task => ({
          type: 'task' as const,
          item: task,
          children: [],
          progress: task.status === 'completed' ? 100 : 0
        }));
    };

    // Build priority nodes
    const buildPriorityNodes = (goalId: string | null): TraceabilityNode[] => {
      return priorities
        .filter(p => p.goal_id === goalId)
        .map(priority => {
          const taskNodes = buildTaskNodes(priority.id, null);
          return {
            type: 'priority' as const,
            item: priority,
            children: taskNodes,
            progress: calculateProgress(taskNodes.map(n => n.item as TaskItem))
          };
        });
    };

    // Build goal nodes
    const goalNodes: TraceabilityNode[] = goals.map(goal => {
      const priorityNodes = buildPriorityNodes(goal.id);
      const directTasks = buildTaskNodes(null, goal.id);
      return {
        type: 'goal' as const,
        item: goal,
        children: [...priorityNodes, ...directTasks],
        progress: goal.progress_percentage || 0
      };
    });

    // Build vision node
    const tree: TraceabilityNode = {
      type: 'vision',
      item: vision,
      children: goalNodes,
      progress: calculateProgress(goals)
    };

    setTraceabilityTree(tree);
  }, [vision, goals, priorities, tasks]);

  // Fetch all data
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const currentYear = new Date().getFullYear();
      
      // Fetch all data in parallel
      const [visionRes, goalsRes, prioritiesRes, tasksRes] = await Promise.all([
        supabase
          .from('annual_priorities')
          .select('*')
          .eq('user_id', user.id)
          .eq('year', currentYear)
          .maybeSingle(),
        supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('priorities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('daily_actions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(100)
      ]);

      if (visionRes.data) setVision(visionRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (prioritiesRes.data) setPriorities(prioritiesRes.data as PriorityItem[]);
      if (tasksRes.data) setTasks(tasksRes.data as TaskItem[]);
    } catch (error) {
      console.error('Error fetching traceability data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial data load
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  // Rebuild tree when data changes
  useEffect(() => {
    buildTree();
  }, [buildTree]);

  // Linking functions
  const linkGoalToVision = async (goalId: string, annualPriorityId: string | null) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ annual_priority_id: annualPriorityId })
        .eq('id', goalId);
      
      if (error) throw error;
      
      setGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, annual_priority_id: annualPriorityId } : g
      ));
      toast.success('Goal linked to vision');
    } catch (error) {
      console.error('Error linking goal to vision:', error);
      toast.error('Failed to link goal');
    }
  };

  const linkPriorityToGoal = async (priorityId: string, goalId: string | null) => {
    try {
      const { error } = await supabase
        .from('priorities')
        .update({ goal_id: goalId })
        .eq('id', priorityId);
      
      if (error) throw error;
      
      setPriorities(prev => prev.map(p => 
        p.id === priorityId ? { ...p, goal_id: goalId } : p
      ));
      toast.success('Priority linked to goal');
    } catch (error) {
      console.error('Error linking priority to goal:', error);
      toast.error('Failed to link priority');
    }
  };

  const linkTaskToPriority = async (taskId: string, priorityId: string | null) => {
    try {
      const { error } = await supabase
        .from('daily_actions')
        .update({ priority_id: priorityId })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, priority_id: priorityId } : t
      ));
      toast.success('Task linked to priority');
    } catch (error) {
      console.error('Error linking task to priority:', error);
      toast.error('Failed to link task');
    }
  };

  const linkTaskToGoal = async (taskId: string, goalId: string | null) => {
    try {
      const { error } = await supabase
        .from('daily_actions')
        .update({ goal_id: goalId })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, goal_id: goalId } : t
      ));
      toast.success('Task linked to goal');
    } catch (error) {
      console.error('Error linking task to goal:', error);
      toast.error('Failed to link task');
    }
  };

  // Priority CRUD
  const createPriority = async (priority: Omit<PriorityItem, 'id'>): Promise<PriorityItem | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('priorities')
        .insert({ ...priority, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      
      const newPriority = data as PriorityItem;
      setPriorities(prev => [newPriority, ...prev]);
      return newPriority;
    } catch (error) {
      console.error('Error creating priority:', error);
      toast.error('Failed to create priority');
      return null;
    }
  };

  const updatePriority = async (id: string, updates: Partial<PriorityItem>) => {
    try {
      const { error } = await supabase
        .from('priorities')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setPriorities(prev => prev.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Failed to update priority');
    }
  };

  const deletePriority = async (id: string) => {
    try {
      const { error } = await supabase
        .from('priorities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPriorities(prev => prev.filter(p => p.id !== id));
      toast.success('Priority deleted');
    } catch (error) {
      console.error('Error deleting priority:', error);
      toast.error('Failed to delete priority');
    }
  };

  // Sharing
  const shareWithSupportCircle = async (memberId: string, viewType: 'full' | 'goals_only' | 'priorities_only') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('shared_traceability_views')
        .upsert({
          user_id: user.id,
          support_circle_member_id: memberId,
          view_type: viewType,
          is_active: true
        });
      
      if (error) throw error;
      toast.success('Shared with support circle member');
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share');
    }
  };

  const revokeShare = async (memberId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('shared_traceability_views')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('support_circle_member_id', memberId);
      
      if (error) throw error;
      toast.success('Share revoked');
    } catch (error) {
      console.error('Error revoking share:', error);
      toast.error('Failed to revoke share');
    }
  };

  // Get traceability path for a task
  const getTraceabilityPath = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    const priority = task.priority_id ? priorities.find(p => p.id === task.priority_id) : undefined;
    const goalId = priority?.goal_id || task.goal_id;
    const goal = goalId ? goals.find(g => g.id === goalId) : undefined;
    const visionItem = goal?.annual_priority_id && vision?.id === goal.annual_priority_id ? vision : undefined;

    return {
      vision: visionItem || undefined,
      goal,
      priority,
      task
    };
  };

  // Get priorities by scope
  const getPrioritiesByScope = (scope: 'daily' | 'weekly' | 'monthly' | 'yearly', date?: Date) => {
    const now = date || new Date();
    const year = now.getFullYear();
    
    return priorities.filter(p => {
      if (p.scope !== scope) return false;
      if (p.year !== year) return false;
      
      if (scope === 'daily' && p.date) {
        return p.date === now.toISOString().split('T')[0];
      }
      if (scope === 'weekly' && p.week_number) {
        const weekNumber = getWeekNumber(now);
        return p.week_number === weekNumber;
      }
      if (scope === 'monthly' && p.month) {
        return p.month === now.getMonth() + 1;
      }
      if (scope === 'yearly') {
        return true;
      }
      return false;
    });
  };

  const value: TraceabilityContextType = {
    vision,
    goals,
    priorities,
    tasks,
    traceabilityTree,
    isLoading,
    linkGoalToVision,
    linkPriorityToGoal,
    linkTaskToPriority,
    linkTaskToGoal,
    createPriority,
    updatePriority,
    deletePriority,
    shareWithSupportCircle,
    revokeShare,
    refreshData,
    getTraceabilityPath,
    getPrioritiesByScope
  };

  return (
    <TraceabilityContext.Provider value={value}>
      {children}
    </TraceabilityContext.Provider>
  );
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function useTraceability() {
  const context = useContext(TraceabilityContext);
  if (context === undefined) {
    throw new Error('useTraceability must be used within a TraceabilityProvider');
  }
  return context;
}
