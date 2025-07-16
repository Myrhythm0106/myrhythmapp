import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Star, Trophy } from 'lucide-react';

interface EmpowermentFloaterProps {
  message: string;
  onComplete?: () => void;
  type?: 'success' | 'encouragement' | 'celebration' | 'progress';
}

const typeConfig = {
  success: {
    icon: Trophy,
    colors: 'from-yellow-400 to-orange-500',
    textColor: 'text-white',
    shadow: 'shadow-yellow-200'
  },
  encouragement: {
    icon: Heart,
    colors: 'from-pink-400 to-purple-500',
    textColor: 'text-white',
    shadow: 'shadow-pink-200'
  },
  celebration: {
    icon: Star,
    colors: 'from-blue-400 to-cyan-500',
    textColor: 'text-white',
    shadow: 'shadow-blue-200'
  },
  progress: {
    icon: Sparkles,
    colors: 'from-green-400 to-emerald-500',
    textColor: 'text-white',
    shadow: 'shadow-green-200'
  }
};

export function EmpowermentFloater({ 
  message, 
  onComplete, 
  type = 'encouragement' 
}: EmpowermentFloaterProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        y: -50,
        transition: { duration: 0.3 }
      }}
      className={`
        fixed top-20 left-1/2 transform -translate-x-1/2 z-50
        bg-gradient-to-r ${config.colors} ${config.textColor}
        px-6 py-4 rounded-full shadow-lg ${config.shadow}
        flex items-center gap-3 max-w-sm
        border border-white/20 backdrop-blur-sm
      `}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 3000);
      }}
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      
      <span className="text-sm font-medium text-center leading-tight">
        {message}
      </span>
      
      <motion.div
        animate={{ 
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="h-4 w-4" />
      </motion.div>
    </motion.div>
  );
}