import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Download, Sparkles, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VisionQuadrant } from '@/components/launch/vision/VisionQuadrant';
import { QuadrantEditor } from '@/components/launch/vision/QuadrantEditor';
import { PersonalAffirmation } from '@/components/launch/vision/PersonalAffirmation';
import { ShareVisionBoard } from '@/components/launch/vision/ShareVisionBoard';
import { visionPillars, VisionPillar, UserVision, defaultVisions } from '@/data/visionPillars';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function LaunchGoals() {
  const currentYear = new Date().getFullYear();
  const [yearlyTheme, setYearlyTheme] = useState('Growth & Abundance');
  const [isEditingTheme, setIsEditingTheme] = useState(false);
  const [themeInput, setThemeInput] = useState(yearlyTheme);
  const [personalAffirmation, setPersonalAffirmation] = useState('I am capable of achieving everything I set my mind to.');
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<VisionPillar | null>(null);
  const [selectedVision, setSelectedVision] = useState<UserVision | null>(null);

  // User's visions for each pillar
  const [visions, setVisions] = useState<Record<string, UserVision>>(() => {
    // Initialize with sample data for demo
    return {
      'mind-growth': {
        id: uuidv4(),
        pillarId: 'mind-growth',
        title: 'Master a new skill',
        why: 'To grow professionally and feel confident',
        emoji: '🧠',
        progress: 40,
        createdAt: new Date().toISOString()
      },
      'health-body': {
        id: uuidv4(),
        pillarId: 'health-body',
        title: 'Feel stronger and healthier',
        why: 'To have energy for what matters most',
        emoji: '💪',
        progress: 65,
        linkedGoalId: 'goal-1',
        linkedGoalTitle: 'Improve my fitness',
        createdAt: new Date().toISOString()
      },
      'relationships': {
        id: uuidv4(),
        pillarId: 'relationships',
        title: '',
        progress: 0,
        createdAt: new Date().toISOString()
      },
      'financial': {
        id: uuidv4(),
        pillarId: 'financial',
        title: '',
        progress: 0,
        createdAt: new Date().toISOString()
      },
      'purpose-joy': {
        id: uuidv4(),
        pillarId: 'purpose-joy',
        title: 'Practice daily gratitude',
        why: 'Because focusing on what I have brings joy',
        emoji: '🌟',
        progress: 25,
        createdAt: new Date().toISOString()
      }
    };
  });

  const handleEditQuadrant = (pillar: VisionPillar, vision: UserVision) => {
    setSelectedPillar(pillar);
    setSelectedVision(vision);
    setShowEditor(true);
  };

  const handleSaveVision = (updatedVision: UserVision) => {
    setVisions(prev => ({
      ...prev,
      [updatedVision.pillarId]: updatedVision
    }));
  };

  const handleLinkGoal = (vision: UserVision) => {
    toast.success(`Creating goal from "${vision.title}"...`);
    // TODO: Navigate to goal creation with prefilled data
    setShowEditor(false);
  };

  const handleUnlinkGoal = (visionId: string) => {
    const vision = Object.values(visions).find(v => v.id === visionId);
    if (vision) {
      setVisions(prev => ({
        ...prev,
        [vision.pillarId]: {
          ...vision,
          linkedGoalId: undefined,
          linkedGoalTitle: undefined
        }
      }));
      toast.success('Goal unlinked');
    }
  };

  const handleSaveTheme = () => {
    setYearlyTheme(themeInput);
    setIsEditingTheme(false);
    toast.success('Theme updated!');
  };

  // Convert visions to dreams array for ShareVisionBoard
  const dreamsForShare = Object.values(visions)
    .filter(v => v.title)
    .map(v => ({
      id: v.id,
      title: v.title,
      why: v.why || '',
      emoji: v.emoji || '✨',
      category: v.pillarId,
      progress: v.progress,
      linkedGoalId: v.linkedGoalId,
      linkedGoalTitle: v.linkedGoalTitle,
      createdAt: v.createdAt
    }));

  // Get the 4 main pillars (2x2 grid) and the featured one (full width)
  const gridPillars = visionPillars.slice(0, 4);
  const featuredPillar = visionPillars[4]; // Purpose & Joy

  return (
    <LaunchLayout>
      {/* Vision Board Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neural-purple-100 via-brain-health-50 to-neural-blue-100 p-6 mb-6"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neural-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brain-health-200/40 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neural-purple-500" />
              <span className="text-sm font-medium text-neural-purple-600">My Vision Board</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {currentYear}
          </h1>
          
          {/* Editable Theme */}
          {isEditingTheme ? (
            <div className="flex items-center gap-2">
              <Input
                value={themeInput}
                onChange={(e) => setThemeInput(e.target.value)}
                className="max-w-xs bg-white/80"
                placeholder="Year of..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTheme();
                  if (e.key === 'Escape') setIsEditingTheme(false);
                }}
              />
              <Button size="sm" onClick={handleSaveTheme}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingTheme(false)}>Cancel</Button>
            </div>
          ) : (
            <button
              onClick={() => {
                setThemeInput(yearlyTheme);
                setIsEditingTheme(true);
              }}
              className="group flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Year of {yearlyTheme}</span>
              <Edit2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </motion.div>

      {/* 5-Pillar Grid */}
      <div className="space-y-4 mb-6">
        {/* 2x2 Grid for first 4 pillars */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {gridPillars.map((pillar, index) => (
            <VisionQuadrant
              key={pillar.id}
              pillar={pillar}
              vision={visions[pillar.id] || defaultVisions[pillar.id]}
              index={index}
              onEdit={handleEditQuadrant}
            />
          ))}
        </div>
        
        {/* Full Width Featured Pillar (Purpose & Joy) */}
        <VisionQuadrant
          pillar={featuredPillar}
          vision={visions[featuredPillar.id] || defaultVisions[featuredPillar.id]}
          index={4}
          isFullWidth
          onEdit={handleEditQuadrant}
        />
      </div>

      {/* Personal Affirmation */}
      <PersonalAffirmation
        affirmation={personalAffirmation}
        onAffirmationChange={setPersonalAffirmation}
      />

      {/* Bottom Spacing for Navigation */}
      <div className="h-24" />

      {/* Quadrant Editor Modal */}
      <QuadrantEditor
        open={showEditor}
        onClose={() => setShowEditor(false)}
        pillar={selectedPillar}
        vision={selectedVision}
        onSave={handleSaveVision}
        onLinkGoal={handleLinkGoal}
        onUnlinkGoal={handleUnlinkGoal}
      />

      {/* Share/Export Modal */}
      <ShareVisionBoard
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        dreams={dreamsForShare}
        yearlyTheme={yearlyTheme}
        affirmation={personalAffirmation}
      />
    </LaunchLayout>
  );
}
