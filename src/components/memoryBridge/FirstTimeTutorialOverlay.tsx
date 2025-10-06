import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Sparkles } from 'lucide-react';

interface FirstTimeTutorialOverlayProps {
  onStart: () => void;
  onSkip: () => void;
}

export function FirstTimeTutorialOverlay({ onStart, onSkip }: FirstTimeTutorialOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" onClick={onSkip} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg max-w-2xl w-full p-8 shadow-lg border border-brain-health-200">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-brain-health-600 rounded-lg flex items-center justify-center mx-auto">
            <Mic className="w-10 h-10 text-white" />
          </div>
          
          {/* Heading */}
          <h2 className="text-title font-bold text-foreground">
            Ready to capture your first conversation?
          </h2>
          
          {/* Body */}
          <p className="text-body-lg text-muted-foreground max-w-lg mx-auto">
            Just tap the microphone and speak naturally. We'll handle the rest—extracting action items, 
            scheduling suggestions, and keeping you on track.
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 py-4">
            <div className="text-center space-y-2">
              <Sparkles className="w-6 h-6 text-brain-health-600 mx-auto" />
              <p className="text-body text-foreground font-medium">AI Extraction</p>
              <p className="text-caption text-muted-foreground">Automatic action item detection</p>
            </div>
            <div className="text-center space-y-2">
              <Sparkles className="w-6 h-6 text-brain-health-600 mx-auto" />
              <p className="text-body text-foreground font-medium">Smart Scheduling</p>
              <p className="text-caption text-muted-foreground">Optimal time suggestions</p>
            </div>
            <div className="text-center space-y-2">
              <Sparkles className="w-6 h-6 text-brain-health-600 mx-auto" />
              <p className="text-body text-foreground font-medium">One-Click Calendar</p>
              <p className="text-caption text-muted-foreground">Instant calendar integration</p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={onStart}
              size="lg"
              variant="premium"
              className="min-w-[250px]"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </Button>
            
            <div>
              <Button
                onClick={onSkip}
                variant="ghost"
                size="sm"
                className="text-caption text-muted-foreground"
              >
                Skip Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}