import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { Plus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisionBoardHeader } from '@/components/launch/vision/VisionBoardHeader';
import { DreamCard, Dream } from '@/components/launch/vision/DreamCard';
import { PersonalAffirmation } from '@/components/launch/vision/PersonalAffirmation';
import { DreamCreator } from '@/components/launch/vision/DreamCreator';
import { JourneyView } from '@/components/launch/vision/JourneyView';
import { ShareVisionBoard } from '@/components/launch/vision/ShareVisionBoard';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function LaunchGoals() {
  const [yearlyTheme, setYearlyTheme] = useState('Growth & Wellness');
  const [personalAffirmation, setPersonalAffirmation] = useState('I am capable of achieving everything I set my mind to.');
  const [showDreamCreator, setShowDreamCreator] = useState(false);
  const [creatorMode, setCreatorMode] = useState<'quick' | 'guided'>('quick');
  const [showJourneyView, setShowJourneyView] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const [dreams, setDreams] = useState<Dream[]>([
    {
      id: '1',
      title: 'Feel Stronger and Healthier',
      why: 'Because I want to be there for my family and feel energized every day',
      affirmation: 'Every healthy choice makes me stronger',
      emoji: '💪',
      category: 'health',
      progress: 65,
      linkedGoalId: 'goal-1',
      linkedGoalTitle: 'Improve my fitness',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Practice Daily Gratitude',
      why: 'Because focusing on what I have brings more joy to my life',
      emoji: '🙏',
      category: 'wellbeing',
      progress: 40,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Build Stronger Relationships',
      why: 'Because meaningful connections are what life is about',
      emoji: '❤️',
      category: 'relationships',
      progress: 33,
      createdAt: new Date().toISOString()
    },
  ]);

  const handleCreateDream = (newDream: {
    title: string;
    why: string;
    affirmation: string;
    emoji: string;
    category: string;
    imageUrl?: string;
  }) => {
    const dream: Dream = {
      id: uuidv4(),
      ...newDream,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    setDreams(prev => [dream, ...prev]);
    toast.success('Dream added to your Vision Board!');
  };

  const handleEditDream = (dream: Dream) => {
    setSelectedDream(dream);
    toast.info('Edit functionality coming soon');
  };

  const handleDeleteDream = (dreamId: string) => {
    setDreams(prev => prev.filter(d => d.id !== dreamId));
    toast.success('Dream removed');
  };

  const handleLinkGoal = (dream: Dream) => {
    toast.success(`Creating goal from "${dream.title}"...`);
    // TODO: Navigate to goal creation with prefilled data
  };

  const handleUnlinkGoal = (dreamId: string) => {
    setDreams(prev => prev.map(d => 
      d.id === dreamId ? { ...d, linkedGoalId: undefined, linkedGoalTitle: undefined } : d
    ));
    toast.success('Goal unlinked');
  };

  const handleViewJourney = (dream: Dream) => {
    setSelectedDream(dream);
    setShowJourneyView(true);
  };

  const openCreator = (mode: 'quick' | 'guided') => {
    setCreatorMode(mode);
    setShowDreamCreator(true);
  };

  return (
    <LaunchLayout>
      {/* Vision Board Header */}
      <VisionBoardHeader
        yearlyTheme={yearlyTheme}
        onThemeChange={setYearlyTheme}
        onExportWallpaper={() => setShowShareModal(true)}
      />

      {/* Dreams List */}
      {dreams.length > 0 ? (
        <div className="space-y-4 mb-6">
          {dreams.map((dream, index) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              index={index}
              onEdit={handleEditDream}
              onDelete={handleDeleteDream}
              onLinkGoal={handleLinkGoal}
              onUnlinkGoal={handleUnlinkGoal}
              onViewJourney={handleViewJourney}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-muted/30 rounded-2xl border-2 border-dashed border-border mb-6">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start Your Vision Board
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            Add your dreams and watch them become goals, then daily actions.
          </p>
        </div>
      )}

      {/* Personal Affirmation */}
      <PersonalAffirmation
        affirmation={personalAffirmation}
        onAffirmationChange={setPersonalAffirmation}
      />

      {/* Add Dream Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-24">
        <Button
          onClick={() => openCreator('quick')}
          className="h-14 bg-gradient-to-r from-neural-purple-500 to-brain-health-500 hover:from-neural-purple-600 hover:to-brain-health-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Dream
        </Button>
        <Button
          onClick={() => openCreator('guided')}
          variant="outline"
          className="h-14 border-2 border-brain-health-300 hover:bg-brain-health-50"
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          Help Me Discover
        </Button>
      </div>

      {/* Modals */}
      <DreamCreator
        open={showDreamCreator}
        onClose={() => setShowDreamCreator(false)}
        onCreateDream={handleCreateDream}
        mode={creatorMode}
      />

      <JourneyView
        open={showJourneyView}
        onClose={() => setShowJourneyView(false)}
        dream={selectedDream}
        linkedGoal={selectedDream?.linkedGoalId ? {
          id: selectedDream.linkedGoalId,
          title: selectedDream.linkedGoalTitle || 'Linked Goal',
          progress: selectedDream.progress,
          actions: [
            { id: '1', title: 'Morning exercise', completed: true },
            { id: '2', title: 'Healthy lunch', completed: false },
          ]
        } : undefined}
      />

      <ShareVisionBoard
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        dreams={dreams}
        yearlyTheme={yearlyTheme}
        affirmation={personalAffirmation}
      />
    </LaunchLayout>
  );
}
