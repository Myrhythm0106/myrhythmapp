import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserType } from "@/types/user";

interface RhythmAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function RhythmAssessmentView({ userType, onComplete }: RhythmAssessmentViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const assessmentQuestions = [
    {
      id: 'energy_patterns',
      title: 'Energy Patterns',
      question: 'When do you typically feel most energetic during the day?',
      type: 'multiple_choice',
      options: [
        { value: 'morning', label: 'Early morning (6-9 AM)' },
        { value: 'mid_morning', label: 'Mid-morning (9-12 PM)' },
        { value: 'afternoon', label: 'Afternoon (12-5 PM)' },
        { value: 'evening', label: 'Evening (5-8 PM)' },
        { value: 'night', label: 'Night (8 PM+)' }
      ]
    },
    {
      id: 'focus_duration',
      title: 'Focus Capacity',
      question: 'How long can you typically maintain focused attention on a single task?',
      type: 'multiple_choice',
      options: [
        { value: '15_min', label: '15 minutes or less' },
        { value: '30_min', label: '15-30 minutes' },
        { value: '45_min', label: '30-45 minutes' },
        { value: '60_min', label: '45-60 minutes' },
        { value: '90_min', label: '60-90 minutes' },
        { value: '120_min', label: '90+ minutes' }
      ]
    },
    {
      id: 'break_preferences',
      title: 'Break Preferences',
      question: 'What type of breaks help you recharge most effectively?',
      type: 'multiple_select',
      options: [
        { value: 'physical_movement', label: 'Physical movement or stretching' },
        { value: 'quiet_rest', label: 'Quiet rest or meditation' },
        { value: 'social_interaction', label: 'Brief social interaction' },
        { value: 'fresh_air', label: 'Fresh air or change of environment' },
        { value: 'creative_activity', label: 'Creative or hands-on activity' },
        { value: 'nutrition', label: 'Snack or hydration break' }
      ]
    },
    {
      id: 'cognitive_challenges',
      title: 'Cognitive Challenges',
      question: 'Which cognitive tasks do you find most challenging?',
      type: 'multiple_select',
      options: [
        { value: 'memory', label: 'Remembering information or instructions' },
        { value: 'attention', label: 'Maintaining attention and focus' },
        { value: 'processing_speed', label: 'Processing information quickly' },
        { value: 'multitasking', label: 'Managing multiple tasks at once' },
        { value: 'decision_making', label: 'Making decisions efficiently' },
        { value: 'organization', label: 'Organizing thoughts or materials' }
      ]
    },
    {
      id: 'daily_structure',
      title: 'Daily Structure',
      question: 'How much structure do you prefer in your daily routine?',
      type: 'scale',
      min: 1,
      max: 5,
      labels: {
        1: 'Very flexible, minimal structure',
        3: 'Balanced mix of structure and flexibility',
        5: 'Highly structured, detailed planning'
      }
    },
    {
      id: 'support_needs',
      title: 'Support Needs',
      question: 'What types of support are most helpful for your daily activities?',
      type: 'multiple_select',
      options: [
        { value: 'reminders', label: 'Reminders and prompts' },
        { value: 'encouragement', label: 'Encouragement and motivation' },
        { value: 'practical_help', label: 'Practical assistance with tasks' },
        { value: 'emotional_support', label: 'Emotional support and understanding' },
        { value: 'information', label: 'Information and education' },
        { value: 'advocacy', label: 'Advocacy and representation' }
      ]
    }
  ];

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < assessmentQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete assessment
      const assessmentResult = {
        userType,
        responses,
        completedAt: new Date().toISOString(),
        recommendations: generateRecommendations(responses)
      };
      onComplete(assessmentResult);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateRecommendations = (responses: Record<string, any>) => {
    const recommendations = {
      optimalWorkBlocks: [],
      breakSuggestions: [],
      structureLevel: 'moderate',
      supportStrategies: []
    };

    // Generate recommendations based on responses
    if (responses.focus_duration) {
      const focusTime = responses.focus_duration;
      if (focusTime === '15_min' || focusTime === '30_min') {
        recommendations.optimalWorkBlocks = ['15-minute focused sessions', '5-minute breaks'];
      } else if (focusTime === '45_min' || focusTime === '60_min') {
        recommendations.optimalWorkBlocks = ['25-minute Pomodoro sessions', '5-minute breaks'];
      } else {
        recommendations.optimalWorkBlocks = ['45-60 minute deep work blocks', '15-minute breaks'];
      }
    }

    if (responses.break_preferences) {
      recommendations.breakSuggestions = responses.break_preferences;
    }

    if (responses.daily_structure) {
      const structureScore = responses.daily_structure;
      if (structureScore <= 2) {
        recommendations.structureLevel = 'flexible';
      } else if (structureScore >= 4) {
        recommendations.structureLevel = 'structured';
      }
    }

    if (responses.support_needs) {
      recommendations.supportStrategies = responses.support_needs;
    }

    return recommendations;
  };

  const currentQuestion = assessmentQuestions[currentStep];
  const progress = ((currentStep + 1) / assessmentQuestions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentStep + 1} of {assessmentQuestions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentQuestion.title}
          </h3>
          <p className="text-gray-700 mb-6">
            {currentQuestion.question}
          </p>

          {currentQuestion.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={responses[currentQuestion.id] === option.value}
                    onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple_select' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(responses[currentQuestion.id] || []).includes(option.value)}
                    onChange={(e) => {
                      const currentValues = responses[currentQuestion.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v: string) => v !== option.value);
                      handleResponse(currentQuestion.id, newValues);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={value}
                      checked={responses[currentQuestion.id] === value}
                      onChange={(e) => handleResponse(currentQuestion.id, parseInt(e.target.value))}
                      className="w-4 h-4 text-blue-600 mb-2"
                    />
                    <span className="text-sm text-gray-600">{value}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{currentQuestion.labels?.[1]}</span>
                <span>{currentQuestion.labels?.[3]}</span>
                <span>{currentQuestion.labels?.[5]}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!responses[currentQuestion.id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {currentStep === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
