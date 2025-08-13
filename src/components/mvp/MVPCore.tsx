import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Search, 
  Brain, 
  Heart, 
  Users, 
  Calendar, 
  BookOpen, 
  Zap, 
  Shield, 
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Trophy,
  Clock,
  Lightbulb,
  MessageCircle,
  BarChart3,
  Smartphone,
  Headphones,
  Activity,
  TrendingUp,
  Lock,
  UserCheck,
  Globe,
  Award,
  Sparkles
} from 'lucide-react';
import { ContinuousGuidance } from '@/components/guidance/ContinuousGuidance';
import { PainPointImageCard } from './PainPointImageCard';

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: 'memory' | 'executive' | 'wellness' | 'social';
  fullWord: string;
}

const FeatureCard = ({ icon, title, description, category }: FeatureCard) => {
  const categoryColors = {
    memory: 'from-memory-emerald-500/20 to-memory-emerald-600/30 border-memory-emerald-400/50',
    executive: 'from-brain-health-500/20 to-brain-health-600/30 border-brain-health-400/50',
    wellness: 'from-clarity-teal-500/20 to-clarity-teal-600/30 border-clarity-teal-400/50',
    social: 'from-sunrise-amber-500/20 to-sunrise-amber-600/30 border-sunrise-amber-400/50'
  };

  return (
    <Card className={`group hover:shadow-xl transition-all duration-300 border-2 bg-gradient-to-br ${categoryColors[category]} hover:scale-105`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/80 group-hover:bg-white transition-colors">
            {icon}
          </div>
          <CardTitle className="text-lg font-bold text-brain-health-800">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-brain-health-700 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

const testimonials = [
  {
    name: "Sarah M.",
    role: "TBI Survivor",
    content: "MYRHYTHM helped me regain confidence in my daily tasks. The personalized approach made all the difference.",
    rating: 5
  },
  {
    name: "Dr. Jennifer L.",
    role: "Neuropsychologist",
    content: "Finally, a platform that bridges the gap between clinical care and daily life management for my patients.",
    rating: 5
  },
  {
    name: "Michael R.",
    role: "Family Caregiver",
    content: "The family features keep us all connected in my wife's recovery journey. Invaluable support.",
    rating: 5
  }
];

const features: FeatureCard[] = [
  {
    icon: <Brain className="h-6 w-6 text-memory-emerald-600" />,
    title: "Smart Memory Training",
    description: "Adaptive exercises that strengthen memory pathways through personalized cognitive challenges.",
    category: 'memory',
    fullWord: 'memory training cognitive exercises adaptive personalized challenges pathways brain'
  },
  {
    icon: <Target className="h-6 w-6 text-brain-health-600" />,
    title: "Executive Function Support",
    description: "Task management tools designed specifically for planning, organization, and decision-making challenges.",
    category: 'executive',
    fullWord: 'executive function planning organization decision making task management tools'
  },
  {
    icon: <Heart className="h-6 w-6 text-clarity-teal-600" />,
    title: "Emotional Wellness Hub",
    description: "Mood tracking, stress management, and emotional regulation tools for comprehensive well-being.",
    category: 'wellness',
    fullWord: 'emotional wellness mood tracking stress management regulation well-being mental health'
  },
  {
    icon: <Users className="h-6 w-6 text-sunrise-amber-600" />,
    title: "Family Care Team",
    description: "Seamless collaboration between users, families, and healthcare providers for holistic support.",
    category: 'social',
    fullWord: 'family care team collaboration healthcare providers support social connection'
  },
  {
    icon: <Calendar className="h-6 w-6 text-memory-emerald-600" />,
    title: "Intelligent Scheduling",
    description: "AI-powered calendar that adapts to your energy levels and cognitive patterns throughout the day.",
    category: 'executive',
    fullWord: 'intelligent scheduling ai calendar energy levels cognitive patterns planning time management'
  },
  {
    icon: <BookOpen className="h-6 w-6 text-brain-health-600" />,
    title: "Progress Journaling",
    description: "Reflective tools that help track improvements and identify patterns in your cognitive journey.",
    category: 'wellness',
    fullWord: 'progress journaling reflective tools tracking improvements patterns cognitive journey recovery'
  },
  {
    icon: <Zap className="h-6 w-6 text-clarity-teal-600" />,
    title: "Energy Management",
    description: "Smart pacing tools that help optimize your daily activities based on your unique energy patterns.",
    category: 'wellness',
    fullWord: 'energy management pacing tools optimize daily activities patterns fatigue cognitive load'
  },
  {
    icon: <MessageCircle className="h-6 w-6 text-sunrise-amber-600" />,
    title: "Communication Support",
    description: "Tools to improve conversation skills and manage communication challenges with confidence.",
    category: 'social',
    fullWord: 'communication support conversation skills challenges confidence social interaction speech'
  }
];

export const MVPCore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'memory' | 'executive' | 'wellness' | 'social'>('all');

  const filteredFeatures = useMemo(() => {
    let filtered = features;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(feature => feature.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(feature => 
        feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        feature.fullWord.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery, activeCategory]);
  
  const filteredBySearch = features.filter(feature => 
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.fullWord.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-brain-health-50/20 to-clarity-teal-50/15">
      {/* Empowering Hero Statement */}
      <div className="relative overflow-hidden bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-b border-brain-health-200/50">
        <div className="absolute inset-0 bg-gradient-to-r from-memory-emerald-100/20 via-brain-health-100/20 to-clarity-teal-100/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            {/* Catchy Empowering Statement */}
            <div className="space-y-4 mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
                <span className="bg-gradient-to-r from-memory-emerald-600 via-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent">
                  EMPOWER YOUR BRAIN.
                </span>
                <br />
                <span className="bg-gradient-to-r from-clarity-teal-600 via-sunrise-amber-500 to-memory-emerald-600 bg-clip-text text-transparent">
                  RECLAIM YOUR POWER.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-brain-health-700 font-semibold max-w-4xl mx-auto">
                Transform cognitive challenges into unstoppable strength with science-backed tools designed for your journey.
              </p>
            </div>
            
            <Badge className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 text-white border-0 px-4 py-2">
              <Crown className="h-4 w-4 mr-2" />
              MYRHYTHM Core Edition
            </Badge>
            
            {/* Pain Point Image Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <PainPointImageCard
                title="Forgetting important conversations?"
                description="Memory challenges don't define you. Discover personalized tools that strengthen recall and build confidence in every interaction."
                imageUrl="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
                imageAlt="Person looking thoughtful and concerned about forgetting conversations"
              />
              <PainPointImageCard
                title="Feeling overwhelmed by simple tasks?"
                description="Transform daily overwhelm into manageable steps. Smart tools that adapt to your pace and celebrate every achievement."
                imageUrl="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                imageAlt="Person surrounded by tasks feeling overwhelmed"
              />
              <PainPointImageCard
                title="Struggling to stay organized?"
                description="Turn chaos into clarity with intelligent organization systems designed specifically for your cognitive needs and lifestyle."
                imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                imageAlt="Person looking at scattered papers and calendar trying to organize"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:from-memory-emerald-600 hover:to-brain-health-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-brain-health-400 text-brain-health-700 hover:bg-brain-health-50 px-8 py-3 text-lg font-semibold"
              >
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
            Comprehensive Cognitive Support
          </h2>
          <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
            Every feature designed with your unique needs in mind, backed by neuroscience research and real-world experience.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brain-health-400 h-4 w-4" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-brain-health-200 focus:border-brain-health-400"
            />
          </div>
          
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="executive">Executive</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-brain-health-600 text-lg">No features found matching your search.</p>
          </div>
        )}
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-memory-emerald-50/50 via-brain-health-50/50 to-clarity-teal-50/50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brain-health-600 to-clarity-teal-600 bg-clip-text text-transparent mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-brain-health-700 max-w-3xl mx-auto">
              Join thousands who have transformed their cognitive wellness journey with MYRHYTHM.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-brain-health-200/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-sunrise-amber-400 text-sunrise-amber-400" />
                    ))}
                  </div>
                  <p className="text-brain-health-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-brain-health-800">{testimonial.name}</p>
                    <p className="text-sm text-brain-health-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <ContinuousGuidance />
    </div>
  );
};
