
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

  const handlePaymentSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly' | 'skip') => {
    setCurrentStep("payment");
  };

  const handlePaymentOption = async (option: 'trial' | 'monthly' | 'annual' | 'skip-trial-monthly' | 'skip') => {
    console.log("Processing payment option:", option);
    
    // Handle skip option immediately
    if (option === 'skip') {
      console.log("User chose to skip payment, proceeding to results");
      setPaymentCompleted(true);
      setCurrentStep("results");
      
      toast.success("Welcome to MyRhythm!", {
        description: "You can upgrade to premium features anytime from your dashboard.",
        duration: 4000
      });
      return;
    }
    
    try {
      toast.info("Redirecting to secure payment...", {
        duration: 3000
      });

      let planType: 'premium' = 'premium'; // Default to premium for all options
      let billingPeriod: 'monthly' | 'annual' = 'monthly';

      // Map payment options to Stripe parameters
      switch (option) {
        case 'trial':
          planType = 'premium';
          billingPeriod = 'monthly';
          break;
        case 'skip-trial-monthly':
          planType = 'premium';
          billingPeriod = 'monthly';
          break;
        case 'annual':
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
        description: "You can continue without payment and upgrade later.",
        duration: 5000,
        action: {
          label: "Continue Anyway",
          onClick: () => {
            console.log("User chose to continue anyway after payment error");
            setPaymentCompleted(true);
            setCurrentStep("results");
          }
        }
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
