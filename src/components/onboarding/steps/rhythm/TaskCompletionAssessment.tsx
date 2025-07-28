import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { UserType } from "@/types/user";
import { CheckCircle, Clock, Lightbulb, Target } from "lucide-react";

interface TaskCompletionQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'scale';
  options?: { value: string; label: string; insight?: string }[];
  min?: number;
  max?: number;
  labels?: Record<number, string>;
  category: 'initiation' | 'memory' | 'completion' | 'interruption' | 'emotional';
}

interface TaskCompletionAssessmentProps {
  userType: UserType;
  onComplete: (data: any) => void;
}

const taskCompletionQuestions: TaskCompletionQuestion[] = [
  {
    id: 'initiation_vs_completion',
    question: "Which is more challenging for you?",
    type: 'multiple_choice',
    category: 'initiation',
    options: [
      { 
        value: 'starting_harder', 
        label: 'Starting new tasks is harder than finishing them',
        insight: 'Focus on initiation strategies and momentum-building techniques.'
      },
      { 
        value: 'finishing_harder', 
        label: 'Finishing tasks is harder than starting them',
        insight: 'Build completion systems and follow-through strategies.'
      },
      { 
        value: 'both_equal', 
        label: 'Both starting and finishing are equally challenging',
        insight: 'Comprehensive task management systems will be most beneficial.'
      },
      { 
        value: 'depends_on_task', 
        label: 'It depends on the type or complexity of the task',
        insight: 'Task categorization and adaptive strategies will be key.'
      }
    ]
  },
  {
    id: 'partial_task_memory',
    question: "How well do you remember tasks you've started but haven't finished?",
    type: 'scale',
    category: 'memory',
    min: 1,
    max: 5,
    labels: {
      1: 'I completely forget about them',
      2: 'I sometimes remember but lose details',
      3: 'I remember some but not consistently', 
      4: 'I usually remember with occasional lapses',
      5: 'I clearly track all ongoing tasks'
    }
  },
  {
    id: 'completion_percentage',
    question: "What percentage of tasks do you typically complete once started?",
    type: 'multiple_choice',
    category: 'completion',
    options: [
      { value: 'under_25', label: 'Less than 25% - I start many but finish few' },
      { value: '25_to_50', label: '25-50% - About half get completed' },
      { value: '50_to_75', label: '50-75% - Most things get done eventually' },
      { value: '75_to_90', label: '75-90% - Nearly everything gets completed' },
      { value: 'over_90', label: 'More than 90% - I almost always finish' }
    ]
  },
  {
    id: 'interruption_recovery',
    question: "How well do you return to incomplete tasks after interruptions?",
    type: 'multiple_choice',
    category: 'interruption',
    options: [
      { 
        value: 'return_easily', 
        label: 'I easily pick up where I left off',
        insight: 'Build on your strong interruption recovery ability.'
      },
      { 
        value: 'need_reminders', 
        label: 'I need notes or reminders about where I was',
        insight: 'External memory aids and resumption cues will help.'
      },
      { 
        value: 'lose_momentum', 
        label: 'I lose momentum and motivation',
        insight: 'Focus on momentum preservation strategies.'
      },
      { 
        value: 'often_restart', 
        label: 'I often need to start over or abandon the task',
        insight: 'Interruption management and task resumption techniques are key.'
      }
    ]
  },
  {
    id: 'incomplete_task_impact',
    question: "How do incomplete tasks affect your mental energy?",
    type: 'multiple_choice',
    category: 'emotional',
    options: [
      { value: 'heavy_burden', label: 'They feel like a heavy mental burden' },
      { value: 'mild_stress', label: 'They create mild background stress' },
      { value: 'motivating', label: 'They serve as motivating reminders' },
      { value: 'easy_ignore', label: 'I can easily set them aside' },
      { value: 'depends_importance', label: 'Depends on how important the task is' }
    ]
  },
  {
    id: 'task_switching_difficulty',
    question: "How difficult is it for you to switch between multiple ongoing tasks?",
    type: 'scale',
    category: 'memory',
    min: 1,
    max: 5,
    labels: {
      1: 'Very easy - I switch fluidly',
      2: 'Somewhat easy with minor adjustment',
      3: 'Moderate difficulty but manageable',
      4: 'Quite difficult - requires significant effort',
      5: 'Very difficult - often loses track'
    }
  },
  {
    id: 'completion_satisfaction',
    question: "How satisfied do you feel when you complete a task?",
    type: 'scale',
    category: 'emotional',
    min: 1,
    max: 5,
    labels: {
      1: 'Minimal satisfaction',
      2: 'Some satisfaction',
      3: 'Moderate satisfaction',
      4: 'Strong satisfaction',
      5: 'Extremely satisfying and energizing'
    }
  }
];

