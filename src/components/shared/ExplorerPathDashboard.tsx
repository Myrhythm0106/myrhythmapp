import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Calendar, 
  Heart, 
  Award, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GuidedJourneyCoach } from '../mvp/GuidedJourneyCoach';
import { AIPresenceIndicator } from './AIPresenceIndicator';

const explorerFeatures = [
  {
    id: 'memory-bridge',
    title: 'Memory Bridge',
    description: 'Capture conversations and important moments',
    icon: Brain,
    route: '/memory-bridge',
    gradient: 'from-memory-emerald-500 to-brain-health-500',
    bgGradient: 'from-memory-emerald-50 to-brain-health-50',
    estimatedTime: '2 min setup',
    quickAction: 'Start recording'
  },
  {
    id: 'calendar',
    title: 'MyRhythm Calendar',
    description: 'Organize tasks around your energy patterns',
    icon: Calendar,
    route: '/calendar',
    gradient: 'from-brain-health-500 to-clarity-teal-500',
    bgGradient: 'from-brain-health-50 to-clarity-teal-50',
    estimatedTime: '3 min setup',
    quickAction: 'Schedule first task'
  },
  {
    id: 'tracking',
    title: 'Mood & Energy Tracking',
    description: 'Monitor your daily patterns and progress',
    icon: Heart,
    route: '/tracking',
    gradient: 'from-clarity-teal-500 to-sunrise-amber-500',
    bgGradient: 'from-clarity-teal-50 to-sunrise-amber-50',
    estimatedTime: '1 min setup',
    quickAction: 'Log current mood'
  },
  {
    id: 'memory-bank',
    title: 'Memory Bank & Wins',
    description: 'Store achievements and gratitude moments',
    icon: Award,
    route: '/memory-bank',
    gradient: 'from-sunrise-amber-500 to-memory-emerald-500',
    bgGradient: 'from-sunrise-amber-50 to-memory-emerald-50',
    estimatedTime: '2 min setup',
    quickAction: 'Add first win'
  }
];

interface ExplorerPathDashboardProps {
  onTakeAssessment?: () => void;
  onRequestGuidance?: () => void;
}

export function ExplorerPathDashboard({ onTakeAssessment, onRequestGuidance }: ExplorerPathDashboardProps) {
  const navigate = useNavigate();

  const handleFeatureClick = (feature: typeof explorerFeatures[0]) => {
    navigate(feature.route + '?mode=explorer');
  };

  const handleGuidedModeRequest = () => {
    if (onRequestGuidance) {
      onRequestGuidance();
    } else {
      navigate('/guided-journey');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Explorer Mode Active
          </Badge>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Explore MyRhythm Features
          </h1>
          
          <p className="text-xl text-brain-health-700 max-w-3xl mx-auto mb-6">
            Jump into any feature that interests you. We're here to help whenever you need guidance.
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button 
              onClick={() => {
                if (onTakeAssessment) {
                  onTakeAssessment();
                } else {
                  navigate('/mvp/assessment-flow');
                }
              }}
              variant="outline"
              className="bg-white/80"
            >
              <Target className="h-4 w-4 mr-2" />
              Take Assessment
            </Button>
            <Button 
              onClick={handleGuidedModeRequest}
              className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500"
            >
              <Users className="h-4 w-4 mr-2" />
              Switch to Guided Mode
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {explorerFeatures.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <Card 
                key={feature.id}
                className={`
                  group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg
                  bg-gradient-to-br from-white to-${feature.bgGradient}
                  border-2 border-gray-200 hover:border-brain-health-300
                `}
                onClick={() => handleFeatureClick(feature)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-center">
                    <div className="text-xl font-bold text-brain-health-900 mb-1">{feature.title}</div>
                    <div className="flex items-center justify-center gap-2 text-sm text-brain-health-600">
                      <Clock className="h-3 w-3" />
                      {feature.estimatedTime}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-brain-health-700 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    <Button 
                      className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white transition-all duration-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeatureClick(feature);
                      }}
                    >
                      {feature.quickAction}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Explorer Coach Section */}
        <div className="mb-8">
          <GuidedJourneyCoach 
            step="explorer-welcome"
            onNext={() => navigate('/memory-bridge')}
            onHelp={() => navigate('/search?q=explorer mode help')}
          />
        </div>

        {/* Optional Assessment Reminder */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Want Personalized Recommendations?
            </h3>
            <p className="text-blue-700 mb-4">
              Take our 5-minute assessment to get personalized feature recommendations based on your unique needs.
            </p>
            <Button 
              onClick={() => {
                if (onTakeAssessment) {
                  onTakeAssessment();
                } else {
                  navigate('/mvp/assessment-flow');
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Take 5-Minute Assessment
            </Button>
          </CardContent>
        </Card>

        {/* AI Presence */}
        <AIPresenceIndicator 
          context="dashboard"
          onHelpRequest={() => navigate('/search?q=explorer mode help')}
        />
      </div>
    </div>
  );
}