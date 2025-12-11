import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface VisionBoardHeaderProps {
  yearlyTheme: string;
  onThemeChange: (theme: string) => void;
  onExportWallpaper: () => void;
  year?: number;
}

export function VisionBoardHeader({
  yearlyTheme,
  onThemeChange,
  onExportWallpaper,
  year = new Date().getFullYear()
}: VisionBoardHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(yearlyTheme);

  const handleSave = () => {
    onThemeChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(yearlyTheme);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neural-purple-100 via-brain-health-50 to-clarity-teal-100 p-6 mb-6"
    >
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neural-purple-300/30 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-brain-health-300/30 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        {/* Top Row: Icon and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neural-purple-500 to-brain-health-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Vision Board</h1>
              <p className="text-sm text-muted-foreground">{year} - My Year of Growth</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportWallpaper}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-brain-health-200 hover:bg-brain-health-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Save Wallpaper</span>
          </Button>
        </div>

        {/* Yearly Theme */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            My Theme for {year}
          </p>
          
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                placeholder="Enter your theme..."
                className="text-lg font-semibold bg-white/80 border-brain-health-300 focus:border-brain-health-500"
                autoFocus
              />
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={cn(
                "text-left w-full group",
                "text-xl font-semibold text-foreground",
                "hover:text-brain-health-700 transition-colors"
              )}
            >
              {yearlyTheme || "Tap to set your theme..."}
              <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm text-brain-health-500">
                ✏️ Edit
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
