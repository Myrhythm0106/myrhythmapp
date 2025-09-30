import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Calendar, MessageSquare, TrendingUp, Coffee, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DualRoleWidget } from '@/components/caregiver/DualRoleWidget';
import { QuickMessageTemplates } from '@/components/support-circle/QuickMessageTemplates';

interface CaregiverDashboardProps {
  userName?: string;
  lovedOneName?: string;
}

export function CaregiverDashboard({ userName, lovedOneName = 'Sarah' }: CaregiverDashboardProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'both' | 'them' | 'me'>('both');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back{userName ? `, ${userName}` : ''}</h1>
            <p className="text-lg text-muted-foreground">Supporting {lovedOneName} • Caring for yourself</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Heart className="w-4 h-4 text-accent" />
            <span>Caregiver Mode</span>
          </Badge>
        </div>
      </motion.div>

      {/* Dual Role Widget */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <DualRoleWidget 
          lovedOneName={lovedOneName}
          onViewChange={setActiveView}
        />
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="both">Both Views</TabsTrigger>
          <TabsTrigger value="them">Their Day</TabsTrigger>
          <TabsTrigger value="me">My Day</TabsTrigger>
        </TabsList>

        {/* Both Views */}
        <TabsContent value="both" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Their Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {lovedOneName}'s Progress
                  </h2>
                  <Badge className="bg-green-500/10 text-green-700">Active</Badge>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-1">Daily Win Streak</p>
                    <p className="text-2xl font-bold">7 days 🎉</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today's Actions</span>
                      <span className="text-sm font-medium">3 of 4 completed</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Recent Activities:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Completed morning exercises
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Recorded doctor conversation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Took medication on time
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Your Self-Care */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    Your Self-Care
                  </h2>
                  <Badge variant="outline">Important</Badge>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm font-medium">Respite Reminder</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You've been actively caregiving for 8 days. Schedule a break soon.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/calendar')}
                    >
                      <Coffee className="w-4 h-4 mr-2" />
                      Schedule respite time
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Quick self-check-in
                    </Button>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-2">Self-care this week:</p>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        30 min walk (Mon)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Called a friend (Wed)
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        Need more activities
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Shared Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Shared Calendar
                </h2>
                <Button variant="outline" onClick={() => navigate('/calendar')}>
                  View Full Calendar
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border">
                  <div>
                    <p className="font-medium">Physical Therapy ({lovedOneName})</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                  </div>
                  <Badge>Tomorrow</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <div>
                    <p className="font-medium">Your Respite Time</p>
                    <p className="text-sm text-muted-foreground">Friday at 3:00 PM</p>
                  </div>
                  <Badge variant="outline">Your Time</Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Support Circle Messages</h2>
              </div>
              <div className="space-y-3 mb-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-1">From Dr. Johnson</p>
                  <p className="text-sm">{lovedOneName}'s progress looks great this week. Keep up the routine!</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-card rounded-lg border">
                  <p className="text-sm font-medium mb-1">From Support Group</p>
                  <p className="text-sm">Remember: taking care of yourself isn't selfish, it's necessary.</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </div>
              <QuickMessageTemplates />
            </Card>
          </motion.div>
        </TabsContent>

        {/* Their Day View */}
        <TabsContent value="them" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">{lovedOneName}'s Day</h2>
            <p className="text-muted-foreground">Full view of their schedule, progress, and activities...</p>
          </Card>
        </TabsContent>

        {/* My Day View */}
        <TabsContent value="me" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Day</h2>
            <p className="text-muted-foreground">Focus on your own wellness, self-care, and support...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
