
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Sparkles, Heart, TrendingUp, CheckCircle2, Zap } from "lucide-react";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";
import { getPremiumAffirmationsCount, getFreeAffirmationsCount } from "@/data/categoryAffirmations";

interface AffirmationUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: UserType;
  onUpgrade: () => void;
}

export function AffirmationUpgradeModal({ 
  isOpen, 
  onClose, 
  userType,
  onUpgrade 
}: AffirmationUpgradeModalProps) {
  const freeCount = getFreeAffirmationsCount(userType);
  const premiumCount = getPremiumAffirmationsCount(userType);

  const getCategoryTitle = (category: UserType): string => {
    const titles = {
      'brain-injury-recovery': 'Brain Injury Recovery',
      'cognitive-optimization': 'Cognitive Performance', 
      'caregiver-support': 'Caregiver Support',
      'wellness-productivity': 'Life Optimization'
    };
    return titles[category];
  };

  const getCategoryIcon = (category: UserType) => {
    const icons = {
      'brain-injury-recovery': <Heart className="h-6 w-6" />,
      'cognitive-optimization': <TrendingUp className="h-6 w-6" />,
      'caregiver-support': <Heart className="h-6 w-6" />,
      'wellness-productivity': <Sparkles className="h-6 w-6" />
    };
    return icons[category];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            Unlock Your Full Potential
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current category showcase */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/20 p-4 rounded-full">
                  {getCategoryIcon(userType)}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {getCategoryTitle(userType)} Affirmations
              </h3>
              <div className="flex justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{freeCount}</div>
                  <div className="text-sm text-muted-foreground">Free</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                    {premiumCount}+
                  </div>
                  <div className="text-sm text-muted-foreground">Premium</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized for your specific journey and goals
              </p>
            </CardContent>
          </Card>

          {/* Premium features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Premium Features
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>400+ category-specific affirmations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Mood-responsive selection</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Calendar integration</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Personal favorites tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Custom affirmation creator</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                Smart Features
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Automatic daily rotation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Progress milestone celebrations</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Streak tracking & rewards</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Voice affirmation playback</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Analytics & insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample premium affirmations preview */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Premium Affirmation Preview
              </h4>
              <blockquote className="italic text-amber-800 text-sm mb-2">
                "I celebrate every cognitive victory, no matter how small it seems to others. My brain is constantly rewiring itself for success and independence."
              </blockquote>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                  Mood: Great
                </Badge>
                <Badge variant="outline" className="text-xs text-amber-700 border-amber-300">
                  Category: Recovery
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Pricing and action */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="text-3xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <p className="text-sm text-muted-foreground">
                Unlock your personalized affirmation journey
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                onClick={onUpgrade}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Cancel anytime • 7-day free trial
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
