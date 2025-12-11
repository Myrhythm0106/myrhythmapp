import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Edit3, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PersonalAffirmationProps {
  affirmation: string;
  onAffirmationChange: (affirmation: string) => void;
}

export function PersonalAffirmation({
  affirmation,
  onAffirmationChange
}: PersonalAffirmationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(affirmation);

  const handleSave = () => {
    onAffirmationChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(affirmation);
    setIsEditing(false);
  };

  const placeholderAffirmation = "I am capable of achieving everything I set my mind to.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6",
        "bg-gradient-to-br from-neural-purple-50 via-brain-health-50 to-clarity-teal-50",
        "border border-neural-purple-200/60"
      )}
    >
      {/* Decorative Elements */}
      <div className="absolute top-2 right-2 opacity-20">
        <Sparkles className="h-16 w-16 text-neural-purple-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">💭</span>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              My Daily Affirmation
            </h3>
          </div>
          
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 px-2 text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Write your personal affirmation..."
              className="text-lg font-medium bg-white/80 border-neural-purple-200"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-brain-health-500 hover:bg-brain-health-600"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className={cn(
            "text-xl font-medium leading-relaxed",
            affirmation ? "text-foreground" : "text-muted-foreground italic"
          )}>
            "{affirmation || placeholderAffirmation}"
          </p>
        )}
      </div>
    </motion.div>
  );
}
