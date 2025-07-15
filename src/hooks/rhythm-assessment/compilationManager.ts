import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { UserType } from "@/types/user";

interface AssessmentQuestion {
  id: string;
  text: string;
  category: string;
  order: number;
  options: { id: string; text: string; value: number }[];
}

interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

interface CompiledAssessment {
  userType: UserType;
  sections: AssessmentSection[];
}

export function useCompilationManager() {
  const [compiledAssessment, setCompiledAssessment] = useState<CompiledAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compileAssessment = useCallback(async (userType: UserType) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate fetching assessment data based on user type
      const assessmentData = await fetchAssessmentData(userType);

      if (!assessmentData) {
        throw new Error("Failed to fetch assessment data.");
      }

      setCompiledAssessment({ userType, sections: assessmentData });
      toast.success("Assessment compiled successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to compile assessment.");
      toast.error(err.message || "Failed to compile assessment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mock function to simulate fetching assessment data
  const fetchAssessmentData = async (userType: UserType): Promise<AssessmentSection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData: AssessmentSection[] = [
          {
            id: "section1",
            title: "Cognitive Function",
            description: "Evaluate your cognitive abilities.",
            questions: [
              {
                id: "q1",
                text: "How often do you experience memory lapses?",
                category: "memory",
                order: 1,
                options: [
                  { id: "o1", text: "Rarely", value: 1 },
                  { id: "o2", text: "Sometimes", value: 2 },
                  { id: "o3", text: "Often", value: 3 },
                ],
              },
            ],
          },
          {
            id: "section2",
            title: "Emotional Regulation",
            description: "Assess your emotional stability.",
            questions: [
              {
                id: "q2",
                text: "How often do you feel overwhelmed?",
                category: "emotional",
                order: 1,
                options: [
                  { id: "o1", text: "Rarely", value: 1 },
                  { id: "o2", text: "Sometimes", value: 2 },
                  { id: "o3", text: "Often", value: 3 },
                ],
              },
            ],
          },
        ];
        resolve(mockData);
      }, 500);
    });
  };

  return {
    compiledAssessment,
    isLoading,
    error,
    compileAssessment,
  };
}
