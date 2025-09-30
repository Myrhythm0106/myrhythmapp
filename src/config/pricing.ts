// Starter Pricing Strategy configuration with freemium model
export interface PlanPricing {
  id: 'free' | 'reconnect' | 'thrive' | 'family' | 'clinic_starter' | 'clinic_pro' | 'clinic_enterprise';
  name: string;
  monthlyPrice: number; // in pounds
  yearlyPrice: number; // in pounds  
  monthlyPricePence: number; // for Stripe
  yearlyPricePence: number; // for Stripe
  category: 'individual' | 'clinical';
  features: string[];
  limits: {
    recordings: number; // -1 for unlimited
    supportCircle: number; // -1 for unlimited
    calendarIntegration: boolean;
    medicalReports: boolean;
    familySharing: boolean;
  };
}

export const basePricing: PlanPricing[] = [
  // Individual Plans
  {
    id: 'free',
    name: 'MyMemory',
    monthlyPrice: 0.00,
    yearlyPrice: 0.00,
    monthlyPricePence: 0,
    yearlyPricePence: 0,
    category: 'individual',
    features: [
      'Basic MYRHYTHM assessment',
      '3 conversation recordings per month',
      'Basic Next Step Summary',
      'Personal calendar integration',
      '1 support circle member'
    ],
    limits: {
      recordings: 3,
      supportCircle: 1,
      calendarIntegration: true,
      medicalReports: false,
      familySharing: false
    }
  },
  {
    id: 'reconnect',
    name: 'MyStarter',
    monthlyPrice: 7.00,
    yearlyPrice: 70.00,
    monthlyPricePence: 700,
    yearlyPricePence: 7000,
    category: 'individual',
    features: [
      'Detailed MYRHYTHM analysis',
      'Unlimited conversation recordings',
      'Advanced Next Step Summary & scheduling',
      'Full calendar integration',
      'Up to 3 support circle members',
      'Basic progress reports'
    ],
    limits: {
      recordings: -1,
      supportCircle: 3,
      calendarIntegration: true,
      medicalReports: false,
      familySharing: false
    }
  },
  {
    id: 'thrive',
    name: 'MyStretch',
    monthlyPrice: 13.00,
    yearlyPrice: 130.00,
    monthlyPricePence: 1300,
    yearlyPricePence: 13000,
    category: 'individual',
    features: [
      'Everything in MyReconnect',
      'Medical-grade progress reports',
      'Healthcare team integration',
      'Up to 5 support circle members',
      'Priority support',
      'Advanced analytics'
    ],
    limits: {
      recordings: -1,
      supportCircle: 5,
      calendarIntegration: true,
      medicalReports: true,
      familySharing: false
    }
  },
  {
    id: 'family',
    name: 'MyLeap',
    monthlyPrice: 20.00,
    yearlyPrice: 200.00,
    monthlyPricePence: 2000,
    yearlyPricePence: 20000,
    category: 'individual',
    features: [
      'Everything in MyThrive',
      'Family sharing & coordination',
      'Unlimited support circle members',
      'Multi-user dashboard',
      'Family progress tracking',
      'Caregiver peace-of-mind features'
    ],
    limits: {
      recordings: -1,
      supportCircle: -1,
      calendarIntegration: true,
      medicalReports: true,
      familySharing: true
    }
  },
  // Clinical Plans
  {
    id: 'clinic_starter',
    name: 'Clinic Starter',
    monthlyPrice: 200.00,
    yearlyPrice: 2000.00,
    monthlyPricePence: 20000,
    yearlyPricePence: 200000,
    category: 'clinical',
    features: [
      'Up to 25 patient licenses',
      'Clinical dashboard & analytics',
      'Bulk MYRHYTHM assessments',
      'Basic outcome tracking',
      'Standard support'
    ],
    limits: {
      recordings: -1,
      supportCircle: -1,
      calendarIntegration: true,
      medicalReports: true,
      familySharing: true
    }
  },
  {
    id: 'clinic_pro',
    name: 'Clinic Professional',
    monthlyPrice: 500.00,
    yearlyPrice: 5000.00,
    monthlyPricePence: 50000,
    yearlyPricePence: 500000,
    category: 'clinical',
    features: [
      'Up to 100 patient licenses',
      'Advanced clinical analytics',
      'Custom outcome measures',
      'API integration',
      'Priority clinical support',
      'White-label options'
    ],
    limits: {
      recordings: -1,
      supportCircle: -1,
      calendarIntegration: true,
      medicalReports: true,
      familySharing: true
    }
  },
  {
    id: 'clinic_enterprise',
    name: 'Healthcare Enterprise',
    monthlyPrice: 1000.00,
    yearlyPrice: 10000.00,
    monthlyPricePence: 100000,
    yearlyPricePence: 1000000,
    category: 'clinical',
    features: [
      'Unlimited patient licenses',
      'Full enterprise integration',
      'Custom development',
      'Dedicated account manager',
      'SLA guarantees',
      'Complete white-labeling'
    ],
    limits: {
      recordings: -1,
      supportCircle: -1,
      calendarIntegration: true,
      medicalReports: true,
      familySharing: true
    }
  }
];

