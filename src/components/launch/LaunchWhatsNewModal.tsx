import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { releases, comingSoon, currentVersion } from '@/data/releaseNotes';
import { Sparkles, Star, Zap, Clock } from 'lucide-react';
import { LaunchCard } from './LaunchCard';

interface LaunchWhatsNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LaunchWhatsNewModal({ isOpen, onClose }: LaunchWhatsNewModalProps) {
  const latestRelease = releases[0];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Star className="h-4 w-4 text-amber-500" />;
      case 'improvement': return <Zap className="h-4 w-4 text-blue-500" />;
      default: return <Sparkles className="h-4 w-4 text-brand-emerald-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            What's New in MyRhythm
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Latest Release */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">{latestRelease.title}</h3>
              <span className="text-xs bg-brand-emerald-100 text-brand-emerald-700 px-2 py-1 rounded-full">
                v{latestRelease.version}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{latestRelease.description}</p>
            
            <div className="space-y-2">
              {latestRelease.features.map((feature) => (
                <div 
                  key={feature.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                >
                  {getTypeIcon(feature.type)}
                  <div>
                    <p className="font-medium text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          {comingSoon.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-400" />
                Coming Soon
              </h3>
              <div className="space-y-2">
                {comingSoon.slice(0, 3).map((feature) => (
                  <div 
                    key={feature.id}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-brand-emerald-50/30 rounded-xl border border-dashed border-gray-200"
                  >
                    <Sparkles className="h-4 w-4 text-brand-emerald-400" />
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
