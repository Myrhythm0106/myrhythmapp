import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Sparkles, TrendingUp, Users, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DailyLimitReachedModalProps {
  open: boolean;
  onClose: () => void;
  hoursUntilReset: number;
  minutesUntilReset: number;
}

export function DailyLimitReachedModal({ 
  open, 
  onClose, 
  hoursUntilReset, 
  minutesUntilReset 
}: DailyLimitReachedModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/subscribe');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-orange-600" />
            Daily Recording Limit Reached
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You've used all <strong>30 minutes</strong> of recording time today on the Free plan.
          </p>
          
          {/* Countdown to next day */}
          <Card className="bg-muted/50 border-orange-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-sm text-muted-foreground mb-1">
                  Your recording time will reset in:
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {hoursUntilReset}h {minutesUntilReset}m
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Upgrade benefits */}
          <div className="border rounded-lg p-4 bg-gradient-to-br from-neural-magenta-50 to-clarity-teal-50">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-neural-magenta-600" />
              <h4 className="font-semibold text-neural-magenta-900">Upgrade to Unlimited Recording</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-neural-magenta-600 flex-shrink-0" />
                <span><strong>Unlimited daily recording time</strong> - no more restrictions</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-brain-health-600 flex-shrink-0" />
                <span><strong>Record up to 3 hours per session</strong> for long meetings</span>
              </li>
              <li className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 text-clarity-teal-600 flex-shrink-0" />
                <span><strong>Permanent storage</strong> - no 7-day deletion</span>
              </li>
              <li className="flex items-start gap-2">
                <Users className="h-4 w-4 mt-0.5 text-brand-orange-600 flex-shrink-0" />
                <span><strong>Support Circle with up to 5 members</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-sunrise-amber-600 flex-shrink-0" />
                <span><strong>Full ACT reports</strong> with all insights and scheduling</span>
              </li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleUpgrade} 
              className="flex-1 bg-gradient-to-r from-neural-magenta-500 to-clarity-teal-500 hover:from-neural-magenta-600 hover:to-clarity-teal-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Wait Until Tomorrow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
