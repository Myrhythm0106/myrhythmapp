
import { toast } from "sonner";
import { useSubscription } from "@/contexts/SubscriptionContext";

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export const usePaymentHandlers = (
  setPaymentCompleted: (completed: boolean) => void,
  setCurrentStep: (step: FlowStep) => void,
  triggerEncouragement: (type: string, data: any) => void,
  assessmentResult: any
) => {
  const { createCheckoutSession } = useSubscription();

  const handlePaymentSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    setCurrentStep("payment");
  };

  const handlePaymentOption = async (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly') => {
    console.log("Processing real payment option:", option);
    
    try {
      toast.info("Redirecting to secure payment...", {
        duration: 3000
      });

      let planType: 'premium' = 'premium'; // Default to premium for all options
      let billingPeriod: 'monthly' | 'annual' = 'monthly';

      // Map payment options to Stripe parameters
      switch (option) {
        case 'trial':
          // Trial with monthly billing after 7 days
          planType = 'premium';
          billingPeriod = 'monthly';
          break;
        case 'skip-trial-monthly':
          // Direct monthly payment
          planType = 'premium';
          billingPeriod = 'monthly';
          break;
        case 'annual':
          // Direct annual payment
          planType = 'premium';
          billingPeriod = 'annual';
          break;
        default:
          planType = 'premium';
          billingPeriod = 'monthly';
      }

      console.log("Creating Stripe checkout session:", { planType, billingPeriod });

      // Create real Stripe checkout session
      const checkoutUrl = await createCheckoutSession(planType, billingPeriod);
      
      if (!checkoutUrl) {
        throw new Error("Failed to create checkout session");
      }

      console.log("Redirecting to Stripe checkout:", checkoutUrl);
      
      // Store payment attempt for tracking
      localStorage.setItem("myrhythm_payment_attempt", JSON.stringify({
        option,
        planType,
        billingPeriod,
        timestamp: new Date().toISOString(),
        assessmentResult
      }));

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error("Payment processing error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown payment error";
      
      toast.error("Payment setup failed", {
        description: errorMessage.includes('authentication') 
          ? "Please log in to continue with payment" 
          : "Unable to process payment. Please try again.",
        duration: 5000
      });

      // If authentication error, redirect to login
      if (errorMessage.includes('authentication')) {
        setTimeout(() => {
          window.location.href = '/auth';
        }, 2000);
      }
    }
  };

  return { handlePaymentSelect, handlePaymentOption };
};
