import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, TrendingUp, Mic, Calendar, Heart, ArrowRight, Star, CheckCircle, Sparkles as SparklesIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function PostRecoveryWelcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Maintain Your Gains',
      description: 'Keep the cognitive strategies that worked during recovery as daily habits',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: 'Optimize Performance',
      description: 'Continue building on your progress with advanced cognitive tools',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Plan your days around your energy peaks and cognitive sweet spots',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Wellness Tracking',
      description: 'Monitor trends and catch early signs if things start slipping',
      color: 'from-rose-500 to-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
            <Star className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            MyRhythm Thrive
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">You've Come So Far</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Now Let's Keep You Thriving
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              You've rebuilt, regained, and recovered. MyRhythm helps you maintain those wins and continue optimizing your cognitive performance.
            </p>
          </motion.div>

          {/* Celebration Card */}
          <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-200 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800 mb-1">
                    Your journey is an inspiration
                  </h3>
                  <p className="text-emerald-700">
                    The tools and strategies that helped you recover are the same ones that will help you thrive. We're here to make them effortless.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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

          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to thrive? 🌟
              </h2>
              <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
                Use the same voice-to-action tool that supports recovery - now optimized for peak performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/launch/register?userType=post-recovery')}
                  className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start 7-Day Free Trial
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/mvp-assessment?type=post-recovery')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Wellness Check
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <p className="text-white/80 text-sm mt-4">
                No credit card charged for 7 days • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
