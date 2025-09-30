import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Calendar, MessageSquare, Battery, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CommunityStatsWidget } from '@/components/community/CommunityStatsWidget';
import { QuickMessageTemplates } from '@/components/support-circle/QuickMessageTemplates';

interface BrainInjuryDashboardProps {
  userName?: string;
}

export function BrainInjuryDashboard({ userName }: BrainInjuryDashboardProps) {
  const navigate = useNavigate();
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');

  const getEnergyColor = () => {
    switch (energyLevel) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
    }
  };

  const getEnergyMessage = () => {
    switch (energyLevel) {
      case 'high': return 'Great energy today! Perfect time for important tasks.';
      case 'medium': return 'Moderate energy. Take breaks between activities.';
      case 'low': return 'Low energy detected. Be gentle with yourself today.';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Header with Energy Status */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Welcome back{userName ? `, ${userName}` : ''}</h1>
          <Badge variant="outline" className="flex items-center gap-2">
            <Battery className={`w-4 h-4 ${getEnergyColor()}`} />
            <span className="text-base">Energy: {energyLevel}</span>
          </Badge>
        </div>
        <p className="text-lg text-muted-foreground">{getEnergyMessage()}</p>
      </motion.div>

      {/* Quick Capture - Always Prominent */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Quick Capture</h2>
              <p className="text-base text-muted-foreground">
                Record a conversation, thought, or reminder in seconds
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => navigate('/memory-bridge')}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Priority */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Today's Priority</h2>
              </div>
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <p className="text-xl mb-3">Review your notes from yesterday's doctor appointment</p>
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => navigate('/memory-bridge')}
                    className="text-base"
                  >
                    Open Recording
                  </Button>
                  <Button variant="outline" className="text-base">
                    Mark Complete
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Focus on one thing at a time. You've got this.
              </p>
            </Card>
          </motion.div>

          {/* Upcoming - Simplified */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Coming Up</h2>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/calendar')}
                  className="text-base"
                >
                  View Calendar
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                  <div>
                    <p className="text-lg font-medium">Physical Therapy</p>
                    <p className="text-base text-muted-foreground">Tomorrow at 2:00 PM</p>
                  </div>
                  <Badge className="text-base">Tomorrow</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                  <div>
                    <p className="text-lg font-medium">Follow-up Call</p>
                    <p className="text-base text-muted-foreground">Friday at 10:00 AM</p>
                  </div>
                  <Badge variant="outline" className="text-base">Friday</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Community Connection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <CommunityStatsWidget />
          </motion.div>
        </div>

        {/* Right Sidebar - Support & Messages */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Support Circle</h2>
              </div>
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">From Sarah (Wife)</p>
                  <p className="text-base">Proud of you for completing your exercises today! 💙</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-card rounded-lg border">
                  <p className="text-sm font-medium mb-1">From Dr. Johnson</p>
                  <p className="text-base">Don't forget to bring your symptom log to our next appointment</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </div>
              <QuickMessageTemplates />
            </Card>
          </motion.div>

          {/* Energy Check-in */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">How's Your Energy?</h3>
              <div className="space-y-2">
                <Button
                  variant={energyLevel === 'high' ? 'default' : 'outline'}
                  className="w-full justify-start text-base"
                  onClick={() => setEnergyLevel('high')}
                >
                  <Battery className="w-5 h-5 mr-2 text-green-500" />
                  High Energy
                </Button>
                <Button
                  variant={energyLevel === 'medium' ? 'default' : 'outline'}
                  className="w-full justify-start text-base"
                  onClick={() => setEnergyLevel('medium')}
                >
                  <Battery className="w-5 h-5 mr-2 text-yellow-500" />
                  Medium Energy
                </Button>
                <Button
                  variant={energyLevel === 'low' ? 'default' : 'outline'}
                  className="w-full justify-start text-base"
                  onClick={() => setEnergyLevel('low')}
                >
                  <Battery className="w-5 h-5 mr-2 text-red-500" />
                  Low Energy
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                We'll adjust your experience based on your energy level
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
