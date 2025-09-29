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
      id: 'individual',
      title: 'Brain Health Optimisation',
      description: 'Personal cognitive wellness and brain health optimization',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
      path: '/start'
    },
    {
      id: 'brain-injury',
      title: 'Brain Injury Recovery',
      description: 'Specialized support for brain injury recovery and cognitive rehabilitation',
      icon: Heart,
      color: 'from-emerald-500 to-teal-500',
      path: '/start'
    },
    {
      id: 'caregiver',
      title: 'Caregiver/Support',
      description: 'Tools for family members, caregivers, and support partners',
      icon: Users,
      color: 'from-orange-500 to-red-500',
      path: '/start'
    },
    {
      id: 'medical-professional',
      title: 'Medical Professional',
      description: 'Healthcare providers, therapists, and medical staff supporting cognitive health',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      path: '/start'
    },
    {
      id: 'cognitive-support',
      title: 'Cognitive Support',
      description: 'For individuals with ADHD, memory challenges, or other cognitive considerations',
      icon: Brain,
      color: 'from-teal-500 to-cyan-500',
      path: '/start'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
              MyRhythm
            </h1>
          </div>
          <Button onClick={() => navigate('/auth')} variant="outline" className="border-purple-200 hover:bg-purple-50">
            Sign In
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Choose Your Path
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
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
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
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
          <p className="text-sm text-gray-500 mb-4">
            Not sure which path fits you? Don't worry - you can always adjust your preferences later.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/start')}
            className="border-purple-200 hover:bg-purple-50"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Take Assessment First
          </Button>
        </div>
      </main>
    </div>
  );
}