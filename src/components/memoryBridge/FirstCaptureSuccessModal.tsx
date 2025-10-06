import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Target, Calendar, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FirstCaptureSuccessModalProps {
  results: {
    actionCount: number;
    appointmentCount: number;
    suggestionCount: number;
  };
  onViewSuggestions: () => void;
  onClose: () => void;
}

export function FirstCaptureSuccessModal({ results, onViewSuggestions, onClose }: FirstCaptureSuccessModalProps) {
  useEffect(() => {
    // Subtle confetti
    const colors = ['#059669', '#0891b2', '#0d9488'];
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: colors,
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg max-w-lg w-full shadow-lg border border-brain-health-200">
        <div className="p-8 space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-16 h-16 bg-brain-health-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-display-md font-bold text-foreground mb-2">
              First Capture Complete
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Your first memory is captured and processed
            </p>
          </div>

          {/* Results Summary */}
          <div className="space-y-3">
            <Card className="border-brain-health-200 bg-brain-health-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-brain-health-600" />
                    <span className="text-body font-medium">Action Items Extracted</span>
                  </div>
                  <div className="text-display-md font-bold text-brain-health-900">
                    {results.actionCount}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brain-health-200 bg-brain-health-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-brain-health-600" />
                    <span className="text-body font-medium">Appointments Found</span>
                  </div>
                  <div className="text-display-md font-bold text-brain-health-900">
                    {results.appointmentCount}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-brain-health-200 bg-brain-health-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-brain-health-600" />
                    <span className="text-body font-medium">Scheduling Suggestions</span>
                  </div>
                  <div className="text-display-md font-bold text-brain-health-900">
                    {results.suggestionCount}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button
              onClick={onViewSuggestions}
              size="lg"
              variant="premium"
              className="w-full"
            >
              View Smart Schedule Suggestions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Continue Exploring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}