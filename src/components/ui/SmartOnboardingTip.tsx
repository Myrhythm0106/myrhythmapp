import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';

interface SmartOnboardingTipProps {
  tip: {
    id: string;
    title: string;
    description: string;
    action?: string;
    importance: 'high' | 'medium' | 'low';
  };
  onDismiss?: (tipId: string) => void;
  onAction?: () => void;
  className?: string;
}

export function SmartOnboardingTip({
  tip,
  onDismiss,
  onAction,
  className = ""
}: SmartOnboardingTipProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    setTimeout(() => onDismiss?.(tip.id), 300);
  };

  const getImportanceConfig = () => {
    switch (tip.importance) {
      case 'high':
        return {
          gradient: 'from-red-500 to-pink-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700'
        };
      case 'medium':
        return {
          gradient: 'from-amber-500 to-orange-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700'
        };
      default:
        return {
          gradient: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700'
        };
    }
  };

  const config = getImportanceConfig();

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.3 }}
          className={className}
        >
          <Card className={`${config.bgColor} ${config.borderColor} border shadow-sm`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <h4 className={`font-semibold text-sm ${config.textColor}`}>
                      {tip.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.description}
                    </p>
                    
                    {tip.action && onAction && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onAction}
                        className={`${config.textColor} hover:bg-white/80 text-xs mt-2 h-8`}
                      >
                        {tip.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}