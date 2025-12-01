import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Compass, 
  Calendar, 
  Brain, 
  CheckSquare, 
  Star,
  ArrowRight,
  Users
} from 'lucide-react';
import { MVPThemeWrapper } from '@/components/theme/MVPThemeWrapper';
import { MVPTopNav } from '@/components/mvp/MVPTopNav';
import { EmpoweringJourneyProgress } from '@/components/onboarding/EmpoweringJourneyProgress';

export default function ExplorerPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: 'memory-bridge',
      title: 'Memory Bridge',
      description: 'Turn conversations into actionable commitments',
      icon: Brain,
      route: '/memory-bridge',
      badge: 'Core',
      badgeColor: 'bg-memory-emerald-100 text-memory-emerald-700',
      buttonColor: 'bg-memory-emerald-600 hover:bg-memory-emerald-700'
    },
    {
      id: 'calendar',
      title: 'Smart Calendar',
      description: 'Organize your actions with intelligent scheduling',
      icon: Calendar,
      route: '/calendar',
      badge: 'Core',
      badgeColor: 'bg-clarity-teal-100 text-clarity-teal-700',
      buttonColor: 'bg-clarity-teal-600 hover:bg-clarity-teal-700'
    },
    {
      id: 'next-steps',
      title: 'Next Steps Hub',
      description: 'Review and organize your extracted ACTs',
      icon: CheckSquare,
      route: '/next-steps-hub',
      badge: 'Essential',
      badgeColor: 'bg-brain-health-100 text-brain-health-700',
      buttonColor: 'bg-brain-health-600 hover:bg-brain-health-700'
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Track your progress and celebrate wins',
      icon: Star,
      route: '/dashboard',
      badge: 'Optional',
      badgeColor: 'bg-neural-purple-100 text-neural-purple-700',
      buttonColor: 'bg-neural-purple-600 hover:bg-neural-purple-700'
    },
    {
      id: 'support-circle',
      title: 'Support Circle',
      subtitle: '(Accountability Network)',
      description: 'Invite trusted people to celebrate wins and keep you accountable',
      icon: Users,
      route: '/support-circle',
      badge: 'Essential',
      badgeColor: 'bg-sunrise-amber-100 text-sunrise-amber-700',
      buttonColor: 'bg-sunrise-amber-600 hover:bg-sunrise-amber-700'
    }
  ];

  return (
    <MVPThemeWrapper>
      <MVPTopNav showBack={false} />
      <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 via-white to-neural-blue-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Journey Progress */}
          <EmpoweringJourneyProgress variant="mini" className="mb-8" />

          {/* Welcome Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neural-purple-100 text-neural-purple-700 mb-4">
              <Compass className="h-5 w-5" />
              <span className="font-medium">Explorer Mode</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neural-indigo-900 mb-4">
              Welcome to Your Journey
            </h1>
            <p className="text-xl text-neural-indigo-600 max-w-2xl mx-auto">
              You're in control. Explore at your own pace and discover what works best for you.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              
              return (
                <Card 
                  key={feature.id}
                  className="hover:shadow-lg transition-all cursor-pointer border-gray-200 bg-white/95"
                  onClick={() => navigate(feature.route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                          <IconComponent className="h-6 w-6" />
                          {feature.title}
                          {(feature as any).subtitle && (
                            <span className="text-sm font-normal text-muted-foreground">
                              {(feature as any).subtitle}
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {feature.description}
                        </CardDescription>
                      </div>
                      <Badge className={feature.badgeColor}>{feature.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full ${feature.buttonColor}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(feature.route);
                      }}
                    >
                      {feature.id === 'memory-bridge' ? 'Start Recording' :
                       feature.id === 'calendar' ? 'View Calendar' :
                       feature.id === 'next-steps' ? 'Open Hub' :
                       feature.id === 'support-circle' ? 'Build Network' :
                       'View Dashboard'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Explorer Philosophy */}
          <Card className="border-neural-blue-200 bg-gradient-to-br from-white to-neural-blue-50">
            <CardContent className="pt-6">
              <div className="text-center max-w-2xl mx-auto">
                <Compass className="h-12 w-12 text-neural-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-neural-indigo-900 mb-3">
                  Your Explorer Journey
                </h3>
                <p className="text-neural-indigo-600 mb-4">
                  There's no pressure, no rigid schedule. Start with whatever feels right. 
                  Try Memory Bridge when you have an important conversation. Use the calendar when you need to organize. 
                  Explore at your own pace.
                </p>
                <p className="text-sm text-neural-indigo-500 italic">
                  "Recovery isn't linear, and neither is your path. We're here whenever you need us."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MVPThemeWrapper>
  );
}
