import React from 'react';
import { milestones, type TaskPhase } from '@/data/roadmapData';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface MilestoneCardsProps {
  filter: 'all' | TaskPhase;
}

export function MilestoneCards({ filter }: MilestoneCardsProps) {
  const filtered = milestones.filter(m => filter === 'all' || m.phase === filter);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {filtered.map((m, i) => (
        <motion.div
          key={m.date + m.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card className="border-brand-teal-200/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center space-y-2">
              <span className="text-3xl">{m.icon}</span>
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-xs text-muted-foreground">
                {format(parseISO(m.date), 'MMM d, yyyy')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
