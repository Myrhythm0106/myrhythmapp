import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Heart, Users, Calendar, ArrowRight, BookOpen, Briefcase, Star, Zap, Cloud, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function MVPUserTypeSelection() {
  const navigate = useNavigate();

  const otherUserTypes = [
    {
      id: 'student',
      title: 'Student / Young Person',
      description: 'Capture class notes, organize homework, and schedule study time — your study superpower!',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      path: '/mvp/student-welcome'
    },
    {
      id: 'executive',
      title: 'Executive / Visionary',
      description: 'Turn meetings into actions, maximize productivity, and never drop a commitment',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-500',
      path: '/mvp/executive-welcome'
    },
    {
      id: 'post-recovery',
      title: 'Thriving (Post-Recovery)',
      description: "You've rebuilt and regained — now maintain your wins and keep optimizing",
      icon: Star,
      color: 'from-emerald-500 to-teal-500',
      path: '/mvp/thriving-welcome'
    },
    {
      id: 'cognitive-support',
      title: 'Cognitive Support',
      description: 'For individuals with memory challenges or other cognitive considerations',
      icon: Brain,
      color: 'from-clarity-teal-500 to-brain-health-500',
      path: '/mvp/cognitive-support-welcome'
    },
    {
      id: 'adhd',
      title: 'ADHD Support',
      description: 'Focus-friendly timers, impulse capture, and dopamine-friendly task chunking — your fast-moving mind is your superpower',
      icon: Zap,
      color: 'from-purple-500 to-violet-500',
      path: '/mvp/adhd-welcome'
    },
    {
      id: 'long-covid',
      title: 'Long COVID Support',
      description: "Energy-paced scheduling, voice capture for foggy moments, and gentle reminders — brain fog doesn't define you",
      icon: Cloud,
      color: 'from-slate-500 to-blue-500',
      path: '/mvp/long-covid-welcome'
    },
    {
      id: 'ms-cognitive',
      title: 'MS Cognitive Support',
      description: 'Fatigue-aware scheduling, cognitive load awareness, and encouragement — your rhythm, your way',
      icon: Activity,
      color: 'from-teal-500 to-emerald-500',
      path: '/mvp/ms-cognitive-welcome'
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
        <div className="text-center max-w-4xl mx-auto mb-10">
          <p className="text-sm text-neural-indigo-600 mb-2 italic">
            "Empower Your Day. Own Your Rhythm."
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-neural-purple-700 via-neural-indigo-700 to-neural-blue-700 bg-clip-text text-transparent">
            Choose Your Path
          </h1>
          <p className="text-lg md:text-xl text-neural-indigo-700 max-w-3xl mx-auto">
            MyRhythm adapts to your unique needs. Select the path that best describes your journey.
          </p>
        </div>

        {/* Foundation Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mb-12"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-brain-health-50 via-white to-clarity-teal-50 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brain-health-500/5 to-clarity-teal-500/5 pointer-events-none" />
            <CardContent className="p-8 md:p-12 relative">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Icon cluster */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-brain-health-500 to-clarity-teal-500 rounded-full flex items-center justify-center shadow-lg">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-clarity-teal-500 to-brain-health-500 rounded-full flex items-center justify-center shadow-md -ml-6 mt-8">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-sm font-semibold text-brain-health-600 uppercase tracking-wider mb-2">
                    Our Foundation
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-neural-indigo-900 mb-3">
                    Built From Lived Experience
                  </h2>
                  <p className="text-neural-indigo-700 leading-relaxed mb-6 max-w-2xl">
                    MyRhythm was born from brain injury recovery. Every feature — Memory Bridge, Support Circles, energy-aware scheduling — was designed by a survivor, for survivors. This is our foundation.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-brain-health-500 to-clarity-teal-500 hover:from-brain-health-600 hover:to-clarity-teal-600 text-white shadow-lg"
                      onClick={() => navigate('/mvp/memory-first-welcome')}
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Brain Injury Navigator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-brand-orange-400 text-brand-orange-700 hover:bg-brand-orange-50"
                      onClick={() => navigate('/mvp/caregiver-welcome')}
                    >
                      <Users className="mr-2 h-5 w-5" />
                      Caregiver / Support
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section header for other paths */}
        <div className="max-w-6xl mx-auto mb-6">
          <h2 className="text-xl font-semibold text-neural-indigo-800 mb-2">Your Rhythm, Your Way</h2>
          <p className="text-sm text-neural-indigo-600">
            MyRhythm also empowers people with ADHD, Long COVID, MS cognitive fatigue, and anyone who wants to own their day.
          </p>
        </div>

        {/* Other user type grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {otherUserTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.08 }}
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
            Not sure which path fits you? Don't worry — you can always adjust your preferences later.
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
