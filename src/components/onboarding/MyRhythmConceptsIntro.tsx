
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Zap, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface MyRhythmConceptsIntroProps {
  onComplete: () => void;
  showSkip?: boolean;
}

interface Concept {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  keyPoints: string[];
  analogy: string;
  actionText: string;
  gradient: string;
}

const concepts: Concept[] = [
  {
    id: "memory-first",
    title: "Memory1st/Brain Health",
    subtitle: "Your Foundation",
    icon: <Brain className="h-8 w-8" />,
    description: "Think of your brain like a garden that needs gentle, consistent care. Memory1st means we start with what helps your brain heal and grow.",
    keyPoints: [
      "Gentle structure supports brain healing",
      "Small, consistent actions create big changes", 
      "Your pace, your rhythm, your journey",
      "Every small step counts and matters"
    ],
    analogy: "Like tending a garden, we give your brain the right conditions to flourish - not too much at once, but steady, caring attention.",
    actionText: "Try this: Take three deep breaths right now. Notice how that simple structure helps you feel more centered.",
    gradient: "from-green-100 to-emerald-100"
  },
  {
    id: "myrhythm",
    title: "MYRHYTHM Process", 
    subtitle: "Your Personal Journey",
    icon: <Heart className="h-8 w-8" />,
    description: "Like your heartbeat, MYRHYTHM is steady, reliable, and uniquely yours. It's your personal 8-step process to discover and live your rhythm.",
    keyPoints: [
      "8 gentle steps that build on each other",
      "Adapts to your energy and needs",
      "Focuses on progress, not perfection", 
      "Celebrates your unique patterns"
    ],
    analogy: "Just like music has rhythm that makes it beautiful, your life has a rhythm that makes it meaningful. MYRHYTHM helps you find and follow that beat.",
    actionText: "Try this: Put your hand on your heart and feel your heartbeat. That steady rhythm is like your life - consistent, strong, and uniquely yours.",
    gradient: "from-blue-100 to-sky-100"
  },
  {
    id: "leap",
    title: "LEAP Outcome",
    subtitle: "Where You're Headed", 
    icon: <Zap className="h-8 w-8" />,
    description: "LEAP is your destination - living a life that's Empowered, Authentic, and Productive. Not busy, but meaningful. Not perfect, but purposeful.",
    keyPoints: [
      "Live: Take charge of your day, one step at a time",
      "Empowered: You have the tools and support you need",
      "Authentic: True to yourself and your values",
      "Productive: Focused on what matters most"
    ],
    analogy: "Like a butterfly emerging from its cocoon, LEAP is your transformation - not rushed, but natural and beautiful in its own time.",
    actionText: "Try this: Think of one small thing you could do today that would feel both authentic to you and meaningful. That's LEAP in action.",
    gradient: "from-purple-100 to-indigo-100"
  }
];

export function MyRhythmConceptsIntro({ onComplete, showSkip = false }: MyRhythmConceptsIntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasTriedAction, setHasTriedAction] = useState(false);
  
  const currentConcept = concepts[currentIndex];
  const isLast = currentIndex === concepts.length - 1;
  const isFirst = currentIndex === 0;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIndex(currentIndex + 1);
      setHasTriedAction(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex(currentIndex - 1);
      setHasTriedAction(false);
    }
  };

  const handleActionTried = () => {
    setHasTriedAction(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center space-x-2">
        {concepts.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary' 
                : index < currentIndex 
                  ? 'bg-primary/60' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <Card className={`border-2 bg-gradient-to-br ${currentConcept.gradient}`}>
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto bg-white/80 rounded-full flex items-center justify-center mb-4">
            {React.cloneElement(currentConcept.icon as React.ReactElement, {
              className: "h-8 w-8 text-primary"
            })}
          </div>
          <CardTitle className="text-2xl">{currentConcept.title}</CardTitle>
          <p className="text-lg text-muted-foreground font-medium">{currentConcept.subtitle}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            {currentConcept.description}
          </p>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Key Principles:</h4>
            <ul className="space-y-2">
              {currentConcept.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/60 p-4 rounded-lg">
            <p className="text-sm italic text-muted-foreground">
              {currentConcept.analogy}
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-sm font-medium text-amber-800 mb-2">
              <Sparkles className="h-4 w-4 inline mr-1" />
              Try This Right Now:
            </p>
            <p className="text-sm text-amber-700 mb-3">
              {currentConcept.actionText}
            </p>
            <Button
              onClick={handleActionTried}
              variant="outline"
              size="sm"
              className={`${hasTriedAction ? 'bg-green-100 text-green-800 border-green-300' : ''}`}
            >
              {hasTriedAction ? '✓ I tried it!' : 'I\'ll try it'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          variant="outline"
          disabled={isFirst}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {showSkip && !isLast && (
            <Button onClick={onComplete} variant="ghost" size="sm">
              Skip Introduction
            </Button>
          )}
          
          <Button onClick={handleNext} className="flex items-center gap-2">
            {isLast ? 'Start My Journey' : 'Next Concept'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
