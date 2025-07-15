import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UserType } from "@/types/user";

interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  options: { id: string; text: string }[];
}

interface AssessmentResponse {
  questionId: string;
  optionId: string;
}

interface CompiledAssessmentResult {
  categoryScores: { [category: string]: number };
  overallScore: number;
  completed: boolean;
}

export function useResponseManager() {
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAssessmentComplete, setIsAssessmentComplete] = useState(false);

  const recordResponse = useCallback((questionId: string, optionId: string) => {
    setResponses(prev => {
      const existingResponseIndex = prev.findIndex(r => r.questionId === questionId);
      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prev];
        updatedResponses[existingResponseIndex] = { questionId, optionId };
        return updatedResponses;
      } else {
        return [...prev, { questionId, optionId }];
      }
    });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  }, []);

  const resetAssessment = useCallback(() => {
    setResponses([]);
    setCurrentQuestionIndex(0);
    setIsAssessmentComplete(false);
  }, []);

  const calculateCategoryScore = useCallback((
    questions: AssessmentQuestion[],
    category: string
  ): number => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryQuestionIds = categoryQuestions.map(q => q.id);
  
    const categoryResponses = responses.filter(response =>
      categoryQuestionIds.includes(response.questionId)
    );
  
    if (categoryQuestions.length === 0) {
      return 0;
    }
  
    const score = (categoryResponses.length / categoryQuestions.length) * 100;
    return Math.min(100, Math.max(0, score));
  }, [responses]);

  const compileAssessmentResults = useCallback((questions: AssessmentQuestion[]): CompiledAssessmentResult => {
    const categoryScores: { [category: string]: number } = {};
    let overallScore = 0;
  
    const categories = Array.from(new Set(questions.map(q => q.category)));
    categories.forEach(category => {
      categoryScores[category] = calculateCategoryScore(questions, category);
      overallScore += categoryScores[category];
    });
  
    overallScore = categories.length > 0 ? overallScore / categories.length : 0;
  
    return {
      categoryScores,
      overallScore,
      completed: true,
    };
  }, [calculateCategoryScore]);

  return {
    responses,
    currentQuestionIndex,
    isAssessmentComplete,
    recordResponse,
    goToNextQuestion,
    goToPreviousQuestion,
    resetAssessment,
    compileAssessmentResults,
    setCurrentQuestionIndex
  };
}
