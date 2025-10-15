import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Users, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function MVPUserTypeSelection() {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'brain-health',
      title: 'Brain Health Optimisation',
      description: 'Personal cognitive wellness and brain health optimization',
      icon: Brain,
      color: 'from-neural-purple-500 to-neural-blue-500',
      path: '/mvp/brain-health-welcome'
    },
    {
      id: 'memory-challenges',
      title: 'Memory Challenges (After Brain Injury)',
      description: 'For anyone rebuilding after brain injury, stroke, or cognitive change—you\'re the CEO of your journey',
      icon: Heart,
      color: 'from-brain-health-500 to-clarity-teal-500',
      path: '/mvp/memory-first-welcome'
    },
    {
      id: 'caregiver',
      title: 'Caregiver/Support',
      description: 'Tools for family members, caregivers, and support partners',
      icon: Users,
      color: 'from-brand-orange-500 to-neural-magenta-500',
      path: '/mvp/caregiver-welcome'
    },
    {
      id: 'medical-professional',
      title: 'Medical Professional',
      description: 'Healthcare providers, therapists, and medical staff supporting cognitive health',
      icon: Users,
      color: 'from-neural-blue-500 to-neural-indigo-500',
      path: '/mvp/medical-professional-welcome'
    },
    {
      id: 'cognitive-support',
      title: 'Cognitive Support',
      description: 'For individuals with ADHD, memory challenges, or other cognitive considerations',
      icon: Brain,
      color: 'from-clarity-teal-500 to-brain-health-500',
      path: '/mvp/cognitive-support-welcome'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50 to-neural-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neural-purple-500 via-neural-indigo-500 to-neural-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-neural-purple-600 via-neural-indigo-600 to-neural-blue-600 bg-clip-text text-transparent">
              MyRhythm
            </h1>
          </div>
          <Button onClick={() => navigate('/auth')} variant="outline" className="border-neural-indigo-200 hover:bg-neural-purple-50">
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <p className="text-sm text-neural-indigo-600 mb-2 italic">
            "Empower Your Mind, Rebuild Your Memory, Reclaim Your Life"
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neural-purple-700 via-neural-indigo-700 to-neural-blue-700 bg-clip-text text-transparent">
            Choose Your Path
          </h1>
          <p className="text-lg md:text-xl text-neural-indigo-700 mb-8 max-w-3xl mx-auto">
            MyRhythm adapts to your unique needs. Select the path that best describes your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {userTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                onClick={() => navigate(type.path)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-neural-indigo-900">
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-neural-indigo-700 mb-6 text-sm leading-relaxed">
                    {type.description}
                  </p>
                  <Button 
                    className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 transition-opacity duration-200`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(type.path);
                    }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-sm text-neural-indigo-600 mb-4">
            Not sure which path fits you? Don't worry - you can always adjust your preferences later.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/start')}
            className="border-neural-indigo-200 hover:bg-neural-purple-50"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Take Assessment First
          </Button>
        </div>
      </main>
    </div>
  );
}