export function TaskCompletionAssessment({ userType, onComplete }: TaskCompletionAssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = taskCompletionQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / taskCompletionQuestions.length) * 100;
  const isLastQuestion = currentQuestionIndex === taskCompletionQuestions.length - 1;

  const handleResponse = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    
    // Generate personalized recommendations based on responses
    const recommendations = generateRecommendations(responses, userType);
    
    onComplete({
      type: 'task_completion',
      responses,
      recommendations,
      insights: generateInsights(responses)
    });
  };

  const generateRecommendations = (responses: Record<string, string>, userType: UserType) => {
    const recommendations = [];
    
    // Initiation vs Completion recommendations
    if (responses.initiation_vs_completion === 'starting_harder') {
      recommendations.push({
        category: 'Initiation Support',
        title: 'Task Initiation Strategies',
        description: 'Use the "2-minute rule" and momentum-building techniques to overcome starting resistance.',
        actions: ['Set up task preparation rituals', 'Break large tasks into smaller first steps', 'Use environmental cues to trigger action']
      });
    } else if (responses.initiation_vs_completion === 'finishing_harder') {
      recommendations.push({
        category: 'Completion Support',
        title: 'Follow-Through Systems',
        description: 'Build robust systems for tracking progress and maintaining momentum through to completion.',
        actions: ['Create progress checkpoints', 'Set up completion rewards', 'Use visual progress tracking']
      });
    }

    // Memory integration recommendations
    if (responses.partial_task_memory === '1' || responses.partial_task_memory === '2') {
      recommendations.push({
        category: 'Task Memory',
        title: 'External Memory Systems',
        description: 'Since you struggle to remember ongoing tasks, external systems will be crucial.',
        actions: ['Use digital task managers with reminders', 'Create visual task boards', 'Set up weekly review rituals']
      });
    }

    // Interruption recovery recommendations
    if (responses.interruption_recovery === 'lose_momentum' || responses.interruption_recovery === 'often_restart') {
      recommendations.push({
        category: 'Interruption Management',
        title: 'Resumption Strategies',
        description: 'Build systems to help you quickly resume tasks after interruptions.',
        actions: ['Leave "breadcrumb" notes when stopping', 'Use task timers to minimize interruptions', 'Create resumption rituals']
      });
    }

    return recommendations;
  };

  const generateInsights = (responses: Record<string, string>) => {
    const insights = [];
    
    // Completion pattern insight
    const completionRate = responses.completion_percentage;
    if (completionRate === 'under_25' || completionRate === '25_to_50') {
      insights.push("Your completion patterns suggest that building stronger follow-through systems could significantly impact your productivity and sense of accomplishment.");
    }

    // Memory pattern insight  
    const memoryScore = parseInt(responses.partial_task_memory || '3');
    if (memoryScore <= 2) {
      insights.push("Your task memory patterns indicate that external tracking systems and reminders will be more effective than relying on mental tracking alone.");
    }

    return insights;
  };

  if (isComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Task Completion Assessment Complete!
          </CardTitle>
          <CardDescription className="text-lg">
            Your personalized task completion and memory integration strategies are ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-blue-700">Completion Focus</div>
              <div className="text-sm text-blue-600">Targeted strategies for your specific patterns</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-purple-700">Memory Integration</div>
              <div className="text-sm text-purple-600">Systems that work with your natural memory</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <Lightbulb className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <div className="font-semibold text-amber-700">Personalized Insights</div>
              <div className="text-sm text-amber-600">Custom recommendations for you</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold">
            Task Completion & Memory Assessment
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {taskCompletionQuestions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.type === 'multiple_choice' && (
            <RadioGroup
              value={responses[currentQuestion.id] || ''}
              onValueChange={handleResponse}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer leading-relaxed">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {currentQuestion.type === 'scale' && (
            <RadioGroup
              value={responses[currentQuestion.id] || ''}
              onValueChange={handleResponse}
              className="space-y-3"
            >
              {Array.from({ length: (currentQuestion.max || 5) - (currentQuestion.min || 1) + 1 }, (_, i) => {
                const value = (currentQuestion.min || 1) + i;
                const label = currentQuestion.labels?.[value] || `${value}`;
                return (
                  <div key={value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={value.toString()} id={value.toString()} className="mt-1" />
                    <Label htmlFor={value.toString()} className="flex-1 cursor-pointer">
                      <div className="font-medium">{value}</div>
                      <div className="text-sm text-muted-foreground">{label}</div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </div>
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!responses[currentQuestion.id]}
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}