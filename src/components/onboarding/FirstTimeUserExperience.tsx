import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Clock,
  Target,
  Heart,
  Users,
  BookOpen,
  CheckCircle,
  Mic,
  Calendar,
  Trophy,
  Zap,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface FirstTimeUserExperienceProps {
  showOnMount?: boolean;
  onClose?: () => void;
}

interface PathOption {
  id: 'guided' | 'explorer';
  title: string;
  description: string;
  icon: any;
  features: string[];
  recommended?: boolean;
}

export function FirstTimeUserExperience({ showOnMount = false, onClose }: FirstTimeUserExperienceProps) {
  const [isOpen, setIsOpen] = useState(showOnMount);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPath, setSelectedPath] = useState<'guided' | 'explorer' | null>(null);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const seen = localStorage.getItem('myrhythm-first-time-experience');
    if (showOnMount && !seen) {
      setIsOpen(true);
    }
  }, [showOnMount]);

  const pathOptions: PathOption[] = [
    {
      id: 'guided',
      title: 'Hand-Holding Mode',
      description: 'Take control with step-by-step guidance and daily recommendations',
      icon: MapPin,
      features: [
        'Daily personalized recommendations',
        '30-day empowerment roadmap',
        'Memory Bridge quick-start tutorial',
        'Weekly progress celebrations',
        'Personal coach reminders'
      ],
      recommended: true
    },
    {
      id: 'explorer',
      title: 'Explorer Mode', 
      description: 'You have the power to discover features at your own pace',
      icon: Zap,
      features: [
        'Complete feature access',
        'Self-guided discovery',
        'Quick tips when needed',
        'Optional tutorial badges',
        'Freedom to explore'
      ]
    }
  ];

  const thirtyDayRoadmap = [
    {
      week: 1,
      title: "Foundation Week",
      description: "Take control of your Memory Bridge basics",
      goals: [
        "Record your first conversation",
        "Experience A.C.T.S. extraction", 
        "Set up your support circle",
        "Complete daily check-ins"
      ],
      color: "bg-gradient-to-r from-blue-500 to-blue-600"
    },
    {
      week: 2,
      title: "Empowerment Week",
      description: "You have the power to build lasting habits",
      goals: [
        "Schedule 3 Memory Bridge sessions",
        "Invite family to your circle",
        "Set your first smart goals",
        "Track mood patterns"
      ],
      color: "bg-gradient-to-r from-purple-500 to-purple-600"
    },
    {
      week: 3,
      title: "Integration Week", 
      description: "Accelerate your progress with advanced features",
      goals: [
        "Use calendar integration",
        "Try brain training games",
        "Share insights with supporters",
        "Customize your dashboard"
      ],
      color: "bg-gradient-to-r from-emerald-500 to-emerald-600"
    },
    {
      week: 4,
      title: "Mastery Week",
      description: "Personalize your journey for long-term success",
      goals: [
        "Master Memory Bridge workflows",
        "Build your routine template",
        "Celebrate your progress",
        "Plan your next month"
      ],
      color: "bg-gradient-to-r from-orange-500 to-orange-600"
    }
  ];

  const quickStartActions = [
    {
      icon: Mic,
      title: "Start Your First Memory Bridge",
      description: "Record a conversation and see the magic happen",
      action: () => navigate('/memory-bridge'),
      time: "5 min",
      priority: "high"
    },
    {
      icon: Users,
      title: "Invite Your Support Circle", 
      description: "Connect with family and caregivers who empower you",
      action: () => navigate('/support-circle'),
      time: "3 min",
      priority: "medium"
    },
    {
      icon: Target,
      title: "Set Your First Goal",
      description: "Take control with a brain-health focused objective",
      action: () => navigate('/goals'),
      time: "2 min", 
      priority: "medium"
    },
    {
      icon: Calendar,
      title: "Plan Your Week",
      description: "You have the power to design your schedule",
      action: () => navigate('/calendar'),
      time: "5 min",
      priority: "low"
    }
  ];

  const handlePathSelection = (pathId: 'guided' | 'explorer') => {
    setSelectedPath(pathId);
    localStorage.setItem('myrhythm-user-path', pathId);
    
    if (pathId === 'guided') {
      setShowRoadmap(true);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('myrhythm-first-time-experience', 'true');
    setIsOpen(false);
    
    if (selectedPath === 'guided') {
      toast.success("Welcome to your empowerment journey! Let's start with Memory Bridge.");
      navigate('/memory-bridge');
    } else {
      toast.success("You have full access to explore MyRhythm. Take control of your journey!");
    }
    
    onClose?.();
  };

  const renderWelcomeStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary via-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">You Did It! 🎉</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You have the power to transform your cognitive wellness. Your personalized MyRhythm experience is ready, 
          and <strong>Memory Bridge</strong> - our game-changing feature - is waiting for you.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-8 h-8 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Memory Bridge is Your Superpower</h3>
              <p className="text-muted-foreground">Record → Summarize → Extract A.C.T.S. → Schedule</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Never miss a promise, commitment, or important moment again. This is where the magic happens.
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={() => setCurrentStep(2)}
          size="lg"
          className="bg-gradient-to-r from-primary via-blue-600 to-purple-600"
        >
          Take Control of My Journey
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  const renderPathSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Choose Your Empowerment Path</h2>
        <p className="text-muted-foreground">
          You have the power to decide how you want to experience MyRhythm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pathOptions.map((path) => (
          <Card 
            key={path.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
              selectedPath === path.id ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'
            } ${path.recommended ? 'bg-gradient-to-br from-primary/5 to-blue-500/5' : ''}`}
            onClick={() => handlePathSelection(path.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  path.recommended ? 'bg-primary text-white' : 'bg-secondary'
                }`}>
                  <path.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {path.title}
                    {path.recommended && <Badge variant="secondary">Recommended</Badge>}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {path.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't worry - you can change this anytime in settings
        </p>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Your 30-Day Empowerment Roadmap</h2>
        <p className="text-muted-foreground">
          Take control with this personalized plan designed for your success
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thirtyDayRoadmap.map((week) => (
          <Card key={week.week} className="overflow-hidden">
            <div className={`h-2 ${week.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-lg">Week {week.week}:</span>
                <span>{week.title}</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{week.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {week.goals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-primary" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to Start Your First Week?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {quickStartActions.slice(0, 2).map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                <action.icon className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleComplete} size="lg" className="w-full md:w-auto">
            Yes, I'm Ready to Take Control!
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Welcome to Your Empowerment Journey
          </DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">Step {currentStep} of 3</p>
        </div>

        {currentStep === 1 && renderWelcomeStep()}
        {currentStep === 2 && !showRoadmap && renderPathSelection()}
        {showRoadmap && renderRoadmap()}
      </DialogContent>
    </Dialog>
  );
}