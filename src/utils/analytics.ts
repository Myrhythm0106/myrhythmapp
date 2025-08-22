import { useAnalytics } from '@/hooks/useAnalytics';

// Analytics utility for subscription events
export const subscriptionAnalytics = {
  planViewed: (plan: string, interval: 'monthly' | 'yearly', hasDiscount: boolean = false) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.plan_viewed',
      eventData: { 
        plan, 
        interval, 
        hasDiscount,
        timestamp: new Date().toISOString()
      }
    });
  },

  planSelected: (plan: string, interval: 'monthly' | 'yearly', hasDiscount: boolean = false) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.plan_selected',
      eventData: { 
        plan, 
        interval, 
        hasDiscount,
        timestamp: new Date().toISOString()
      }
    });
  },

  checkoutStarted: (plan: string, interval: 'monthly' | 'yearly', hasDiscount: boolean = false, discountPercent?: number) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.checkout_started',
      eventData: { 
        plan, 
        interval, 
        hasDiscount,
        discountPercent,
        timestamp: new Date().toISOString()
      }
    });
  },

  checkoutSuccess: (plan: string, interval: 'monthly' | 'yearly', hasDiscount: boolean = false, discountPercent?: number) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.checkout_success',
      eventData: { 
        plan, 
        interval, 
        hasDiscount,
        discountPercent,
        timestamp: new Date().toISOString()
      }
    });
  },

  discountApplied: (plan: string, interval: 'monthly' | 'yearly', discountPercent: number, discountType: string) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.discount_applied',
      eventData: { 
        plan, 
        interval, 
        discountPercent,
        discountType,
        timestamp: new Date().toISOString()
      }
    });
  },

  statusRefreshed: (tier: string, status: string) => {
    const { trackEvent } = useAnalytics();
    trackEvent({
      eventType: 'subscription.status_refreshed',
      eventData: { 
        tier, 
        status,
        timestamp: new Date().toISOString()
      }
    });
  }
};

export function trackSubscriptionAnalytics() {
  return subscriptionAnalytics;
}