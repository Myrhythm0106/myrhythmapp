import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { 
  Brain, 
  Calendar, 
  Users, 
  Database,
  Target,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Sparkles,
  Mic,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EcosystemComponent {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  gradient: string;
  features: string[];
  status: 'active' | 'beta' | 'coming-soon';
  badge?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
  color: string;
}

export function EcosystemNavigationHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const ecosystemComponents: EcosystemComponent[] = [
    {
      id: 'memory-bridge',
      title: 'Memory Bridge',
      description: 'AI-powered conversation capture and action extraction',
      icon: Brain,
      route: '/memory-bridge',
      gradient: 'from-emerald-500 to-teal-600',
      features: ['Voice recording', 'AI transcription', 'Action extraction', 'Smart insights'],
      status: 'active',
      badge: 'Core'
    },
    {
      id: 'calendar',
      title: 'Calendar',
      description: 'Intelligent scheduling with brain-friendly time management',
      icon: Calendar,
      route: '/calendar',
      gradient: 'from-blue-500 to-purple-600',
      features: ['Smart scheduling', 'Conflict detection', 'Annual compass', 'Time blocking'],
      status: 'active'
    },
    {
      id: 'support-circle',
      title: 'Support Circle',
      description: 'Collaborative accountability with trusted connections',
      icon: Users,
      route: '/support-circle',
      gradient: 'from-pink-500 to-rose-600',
      features: ['Shared actions', 'Progress updates', 'Gentle reminders', 'Celebration sharing'],
      status: 'beta',
      badge: 'Social'
    },
    {
      id: 'memory-bank',
      title: 'Memory Bank',
      description: 'Long-term knowledge repository and insight archive',
      icon: Database,
      route: '/memory-bank',
      gradient: 'from-amber-500 to-orange-600',
      features: ['Conversation history', 'Smart search', 'Pattern recognition', 'Wisdom extraction'],
      status: 'beta'
    }
  ];

  const quickActions: QuickAction[] = [
    {
      id: 'quick-record',
      title: 'Quick Record',
      description: 'Capture a 30-second commitment',
      icon: Mic,
      action: () => navigate('/memory-bridge?tab=recording'),
      color: 'bg-emerald-500'
    },
    {
      id: 'schedule-actions',
      title: 'Schedule Actions',
      description: 'Review and calendar extracted actions',
      icon: Calendar,
      action: () => navigate('/next-steps'),
      color: 'bg-blue-500'
    },
    {
      id: 'share-progress',
      title: 'Share Progress',
      description: 'Update your support circle',
      icon: Users,
      action: () => navigate('/support-circle'),
      color: 'bg-pink-500'
    },
    {
      id: 'view-insights',
      title: 'View Insights',
      description: 'Explore your conversation patterns',
      icon: TrendingUp,
      action: () => navigate('/memory-bank'),
      color: 'bg-amber-500'
    }
  ];

  const handleNavigateToComponent = (component: EcosystemComponent) => {
    if (!user && component.id !== 'calendar') {
      navigate('/auth');
      return;
    }
    navigate(component.route);
  };

  const getSuggestedFlow = () => {
    const flows = [
      {
        title: "New User Journey",
        steps: ["Record conversation", "Review extracted actions", "Schedule in calendar", "Share with support circle"],
        description: "Perfect for first-time users to experience the full ecosystem"
      },
      {
        title: "Daily Productivity Flow",
        steps: ["Check daily brief", "Quick record session", "Calendar review", "Progress update"],
        description: "Your daily rhythm for consistent progress"
      },
      {
        title: "Weekly Planning Flow",
        steps: ["Review memory bank insights", "Plan weekly priorities", "Schedule focused work", "Set support circle goals"],
        description: "Strategic planning with ecosystem support"
      }
    ];
    
    return flows[Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % flows.length];
  };

  const suggestedFlow = getSuggestedFlow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ecosystem Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your integrated productivity ecosystem - where conversations become actions, actions become progress, and progress becomes transformation.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                    onClick={action.action}
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Ecosystem Components */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {ecosystemComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  selectedComponent === component.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedComponent(component.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${component.gradient} flex items-center justify-center`}>
                        <component.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {component.title}
                          {component.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {component.badge}
                            </Badge>
                          )}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge 
                      variant={component.status === 'active' ? 'default' : 'secondary'}
                      className={
                        component.status === 'active' ? 'bg-green-100 text-green-700' :
                        component.status === 'beta' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {component.status === 'active' ? 'Ready' : 
                       component.status === 'beta' ? 'Beta' : 'Soon'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{component.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {component.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToComponent(component);
                    }}
                    className={`w-full bg-gradient-to-r ${component.gradient} hover:opacity-90 text-white`}
                    disabled={component.status === 'coming-soon'}
                  >
                    {component.status === 'coming-soon' ? 'Coming Soon' : 'Enter Component'}
                    {component.status !== 'coming-soon' && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Suggested Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Suggested Flow: {suggestedFlow.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{suggestedFlow.description}</p>
              <div className="flex flex-wrap gap-2">
                {suggestedFlow.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-white/50">
                      {index + 1}. {step}
                    </Badge>
                    {index < suggestedFlow.steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}