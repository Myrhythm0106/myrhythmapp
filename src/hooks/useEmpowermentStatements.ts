
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface EmpowermentStatement {
  id: string;
  text: string;
  category: string;
  subcategory: string | null;
  user_type: string;
  tier: 'free' | 'premium' | 'family';
  theme: string | null;
  mood: 'great' | 'okay' | 'struggling' | null;
  season: 'spring' | 'summer' | 'fall' | 'winter' | null;
  tags: string[];
  usage_count: number;
  engagement_score: number;
  created_at: string;
}

export interface UserStatementHistory {
  id: string;
  user_id: string;
  statement_id: string;
  shown_date: string;
  user_mood: string | null;
  user_energy: number | null;
}

export interface UserFavoriteStatement {
  id: string;
  user_id: string;
  statement_id: string;
  created_at: string;
}

export function useEmpowermentStatements(
  userType: string = 'brain-injury',
  includePremium: boolean = false,
  mood?: 'great' | 'okay' | 'struggling'
) {
  const queryClient = useQueryClient();

  // Fetch available statements
  const { data: statements = [], isLoading } = useQuery({
    queryKey: ['empowerment-statements', userType, includePremium, mood],
    queryFn: async () => {
      let query = supabase
        .from('empowerment_statements')
        .select('*')
        .eq('user_type', userType);

      if (!includePremium) {
        query = query.eq('tier', 'free');
      }

      if (mood) {
        query = query.or(`mood.is.null,mood.eq.${mood}`);
      }

      const { data, error } = await query.order('engagement_score', { ascending: false });
      if (error) throw error;
      return data as EmpowermentStatement[];
    }
  });

  // Fetch user's statement history
  const { data: history = [] } = useQuery({
    queryKey: ['user-statement-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_statement_history')
        .select('*')
        .eq('user_id', user.id)
        .gte('shown_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      
      if (error) throw error;
      return data as UserStatementHistory[];
    }
  });

  // Fetch user's favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ['user-favorite-statements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_favorite_statements')
        .select('*, empowerment_statements(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    }
  });

  // Smart statement selection algorithm
  const selectDailyStatement = (): EmpowermentStatement | null => {
    if (statements.length === 0) return null;

    const today = new Date().toISOString().split('T')[0];
    const shownToday = history.filter(h => h.shown_date === today);
    const shownStatementIds = shownToday.map(h => h.statement_id);
    
    // Filter out statements shown today
    const availableStatements = statements.filter(s => !shownStatementIds.includes(s.id));
    
    if (availableStatements.length === 0) {
      // If all statements shown today, pick from all statements
      return statements[Math.floor(Math.random() * statements.length)];
    }

    // Weighted selection based on engagement score and recency
    const recentlyShown = history.filter(h => 
      new Date(h.shown_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).map(h => h.statement_id);

    const weights = availableStatements.map(statement => {
      let weight = statement.engagement_score + 1; // Base weight
      
      // Reduce weight for recently shown statements
      if (recentlyShown.includes(statement.id)) {
        weight *= 0.3;
      }
      
      // Boost weight for mood-matching statements
      if (mood && statement.mood === mood) {
        weight *= 1.5;
      }
      
      return weight;
    });

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < availableStatements.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return availableStatements[i];
      }
    }
    
    return availableStatements[0];
  };

  // Record statement interaction
  const recordInteraction = useMutation({
    mutationFn: async ({ 
      statementId, 
      interactionType, 
      interactionData = {} 
    }: { 
      statementId: string; 
      interactionType: string; 
      interactionData?: any 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('user_statement_interactions').insert({
        user_id: user.id,
        statement_id: statementId,
        interaction_type: interactionType,
        interaction_data: interactionData
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-statement-history'] });
    }
  });

  // Record statement as shown
  const recordStatementShown = useMutation({
    mutationFn: async ({ 
      statementId, 
      userMood, 
      userEnergy 
    }: { 
      statementId: string; 
      userMood?: string; 
      userEnergy?: number 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase.from('user_statement_history').upsert({
        user_id: user.id,
        statement_id: statementId,
        shown_date: new Date().toISOString().split('T')[0],
        user_mood: userMood,
        user_energy: userEnergy
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-statement-history'] });
    }
  });

  // Toggle favorite
  const toggleFavorite = useMutation({
    mutationFn: async (statementId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const existingFavorite = favorites.find(f => f.statement_id === statementId);

      if (existingFavorite) {
        const { error } = await supabase
          .from('user_favorite_statements')
          .delete()
          .eq('id', existingFavorite.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorite_statements')
          .insert({ user_id: user.id, statement_id: statementId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorite-statements'] });
    }
  });

  return {
    statements,
    history,
    favorites,
    isLoading,
    selectDailyStatement,
    recordInteraction: recordInteraction.mutate,
    recordStatementShown: recordStatementShown.mutate,
    toggleFavorite: toggleFavorite.mutate,
    isRecordingInteraction: recordInteraction.isPending,
    isTogglingFavorite: toggleFavorite.isPending
  };
}
