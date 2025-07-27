import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface DecisionEntry {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  decision_type?: string;
  decision_context?: string;
  decision_outcome?: string;
  reflection_date?: string;
  decision_tags: string[];
  is_decision: boolean;
  created_at: string;
  updated_at: string;
}

export function useDecisionLogging() {
  const [decisions, setDecisions] = useState<DecisionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchDecisions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('is_decision', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecisions((data || []) as DecisionEntry[]);
    } catch (error) {
      console.error('Error fetching decisions:', error);
      toast({
        title: "Error loading decisions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDecision = async (decision: Omit<DecisionEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          ...decision,
          user_id: user.id,
          is_decision: true,
        }])
        .select()
        .single();

      if (error) throw error;

      setDecisions(prev => [data as DecisionEntry, ...prev]);
      toast({
        title: "Decision logged",
        description: "Your decision moment has been captured.",
      });

      return data;
    } catch (error) {
      console.error('Error creating decision:', error);
      toast({
        title: "Error saving decision",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDecision = async (id: string, updates: Partial<DecisionEntry>) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDecisions(prev => prev.map(decision => 
        decision.id === id ? { ...decision, ...data } as DecisionEntry : decision
      ));

      return data;
    } catch (error) {
      console.error('Error updating decision:', error);
      toast({
        title: "Error updating decision",
        description: "Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteDecision = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDecisions(prev => prev.filter(decision => decision.id !== id));
      toast({
        title: "Decision deleted",
        description: "The decision record has been removed.",
      });
    } catch (error) {
      console.error('Error deleting decision:', error);
      toast({
        title: "Error deleting decision",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, [user]);

  return {
    decisions,
    loading,
    createDecision,
    updateDecision,
    deleteDecision,
    refetch: fetchDecisions,
  };
}