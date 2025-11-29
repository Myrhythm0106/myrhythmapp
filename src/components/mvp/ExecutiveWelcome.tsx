import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, Target, Mic, Calendar, TrendingUp, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function ExecutiveWelcome() {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: Mic,
      title: 'Meeting → Actions in 60 Seconds',
      description: 'Record any meeting, get structured deliverables and calendar blocks automatically',
      metric: '2+ hours/week saved'
    },
    {
      icon: Target,
      title: 'Never Drop a Commitment',
      description: 'Every verbal commitment captured, prioritized, and scheduled with smart reminders',
      metric: '100% follow-through'
    },
    {
      icon: Calendar,
      title: 'Calendar-Aware Scheduling',
      description: 'Actions scheduled around your existing commitments and peak performance times',
      metric: 'Optimized execution'
    },
    {
      icon: TrendingUp,
      title: 'Performance Analytics',
      description: 'Track completion rates, identify bottlenecks, and optimize your rhythm',
      metric: 'Data-driven decisions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              MyRhythm <span className="text-amber-500">Executive</span>
            </h1>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/auth')}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-400">Productivity Multiplier</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Turn Every Conversation Into
              <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Measurable Results
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Stop losing commitments between meetings. Record, extract actions, schedule intelligently, execute flawlessly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-amber-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <prop.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white">{prop.title}</h3>
                          <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                            {prop.metric}
                          </span>
                        </div>
                        <p className="text-slate-400">{prop.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ROI Calculator */}
          <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/30 mb-12">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">2+ hrs</div>
                  <div className="text-slate-400">Saved per week on meeting follow-ups</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">100%</div>
                  <div className="text-slate-400">Commitment capture rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">3x</div>
                  <div className="text-slate-400">Faster action execution</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to maximize your impact?
              </h2>
              <p className="text-amber-100 mb-6 max-w-xl mx-auto">
                Your next meeting is your first chance to see the ROI. Record → Extract → Execute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/memory-bridge')}
                  className="bg-white text-amber-600 hover:bg-amber-50"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start First Meeting
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/mvp-assessment?type=executive')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Performance Check
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
