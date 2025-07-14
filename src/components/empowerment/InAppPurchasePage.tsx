
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Star, 
  Check, 
  Zap, 
  Heart, 
  Users, 
  Brain,
  Sparkles,
  Lock,
  Unlock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  billing: string;
  description: string;
  features: string[];
  statementCount: number;
  icon: React.ReactNode;
  gradient: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter (Free)',
    price: '£0',
    billing: 'Forever',
    description: 'Perfect for beginning your empowerment journey',
    features: [
      '60 carefully curated #IChoose statements',
      'Basic daily empowerment experience',
      'Statement favorites and sharing',
      'Progress tracking and streaks',
      'Community access'
    ],
    statementCount: 60,
    icon: <Sparkles className="h-6 w-6" />,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    id: 'premium',
    name: 'Premium Individual',
    price: '£9.99',
    billing: 'per month',
    description: 'Unlock your full empowerment potential',
    features: [
      '700+ premium #IChoose statements',
      'Personalized statement selection AI',
      'Mood-based empowerment matching',
      'Advanced reflection and journaling',
      'Achievement badges and milestones',
      'Priority customer support',
      'Offline access to all content'
    ],
    statementCount: 760,
    icon: <Crown className="h-6 w-6" />,
    gradient: 'from-purple-500 to-blue-600',
    popular: true
  },
  {
    id: 'family',
    name: 'Family Circle',
    price: '£15.99',
    billing: 'per month',
    description: 'Empowerment for your entire support network',
    features: [
      'Everything in Premium Individual',
      '300+ family-focused statements',
      'Caregiver empowerment content',
      'Support circle collaboration tools',
      'Family progress dashboard',
      'Shared reflection spaces',
      'Up to 6 family member accounts'
    ],
    statementCount: 1000,
    icon: <Users className="h-6 w-6" />,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'clinical',
    name: 'Clinical Partnership',
    price: 'Custom',
    billing: 'Contact us',
    description: 'Professional-grade empowerment for healthcare providers',
    features: [
      'All premium features included',
      'Clinical dashboard and analytics',
      'Patient progress monitoring',
      'Custom statement libraries',
      'Healthcare team collaboration',
      'HIPAA-compliant data handling',
      'Dedicated account management'
    ],
    statementCount: 1000,
    icon: <Brain className="h-6 w-6" />,
    gradient: 'from-indigo-500 to-purple-600',
    comingSoon: true
  }
];

export function InAppPurchasePage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (tierId: string) => {
    if (tierId === 'starter') {
      toast.info('You\'re already enjoying our free tier!');
      return;
    }

    if (tierId === 'clinical') {
      toast.info('Please contact our sales team for clinical partnerships');
      return;
    }

    setSelectedTier(tierId);
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedTier(null);
      toast.success('Upgrade successful! Welcome to premium empowerment!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Unlock Your Full Empowerment Potential
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the perfect plan to accelerate your cognitive wellness journey with thousands of personalized #IChoose statements
            </p>
          </motion.div>

          {/* Feature Highlight */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-white/50 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Why Premium Empowerment Matters
              </h3>
            </div>
            <p className="text-gray-600">
              Our premium statements are crafted by cognitive wellness experts and tailored to your specific journey stage, 
              mood, and goals. Experience deeper transformation with content that evolves with you.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`h-full ${tier.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''} ${tier.comingSoon ? 'opacity-75' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                {tier.comingSoon && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="outline" className="bg-white">
                      Coming Soon
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${tier.gradient} text-white mb-4 mx-auto`}>
                    {tier.icon}
                  </div>
                  
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-gray-900">
                      {tier.price}
                    </div>
                    <div className="text-sm text-gray-600">{tier.billing}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Statement Count Highlight */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {tier.statementCount.toLocaleString()}+
                    </div>
                    <div className="text-xs text-gray-600">#IChoose Statements</div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button
                    onClick={() => handlePurchase(tier.id)}
                    disabled={isProcessing && selectedTier === tier.id}
                    className={`w-full mt-6 ${
                      tier.id === 'starter' 
                        ? 'bg-gray-500 hover:bg-gray-600' 
                        : `bg-gradient-to-r ${tier.gradient} hover:opacity-90`
                    }`}
                  >
                    {isProcessing && selectedTier === tier.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {tier.id === 'starter' ? (
                          <>
                            <Check className="h-4 w-4" />
                            Current Plan
                          </>
                        ) : tier.comingSoon ? (
                          <>
                            <Lock className="h-4 w-4" />
                            Notify Me
                          </>
                        ) : tier.id === 'clinical' ? (
                          <>
                            <Brain className="h-4 w-4" />
                            Contact Sales
                          </>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4" />
                            Upgrade Now
                          </>
                        )}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                  Changes take effect at your next billing cycle.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What makes premium statements different?</h4>
                <p className="text-gray-600 text-sm">
                  Premium statements are personalized to your journey stage, include advanced features like mood matching, 
                  and are crafted by cognitive wellness experts.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Is there a free trial?</h4>
                <p className="text-gray-600 text-sm">
                  Your first 60 statements are completely free! This gives you a full month to experience 
                  the power of daily empowerment before deciding to upgrade.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">How does Family Circle work?</h4>
                <p className="text-gray-600 text-sm">
                  Family Circle includes up to 6 accounts, specialized caregiver content, 
                  and tools for your support network to collaborate in your wellness journey.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Loved by 10,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            Your empowerment journey is personal and secure. We never share your data, 
            and you can export or delete your information anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
