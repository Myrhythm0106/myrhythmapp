import React from 'react';
import { motion } from 'framer-motion';

interface AppSignatureProps {
  variant?: 'default' | 'light' | 'dark';
  className?: string;
}

export function AppSignature({ variant = 'default', className = '' }: AppSignatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`text-center py-6 ${className}`}
    >
      <p className={`text-sm italic ${
        variant === 'light' 
          ? 'text-white/70' 
          : variant === 'dark' 
            ? 'text-foreground/70' 
            : 'text-muted-foreground'
      }`}>
        "Every promise you keep builds trust. You're building something amazing." 💪
      </p>
    </motion.div>
  );
}
