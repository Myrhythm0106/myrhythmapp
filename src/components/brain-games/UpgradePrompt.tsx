import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Users, Sparkles, Brain, Target } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UpgradePromptProps {
  feature?: 'game' | 'difficulty' | 'daily_limit' | 'analytics' | 'personalized';
  gameId?: string;
  difficulty?: 'Low' | 'Medium' | 'High';
  requiredTier?: 'starter' | 'smart_pro' | 'family_smart';
  title?: string;
  description?: string;
  className?: string;
}

export function UpgradePrompt({ 
  feature = 'game',
  gameId,
  difficulty,
  requiredTier = 'starter',
  title,
  description,
  className = ""
}: UpgradePromptProps) {
  const { tier, updateSubscription } = useSubscription();

  const tierInfo = {
    starter: { 
      icon: Brain, 
      name: 'Starter', 
      color: 'bg-blue-100 text-blue-800',
      price: '$9.99/mo'
    },
    smart_pro: { 
      icon: Crown, 
      name: 'SMART Pro', 
      color: 'bg-yellow-100 text-yellow-800',
      price: '$19.99/mo'
    },
    family_smart: { 
      icon: Users, 
      name: 'Family SMART', 
      color: 'bg-purple-100 text-purple-800',
      price: '$29.99/mo'
    }
  };

  const info = tierInfo[requiredTier];
  const Icon = info.icon;

  const getFeatureContent = () => {
    switch (feature) {
      case 'game':
        if (gameId === 'matching') {
          return {
            title: 'Unlock Matching Games',
            description: 'Access concentration and memory matching games with Starter subscription.',
            benefits: ['Memory matching games', 'Pattern recognition training', 'Enhanced difficulty levels']
          };
        }
        if (gameId === 'spatial') {
          return {
            title: 'Unlock Spatial Memory',
            description: 'Master spatial reasoning and navigation with SMART Pro subscription.',
            benefits: ['Advanced spatial games', 'Navigation challenges', '3D memory training']
          };
        }
        return {
          title: 'Unlock Advanced Games',
          description: 'Access more brain training games with a premium subscription.',
          benefits: ['More game types', 'Advanced challenges', 'Personalized training']
        };
        
      case 'difficulty':
        if (difficulty === 'Medium') {
          return {
            title: 'Unlock Medium Difficulty',
            description: 'Challenge yourself with intermediate difficulty levels.',
            benefits: ['Medium difficulty games', 'Progressive challenges', 'Skill development']
          };
        }
        if (difficulty === 'High') {
          return {
            title: 'Unlock Expert Level',
            description: 'Master the highest difficulty challenges with SMART Pro.',
            benefits: ['Expert difficulty games', 'Maximum cognitive challenge', 'Elite performance tracking']
          };
        }
        break;
        
      case 'daily_limit':
        return {
          title: 'Remove Daily Limits',
          description: 'Play unlimited brain games every day with premium subscription.',
          benefits: ['Unlimited daily games', 'No waiting periods', 'Continuous training']
        };
        
      case 'analytics':
        return {
          title: 'Advanced Analytics',
          description: 'Get detailed insights into your cognitive performance.',
          benefits: ['Performance analytics', 'Progress tracking', 'Cognitive insights']
        };
        
      case 'personalized':
        return {
          title: 'Personalized Training',
          description: 'AI-powered training plans adapted to your cognitive profile.',
          benefits: ['Custom training plans', 'AI recommendations', 'Adaptive difficulty']
        };
    }
    
    return {
      title: title || 'Premium Feature',
      description: description || 'This feature requires a premium subscription.',
      benefits: ['Enhanced features', 'Better performance', 'Premium support']
    };
  };

  const content = getFeatureContent();

  const handleUpgrade = () => {
    // In a real app, this would redirect to billing/upgrade flow
    updateSubscription(requiredTier);
    console.log(`Upgrading to ${requiredTier}`);
  };

  return (
    <Card className={`border-dashed ${className}`}>
      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center mb-2">
          <div className="relative">
            <Lock className="h-8 w-8 text-muted-foreground" />
            <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
          </div>
        </div>
        <CardTitle className="text-lg">{content.title}</CardTitle>
        <Badge className={info.color}>
          <Icon className="h-3 w-3 mr-1" />
          {info.name} Required
        </Badge>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {content.description}
        </p>
        
        <div className="space-y-2">
          {content.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center text-sm text-left">
              <Target className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
              {benefit}
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade to {info.name}
            <span className="ml-2 text-xs opacity-80">{info.price}</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Current plan: {tier.charAt(0).toUpperCase() + tier.slice(1).replace('_', ' ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}