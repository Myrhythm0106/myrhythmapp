import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users, Shield, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface CaregiverWelcomeProps {
  onContinue: () => void;
  userName?: string;
}

export function CaregiverWelcome({ onContinue, userName }: CaregiverWelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-accent to-primary mb-6"
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Welcome{userName ? `, ${userName}` : ''} 
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Support your loved one AND yourself
          </p>
          <p className="text-lg text-muted-foreground">
            Because caregivers need care too 💙
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-3 text-center">Two Journeys, One Platform</h2>
          <p className="text-center text-muted-foreground mb-6">
            MyRhythm helps you support your loved one while also taking care of yourself
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5 border-accent/20 bg-card/50">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                For Your Loved One
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Track their progress together</li>
                <li>• Share calendars and appointments</li>
                <li>• See their daily wins</li>
                <li>• Coordinate with their care team</li>
              </ul>
            </Card>
            
            <Card className="p-5 border-primary/20 bg-card/50">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                For You
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Track your own self-care</li>
                <li>• Prevent burnout with reminders</li>
                <li>• Connect with your support circle</li>
                <li>• Access respite resources</li>
              </ul>
            </Card>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full border-accent/20 hover:border-accent/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Shared Calendar</h3>
                <p className="text-sm text-muted-foreground">
                  Never miss appointments. Coordinate schedules seamlessly with your loved one.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full border-accent/20 hover:border-accent/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Burnout Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Gentle reminders to take breaks, rest, and recharge your own energy.
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 h-full border-accent/20 hover:border-accent/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Your Support Circle</h3>
                <p className="text-sm text-muted-foreground">
                  Build your own support network. You don't have to do this alone.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-card/50 backdrop-blur-sm border border-accent/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">You Deserve Support Too</h4>
              <p className="text-sm text-muted-foreground">
                Caregiving is one of the hardest journeys. MyRhythm recognizes that caring for someone 
                else means you need care too. We'll help you support your loved one while making sure 
                you don't lose yourself in the process.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-gradient-to-r from-accent to-primary hover:opacity-90 text-white px-8"
          >
            Set Up Your Support System
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Next: Connect with your loved one and build your own support circle
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
