
import { toast } from "sonner";

type FlowStep = "teaser-preview" | "registration-prompt" | "payment" | "results" | "choice" | "user-guide" | "goal-creation" | "life-operating-model-setup" | "complete";

export const usePaymentHandlers = (
  setPaymentCompleted: (completed: boolean) => void,
  setCurrentStep: (step: FlowStep) => void,
  triggerEncouragement: (type: string, data: any) => void,
  assessmentResult: any
) => {
  const handlePaymentSelect = (option: 'trial' | 'monthly' | 'annual' | 'skip') => {
    setCurrentStep("payment");
  };

  const handlePaymentOption = async (option: 'trial' | 'monthly' | 'annual') => {
    console.log("Processing payment option:", option);
    
    toast.info("Processing your selection...", {
      duration: 2000
    });

    setTimeout(() => {
      setPaymentCompleted(true);
      localStorage.setItem("myrhythm_payment_completed", "true");
      localStorage.setItem("myrhythm_subscription_active", "true");
      
      triggerEncouragement('payment_success', {
        userType: assessmentResult.userType,
        customMessage: "🎉 Welcome to your personalized MyRhythm experience! Your support circle will now be notified of your progress!"
      });
      
      toast.success("Payment successful! 🎉", {
        description: "Your support circle will now be notified of your progress!",
        duration: 5000
      });
      
      setCurrentStep("results");
    }, 2000);
  };

  return { handlePaymentSelect, handlePaymentOption };
};
