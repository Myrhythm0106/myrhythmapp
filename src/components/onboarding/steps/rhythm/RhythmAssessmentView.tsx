
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserType } from "../UserTypeStep";

interface Question {
  id: string;
  text: string;
  type: 'scale' | 'multiple-choice' | 'text';
  options?: string[];
  userTypes?: UserType[];
}

// User type specific questions
const getQuestionsForUserType = (userType: UserType | null): Question[] => {
  console.log("Getting questions for user type:", userType);
  
  const baseQuestions: Question[] = [
    {
      id: 'energy_levels',
      text: 'How would you rate your typical daily energy levels?',
      type: 'scale',
      userTypes: ['brain-injury', 'caregiver', 'cognitive-optimization', 'wellness']
    },
    {
      id: 'focus_duration',
      text: 'How long can you typically maintain focus on a single task?',
      type: 'multiple-choice',
      options: ['Less than 15 minutes', '15-30 minutes', '30-60 minutes', '1-2 hours', 'More than 2 hours'],
      userTypes: ['brain-injury', 'cognitive-optimization', 'wellness']
    }
  ];

  // Add user type specific questions
  if (userType === 'brain-injury') {
    baseQuestions.push(
      {
        id: 'injury_recovery_stage',
        text: 'What stage of recovery are you currently in?',
        type: 'multiple-choice',
        options: ['Early recovery (0-6 months)', 'Mid recovery (6-18 months)', 'Late recovery (18+ months)', 'Long-term management'],
        userTypes: ['brain-injury']
      },
      {
        id: 'cognitive_symptoms',
        text: 'Which cognitive symptoms do you experience most frequently?',
        type: 'multiple-choice',
        options: ['Memory issues', 'Attention problems', 'Processing speed', 'Executive function', 'Language difficulties'],
        userTypes: ['brain-injury']
      }
    );
  }

  if (userType === 'caregiver') {
    baseQuestions.push(
      {
        id: 'caregiving_duration',
        text: 'How long have you been in a caregiving role?',
        type: 'multiple-choice',
        options: ['Less than 6 months', '6 months - 1 year', '1-3 years', '3-5 years', 'More than 5 years'],
        userTypes: ['caregiver']
      },
      {
        id: 'caregiver_stress',
        text: 'How would you rate your current stress level as a caregiver?',
        type: 'scale',
        userTypes: ['caregiver']
      }
    );
  }

  if (userType === 'cognitive-optimization') {
    baseQuestions.push(
      {
        id: 'optimization_goals',
        text: 'What cognitive areas do you most want to optimize?',
        type: 'multiple-choice',
        options: ['Memory enhancement', 'Focus and attention', 'Processing speed', 'Problem-solving', 'Creative thinking'],
        userTypes: ['cognitive-optimization']
      },
      {
        id: 'current_performance',
        text: 'How would you rate your current cognitive performance?',
        type: 'scale',
        userTypes: ['cognitive-optimization']
      }
    );
  }

  if (userType === 'wellness') {
    baseQuestions.push(
      {
        id: 'wellness_priorities',
        text: 'What wellness areas are most important to you?',
        type: 'multiple-choice',
        options: ['Stress management', 'Sleep quality', 'Mental clarity', 'Emotional balance', 'Overall brain health'],
        userTypes: ['wellness']
      },
      {
        id: 'current_wellness',
        text: 'How would you rate your current overall wellness?',
        type: 'scale',
        userTypes: ['wellness']
      }
    );
  }

  // Filter questions based on user type
  const filteredQuestions = baseQuestions.filter(q => 
    !q.userTypes || q.userTypes.includes(userType as UserType)
  );

  console.log("Filtered questions for", userType, ":", filteredQuestions.length, "questions");
  return filteredQuestions;
};

interface RhythmAssessmentViewProps {
  currentSection: number;
  responses: Record<string, any>;
  onResponse: (questionId: string, response: any) => void;
  onNext: () => void;
  onBack: () => void;
  sections: any[];
  userType?: UserType | null;
}

export function RhythmAssessmentView({
  currentSection,
  responses,
  onResponse,
  onNext,
  onBack,
  sections,
  userType
}: RhythmAssessmentViewProps) {
  console.log("RhythmAssessmentView: Rendering for userType:", userType, "currentSection:", currentSection);
  
  const questions = getQuestionsForUserType(userType);
  const currentQuestion = questions[currentSection];

  if (!currentQuestion) {
    console.log("RhythmAssessmentView: No current question, completing assessment");
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-4">Assessment Complete!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for completing your personalized assessment.
        </p>
        <Button onClick={onNext} size="lg">
          View Results
        </Button>
      </div>
    );
  }

  const handleResponse = (value: any) => {
    console.log("RhythmAssessmentView: Recording response for", currentQuestion.id, ":", value);
    onResponse(currentQuestion.id, value);
  };

  const currentResponse = responses[currentQuestion.id];
  const canProceed = currentResponse !== undefined && currentResponse !== null && currentResponse !== '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground mb-2">
          Question {currentSection + 1} of {questions.length}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
        
        {currentQuestion.type === 'scale' && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Very Poor</span>
              <span>Excellent</span>
            </div>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    currentResponse === value
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleResponse(option)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  currentResponse === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <textarea
            value={currentResponse || ''}
            onChange={(e) => handleResponse(e.target.value)}
            placeholder="Please share your thoughts..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none"
          />
        )}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={currentSection === 0}
        >
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className={canProceed ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          {currentSection === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
