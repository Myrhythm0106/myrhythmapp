import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UserType } from "@/types/user";

interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  options: string[];
}

interface AssessmentResult {
  category: string;
  score: number;
  maxScore: number;
}

interface UseRhythmAssessment {
  questions: AssessmentQuestion[];
  currentQuestionIndex: number;
  userResponses: { [questionId: string]: string };
  assessmentComplete: boolean;
  results: AssessmentResult[];
  startAssessment: (questions: AssessmentQuestion[]) => void;
  submitResponse: (questionId: string, response: string) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  calculateResults: () => void;
  resetAssessment: () => void;
}

export function useRhythmAssessment(): UseRhythmAssessment {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<{ [questionId: string]: string }>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const startAssessment = useCallback((initialQuestions: AssessmentQuestion[]) => {
    setQuestions(initialQuestions);
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setAssessmentComplete(false);
    setResults([]);
  }, []);

  const submitResponse = useCallback((questionId: string, response: string) => {
    setUserResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: response,
    }));
  }, []);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      toast.info("You've reached the end of the assessment. Please calculate your results.");
    }
  }, [currentQuestionIndex, questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  }, [currentQuestionIndex]);

  const calculateResults = useCallback(() => {
    if (questions.length === 0) {
      toast.error("No questions available to calculate results.");
      return;
    }

    const categoryScores: { [category: string]: { score: number; maxScore: number } } = {};

    questions.forEach(question => {
      const response = userResponses[question.id];
      if (response) {
        const numericResponse = parseInt(response, 10) || 0;

        if (!categoryScores[question.category]) {
          categoryScores[question.category] = { score: 0, maxScore: 0 };
        }

        categoryScores[question.category].score += numericResponse;
        categoryScores[question.category].maxScore += question.options.length - 1;
      }
    });

    const calculatedResults: AssessmentResult[] = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      score: scores.score,
      maxScore: scores.maxScore,
    }));

    setResults(calculatedResults);
    setAssessmentComplete(true);
    toast.success("Assessment complete! Check out your results.");
  }, [questions, userResponses]);

  const resetAssessment = useCallback(() => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserResponses({});
    setAssessmentComplete(false);
    setResults([]);
  }, []);

  return {
    questions,
    currentQuestionIndex,
    userResponses,
    assessmentComplete,
    results,
    startAssessment,
    submitResponse,
    goToNextQuestion,
    goToPreviousQuestion,
    calculateResults,
    resetAssessment,
  };
}
