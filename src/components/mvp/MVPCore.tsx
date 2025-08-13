
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Brain, Crown, Heart, Search, Shield, Sparkles, Star, Users, Zap, CheckCircle, Clock, Target, Calendar, BookOpen, Award, TrendingUp, Activity } from 'lucide-react';
import { FounderStorySection } from '@/components/memory-first/sections/FounderStorySection';
import { YourRhythmSection } from '@/components/founders-story/YourRhythmSection';
import { PainPointImageCard } from './PainPointImageCard';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  category: string;
  fullWord: string;
}

const features: Feature[] = [
  {
    id: 1,
    title: 'Memory Lane',
    description: 'Relive precious moments with our interactive memory journal.',
    icon: BookOpen,
    category: 'memory',
    fullWord: 'memory'
  },
  {
    id: 2,
    title: 'Focus Flow',
    description: 'Sharpen your concentration with personalized focus exercises.',
    icon: Brain,
    category: 'focus',
    fullWord: 'focus'
  },
  {
    id: 3,
    title: 'Energy Surge',
    description: 'Boost your vitality with revitalizing activities and routines.',
    icon: Zap,
    category: 'energy',
    fullWord: 'energy'
  },
  {
    id: 4,
    title: 'Clarity Zone',
    description: 'Find mental clarity through guided mindfulness and meditation.',
    icon: Activity,
    category: 'clarity',
    fullWord: 'clarity'
  },
  {
    id: 5,
    title: 'Rhythm Calendar',
    description: 'Plan your days around your peak performance times.',
    icon: Calendar,
    category: 'rhythm',
    fullWord: 'rhythm'
  },
  {
    id: 6,
    title: 'Goal Mastery',
    description: 'Achieve your ambitions with structured goal-setting tools.',
    icon: Target,
    category: 'goals',
    fullWord: 'goals'
  },
  {
    id: 7,
    title: 'Triumph Tracker',
    description: 'Celebrate your successes and track your progress over time.',
    icon: Award,
    category: 'progress',
    fullWord: 'progress'
  },
  {
    id: 8,
    title: 'Social Spark',
    description: 'Connect with a supportive community and share your journey.',
    icon: Users,
    category: 'community',
    fullWord: 'community'
  },
  {
    id: 9,
    title: 'Mood Lifter',
    description: 'Elevate your spirits with uplifting content and activities.',
    icon: Heart,
    category: 'mood',
    fullWord: 'mood'
  },
  {
    id: 10,
    title: 'Confidence Shield',
    description: 'Build resilience and self-assurance with proven techniques.',
    icon: Shield,
    category: 'confidence',
    fullWord: 'confidence'
  },
  {
    id: 11,
    title: 'Habit Hero',
    description: 'Form positive habits and break free from negative patterns.',
    icon: TrendingUp,
    category: 'habits',
    fullWord: 'habits'
  },
  {
    id: 12,
    title: 'Sparkle Sanctuary',
    description: 'Indulge in moments of joy and creativity to ignite your passion.',
    icon: Sparkles,
    category: 'joy',
    fullWord: 'joy'
  }
];

export function MVPCore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFeatureFilter, setActiveFeatureFilter] = useState('all');

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

            {/* Pain Points with Professional Images */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <PainPointImageCard
                title="Forgetting important conversations?"
                imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop&crop=face"
                imageAlt="Person looking concerned about memory loss during conversation"
                description="Missing precious moments and connections"
              />
              <PainPointImageCard
                title="Feeling overwhelmed by simple tasks?"
                imageUrl="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500&h=300&fit=crop"
                imageAlt="Person feeling overwhelmed by everyday tasks and responsibilities"
                description="When everyday activities feel impossible"
              />
              <PainPointImageCard
                title="Struggling to stay organized?"
                imageUrl="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=300&fit=crop"
                imageAlt="Disorganized workspace showing difficulty with organization"
                description="Losing track of what matters most"
              />
            </div>

            <div className="flex flex-col items-center space-y-6 mt-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-brain-health-800">
                  You're Not Broken. You're <span className="bg-gradient-to-r from-memory-emerald-600 to-clarity-teal-600 bg-clip-text text-transparent">Rebuilding</span>.
                </h2>
                <p className="font-semibold text-sm text-brain-health-700">
                  Your Rhythm
                </p>
              </div>
              <Button size="lg" className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-brain-health-900 mb-8">
            Core Features to Supercharge Your Mind
          </h2>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 px-6">
            <div className="w-full md:w-1/2 mb-4 md:mb-0">
              <Input
                type="search"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-brain-health-500 focus:ring focus:ring-brain-health-200 focus:ring-opacity-50"
              />
            </div>

            <div className="space-x-2">
              <Button
                variant={activeFeatureFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveFeatureFilter('all')}
              >
                All Features
              </Button>
              <Button
                variant={activeFeatureFilter === 'memory' ? 'default' : 'outline'}
                onClick={() => setActiveFeatureFilter('memory')}
              >
                Memory
              </Button>
              <Button
                variant={activeFeatureFilter === 'focus' ? 'default' : 'outline'}
                onClick={() => setActiveFeatureFilter('focus')}
              >
                Focus
              </Button>
              {/* Add more filter buttons as needed */}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
            {filteredFeatures.map((feature) => (
              <Card key={feature.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">{feature.title}</CardTitle>
                  <feature.icon className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Story Section */}
      <FounderStorySection />

      {/* Your Rhythm Section */}
      <YourRhythmSection />

      {/* Call to Action Footer */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ready to Transform Your Cognitive Wellness?</h2>
          <p className="text-gray-600 mb-6">Start your personalized journey with MyRhythm today.</p>
          <Button className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white px-8 py-3 text-lg">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
