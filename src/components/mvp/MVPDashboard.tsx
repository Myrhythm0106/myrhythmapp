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
  Award,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DailyEmpowermentStatement } from '@/components/dashboard/DailyEmpowermentStatement';
import { DashboardFooter } from '@/components/dashboard/DashboardFooter';

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
    <div className="min-h-screen bg-slate-50">
      {/* Subtle brand overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-memory-emerald-50/20 via-white to-clarity-teal-50/15 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-10 w-10 text-brain-health-600" />
            <h1 className="text-5xl md:text-6xl font-bold font-serif bg-gradient-to-r from-memory-emerald-700 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
              MyRhythm Core Edition
            </h1>
            <Sparkles className="h-10 w-10 text-sunrise-amber-500" />
          </div>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Your cognitive wellness journey, scientifically designed to strengthen memory, 
            enhance focus, and empower daily living through the MYRHYTHM framework.
          </p>
          
          {/* Assessment Cards */}
          <div className="flex gap-6 justify-center mt-8">
            <div className="relative">
              <Badge className="absolute -top-2 -right-2 bg-clarity-teal-500 text-white text-xs px-2 py-0.5 z-10">
                NEW
              </Badge>
              <Button 
                onClick={() => handleAssessment('brief')}
                variant="outline"
                size="lg"
                className="h-14 border-2 border-brain-health-300 hover:bg-brain-health-50 hover:border-brain-health-400 text-lg transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Quick Assessment (2 min)
              </Button>
            </div>
            <div className="relative">
              <Badge className="absolute -top-2 -right-2 bg-sunrise-amber-500 text-white text-xs px-2 py-0.5 z-10">
                RECOMMENDED
              </Badge>
              <Button 
                onClick={() => handleAssessment('comprehensive')}
                size="lg"
                className="h-14 bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              >
                <Award className="h-5 w-5 mr-2" />
                Comprehensive Assessment (10 min)
              </Button>
            </div>
          </div>
        </div>

        {/* Daily Empowerment Statement - TOP PRIORITY */}
        <div className="mb-12">
          <DailyEmpowermentStatement />
        </div>

        {/* MYRHYTHM Framework Overview */}
        <Card className="mb-12 p-8 border-2 border-memory-emerald-200/50 bg-gradient-to-br from-memory-emerald-50/30 via-white to-brain-health-50/20 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-memory-emerald-800 text-3xl">
              <Brain className="h-8 w-8" />
              MYRHYTHM Framework - Your Cognitive Wellness Foundation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {['Memory', 'Your Training', 'Resilience', 'Habits', 'Tracking', 'Healthy Mind'].map((phase, index) => (
                <div key={phase} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-memory-emerald-500 to-brain-health-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {phase[0]}
                  </div>
                  <p className="text-base font-medium text-memory-emerald-700">{phase}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-6 text-slate-600 text-lg leading-relaxed">
              Each feature below maps to specific MYRHYTHM phases, providing targeted cognitive benefits
            </p>
          </CardContent>
        </Card>

        {/* MVP Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MVP_FEATURES.map((feature) => {
            const getColorClasses = (color: string) => {
              const colorMap = {
                'memory-emerald': {
                  card: 'bg-white border-2 border-slate-200/80 hover:border-memory-emerald-400',
                  icon: 'bg-memory-emerald-100 group-hover:bg-memory-emerald-200',
                  iconText: 'text-memory-emerald-600',
                  badge: 'border-memory-emerald-300 text-memory-emerald-700 bg-memory-emerald-50',
                  title: 'text-memory-emerald-800 group-hover:text-memory-emerald-900',
                  benefit: 'bg-memory-emerald-50 border-memory-emerald-100',
                  benefitTitle: 'text-memory-emerald-700',
                  benefitText: 'text-memory-emerald-600',
                  progress: 'text-memory-emerald-600',
                  progressBg: 'bg-memory-emerald-100',
                  button: 'bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700'
                },
                'brain-health': {
                  card: 'bg-white border-2 border-slate-200/80 hover:border-brain-health-400',
                  icon: 'bg-brain-health-100 group-hover:bg-brain-health-200',
                  iconText: 'text-brain-health-600',
                  badge: 'border-brain-health-300 text-brain-health-700 bg-brain-health-50',
                  title: 'text-brain-health-800 group-hover:text-brain-health-900',
                  benefit: 'bg-brain-health-50 border-brain-health-100',
                  benefitTitle: 'text-brain-health-700',
                  benefitText: 'text-brain-health-600',
                  progress: 'text-brain-health-600',
                  progressBg: 'bg-brain-health-100',
                  button: 'bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600'
                },
                'clarity-teal': {
                  card: 'bg-white border-2 border-slate-200/80 hover:border-clarity-teal-400',
                  icon: 'bg-clarity-teal-100 group-hover:bg-clarity-teal-200',
                  iconText: 'text-clarity-teal-600',
                  badge: 'border-clarity-teal-300 text-clarity-teal-700 bg-clarity-teal-50',
                  title: 'text-clarity-teal-800 group-hover:text-clarity-teal-900',
                  benefit: 'bg-clarity-teal-50 border-clarity-teal-100',
                  benefitTitle: 'text-clarity-teal-700',
                  benefitText: 'text-clarity-teal-600',
                  progress: 'text-clarity-teal-600',
                  progressBg: 'bg-clarity-teal-100',
                  button: 'bg-gradient-to-r from-clarity-teal-500 to-brain-health-500 hover:from-clarity-teal-600 hover:to-brain-health-600'
                },
                'sunrise-amber': {
                  card: 'bg-white border-2 border-slate-200/80 hover:border-sunrise-amber-400',
                  icon: 'bg-sunrise-amber-100 group-hover:bg-sunrise-amber-200',
                  iconText: 'text-sunrise-amber-600',
                  badge: 'border-sunrise-amber-300 text-sunrise-amber-700 bg-sunrise-amber-50',
                  title: 'text-sunrise-amber-800 group-hover:text-sunrise-amber-900',
                  benefit: 'bg-sunrise-amber-50 border-sunrise-amber-100',
                  benefitTitle: 'text-sunrise-amber-700',
                  benefitText: 'text-sunrise-amber-600',
                  progress: 'text-sunrise-amber-600',
                  progressBg: 'bg-sunrise-amber-100',
                  button: 'bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 hover:from-sunrise-amber-600 hover:to-memory-emerald-600'
                }
              };
              return colorMap[color as keyof typeof colorMap] || colorMap['memory-emerald'];
            };

            const colors = getColorClasses(feature.color);

            return (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.card} group p-8`}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-4 px-0">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-xl ${colors.icon} transition-colors`}>
                      <feature.icon className={`h-8 w-8 ${colors.iconText}`} />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={colors.badge}
                    >
                      {feature.myrhythmPhase}
                    </Badge>
                  </div>
                  <CardTitle className={`${colors.title} text-3xl font-bold`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-0">
                  <p className="text-slate-700 text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Cognitive Benefit Highlight */}
                  <div className={`p-4 rounded-lg ${colors.benefit} border`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className={`h-4 w-4 ${colors.benefitTitle}`} />
                      <p className={`text-base font-medium ${colors.benefitTitle}`}>
                        Cognitive Benefit:
                      </p>
                    </div>
                    <p className={`text-base ${colors.benefitText} leading-relaxed`}>
                      {feature.cognitiveBenefit}
                    </p>
                  </div>

                  {/* Progress indicator - only show if > 0 */}
                  {feature.completionRate && feature.completionRate > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-base">
                        <span className="text-slate-600">Progress</span>
                        <span className={`${colors.progress} font-medium`}>
                          {feature.completionRate}%
                        </span>
                      </div>
                      <Progress 
                        value={feature.completionRate} 
                        className={`h-2 ${colors.progressBg}`}
                      />
                    </div>
                  )}

                  <Button 
                    className={`w-full ${colors.button} shadow-lg hover:shadow-xl transition-all`}
                    size="lg"
                  >
                    Begin {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <DashboardFooter />

      </div>
    </div>
  );
}