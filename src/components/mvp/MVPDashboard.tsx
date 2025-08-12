import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Heart, 
  Target, 
  Calendar, 
  Users, 
  Gamepad2,
  Mic,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MVPFeature {
  id: string;
  title: string;
  description: string;
  cognitiveBenefit: string;
  myrhythmPhase: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  completionRate?: number;
}

const MVP_FEATURES: MVPFeature[] = [
  {
    id: 'memory-bridge',
    title: 'Memory Bridge',
    description: 'Capture and extract meaningful actions from conversations',
    cognitiveBenefit: 'Strengthens memory encoding and reduces cognitive load',
    myrhythmPhase: 'M - Memory Enhancement',
    icon: Mic,
    route: '/memory-bridge',
    color: 'memory-emerald',
    completionRate: 0
  },
  {
    id: 'brain-games',
    title: 'Brain Games',
    description: 'Memory-focused cognitive exercises and challenges',
    cognitiveBenefit: 'Improves working memory and neural plasticity',
    myrhythmPhase: 'Y - Your Cognitive Training',
    icon: Gamepad2,
    route: '/brain-games',
    color: 'brain-health',
    completionRate: 0
  },
  {
    id: 'gratitude',
    title: 'Gratitude Practice',
    description: 'Daily appreciation exercises for emotional wellness',
    cognitiveBenefit: 'Enhances positive neural pathways and reduces stress',
    myrhythmPhase: 'R - Resilience Building',
    icon: Heart,
    route: '/gratitude',
    color: 'clarity-teal',
    completionRate: 0
  },
  {
    id: 'calendar-goals',
    title: 'Calendar & Goals',
    description: 'Brain-friendly scheduling and goal tracking',
    cognitiveBenefit: 'Supports executive function and time management',
    myrhythmPhase: 'H - Habits & Structure',
    icon: Calendar,
    route: '/calendar',
    color: 'sunrise-amber',
    completionRate: 0
  },
  {
    id: 'act-log',
    title: 'Daily Actions Log',
    description: 'Track meaningful daily activities and wins',
    cognitiveBenefit: 'Reinforces positive behavioral patterns',
    myrhythmPhase: 'T - Tracking Progress',
    icon: Target,
    route: '/dashboard',
    color: 'memory-emerald',
    completionRate: 0
  },
  {
    id: 'support-network',
    title: 'Support Network',
    description: 'Connect with your care circle and accountability partners',
    cognitiveBenefit: 'Provides social cognitive stimulation and support',
    myrhythmPhase: 'H - Healthy Connections',
    icon: Users,
    route: '/support',
    color: 'brain-health',
    completionRate: 0
  }
];

export function MVPDashboard() {
  const navigate = useNavigate();
  const [selectedAssessment, setSelectedAssessment] = React.useState<'brief' | 'comprehensive' | null>(null);

  const handleFeatureClick = (feature: MVPFeature) => {
    navigate(feature.route);
  };

  const handleAssessment = (type: 'brief' | 'comprehensive') => {
    setSelectedAssessment(type);
    // Navigate to assessment
    navigate(`/assessment?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50/30 via-brain-health-50/25 to-clarity-teal-50/30">
      {/* Enhanced gradient foundation */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sunrise-amber-50/20 via-transparent to-memory-emerald-50/15" />
      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-brain-health-50/10 to-clarity-teal-50/20" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-brain-health-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-memory-emerald-700 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
              MyRhythm Core Edition
            </h1>
            <Sparkles className="h-8 w-8 text-sunrise-amber-500" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your cognitive wellness journey, scientifically designed to strengthen memory, 
            enhance focus, and empower daily living through the MYRHYTHM framework.
          </p>
          
          {/* Assessment Cards */}
          <div className="flex gap-4 justify-center mt-6">
            <Button 
              onClick={() => handleAssessment('brief')}
              variant="outline"
              className="border-brain-health-200 hover:bg-brain-health-50"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Quick Assessment (2 min)
            </Button>
            <Button 
              onClick={() => handleAssessment('comprehensive')}
              className="bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700"
            >
              <Award className="h-4 w-4 mr-2" />
              Comprehensive Assessment (10 min)
            </Button>
          </div>
        </div>

        {/* MYRHYTHM Framework Overview */}
        <Card className="mb-8 border-memory-emerald-200 bg-gradient-to-r from-memory-emerald-50/50 to-brain-health-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-memory-emerald-800">
              <Brain className="h-5 w-5" />
              MYRHYTHM Framework - Your Cognitive Wellness Foundation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Memory', 'Your Training', 'Resilience', 'Habits', 'Tracking', 'Healthy Mind'].map((phase, index) => (
                <div key={phase} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center text-white font-bold">
                    {phase[0]}
                  </div>
                  <p className="text-sm font-medium text-memory-emerald-700">{phase}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-4 text-muted-foreground">
              Each feature below maps to specific MYRHYTHM phases, providing targeted cognitive benefits
            </p>
          </CardContent>
        </Card>

        {/* MVP Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MVP_FEATURES.map((feature) => (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-${feature.color}-200 bg-gradient-to-br from-${feature.color}-50/50 to-white group`}
              onClick={() => handleFeatureClick(feature)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-${feature.color}-100 group-hover:bg-${feature.color}-200 transition-colors`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`border-${feature.color}-300 text-${feature.color}-700 bg-${feature.color}-50`}
                  >
                    {feature.myrhythmPhase}
                  </Badge>
                </div>
                <CardTitle className={`text-${feature.color}-800 group-hover:text-${feature.color}-900`}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
                
                {/* Cognitive Benefit Highlight */}
                <div className={`p-3 rounded-lg bg-${feature.color}-50 border border-${feature.color}-100`}>
                  <p className={`text-xs font-medium text-${feature.color}-700 mb-1`}>
                    🧠 Cognitive Benefit:
                  </p>
                  <p className={`text-xs text-${feature.color}-600`}>
                    {feature.cognitiveBenefit}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={`text-${feature.color}-600 font-medium`}>
                      {feature.completionRate}%
                    </span>
                  </div>
                  <Progress 
                    value={feature.completionRate} 
                    className={`h-2 bg-${feature.color}-100`}
                  />
                </div>

                <Button 
                  className={`w-full bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 hover:from-${feature.color}-600 hover:to-${feature.color}-700`}
                  size="sm"
                >
                  Begin {feature.title}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Daily Empowerment Section */}
        <Card className="mt-8 border-sunrise-amber-200 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sunrise-amber-800">
              <Sparkles className="h-5 w-5" />
              Today's Empowerment Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-lg font-medium text-sunrise-amber-700 mb-2">
                "Every small step strengthens your cognitive resilience"
              </p>
              <p className="text-muted-foreground">
                Your brain is constantly adapting and growing. Each feature you engage with 
                creates new neural pathways and strengthens existing ones.
              </p>
              <Button 
                className="mt-4 bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 hover:from-sunrise-amber-600 hover:to-memory-emerald-600"
                onClick={() => navigate('/assessment')}
              >
                Discover Your Optimal Daily Rhythm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}