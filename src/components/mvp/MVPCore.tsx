import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useNavigate } from "react-router-dom";
import { useSubscription } from '@/contexts/SubscriptionContext';
import { FeatureGate } from '@/components/subscription/FeatureGate';
import { Brain, Target, Heart, Calendar, Moon, TrendingUp, Sparkles, Lock, Crown, ArrowRight, CheckCircle, Star, Zap, Search, ChevronDown, Users, Shield, AlertTriangle, Phone, BookOpen } from "lucide-react";
interface MVPFeature {
  id: string;
  title: string;
  description: string;
  cognitiveExplanation: string;
  letter: string;
  fullWord: string;
  icon: any;
  route: string;
  color: string;
  gradientClasses: string;
  completionRate: number;
  isPremium: boolean;
  monthlyLimit?: number;
}
const MVP_FEATURES: MVPFeature[] = [{
  id: 'memory-bridge',
  title: 'Memory Bridge',
  description: 'Struggling to remember conversations? Memory Bridge captures key details automatically so you never lose important information.',
  cognitiveExplanation: 'Memory reconstruction activates the hippocampus and strengthens neural pathways, improving both episodic and working memory. Each session helps rebuild damaged memory networks.',
  letter: 'M',
  fullWord: 'Memory',
  icon: Brain,
  route: '/memory-bridge',
  color: 'memory-emerald',
  gradientClasses: 'from-memory-emerald-500 to-brain-health-500',
  completionRate: 75,
  isPremium: false,
  monthlyLimit: 3
}, {
  id: 'cognitive-training',
  title: 'Your Cognitive Training',
  description: 'Finding it hard to focus? Personalized brain exercises adapt to your needs, rebuilding attention and processing speed.',
  cognitiveExplanation: 'Targeted cognitive exercises enhance neuroplasticity and improve executive function. Games adapt to your recovery needs, focusing on attention, processing speed, and problem-solving.',
  letter: 'Y',
  fullWord: 'Your',
  icon: Target,
  route: '/mvp/cognitive-training',
  color: 'brain-health',
  gradientClasses: 'from-brain-health-500 to-clarity-teal-500',
  completionRate: 45,
  isPremium: true
}, {
  id: 'resilience-building',
  title: 'Resilience Building',
  description: 'Feeling overwhelmed emotionally? Evidence-based practices help you build emotional strength and cope with challenges.',
  cognitiveExplanation: 'Gratitude practices stimulate the prefrontal cortex and anterior cingulate, reducing stress hormones while promoting emotional regulation and cognitive flexibility.',
  letter: 'R',
  fullWord: 'Resilience',
  icon: Heart,
  route: '/mvp/resilience',
  color: 'clarity-teal',
  gradientClasses: 'from-clarity-teal-500 to-sunrise-amber-500',
  completionRate: 60,
  isPremium: false
}, {
  id: 'habits-structure',
  title: 'Habits & Structure',
  description: 'Chaos in your daily routine? Smart planning tools help you organize tasks and take control of your day.',
  cognitiveExplanation: 'Structured routines support executive function recovery by reducing cognitive load and creating predictable patterns that help rebuild damaged frontal lobe networks.',
  letter: 'H',
  fullWord: 'Habits',
  icon: Calendar,
  route: '/mvp/habits',
  color: 'brain-health',
  gradientClasses: 'from-brain-health-500 to-memory-emerald-500',
  completionRate: 30,
  isPremium: true
}, {
  id: 'daily-rhythm',
  title: 'Your Daily Rhythm',
  description: 'Energy levels all over the place? Optimize your natural rhythms to maximize cognitive performance throughout the day.',
  cognitiveExplanation: 'Quality sleep is essential for memory consolidation and brain repair. Circadian optimization supports glymphatic system function, clearing brain toxins and strengthening neural connections.',
  letter: 'Y',
  fullWord: 'Your (Daily)',
  icon: Moon,
  route: '/mvp/daily-rhythm',
  color: 'sunrise-amber',
  gradientClasses: 'from-sunrise-amber-500 to-memory-emerald-500',
  completionRate: 80,
  isPremium: false
}, {
  id: 'tracking-progress',
  title: 'Tracking Progress',
  description: 'Not sure if you\'re improving? Visual progress tracking shows your cognitive gains and motivates continued growth.',
  cognitiveExplanation: 'Regular progress tracking provides neuroplasticity feedback and motivation. Data visualization helps identify recovery patterns and optimizes intervention timing.',
  letter: 'T',
  fullWord: 'Tracking',
  icon: TrendingUp,
  route: '/mvp/tracking',
  color: 'brain-health',
  gradientClasses: 'from-brain-health-500 to-clarity-teal-500',
  completionRate: 55,
  isPremium: true
}, {
  id: 'healing-mindfulness',
  title: 'Healing & Mindfulness',
  description: 'Stress and anxiety overwhelming you? Gentle mindfulness practices reduce cognitive fatigue and promote healing.',
  cognitiveExplanation: 'Mindfulness meditation increases cortical thickness in the hippocampus and prefrontal cortex, directly supporting memory formation and attention control while reducing stress-related cognitive interference.',
  letter: 'H',
  fullWord: 'Healing',
  icon: Shield,
  route: '/mvp/healing',
  color: 'clarity-teal',
  gradientClasses: 'from-clarity-teal-500 to-memory-emerald-500',
  completionRate: 35,
  isPremium: true
}, {
  id: 'mindset-mastery',
  title: 'Mindset & Mastery',
  description: 'Lost confidence in your abilities? Rebuild cognitive confidence through proven brain science and personal empowerment.',
  cognitiveExplanation: 'Cognitive confidence training activates the prefrontal cortex and strengthens self-efficacy pathways. Understanding your brain\'s recovery process builds resilience and accelerates neuroplasticity.',
  letter: 'M',
  fullWord: 'Mindset',
  icon: Sparkles,
  route: '/mvp/mindset',
  color: 'sunrise-amber',
  gradientClasses: 'from-sunrise-amber-500 to-memory-emerald-500',
  completionRate: 45,
  isPremium: true
}];
export function MVPCore() {
  const navigate = useNavigate();
  const {
    hasFeature,
    tier
  } = useSubscription();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBrainScience, setExpandedBrainScience] = useState<string | null>(null);
  const handleFeatureClick = (feature: MVPFeature) => {
    if (feature.isPremium && !hasFeature('fullAssessment')) {
      // Show upgrade prompt and navigate to dashboard with feature context
      navigate('/dashboard', {
        state: {
          requestedFeature: feature.id,
          showUpgrade: true
        }
      });
      return;
    }

    // For resilience building, redirect to enhanced gratitude
    if (feature.id === 'resilience-building') {
      navigate('/gratitude');
      return;
    }

    // For other features, navigate to dashboard with context
    navigate('/dashboard', {
      state: {
        activeFeature: feature.id
      }
    });
  };
  const handleAssessment = (type: 'brief' | 'comprehensive') => {
    navigate('/mvp/assessment', {
      state: {
        assessmentType: type
      }
    });
  };
  const getFeatureAccessStatus = (feature: MVPFeature) => {
    if (!feature.isPremium) return 'full';
    if (hasFeature('fullAssessment')) return 'full';
    return 'locked';
  };

  const filteredFeatures = MVP_FEATURES.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.fullWord.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Pain Point Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-b border-brain-health-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/20 via-brain-health-100/20 to-clarity-teal-100/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              MYRHYTHM Core Edition
            </Badge>
            
            {/* Pain Points Recognition */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">You're not alone in these struggles</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-brain-health-700">
                Forgetting important conversations?<br />
                <span className="text-orange-600">Feeling overwhelmed by simple tasks?</span><br />
                <span className="text-clarity-teal-600">Struggling to stay organized?</span>
              </h1>
              <p className="text-xl text-brain-health-700 max-w-3xl mx-auto leading-relaxed">
                MYRHYTHM understands your journey. Eight evidence-based features that directly address your cognitive challenges.
                <span className="font-semibold text-memory-emerald-600"> You're not alone in this journey.</span>
              </p>
              
              {/* Testimonial */}
              <div className="bg-gradient-to-r from-memory-emerald-50/80 to-brain-health-50/80 rounded-lg p-4 max-w-2xl mx-auto border border-memory-emerald-200/50">
                <p className="text-sm italic text-brain-health-600">
                  "After my TBI, everything felt impossible. MYRHYTHM gave me back control of my day and confidence in my abilities."
                </p>
                <p className="text-xs text-brain-health-500 mt-1">- Sarah, TBI survivor</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brain-health-400 h-4 w-4" />
                <Input
                  placeholder="Search features (e.g., memory, planning, stress...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-brain-health-200 focus:border-memory-emerald-400"
                />
              </div>
            </div>

            {/* Assessment Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button onClick={() => handleAssessment('brief')} className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white px-8 py-3 text-lg" size="lg">
                Start Brief Assessment (2 min)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button onClick={() => handleAssessment('comprehensive')} variant="outline" className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 px-8 py-3 text-lg" size="lg">
                Comprehensive Assessment (10 min)
                <Star className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MYRHYTHM Framework Explanation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="premium-card border-brain-health-200/60">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
              The MYRHYTHM Framework
            </CardTitle>
            <p className="text-brain-health-600 mt-2">
              Eight interconnected pillars designed by cognitive recovery experts
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {MVP_FEATURES.map((feature, index) => <div key={feature.id} className="text-center space-y-2">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${feature.gradientClasses} text-white flex items-center justify-center font-bold text-lg`}>
                    {feature.letter}
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-brain-health-700">{feature.fullWord}</p>
                    <div className="w-8 h-1 bg-gradient-to-r from-brain-health-300 to-clarity-teal-300 mx-auto rounded-full" />
                  </div>
                </div>)}
            </div>
            <div className="text-center mt-6">
              <p className="text-sm text-brain-health-600">
                <strong>M-Y-R-H-Y-T-H-M</strong> - Each letter represents a crucial aspect of cognitive wellness and empowerment
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map(feature => {
          const Icon = feature.icon;
          const accessStatus = getFeatureAccessStatus(feature);
          return <Card key={feature.id} className={`premium-card border-brain-health-200/60 transition-all duration-300 cursor-pointer ${hoveredFeature === feature.id ? 'shadow-lg scale-105' : ''}`} onMouseEnter={() => setHoveredFeature(feature.id)} onMouseLeave={() => setHoveredFeature(null)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradientClasses} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {accessStatus === 'locked' && <Badge variant="outline" className="border-orange-300 text-orange-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>}
                      {feature.monthlyLimit && accessStatus === 'full' && tier === 'free' && <Badge variant="outline" className="border-brain-health-300 text-brain-health-600 text-xs">
                          {feature.monthlyLimit}/month
                        </Badge>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-lg text-brain-health-700">
                      {feature.title}
                    </CardTitle>
                    <Progress value={feature.completionRate} className="h-2 bg-brain-health-100" />
                    <p className="text-sm text-brain-health-600">
                      {feature.completionRate}% progress
                    </p>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Pain → Solution → Result Format */}
                    <p className="text-brain-health-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Collapsible Brain Science */}
                  <Collapsible open={expandedBrainScience === feature.id} onOpenChange={(open) => setExpandedBrainScience(open ? feature.id : null)}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full p-3 h-auto bg-gradient-to-r from-memory-emerald-50/50 to-brain-health-50/50 rounded-lg border border-memory-emerald-200/50 hover:bg-memory-emerald-50">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-memory-emerald-500" />
                            <span className="text-xs font-semibold text-brain-health-700">Brain Science</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-brain-health-500 transition-transform ${expandedBrainScience === feature.id ? 'rotate-180' : ''}`} />
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="bg-gradient-to-r from-memory-emerald-50/50 to-brain-health-50/50 rounded-lg p-3 border border-memory-emerald-200/50">
                        <p className="text-xs text-brain-health-600 leading-relaxed">
                          <Zap className="h-3 w-3 inline mr-1 text-memory-emerald-500" />
                          {feature.cognitiveExplanation}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {accessStatus === 'locked' ? <FeatureGate feature="fullAssessment" showUpgrade={true}>
                      <Button onClick={() => handleFeatureClick(feature)} className={`w-full bg-gradient-to-r ${feature.gradientClasses} hover:opacity-90 text-white`}>
                        Begin Journey
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </FeatureGate> : <Button onClick={() => handleFeatureClick(feature)} className={`w-full bg-gradient-to-r ${feature.gradientClasses} hover:opacity-90 text-white`}>
                      {feature.completionRate > 0 ? 'Continue' : 'Begin Journey'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>}
                </CardContent>
              </Card>;
        })}
        </div>
        
        {/* Search Results Message */}
        {searchQuery && filteredFeatures.length === 0 && (
          <div className="text-center py-8">
            <p className="text-brain-health-600">No features found matching "{searchQuery}". Try searching for memory, focus, planning, or stress.</p>
          </div>
        )}
      </div>

      {/* Empowerment Section with Continuous Guidance */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Card className="premium-card border-sunrise-amber-200/60 bg-gradient-to-r from-sunrise-amber-50/50 to-memory-emerald-50/50">
          <CardContent className="p-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gradient-to-r from-sunrise-amber-500 to-memory-emerald-500 text-white">
                <Heart className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-sunrise-amber-600 to-memory-emerald-600 bg-clip-text text-transparent">
              You're Never Alone in This Journey
            </h3>
            <p className="text-brain-health-700 text-lg leading-relaxed max-w-2xl mx-auto">
              Every small step rebuilds your neural pathways. Your brain is remarkably adaptable, 
              and each interaction with MYRHYTHM strengthens your cognitive recovery. 
              <span className="font-semibold text-memory-emerald-600">You are making progress, even when it's not visible.</span>
            </p>
            
            {/* Next Steps Guidance */}
            <div className="bg-gradient-to-r from-brain-health-50/80 to-clarity-teal-50/80 rounded-lg p-4 max-w-lg mx-auto border border-brain-health-200/50">
              <p className="text-sm font-medium text-brain-health-700 mb-2">What happens next:</p>
              <div className="space-y-2 text-xs text-brain-health-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-memory-emerald-500" />
                  <span>Take a quick assessment to understand your needs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-memory-emerald-500" />
                  <span>Get personalized feature recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-memory-emerald-500" />
                  <span>Begin your journey with gentle, guided support</span>
                </div>
              </div>
            </div>
            
            {/* Help Access */}
            <div className="flex justify-center items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-memory-emerald-500" />
                <span className="text-sm text-brain-health-600">Evidence-based methods</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-clarity-teal-500" />
                <span className="text-sm text-brain-health-600">Peer support available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sunrise-amber-500" />
                <span className="text-sm text-brain-health-600">Help always accessible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}