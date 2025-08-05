import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Crown, Users, Shield, Mic, Brain, TrendingUp, Heart } from 'lucide-react';

interface RecordingLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUsage: number;
}

export function RecordingLimitDialog({ open, onOpenChange, currentUsage }: RecordingLimitDialogProps) {
  const { tier, features, updateSubscription } = useSubscription();

  const handleUpgrade = (newTier: 'premium' | 'family') => {
    updateSubscription(newTier);
    onOpenChange(false);
  };

  const plans = [
    {
      id: 'premium',
      name: 'MyRhythm Flow',
      price: '£9.99/month',
      icon: Crown,
      color: 'from-purple-500 to-blue-500',
      recordings: 20,
      features: [
        '20 recordings per month',
        'Advanced AI analysis',
        '30-day retention',
        'Family sharing',
        'Caregiver alerts'
      ]
    },
    {
      id: 'family',
      name: 'MyRhythm Thrive',
      price: '£19.99/month',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      recordings: 'Unlimited',
      features: [
        'Unlimited recordings',
        'Professional AI analysis',
        '90-day retention',
        'Healthcare reports',
        'Trust metrics dashboard'
      ]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Mic className="h-6 w-6 text-memory-emerald" />
            Recording Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Usage */}
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-800">
                  <Brain className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    You've used {currentUsage} of {features.monthlyRecordings} recordings this month
                  </h3>
                  <p className="text-orange-600 dark:text-orange-300">
                    Upgrade to continue capturing important conversations and building trust
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emotional Value Proposition */}
          <Card className="border-memory-emerald/20 bg-gradient-to-r from-memory-emerald/10 to-brain-health/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Heart className="h-12 w-12 mx-auto text-memory-emerald" />
                <h3 className="text-xl font-bold">Never Miss Another Promise</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Every conversation matters. Don't let important commitments slip through the cracks. 
                  Upgrade to keep building trust with your loved ones and maintain your relationship integrity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Options */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.id} className="relative overflow-hidden border-2 hover:border-memory-emerald/50 transition-colors">
                  <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-5`} />
                  <CardContent className="pt-6 relative">
                    <div className="text-center space-y-4">
                      <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${plan.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <span className="text-2xl font-bold text-memory-emerald">{plan.price}</span>
                          <Badge variant="secondary">7-day free trial</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-memory-emerald" />
                          <span className="font-semibold">{plan.recordings} recordings/month</span>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-memory-emerald" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleUpgrade(plan.id as 'premium' | 'family')}
                        className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                      >
                        Upgrade to {plan.name}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trust & Family Message */}
          <Card className="border-heart-warm/20 bg-heart-warm/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 mx-auto text-heart-warm" />
                <h4 className="font-semibold text-heart-warm">Relationship Insurance</h4>
                <p className="text-sm text-muted-foreground">
                  Think of this as insurance for your most important relationships. 
                  Never let a forgotten promise damage the trust you've built.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}