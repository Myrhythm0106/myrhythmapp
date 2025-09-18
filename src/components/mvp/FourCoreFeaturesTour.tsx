import React, { useState } from 'react';
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
  Sun,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FourCoreFeaturesTourProps {
  onFeatureSelect: (feature: string) => void;
  assessmentResult?: {
    primaryRecommendation?: string;
    riskLevel?: 'low' | 'moderate' | 'high';
  };
}

// Combined Brain + Sun empowering icon
const EmpoweringIcon = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <Sun className="absolute inset-0 text-sunrise-amber-400 animate-pulse" />
    <Brain className="relative text-brain-health-600" />
  </div>
);

const coreFeatures = [
  {
    id: 'capture',
    title: 'Capture',
    subtitle: 'Your Memory Bridge',
    description: 'Never lose precious moments. Intelligent capture for conversations, appointments, and memories.',
    icon: Brain,
    gradient: 'from-memory-emerald-500 to-brain-health-500',
    bgGradient: 'from-memory-emerald-50 to-brain-health-50',
    demo: 'Record a quick voice note or important conversation',
    benefit: 'Retain 60% more important information',
    route: '/memory-bridge'
  },
  {
    id: 'commit',
    title: 'Commit', 
    subtitle: 'Your MyRhythm Calendar',
    description: 'Transform overwhelm into organized action. Adapts to your energy and cognitive patterns.',
    icon: Calendar,
    gradient: 'from-brain-health-500 to-clarity-teal-500',
    bgGradient: 'from-brain-health-50 to-clarity-teal-50',
    demo: 'Schedule tasks at your optimal energy times',
    benefit: 'Reduce overwhelm by 40%',
    route: '/calendar'
  },
  {
    id: 'calibrate',
    title: 'Calibrate',
    subtitle: 'Mood & Energy Check-ins',
    description: 'Track your cognitive patterns and energy levels to optimize your daily rhythm.',
    icon: Heart,
    gradient: 'from-clarity-teal-500 to-sunrise-amber-500',
    bgGradient: 'from-clarity-teal-50 to-sunrise-amber-50',
    demo: 'Quick daily mood and energy tracking',
    benefit: 'Identify your peak performance windows',
    route: '/mood-tracking'
  },
  {
    id: 'celebrate',
    title: 'Celebrate',
    subtitle: 'Memory Bank & Gratitude',
    description: 'Build unshakeable confidence. Track progress, store wins, cultivate gratitude.',
    icon: Award,
    gradient: 'from-sunrise-amber-500 to-memory-emerald-500',
    bgGradient: 'from-sunrise-amber-50 to-memory-emerald-50',
    demo: 'Save your daily wins and gratitude moments',
    benefit: 'Boost confidence and motivation',
    route: '/memory-bank'
  }
];

export function FourCoreFeaturesTour({ onFeatureSelect, assessmentResult }: FourCoreFeaturesTourProps) {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Smart recommendation based on assessment
  const getRecommendedFeature = () => {
    if (!assessmentResult) return 'capture';
    
    const { riskLevel, primaryRecommendation } = assessmentResult;
    
    if (primaryRecommendation?.includes('memory')) return 'capture';
    if (primaryRecommendation?.includes('organization') || primaryRecommendation?.includes('planning')) return 'commit';
    if (primaryRecommendation?.includes('mood') || primaryRecommendation?.includes('energy')) return 'calibrate';
    
    return riskLevel === 'high' ? 'capture' : 'commit';
  };

  const recommendedFeature = getRecommendedFeature();

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(featureId);
    onFeatureSelect(featureId);
  };

  const handleTryFeature = (feature: typeof coreFeatures[0]) => {
    // Store the selected feature and navigate
    localStorage.setItem('mvp_first_feature', feature.id);
    navigate(feature.route + '?fromTour=true');
  };

  const handleContinueGuided = () => {
    // Navigate to guided journey with assessment result
    navigate('/guided-journey');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with Empowering Icon */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-brain-health-100 to-clarity-teal-100 rounded-full">
              <EmpoweringIcon className="h-12 w-12" />
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Your Cognitive Empowerment Toolkit
          </Badge>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Four Core Features to Transform Your Life
          </h1>
          
          <p className="text-xl text-brain-health-700 max-w-3xl mx-auto mb-8">
            Each tool is designed to brighten your cognitive potential. Start with what feels right for you.
          </p>

          {assessmentResult && (
            <div className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 border border-memory-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-memory-emerald-600" />
                <span className="font-semibold text-memory-emerald-700">Smart Recommendation</span>
              </div>
              <p className="text-brain-health-600">
                Based on your assessment, we recommend starting with <span className="font-semibold">{coreFeatures.find(f => f.id === recommendedFeature)?.title}</span> 
                to see the fastest improvement in your daily life.
              </p>
            </div>
          )}
        </div>

        {/* Four Core Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {coreFeatures.map((feature) => {
            const IconComponent = feature.icon;
            const isRecommended = feature.id === recommendedFeature;
            const isSelected = selectedFeature === feature.id;
            
            return (
              <Card 
                key={feature.id}
                className={`
                  group relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer
                  bg-gradient-to-br from-white to-${feature.bgGradient} 
                  border-2 ${isRecommended ? 'border-memory-emerald-300 shadow-lg' : isSelected ? 'border-brain-health-300' : 'border-gray-200'}
                  ${isRecommended ? 'ring-2 ring-memory-emerald-200' : ''}
                `}
                onClick={() => handleFeatureSelect(feature.id)}
              >
                {isRecommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-3 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recommended for You
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="relative z-10 pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-center space-y-1">
                    <div className="text-2xl font-bold text-brain-health-900">{feature.title}</div>
                    <div className="text-sm text-brain-health-600 font-medium">{feature.subtitle}</div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 space-y-4">
                  <p className="text-brain-health-700 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium text-brain-health-600 mb-1">Quick Demo:</div>
                      <div className="text-sm text-brain-health-700">{feature.demo}</div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-memory-emerald-50 to-brain-health-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-semibold text-memory-emerald-700">{feature.benefit}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white transition-all duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTryFeature(feature);
                    }}
                  >
                    Try {feature.title} First
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
                
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              </Card>
            );
          })}
        </div>

        {/* Guided Experience Option */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-brain-health-50 to-clarity-teal-50 border-brain-health-200">
            <CardContent className="p-8">
              <EmpoweringIcon className="h-8 w-8 mx-auto mb-4" />
              
              <h3 className="text-xl font-bold text-brain-health-900 mb-4">
                Want Gentle Guidance?
              </h3>
              
              <p className="text-brain-health-700 mb-6">
                Let MyRhythm guide you through each feature at your own pace. We'll provide smart suggestions 
                without being overwhelming or demanding.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={handleContinueGuided}
                  className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white px-8 py-3"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Continue with Guided Experience
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50"
                >
                  I'll Explore on My Own
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}