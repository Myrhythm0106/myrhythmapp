import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Target, 
  Mic, 
  Calendar, 
  Brain, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

interface EmpoweringEmptyStateProps {
  type: 'recordings' | 'actions' | 'schedule' | 'transcripts' | 'general';
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

export function EmpoweringEmptyState({ 
  type, 
  onAction, 
  actionText,
  className = ""
}: EmpoweringEmptyStateProps) {
  const getStateConfig = () => {
    switch (type) {
      case 'recordings':
        return {
          icon: Mic,
          title: "Your Voice Journey Begins Here",
          message: "Ready to capture your thoughts, ideas, and commitments? Your first recording will unlock the power of AI-assisted memory and action tracking.",
          actionText: actionText || "Start Recording",
          features: [
            "Voice-to-text transcription",
            "AI-powered action extraction", 
            "Smart scheduling suggestions",
            "Empowering progress tracking"
          ],
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "from-purple-50 to-pink-50"
        };
      case 'actions':
        return {
          icon: Target,
          title: "Your Action Hub Awaits",
          message: "Once you make your first recording, MyRhythm will extract actionable commitments and help you schedule them for success.",
          actionText: actionText || "Make First Recording",
          features: [
            "Automatic action identification",
            "Priority-based organization",
            "Calendar integration",
            "Progress celebration"
          ],
          gradient: "from-emerald-500 to-green-500",
          bgGradient: "from-emerald-50 to-green-50"
        };
      case 'schedule':
        return {
          icon: Calendar,
          title: "Smart Scheduling Ready",
          message: "Your AI-powered scheduling assistant is ready to find the perfect times for your actions, considering your calendar and energy levels.",
          actionText: actionText || "Create Actions to Schedule",
          features: [
            "Conflict-free scheduling",
            "Energy-optimized timing",
            "Multi-calendar integration",
            "Intelligent suggestions"
          ],
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50"
        };
      case 'transcripts':
        return {
          icon: Brain,
          title: "AI Analysis Center",
          message: "Your recordings will appear here with full transcripts and AI-powered insights, helping you track commitments and identify patterns.",
          actionText: actionText || "Record Your First Session",
          features: [
            "Full transcript access",
            "AI insight extraction",
            "Commitment tracking",
            "Pattern recognition"
          ],
          gradient: "from-indigo-500 to-purple-500",
          bgGradient: "from-indigo-50 to-purple-50"
        };
      default:
        return {
          icon: Sparkles,
          title: "Your MyRhythm Journey",
          message: "Welcome to your empowering productivity ecosystem. Every step you take here builds toward a more organized, successful you.",
          actionText: actionText || "Get Started",
          features: [
            "Voice-powered capture",
            "AI-driven insights",
            "Smart scheduling",
            "Progress celebration"
          ],
          gradient: "from-violet-500 to-purple-500",
          bgGradient: "from-violet-50 to-purple-50"
        };
    }
  };

  const config = getStateConfig();
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className={`border-0 bg-gradient-to-br ${config.bgGradient} shadow-sm`}>
        <CardContent className="p-12 text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="relative"
          >
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mx-auto shadow-lg`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-3 bg-gradient-to-br from-current/10 to-transparent rounded-3xl"
            />
          </motion.div>

          <div className="space-y-4 max-w-lg mx-auto">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground"
            >
              {config.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground leading-relaxed"
            >
              {config.message}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4 max-w-md mx-auto"
          >
            {config.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm font-medium text-foreground shadow-sm"
              >
                ✨ {feature}
              </motion.div>
            ))}
          </motion.div>

          {onAction && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-4"
            >
              <Button
                onClick={onAction}
                size="lg"
                className={`bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white shadow-lg px-8`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {config.actionText}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}