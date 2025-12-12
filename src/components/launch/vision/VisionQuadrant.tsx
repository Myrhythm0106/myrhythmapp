import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Link, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VisionPillar, UserVision } from '@/data/visionPillars';

interface VisionQuadrantProps {
  pillar: VisionPillar;
  vision: UserVision;
  index: number;
  isFullWidth?: boolean;
  onEdit: (pillar: VisionPillar, vision: UserVision) => void;
}

export function VisionQuadrant({
  pillar,
  vision,
  index,
  isFullWidth = false,
  onEdit
}: VisionQuadrantProps) {
  const hasContent = vision.title && vision.title.trim() !== '';
  
  // Progress dots (5 dots)
  const progressDots = Array.from({ length: 5 }, (_, i) => {
    const threshold = (i + 1) * 20;
    return vision.progress >= threshold;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => onEdit(pillar, vision)}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer group",
        "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        isFullWidth ? "col-span-2" : "",
        "min-h-[180px] sm:min-h-[200px]"
      )}
    >
      {/* Background Gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        pillar.gradientFrom,
        pillar.gradientTo,
        "opacity-90"
      )} />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform -translate-x-4 translate-y-4" />
      </div>

      {/* Image Overlay (if set) */}
      {vision.imageUrl && (
        <div className="absolute inset-0">
          <img 
            src={vision.imageUrl} 
            alt={vision.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">{vision.emoji || pillar.icon}</span>
            <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wide">
              {pillar.name}
            </span>
          </div>
          
          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="h-4 w-4 text-white" />
          </motion.button>
        </div>

        {/* Dream Content */}
        <div className="flex-1 flex flex-col justify-center">
          {hasContent ? (
            <>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                {vision.title}
              </h3>
              {vision.why && (
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mb-2">
                  {vision.why}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <Sparkles className="h-6 w-6 text-white/60 mx-auto mb-2" />
              <p className="text-sm text-white/80 font-medium">
                Tap to add your dream
              </p>
              <p className="text-xs text-white/60 mt-1">
                {pillar.question}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Progress & Link */}
        {hasContent && (
          <div className="mt-auto flex items-center justify-between">
            {/* Journey Dots */}
            <div className="flex items-center gap-1.5">
              {progressDots.map((filled, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    filled 
                      ? "bg-white shadow-sm" 
                      : "bg-white/30 border border-white/40"
                  )}
                />
              ))}
            </div>

            {/* Linked Goal Indicator */}
            {vision.linkedGoalId && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Link className="h-3 w-3 text-white" />
                <span className="text-xs text-white font-medium">Goal</span>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
