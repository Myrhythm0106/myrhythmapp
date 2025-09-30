import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DualRoleWidgetProps {
  lovedOneName: string;
  onViewChange: (view: 'both' | 'them' | 'me') => void;
}

export function DualRoleWidget({ lovedOneName, onViewChange }: DualRoleWidgetProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 via-background to-accent/5 border-primary/20">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Their Progress */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-card rounded-lg border border-primary/20 cursor-pointer"
          onClick={() => onViewChange('them')}
        >
          <div className="flex items-center justify-between mb-3">
            <Users className="w-6 h-6 text-primary" />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">{lovedOneName}'s Progress</h3>
          <p className="text-2xl font-bold mb-1">75%</p>
          <p className="text-sm text-muted-foreground">Daily actions completed</p>
          <div className="mt-3 p-2 bg-green-500/10 rounded text-xs text-green-700 font-medium">
            🎉 7-day streak active!
          </div>
        </motion.div>

        {/* Celebration Message */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium mb-2">Today's Impact</p>
            <p className="text-xs text-muted-foreground">
              Your support helped {lovedOneName} complete 3 important tasks today
            </p>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-3 w-full"
              onClick={() => onViewChange('both')}
            >
              View Details
            </Button>
          </div>
        </motion.div>

        {/* Your Self-Care */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 bg-card rounded-lg border border-accent/20 cursor-pointer"
          onClick={() => onViewChange('me')}
        >
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-6 h-6 text-accent" />
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Your Self-Care</h3>
          <p className="text-2xl font-bold mb-1">40%</p>
          <p className="text-sm text-muted-foreground">Weekly self-care goal</p>
          <div className="mt-3 p-2 bg-yellow-500/10 rounded text-xs text-yellow-700 font-medium">
            ⚠️ Schedule respite time
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
        >
          Send Encouragement
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
        >
          Schedule Break
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
        >
          Self Check-in
        </Button>
      </div>
    </Card>
  );
}