// Founding member configuration - ACTIVE by default for launch
export const foundingMemberConfig = {
  enabled: true, // Always enabled for launch
  discountPercent: 0, // No additional discount - prices are already introductory
  endDate: null, // No end date yet - will be set after 1,000 users
  badge: 'Founding Member',
  tagline: 'Limited Time: First 1,000 Users Only',
  maxUsers: 1000,
  nextPricing: {
    reconnect: { monthly: 39.00, yearly: 390.00 },
    thrive: { monthly: 79.00, yearly: 790.00 },
    family: { monthly: 199.00, yearly: 1990.00 }
  }
};

export function getDiscountedPrice(basePrice: number, discountPercent: number): number {
  return Math.floor(basePrice * (1 - discountPercent / 100) * 100) / 100;
}

export function getDiscountedPricePence(basePricePence: number, discountPercent: number): number {
  return Math.floor(basePricePence * (1 - discountPercent / 100));
}

export function isFoundingMemberActive(): boolean {
  if (!foundingMemberConfig.enabled) return false;
  
  if (foundingMemberConfig.endDate) {
    const endDate = new Date(foundingMemberConfig.endDate);
    const now = new Date();
    return now <= endDate;
  }
  
  return true;
}

export function getPricingWithDiscount(plan: PlanPricing, isYearly: boolean) {
  const isFoundingActive = isFoundingMemberActive();
  const discountPercent = foundingMemberConfig.discountPercent;
  
  const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const basePricePence = isYearly ? plan.yearlyPricePence : plan.monthlyPricePence;
  
  // Get next pricing from config
  let nextPrice = null;
  let nextPricePence = null;
  if (plan.id === 'reconnect' && foundingMemberConfig.nextPricing.reconnect) {
    nextPrice = isYearly ? foundingMemberConfig.nextPricing.reconnect.yearly : foundingMemberConfig.nextPricing.reconnect.monthly;
    nextPricePence = nextPrice * 100;
  } else if (plan.id === 'thrive' && foundingMemberConfig.nextPricing.thrive) {
    nextPrice = isYearly ? foundingMemberConfig.nextPricing.thrive.yearly : foundingMemberConfig.nextPricing.thrive.monthly;
    nextPricePence = nextPrice * 100;
  } else if (plan.id === 'family' && foundingMemberConfig.nextPricing.family) {
    nextPrice = isYearly ? foundingMemberConfig.nextPricing.family.yearly : foundingMemberConfig.nextPricing.family.monthly;
    nextPricePence = nextPrice * 100;
  }
  
  if (isFoundingActive) {
    return {
      originalPrice: basePrice,
      discountedPrice: getDiscountedPrice(basePrice, discountPercent),
      originalPricePence: basePricePence,
      discountedPricePence: getDiscountedPricePence(basePricePence, discountPercent),
      hasDiscount: true,
      discountPercent,
      badge: foundingMemberConfig.badge,
      nextPrice,
      nextPricePence,
      savings: nextPrice ? nextPrice - getDiscountedPrice(basePrice, discountPercent) : 0
    };
  }
  
  return {
    originalPrice: basePrice,
    discountedPrice: basePrice,
    originalPricePence: basePricePence,
    discountedPricePence: basePricePence,
    hasDiscount: false,
    discountPercent: 0,
    badge: null,
    nextPrice: null,
    nextPricePence: null,
    savings: 0
  };
}