import React, { useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Heart, Plus, Share2, Calendar, X, Users, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function LaunchGratitude() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [whyGrateful, setWhyGrateful] = useState('');
  const [shareWithSupport, setShareWithSupport] = useState(false);

  const gratitudeEntries = [
    { id: '1', text: 'My morning coffee routine', why: 'It gives me a calm start', date: 'Today' },
    { id: '2', text: 'Phone call with Mom', why: 'Made me feel supported', date: 'Yesterday' },
    { id: '3', text: 'Completed my therapy session', why: 'I\'m making progress', date: '2 days ago' },
    { id: '4', text: 'Beautiful sunset walk', why: 'Fresh air helps me think', date: '3 days ago' },
  ];

  const handleSave = () => {
    if (gratitudeText.trim()) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      // Would save to database here
      setGratitudeText('');
      setWhyGrateful('');
      setShareWithSupport(false);
      setIsAddModalOpen(false);
    }
  };

  return (
    <LaunchLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gratitude</h1>
          <p className="text-gray-600">Celebrate what matters</p>
        </div>
        <div className="flex items-center gap-2 bg-rose-100 px-3 py-1.5 rounded-full">
          <Heart className="h-4 w-4 text-rose-500" />
          <span className="font-bold text-rose-600">12 this week</span>
        </div>
      </div>

      {/* Single Add Button - Brain Friendly! */}
      <LaunchCard 
        variant="featured" 
        className="mb-6 text-center py-8"
        onClick={() => setIsAddModalOpen(true)}
      >
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Plus className="h-8 w-8 text-white" />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-1">Add Gratitude</p>
        <p className="text-sm text-gray-600">What made you smile today?</p>
      </LaunchCard>

      {/* Recent Entries */}
      <h2 className="font-semibold text-gray-900 mb-3">Recent Gratitudes</h2>
      <div className="space-y-3 mb-24">
        {gratitudeEntries.map((entry) => (
          <LaunchCard key={entry.id} variant="glass" className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{entry.text}</p>
                {entry.why && (
                  <p className="text-sm text-gray-600 mt-1">"{entry.why}"</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
              </div>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => toast.info('Share with Support Circle coming soon!')}
              >
                <Share2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </LaunchCard>
        ))}
      </div>

      {/* Add Gratitude Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Heart className="h-5 w-5 text-rose-500" />
              Add Gratitude
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What are you grateful for?
              </label>
              <textarea
                value={gratitudeText}
                onChange={(e) => setGratitudeText(e.target.value)}
                placeholder="Something that made you smile..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[100px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                🧠 Why does this matter? <span className="text-rose-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Reflecting on "why" activates deeper brain pathways!
              </p>
              <textarea
                value={whyGrateful}
                onChange={(e) => setWhyGrateful(e.target.value)}
                placeholder="This made me feel..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 min-h-[80px]"
              />
            </div>

            {/* Share with Support Circle */}
            <button
              onClick={() => setShareWithSupport(!shareWithSupport)}
              className={cn(
                "w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-colors",
                shareWithSupport
                  ? "border-brand-emerald-500 bg-brand-emerald-50 text-brand-emerald-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              <Users className="h-4 w-4" />
              Share with Support Circle
            </button>

            <LaunchButton onClick={handleSave} className="w-full" disabled={!gratitudeText.trim() || !whyGrateful.trim()}>
              <Sparkles className="h-5 w-5" />
              Save Gratitude
            </LaunchButton>
          </div>
        </DialogContent>
      </Dialog>
    </LaunchLayout>
  );
}
