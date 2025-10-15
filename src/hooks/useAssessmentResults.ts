import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Use the database types from Supabase
export interface AssessmentResult {
  id: string;
  user_id: string;
  assessment_type: string;
  responses: any;
  scores: any;
  recommendations: any;
  completion_status: string;
  payment_status: string;
  raw_assessment_data: any;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

// Helper type for type-safe operations
export interface TypedAssessmentResult extends Omit<AssessmentResult, 'assessment_type' | 'completion_status' | 'payment_status'> {
  assessment_type: 'brief' | 'comprehensive';
  responses: Record<string, any>;
  scores: Record<string, number>;
  recommendations: Record<string, any>;
  completion_status: 'in_progress' | 'completed';
  payment_status: 'free' | 'paid';
  raw_assessment_data: Record<string, any>;
}

export function useAssessmentResults() {
  const { user } = useAuth();
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [currentAssessment, setCurrentAssessment] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save a new assessment result to database
  const saveAssessmentResult = async (
    assessmentType: 'brief' | 'comprehensive',
    responses: Record<string, any>,
    scores?: Record<string, number>,
    recommendations?: Record<string, any>,
    completionStatus: 'in_progress' | 'completed' = 'in_progress',
    paymentStatus: 'free' | 'paid' = 'free'
  ): Promise<AssessmentResult | null> => {
    if (!user) {
      toast.error('Please log in to save your assessment');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const assessmentData = {
        user_id: user.id,
        assessment_type: assessmentType,
        responses,
        scores: scores || {},
        recommendations: recommendations || {},
        completion_status: completionStatus,
        payment_status: paymentStatus, // Use the parameter instead of hardcoded 'free'
        raw_assessment_data: {
          responses,
          scores,
          recommendations,
          timestamp: new Date().toISOString()
        },
        ...(completionStatus === 'completed' ? { completed_at: new Date().toISOString() } : {})
      };

      const { data, error } = await supabase
        .from('assessment_results')
        .insert(assessmentData)
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment result:', error);
        toast.error('Failed to save assessment: ' + error.message);
        setError(error.message);
        return null;
      }

      toast.success('Assessment saved successfully!');
      setAssessmentResults(prev => [...prev, data]);
      setCurrentAssessment(data);
      
      return data;
    } catch (error: any) {
      console.error('Exception saving assessment result:', error);
      toast.error('Failed to save assessment: ' + error.message);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing assessment
  const updateAssessmentResult = async (
    assessmentId: string,
    updates: Partial<AssessmentResult>
  ): Promise<AssessmentResult | null> => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', assessmentId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating assessment result:', error);
        toast.error('Failed to update assessment: ' + error.message);
        setError(error.message);
        return null;
      }

      setAssessmentResults(prev => 
        prev.map(assessment => 
          assessment.id === assessmentId ? data : assessment
        )
      );
      
      if (currentAssessment?.id === assessmentId) {
        setCurrentAssessment(data);
      }

      return data;
    } catch (error: any) {
      console.error('Exception updating assessment result:', error);
      toast.error('Failed to update assessment: ' + error.message);
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete an assessment (mark as completed and set payment status)
  const completeAssessment = async (
    assessmentId: string,
    paymentStatus: 'free' | 'paid' = 'free'
  ): Promise<AssessmentResult | null> => {
    return updateAssessmentResult(assessmentId, {
      completion_status: 'completed',
      payment_status: paymentStatus,
      completed_at: new Date().toISOString()
    });
  };

  // Load all assessment results for the current user
  const loadAssessmentResults = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading assessment results:', error);
        setError(error.message);
        return;
      }

      setAssessmentResults(data || []);
    } catch (error: any) {
      console.error('Exception loading assessment results:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the most recent assessment
  const getLatestAssessment = (): AssessmentResult | null => {
    return assessmentResults[0] || null;
  };

  // Check if user has any completed assessments
  const hasCompletedAssessment = (): boolean => {
    return assessmentResults.some(assessment => assessment.completion_status === 'completed');
  };

  // Get assessments by type
  const getAssessmentsByType = (type: 'brief' | 'comprehensive'): AssessmentResult[] => {
    return assessmentResults.filter(assessment => assessment.assessment_type === type);
  };

  // Helper to convert to typed result
  const toTypedResult = (result: AssessmentResult): TypedAssessmentResult => {
    return {
      ...result,
      assessment_type: result.assessment_type as 'brief' | 'comprehensive',
      completion_status: result.completion_status as 'in_progress' | 'completed',
      payment_status: result.payment_status as 'free' | 'paid',
      responses: result.responses || {},
      scores: result.scores || {},
      recommendations: result.recommendations || {},
      raw_assessment_data: result.raw_assessment_data || {}
    };
  };

  // Load data on user change
  useEffect(() => {
    if (user) {
      loadAssessmentResults();
    } else {
      setAssessmentResults([]);
      setCurrentAssessment(null);
    }
  }, [user]);

  return {
    assessmentResults,
    currentAssessment,
    isLoading,
    error,
    saveAssessmentResult,
    updateAssessmentResult,
    completeAssessment,
    loadAssessmentResults,
    getLatestAssessment,
    hasCompletedAssessment,
    getAssessmentsByType,
    setCurrentAssessment,
    toTypedResult
  };
}