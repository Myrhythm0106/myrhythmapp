import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Crown, 
  Infinity, 
  CheckCircle, 
  ArrowRight, 
  Brain,
  Heart,
  Star,
  Zap
} from "lucide-react";

interface LifeEmpowermentGuideProps {
  onComplete: () => void;
  userType?: string;
}

export function LifeEmpowermentGuide({ onComplete, userType }: LifeEmpowermentGuideProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    {
      id: "week-1",
      title: "Your Foundation",
      timeframe: "Week 1",
      icon: Calendar,
      color: "emerald",
      progress: 0,
      description: "Welcome to your journey of empowerment",
      goals: [
        "Complete your personalized setup",
        "Create your first daily rhythm",
        "Explore brain-friendly features",
        "Connect with your support network"
      ],
      achievement: "Foundation Builder",
      message: "You're taking the first step towards reclaiming control of your life."
    },
    {
      id: "month-1",
      title: "Building Momentum",
      timeframe: "Month 1",
      icon: Target,
      color: "blue",
      progress: 25,
      description: "Habits are forming, confidence is growing",
      goals: [
        "Establish consistent daily routines",
        "Track your progress and wins",
        "Refine your rhythm preferences",
        "Build confidence through small victories"
      ],
      achievement: "Momentum Creator",
      message: "You're building unstoppable momentum. Each day is a victory."
    },
    {
      id: "month-6",
      title: "Mastering Your Flow",
      timeframe: "6 Months",
      icon: TrendingUp,
      color: "purple",
      progress: 60,
      description: "Optimization and advanced features",
      goals: [
        "Master advanced planning features",
        "Optimize your life operating model",
        "Help others in the community",
        "Celebrate major milestones"
      ],
      achievement: "Flow Master",
      message: "You've transformed challenges into strength. You're inspiring others."
    },
    {
      id: "year-1",
      title: "Living Your Best Life",
      timeframe: "1 Year",
      icon: Crown,
      color: "amber",
      progress: 85,
      description: "Sustained success and leadership",
      goals: [
        "Achieve life-changing milestones",
        "Become a mentor to others",
        "Master long-term goal achievement",
        "Unlock premium life features"
      ],
      achievement: "Life Champion",
      message: "You've proven that challenges don't define limits. You define possibilities."
    },
    {
      id: "beyond",
      title: "Life Evolution",
      timeframe: "Beyond",
      icon: Infinity,
      color: "violet",
      progress: 100,
      description: "Your legacy of empowerment continues",
      goals: [
        "Shape your 3-year vision",
        "Pioneer advanced wellness features",
        "Lead community transformations",
        "Create your lasting impact"
      ],
      achievement: "Legacy Builder",
      message: "Your journey continues to evolve. MyRhythm grows with you, for life."
    }
  ];

  const currentPhaseData = phases[currentPhase];

  const handleNext = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Your Life Empowerment Timeline</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how MyRhythm will evolve with you. This isn't just an app—it's your lifelong partner 
          in personal empowerment and growth.
        </p>
      </div>

      {/* Timeline Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {phases.map((phase, index) => (
          <Button
            key={phase.id}
            variant={currentPhase === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPhase(index)}
            className="text-xs"
          >
            {phase.timeframe}
          </Button>
        ))}
      </div>

      {/* Main Phase Card */}
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-100 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-teal-200">
              <currentPhaseData.icon className="h-8 w-8 text-teal-700" />
            </div>
            <div>
              <Badge className="bg-teal-600 text-white">
                {currentPhaseData.timeframe}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl">{currentPhaseData.title}</CardTitle>
          <p className="text-muted-foreground">{currentPhaseData.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Journey Progress</span>
              <span>{currentPhaseData.progress}%</span>
            </div>
            <Progress value={currentPhaseData.progress} className="h-2" />
          </div>

          {/* Goals */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              What You'll Achieve
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPhaseData.goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                  <span>{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="bg-teal-200 p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-5 w-5 text-teal-700" />
              <span className="font-semibold">Unlock: {currentPhaseData.achievement}</span>
            </div>
          </div>

          {/* Empowerment Message */}
          <div className="bg-white/80 p-4 rounded-lg border-l-4 border-primary">
            <p className="text-sm italic text-foreground">
              💫 {currentPhaseData.message}
            </p>
          </div>

          {/* Special Features Preview for Beyond */}
          {currentPhase === phases.length - 1 && (
            <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-4 rounded-lg space-y-3">
              <h5 className="font-semibold text-violet-800 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Future Evolution Features
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="text-center">
                  <div className="font-medium text-violet-700">3-Year Vision</div>
                  <div className="text-violet-600">Life architecture planning</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-violet-700">AI Life Coach</div>
                  <div className="text-violet-600">Personalized growth insights</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-violet-700">Legacy Builder</div>
                  <div className="text-violet-600">Impact measurement tools</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentPhase === 0}
        >
          Previous
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {currentPhase + 1} of {phases.length}
          </p>
        </div>

        <Button onClick={handleNext} className="gap-2">
          {currentPhase === phases.length - 1 ? (
            <>Start Your Journey <Heart className="h-4 w-4" /></>
          ) : (
            <>Next <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>

      {/* Bottom Message */}
      <div className="text-center mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Your investment in MyRhythm is an investment in your future self.</strong><br />
          As you grow, MyRhythm evolves with you—building on your progress, 
          adapting to your changing needs, and unlocking new possibilities for years to come.
        </p>
      </div>
    </div>
  );
}