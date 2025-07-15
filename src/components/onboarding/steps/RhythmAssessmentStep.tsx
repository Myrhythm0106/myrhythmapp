
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentManager } from "@/hooks/useAssessmentManager";
import { Brain, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface RhythmAssessmentStepProps {
  onComplete: () => void;
}

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const { saveAssessment, isLoading } = useAssessmentManager();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const questions = [
    {
      id: "energy_patterns",
      text: "When do you typically feel most alert and focused?",
      options: [
        { value: "morning", label: "Early morning (6-9 AM)" },
        { value: "midday", label: "Mid-day (10 AM - 2 PM)" },
        { value: "afternoon", label: "Late afternoon (3-6 PM)" },
        { value: "evening", label: "Evening (7-10 PM)" }
      ]
    },
    {
      id: "cognitive_challenges",
      text: "What cognitive challenge do you face most often?",
      options: [
        { value: "memory", label: "Memory and recall" },
        { value: "focus", label: "Maintaining focus" },
        { value: "processing", label: "Processing information" },
        { value: "multitasking", label: "Managing multiple tasks" }
      ]
    },
    {
      id: "support_preference",
      text: "How do you prefer to receive support and reminders?",
      options: [
        { value: "gentle", label: "Gentle nudges and encouragement" },
        { value: "structured", label: "Structured plans and schedules" },
        { value: "visual", label: "Visual cues and progress tracking" },
        { value: "social", label: "Community and family involvement" }
      ]
    }
  ];

  const handleAnswerSelect = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleComplete = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("Please answer all questions to continue");
      return;
    }

    try {
      // Generate basic recommendations based on answers
      const recommendations = {
        primaryEnergyTime: selectedAnswers.energy_patterns,
        focusArea: selectedAnswers.cognitive_challenges,
        supportStyle: selectedAnswers.support_preference,
        suggestedSchedule: generateScheduleRecommendation(selectedAnswers.energy_patterns),
        personalizedTips: generateTips(selectedAnswers.cognitive_challenges)
      };

      await saveAssessment('brief', selectedAnswers, recommendations);
      toast.success("Assessment completed! Your personalized recommendations are ready.");
      onComplete();
    } catch (error) {
      console.error('Error completing assessment:', error);
      toast.error("Failed to save assessment. Please try again.");
    }
  };

  const generateScheduleRecommendation = (energyTime: string) => {
    const schedules = {
      morning: "Schedule important tasks and planning between 7-10 AM",
      midday: "Focus on complex work during 10 AM - 2 PM peak hours",
      afternoon: "Plan challenging activities for 3-6 PM when you're most alert",
      evening: "Use evening hours (7-10 PM) for important tasks and reflection"
    };
    return schedules[energyTime as keyof typeof schedules] || schedules.morning;
  };

  const generateTips = (challenge: string) => {
    const tips = {
      memory: ["Use visual reminders and notes", "Break information into smaller chunks", "Practice regular review sessions"],
      focus: ["Minimize distractions in your environment", "Use timer-based work sessions", "Take regular breaks"],
      processing: ["Allow extra time for complex tasks", "Use checklists and step-by-step guides", "Process information in smaller segments"],
      multitasking: ["Focus on one task at a time", "Use priority lists", "Set up organized workspaces"]
    };
    return tips[challenge as keyof typeof tips] || tips.focus;
  };

  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-memory-emerald-500" />
          <h2 className="text-2xl font-bold text-gray-900">Rhythm Assessment</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us understand your unique patterns and preferences to create your personalized MyRhythm experience.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <Card key={question.id} className="border-2 border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-8 h-8 bg-memory-emerald-100 text-memory-emerald-700 rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                {question.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAnswers[question.id] === option.value
                        ? 'border-memory-emerald-500 bg-memory-emerald-50'
                        : 'border-gray-200 hover:border-memory-emerald-300 hover:bg-memory-emerald-25'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={selectedAnswers[question.id] === option.value}
                      onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[question.id] === option.value
                        ? 'border-memory-emerald-500 bg-memory-emerald-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[question.id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button
          onClick={handleComplete}
          disabled={!allQuestionsAnswered || isLoading}
          className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-3 text-lg"
        >
          {isLoading ? (
            <>
              <Clock className="h-5 w-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Assessment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
