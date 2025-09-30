import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Heart, Users, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface BrainInjuryWelcomeProps {
  onContinue: () => void;
  userName?: string;
}

export function BrainInjuryWelcome({ onContinue, userName }: BrainInjuryWelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome{userName ? `, ${userName}` : ''} 
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            We understand brain injury recovery is different
          </p>
          <p className="text-lg text-muted-foreground">
            Where no one walks alone 💙
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Memory Bridge</h3>
                <p className="text-sm text-muted-foreground">
                  Record conversations and never lose important medical information again
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Brain-Friendly Design</h3>
                <p className="text-sm text-muted-foreground">
                  Larger fonts, clear icons, and energy-aware features designed for cognitive wellness
                </p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 h-full border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Your Support Circle</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with family, caregivers, and healthcare providers who support your journey
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">Our Promise to You</h4>
              <p className="text-sm text-muted-foreground">
                We've designed every feature with brain injury recovery in mind. 
                Large text for easier reading. Simple layouts to reduce cognitive load. 
                Energy tracking to respect your limits. And a community that truly understands.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-8"
          >
            Start Your Journey
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Set up your support circle in the next step
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
