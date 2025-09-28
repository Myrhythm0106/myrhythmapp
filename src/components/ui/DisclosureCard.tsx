import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DisclosureCardProps {
  children: React.ReactNode;
  expandedContent: React.ReactNode;
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  showExpandIndicator?: boolean;
  expandOnHover?: boolean;
}

export function DisclosureCard({
  children,
  expandedContent,
  className,
  isExpanded: controlledExpanded,
  onToggle,
  showExpandIndicator = true,
  expandOnHover = false
}: DisclosureCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const isControlled = controlledExpanded !== undefined;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else if (!isControlled) {
      setInternalExpanded(!internalExpanded);
    }
  };

  const handleMouseEnter = () => {
    if (expandOnHover && !isControlled) {
      setInternalExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (expandOnHover && !isControlled) {
      setInternalExpanded(false);
    }
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 overflow-hidden",
        "hover:shadow-md border-0 bg-white/60 backdrop-blur-sm",
        isExpanded && "shadow-lg ring-2 ring-primary/20",
        className
      )}
      onClick={handleToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CardContent className="p-0">
        {/* Preview Content */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {children}
            </div>
            {showExpandIndicator && (
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-4 flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0 border-t border-border/50">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="pt-4"
                >
                  {expandedContent}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}