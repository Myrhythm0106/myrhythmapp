
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Heart, Brain, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RhythmAssessmentStepProps {
  onComplete: (responses: AssessmentResponses) => void;
}

interface Question {
  id: string;
  text: string;
}

interface Section {
  id: number;
  title: string;
  phase: string;
  phaseDescription: string;
  narrative: string;
  questions: Question[];
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

interface AssessmentResponses {
  [sectionId: string]: {
    [questionId: string]: number;
  };
}

const sections: Section[] = [
  {
    id: 1,
    title: "The Beginning",
    phase: "M",
    phaseDescription: "Moment of Impact",
    narrative: "Sometimes, everything changes in a moment. That moment might feel like a blur, or it might still be vivid in your mind.",
    questions: [
      { id: "replay_moment", text: "Do you replay the moment your brain injury happened in your mind?" },
      { id: "something_broke", text: "Do you feel like something \"broke\" or changed dramatically in your thinking?" },
      { id: "negative_thoughts", text: "Do you frequently experience negative or fearful thoughts since the injury?" }
    ],
    icon: Brain,
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 2,
    title: "In the Fog",
    phase: "Y",
    phaseDescription: "Yield to the Fog",
    narrative: "Minds can feel misty after trauma. Like you're here—but not quite.",
    questions: [
      { id: "brain_fog", text: "Do you struggle to finish tasks because your brain feels tired or foggy?" },
      { id: "memory_issues", text: "Do you often forget what you were doing or why you entered a room?" },
      { id: "overwhelm", text: "Do things that once felt easy now seem mentally overwhelming?" }
    ],
    icon: Brain,
    gradient: "from-gray-500 to-blue-400"
  },
  {
    id: 3,
    title: "Facing Reality",
    phase: "R",
    phaseDescription: "Reckon with Reality",
    narrative: "Healing begins with honesty. Grief, acceptance, even frustration—it's all part of the rhythm.",
    questions: [
      { id: "acceptance", text: "Have you accepted that life feels different after your brain injury?" },
      { id: "grief", text: "Do you sometimes feel sadness or grief over how things have changed?" },
      { id: "exploring_new_ways", text: "Are you beginning to explore new ways of functioning with your current abilities?" }
    ],
    icon: Heart,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    title: "Gathering Strength",
    phase: "H",
    phaseDescription: "Harness Support and Strategy",
    narrative: "Structure is a kind of medicine. Support is a kind of power.",
    questions: [
      { id: "daily_routines", text: "Do you use daily routines or tools to help you stay on track?" },
      { id: "support_systems", text: "Are there people or systems that you rely on to support your recovery?" },
      { id: "structured_plan", text: "Do you feel more in control when you follow a structured plan?" }
    ],
    icon: Target,
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 5,
    title: "Embracing the Shift",
    phase: "Y",
    phaseDescription: "Yield Again to Progress",
    narrative: "Healing isn't always linear. But awareness of change is a sign of growth.",
    questions: [
      { id: "recognizing_progress", text: "Are you recognizing progress, even in small ways, in your healing journey?" },
      { id: "flexibility", text: "Are you becoming more flexible in how you approach daily life and tasks?" },
      { id: "confident_pacing", text: "Do you feel more confident adjusting your pace to what your brain needs?" }
    ],
    icon: Brain,
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    id: 6,
    title: "Regaining Power",
    phase: "T",
    phaseDescription: "Take Back Control",
    narrative: "Control is built step by step—and it begins with choosing how to respond today.",
    questions: [
      { id: "setting_goals", text: "Are you setting goals for your day or week to regain a sense of control?" },
      { id: "shaping_healing", text: "Do you believe your decisions and actions are shaping your healing?" },
      { id: "rebuilding_trust", text: "Are you beginning to rebuild trust in your memory and judgment?" }
    ],
    icon: Target,
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    id: 7,
    title: "Becoming New",
    phase: "H",
    phaseDescription: "Heal Forward",
    narrative: "This version of you is growing. Not in spite of what happened, but through it.",
    questions: [
      { id: "self_kindness", text: "Are you practicing self-kindness and patience during setbacks?" },
      { id: "new_version", text: "Do you feel you are growing into a new version of yourself?" },
      { id: "meaningful_life", text: "Are you focused on creating a meaningful life going forward, not just returning to the past?" }
    ],
    icon: Heart,
    gradient: "from-pink-500 to-rose-500"
  },
  {
    id: 8,
    title: "Sharing the Light",
    phase: "M",
    phaseDescription: "Multiply the Mission",
    narrative: "Your healing has ripple effects. Maybe what hurt you can help someone else rise.",
    questions: [
      { id: "sharing_journey", text: "Do you feel inspired to share your recovery journey with others?" },
      { id: "supporting_others", text: "Are you exploring ways to support or encourage others going through similar challenges?" },
      { id: "greater_purpose", text: "Does your experience now feel like something that can lead to greater purpose or mission?" }
    ],
    icon: Users,
    gradient: "from-amber-500 to-yellow-500"
  }
];

const scaleLabels = ["Not at all", "Rarely", "Often", "Very much so"];

export function RhythmAssessmentStep({ onComplete }: RhythmAssessmentStepProps) {
  const [currentView, setCurrentView] = useState<"welcome" | "assessment" | "summary">("welcome");
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponses>({});

  const handleBeginAssessment = () => {
    setCurrentView("assessment");
  };

  const handleResponse = (questionId: string, value: string) => {
    const sectionId = sections[currentSection].id.toString();
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: parseInt(value)
      }
    }));
  };

  const canProceed = () => {
    const sectionId = sections[currentSection].id.toString();
    const sectionResponses = responses[sectionId] || {};
    return sections[currentSection].questions.every(q => sectionResponses[q.id] !== undefined);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setCurrentView("summary");
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else {
      setCurrentView("welcome");
    }
  };

  const handleComplete = () => {
    onComplete(responses);
  };

  const progressPercentage = currentView === "assessment" 
    ? ((currentSection + 1) / sections.length) * 100 
    : currentView === "summary" ? 100 : 0;

  if (currentView === "welcome") {
    return (
      <div className="space-y-8 text-center max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-full flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
            Let's Find Your Rhythm
          </h1>
        </div>
        
        <div className="space-y-6 text-left bg-gradient-to-r from-beacon-50 to-indigo-50 p-8 rounded-2xl">
          <p className="text-lg leading-relaxed text-gray-700">
            Your story matters. Not just what happened, but how it changed your rhythm of life.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            We'll ask a few short questions. Just answer honestly. There are no right or wrong answers—only your truth.
          </p>
        </div>

        <Button 
          onClick={handleBeginAssessment}
          className="w-full max-w-md mx-auto py-6 text-lg bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900 transition-all duration-300 transform hover:scale-105"
        >
          Begin My Rhythm
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  if (currentView === "summary") {
    return (
      <div className="space-y-8 text-center max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            We Found Your Rhythm
          </h1>
        </div>
        
        <div className="space-y-6 text-left bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl">
          <p className="text-lg leading-relaxed text-gray-700">
            Based on your answers, we'll customize your MyRhythm experience. This helps your brain receive the structure, guidance, and rhythm it needs today.
          </p>
          <p className="text-sm text-gray-600 italic">
            Every 6 months, we'll check in again. Because your rhythm will evolve. And we'll evolve with you.
          </p>
        </div>

        <Button 
          onClick={handleComplete}
          className="w-full max-w-md mx-auto py-6 text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all duration-300 transform hover:scale-105"
        >
          Personalize MyRhythm
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    );
  }

  const section = sections[currentSection];
  const sectionId = section.id.toString();
  const sectionResponses = responses[sectionId] || {};
  const IconComponent = section.icon;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Progress</span>
          <span>{currentSection + 1} of {sections.length} Sections Complete</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Section Header */}
      <Card className="overflow-hidden">
        <div className={cn("p-6 text-white bg-gradient-to-r", section.gradient)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium opacity-90">Phase: {section.phase}</span>
                <span className="text-sm opacity-75">– {section.phaseDescription}</span>
              </div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <p className="text-lg leading-relaxed text-gray-700 mb-8">
            {section.narrative}
          </p>

          {/* Questions */}
          <div className="space-y-8">
            {section.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {question.text}
                </h3>
                
                <RadioGroup
                  value={sectionResponses[question.id]?.toString() || ""}
                  onValueChange={(value) => handleResponse(question.id, value)}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {scaleLabels.map((label, value) => (
                    <div key={value + 1} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={(value + 1).toString()} 
                        id={`${question.id}-${value + 1}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${question.id}-${value + 1}`}
                        className="flex-1 p-3 text-center border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-beacon-300 peer-checked:border-beacon-500 peer-checked:bg-beacon-50 peer-checked:text-beacon-700"
                      >
                        <div className="font-medium text-sm">{value + 1}</div>
                        <div className="text-xs text-gray-600 mt-1">{label}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {currentSection === 0 ? "Back to Welcome" : "Previous"}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 bg-gradient-to-r from-beacon-600 to-beacon-800 hover:from-beacon-700 hover:to-beacon-900"
        >
          {currentSection === sections.length - 1 ? "Complete Assessment" : "Next Section"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
