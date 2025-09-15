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
      'Basic ACTS extraction',
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
    name: 'MyReconnect',
    monthlyPrice: 15.00,
    yearlyPrice: 150.00,
    monthlyPricePence: 1500,
    yearlyPricePence: 15000,
    category: 'individual',
    features: [
      'Detailed MYRHYTHM analysis',
      'Unlimited conversation recordings',
      'Advanced ACTS extraction & scheduling',
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
    name: 'MyThrive',
    monthlyPrice: 25.00,
    yearlyPrice: 250.00,
    monthlyPricePence: 2500,
    yearlyPricePence: 25000,
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
    name: 'MyFamily',
    monthlyPrice: 40.00,
    yearlyPrice: 400.00,
    monthlyPricePence: 4000,
    yearlyPricePence: 40000,
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

// Founding member configuration
export const foundingMemberConfig = {
  enabled: import.meta.env.VITE_FOUNDING_MEMBER_ENABLED === 'true' || false,
  discountPercent: parseInt(import.meta.env.VITE_FOUNDING_MEMBER_DISCOUNT_PERCENT || '20'),
  endDate: import.meta.env.VITE_FOUNDING_MEMBER_END_DATE || null, // format: YYYY-MM-DD
  badge: 'Founding Member',
  tagline: 'Limited Time Offer'
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
  
  if (isFoundingActive) {
    return {
      originalPrice: basePrice,
      discountedPrice: getDiscountedPrice(basePrice, discountPercent),
      originalPricePence: basePricePence,
      discountedPricePence: getDiscountedPricePence(basePricePence, discountPercent),
      hasDiscount: true,
      discountPercent,
      badge: foundingMemberConfig.badge
    };
  }
  
  return {
    originalPrice: basePrice,
    discountedPrice: basePrice,
    originalPricePence: basePricePence,
    discountedPricePence: basePricePence,
    hasDiscount: false,
    discountPercent: 0,
    badge: null
  };
}