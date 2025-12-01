import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, Mic, Users, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface FirstVictoryBannerProps {
  onDismiss?: () => void;
  userName?: string;
}

export function FirstVictoryBanner({ onDismiss, userName }: FirstVictoryBannerProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Mic,
      label: 'Record First Conversation',
      description: 'Capture an important moment',
      path: '/memory-bridge',
      gradient: 'from-memory-emerald-500 to-brain-health-500'
    },
    {
      icon: Calendar,
      label: 'Plan Your Week',
      description: 'Set up your priorities',
      path: '/calendar',
      gradient: 'from-brain-health-500 to-clarity-teal-500'
    },
    {
      icon: Users,
      label: 'Invite Support',
      description: 'Add your accountability partner',
      path: '/support-circle',
      gradient: 'from-clarity-teal-500 to-sunrise-amber-500'
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-memory-emerald-500/10 via-brain-health-500/10 to-clarity-teal-500/10 border-memory-emerald-200/50 overflow-hidden">
          <div className="p-6 relative">
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brain-health-900">
                  Welcome{userName ? `, ${userName}` : ''}! Let's get started.
                </h2>
                <p className="text-sm text-brain-health-700">
                  Choose your first action to begin your journey
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-auto p-4 flex flex-col items-start gap-2 bg-white/80 hover:bg-white border-brain-health-200/50 hover:border-brain-health-300 transition-all group"
                    onClick={() => navigate(action.path)}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-brain-health-900 flex items-center gap-2">
                        {action.label}
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xs text-brain-health-600">{action.description}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
