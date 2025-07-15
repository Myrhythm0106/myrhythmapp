
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user";

interface BriefAssessmentViewProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

export function BriefAssessmentView({ userType, onComplete }: BriefAssessmentViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const briefQuestions = [
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
      id: 'support_needs',
      title: 'Support Preferences',
      question: 'What type of support is most helpful for your daily activities?',
      type: 'multiple_choice',
      options: [
        { value: 'reminders', label: 'Reminders and prompts' },
        { value: 'encouragement', label: 'Encouragement and motivation' },
        { value: 'practical_help', label: 'Practical assistance with tasks' },
        { value: 'emotional_support', label: 'Emotional support and understanding' },
        { value: 'information', label: 'Information and education' }
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
    if (currentStep < briefQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete brief assessment
      const assessmentResult = {
        userType,
        assessmentType: 'brief',
        responses,
        completedAt: new Date().toISOString(),
        recommendations: generateBriefRecommendations(responses)
      };
      onComplete(assessmentResult);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateBriefRecommendations = (responses: Record<string, any>) => {
    const recommendations = {
      focusBlocks: [],
      supportStrategy: '',
      energyOptimization: ''
    };

    // Generate basic recommendations based on responses
    if (responses.focus_duration) {
      const focusTime = responses.focus_duration;
      if (focusTime === '15_min' || focusTime === '30_min') {
        recommendations.focusBlocks = ['Short 15-minute focused sessions', 'Frequent 5-minute breaks'];
      } else if (focusTime === '45_min' || focusTime === '60_min') {
        recommendations.focusBlocks = ['25-minute Pomodoro sessions', 'Regular breaks'];
      } else {
        recommendations.focusBlocks = ['45-60 minute deep work blocks', '15-minute breaks'];
      }
    }

    if (responses.support_needs) {
      recommendations.supportStrategy = responses.support_needs;
    }

    if (responses.energy_patterns) {
      const energy = responses.energy_patterns;
      if (energy === 'morning' || energy === 'mid_morning') {
        recommendations.energyOptimization = 'Schedule important tasks in the morning';
      } else if (energy === 'afternoon') {
        recommendations.energyOptimization = 'Plan key activities for afternoon hours';
      } else {
        recommendations.energyOptimization = 'Utilize evening energy for important tasks';
      }
    }

    return recommendations;
  };

  const currentQuestion = briefQuestions[currentStep];
  const progress = ((currentStep + 1) / briefQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Badge className="bg-green-100 text-green-700 mb-4">Quick Assessment</Badge>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's Learn About Your Rhythm
        </h2>
        <p className="text-gray-600">
          Just 3 questions to get you started with personalized recommendations
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentStep + 1} of {briefQuestions.length}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-beacon-500 to-beacon-600 h-2 rounded-full transition-all duration-300" 
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

            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.value}
                    checked={responses[currentQuestion.id] === option.value}
                    onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
                    className="w-4 h-4 text-beacon-600"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!responses[currentQuestion.id]}
              className="bg-gradient-to-r from-beacon-600 to-beacon-700 hover:from-beacon-700 hover:to-beacon-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === briefQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
