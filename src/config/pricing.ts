// Simplified Single-Tier Pricing Strategy - December 2024
// MyRhythm Premium: £10/month (Founding Member) | £15/month (Regular)

export interface PlanPricing {
  id: 'free' | 'premium';
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPricePence: number;
  yearlyPricePence: number;
  features: string[];
  limits: {
    recordings: number;
    supportCircle: number;
    calendarIntegration: boolean;
    brainHealthReminders: boolean;
    dailyBrainBoost: boolean;
    leapAssessment: boolean;
  };
}

export const basePricing: PlanPricing[] = [
  {
    id: 'free',
    name: 'Free Trial',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyPricePence: 0,
    yearlyPricePence: 0,
    features: [
      '7-day free trial',
      'Full access to all features',
      'Memory Bridge recordings',
      'LEAP Assessment',
      'Brain Health Reminders',
      'Daily Brain Boost'
    ],
    limits: {
      recordings: -1,
      supportCircle: 5,
      calendarIntegration: true,
      brainHealthReminders: true,
      dailyBrainBoost: true,
      leapAssessment: true
    }
  },
  {
    id: 'premium',
    name: 'MyRhythm Premium',
    monthlyPrice: 10.00,
    yearlyPrice: 100.00,
    monthlyPricePence: 1000,
    yearlyPricePence: 10000,
    features: [
      'Unlimited Memory Bridge recordings',
      'Brain Health Reminders with escalation',
      'Daily Brain Boost (240+ challenges)',
      'Support Circle (5 members included)',
      'LEAP Assessment & Analytics',
      'Calendar Integration',
      'Progress Tracking & Reports',
      'Promise Score tracking',
      'Streak celebrations',
      'Priority support'
    ],
    limits: {
      recordings: -1,
      supportCircle: 5,
      calendarIntegration: true,
      brainHealthReminders: true,
      dailyBrainBoost: true,
      leapAssessment: true
    }
  }
];

// Founding Member Configuration
export const foundingMemberConfig = {
  enabled: true,
  currentPrice: {
    monthly: 10.00,
    yearly: 100.00,
    monthlyPence: 1000,
    yearlyPence: 10000
  },
  regularPrice: {
    monthly: 15.00,
    yearly: 150.00,
    monthlyPence: 1500,
    yearlyPence: 15000
  },
  badge: 'Founding Member',
  tagline: 'Lock in £10/month forever',
  maxUsers: 500,
  triggers: {
    userCount: 500,
    monthsAfterLaunch: 6,
    launchDate: '2024-12-01'
  },
  benefits: [
    'Lock in £10/month pricing forever',
    'Founding Member badge on profile',
    'Early access to new features',
    'Direct input on product roadmap',
    'Exclusive community access'
  ]
};

export function isFoundingMemberActive(): boolean {
  if (!foundingMemberConfig.enabled) return false;
  
  const launchDate = new Date(foundingMemberConfig.triggers.launchDate);
  const monthsAfterLaunch = foundingMemberConfig.triggers.monthsAfterLaunch;
  const endDate = new Date(launchDate);
  endDate.setMonth(endDate.getMonth() + monthsAfterLaunch);
  
  return new Date() < endDate;
}

export function getFoundingMemberSavings(): { monthly: number; yearly: number } {
  const { currentPrice, regularPrice } = foundingMemberConfig;
  return {
    monthly: regularPrice.monthly - currentPrice.monthly,
    yearly: regularPrice.yearly - currentPrice.yearly
  };
}

export function getPremiumPricing(isYearly: boolean = false) {
  const isFoundingActive = isFoundingMemberActive();
  const { currentPrice, regularPrice } = foundingMemberConfig;
  
  if (isFoundingActive) {
    return {
      price: isYearly ? currentPrice.yearly : currentPrice.monthly,
      pricePence: isYearly ? currentPrice.yearlyPence : currentPrice.monthlyPence,
      regularPrice: isYearly ? regularPrice.yearly : regularPrice.monthly,
      isFoundingMember: true,
      badge: foundingMemberConfig.badge,
      savings: isYearly 
        ? regularPrice.yearly - currentPrice.yearly 
        : regularPrice.monthly - currentPrice.monthly
    };
  }
  
  return {
    price: isYearly ? regularPrice.yearly : regularPrice.monthly,
    pricePence: isYearly ? regularPrice.yearlyPence : regularPrice.monthlyPence,
    regularPrice: null,
    isFoundingMember: false,
    badge: null,
    savings: 0
  };
}
