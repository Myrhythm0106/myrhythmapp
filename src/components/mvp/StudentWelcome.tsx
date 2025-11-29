import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, CheckCircle, Mic, Calendar, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function StudentWelcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: 'Capture Class Notes',
      description: 'Record lectures and discussions - we\'ll turn them into organized notes',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: 'Homework Reminders',
      description: 'Never forget an assignment again with smart scheduling',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Calendar,
      title: 'Study Scheduler',
      description: 'Plan your study time around your energy and activities',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Trophy,
      title: 'Achievement Tracking',
      description: 'Celebrate wins and build streaks for completed tasks',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            MyRhythm for Students
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Your Study Superpower</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
              Turn Class Into Action
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Record what you hear in class, and we'll help you remember it, organize it, and schedule when to study or complete homework.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to become a study superhero? 🦸‍♂️
              </h2>
              <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                Just tap record during class, and we'll handle the rest. Notes, reminders, schedules - all automatic!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/memory-bridge')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/mvp-assessment?type=student')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Quick Quiz First
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
