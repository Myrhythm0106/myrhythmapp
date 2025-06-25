
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  category: "recall" | "attention" | "processing" | "memory_strategies";
}

export function MemoryAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions: AssessmentQuestion[] = [
    {
      id: "1",
      question: "How often do you successfully remember important moments from your day without external reminders?",
      options: ["Rarely", "Sometimes", "Often", "Almost always"],
      category: "recall"
    },
    {
      id: "2", 
      question: "When making important decisions, how well do you recall the context and reasoning behind them later?",
      options: ["Very poorly", "Somewhat poorly", "Well", "Very well"],
      category: "processing"
    },
    {
      id: "3",
      question: "How easily can you focus on logging important actions without getting distracted?",
      options: ["Very difficult", "Somewhat difficult", "Fairly easy", "Very easy"],
      category: "attention"
    },
    {
      id: "4",
      question: "How often do you use specific techniques or strategies to help remember important information?",
      options: ["Never", "Rarely", "Sometimes", "Frequently"],
      category: "memory_strategies"
    },
    {
      id: "5",
      question: "How confident are you in your ability to recall sequences of important actions you've taken?",
      options: ["Not confident", "Slightly confident", "Moderately confident", "Very confident"],
      category: "recall"
    }
  ];

  const handleResponse = (value: string) => {
    setResponses({
      ...responses,
      [questions[currentQuestion].id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canProceed = responses[questions[currentQuestion]?.id] !== undefined;
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Assessment Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <p className="text-muted-foreground">
              Thank you for completing the memory assessment. Your personalized memory enhancement 
              plan is being prepared based on your responses.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-800">Recall Strength</p>
                <p className="text-2xl font-bold text-blue-600">Good</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-purple-800">Focus Level</p>
                <p className="text-2xl font-bold text-purple-600">Improving</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Recommended Actions</h3>
              <div className="text-sm text-green-700 space-y-1 text-left">
                <p>• Start with "Important Moments Sequence" exercises</p>
                <p>• Log 3-5 important moments daily</p>
                <p>• Practice memory exercises during your peak focus hours</p>
                <p>• Track your progress with weekly assessments</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-600"
              onClick={() => window.location.reload()}
            >
              Start Your Memory Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Memory Enhancement Assessment
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {questions[currentQuestion].question}
          </h3>
          
          <RadioGroup
            value={responses[questions[currentQuestion].id] || ""}
            onValueChange={handleResponse}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? "Complete Assessment" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
