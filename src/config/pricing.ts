// Pricing configuration with founding member discount support
export interface PlanPricing {
  id: 'starter' | 'smart_pro' | 'family_smart';
  name: string;
  monthlyPrice: number; // in pounds
  yearlyPrice: number; // in pounds  
  monthlyPricePence: number; // for Stripe
  yearlyPricePence: number; // for Stripe
}

export const basePricing: PlanPricing[] = [
  {
    id: 'starter',
    name: 'MyStarter', 
    monthlyPrice: 7.00,
    yearlyPrice: 70.00,
    monthlyPricePence: 700,
    yearlyPricePence: 7000
  },
  {
    id: 'smart_pro',
    name: 'MyStretch',
    monthlyPrice: 13.00,
    yearlyPrice: 130.00,
    monthlyPricePence: 1300,
    yearlyPricePence: 13000
  },
  {
    id: 'family_smart',
    name: 'MyLeap',
    monthlyPrice: 20.00,
    yearlyPrice: 200.00,
    monthlyPricePence: 2000,
    yearlyPricePence: 20000
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