
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserType, UserTypeData } from "@/components/onboarding/steps/UserTypeStep";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription, SubscriptionTier } from "@/contexts/SubscriptionContext";

type LocationFormValues = {
  country: string;
  state: string;
  town: string;
};

interface UseOnboardingHandlersProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setUserType: (type: UserType | null) => void;
  setLocation: (location: LocationFormValues | null) => void;
  setPersonalInfo: (info: PersonalInfoFormValues | null) => void;
  setSelectedPlan: (plan: PlanType) => void;
  setPaymentData: (data: PaymentFormValues | null) => void;
  setShowPaymentConfirmation: (show: boolean) => void;
  setIsUserTypeSelected: (isSelected: boolean) => void;
  setIsPersonalInfoValid: (isValid: boolean) => void;
  setIsLocationValid: (isValid: boolean) => void;
  setIsPlanSelected: (isSelected: boolean) => void;
  setIsDirectNavigation: (isDirect: boolean) => void;
  totalSteps: number;
  userType: UserType | null;
  personalInfo: PersonalInfoFormValues | null;
  selectedPlan: PlanType;
  paymentData: PaymentFormValues | null;
}

export const useOnboardingHandlers = (props: UseOnboardingHandlersProps) => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { createCheckoutSession } = useSubscription();
  
  const {
    currentStep,
    setCurrentStep,
    setUserType,
    setLocation,
    setPersonalInfo,
    setSelectedPlan,
    setPaymentData,
    setShowPaymentConfirmation,
    setIsUserTypeSelected,
    setIsPersonalInfoValid,
    setIsLocationValid,
    setIsPlanSelected,
    setIsDirectNavigation,
    totalSteps,
    userType,
    personalInfo,
    selectedPlan
  } = props;

  // Convert PlanType to SubscriptionTier
  const mapPlanToTier = (plan: PlanType): SubscriptionTier => {
    switch (plan) {
      case 'basic':
        return 'basic';
      case 'premium':
        return 'premium';
      case 'family':
        return 'family';
      default:
        return 'premium';
    }
  };

  const handleUserTypeComplete = (data: UserTypeData) => {
    console.log("OnboardingHandlers: User type selected:", data.type);
    
    try {
      setUserType(data.type);
      setIsUserTypeSelected(true);
      setIsDirectNavigation(false);
      
      localStorage.setItem('myrhythm_user_type', data.type);
      
      setTimeout(() => {
        setCurrentStep(2);
      }, 300);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling user type selection:", error);
      toast.error("Error saving user type. Please try again.");
    }
  };

  const handlePersonalInfoComplete = async (values: PersonalInfoFormValues) => {
    console.log("OnboardingHandlers: Personal info submitted:", values);
    
    try {
      setPersonalInfo(values);
      setIsPersonalInfoValid(true);
      setIsDirectNavigation(false);
      
      localStorage.setItem('myrhythm_personal_info', JSON.stringify(values));
      
      if (!values.email || !values.password) {
        console.warn("OnboardingHandlers: Email or password missing, skipping signup");
      } else {
        const { error } = await signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name
            }
          }
        });
        
        if (error) {
          console.error("OnboardingHandlers: Signup error:", error);
          toast.error("Error creating account. Please try again.");
          return;
        }
      }
      
      setTimeout(() => {
        setCurrentStep(3);
      }, 300);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling personal info submission:", error);
      toast.error("Error saving personal information. Please try again.");
    }
  };

  const handleLocationComplete = (locationData: LocationFormValues) => {
    console.log("OnboardingHandlers: Location submitted:", locationData);
    
    try {
      setLocation(locationData);
      setIsLocationValid(true);
      setIsDirectNavigation(false);
      
      localStorage.setItem('myrhythm_location', JSON.stringify(locationData));
      
      setTimeout(() => {
        setCurrentStep(4);
      }, 300);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling location submission:", error);
      toast.error("Error saving location. Please try again.");
    }
  };

  const handlePlanSelected = async (plan: PlanType) => {
    console.log("OnboardingHandlers: Plan selected:", plan);
    
    try {
      setSelectedPlan(plan);
      setIsPlanSelected(true);
      setIsDirectNavigation(false);
      
      localStorage.setItem('myrhythm_selected_plan', plan);
      
      setTimeout(() => {
        setCurrentStep(5);
      }, 300);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling plan selection:", error);
      toast.error("Error selecting plan. Please try again.");
    }
  };

  const handlePaymentComplete = async (paymentData: PaymentFormValues) => {
    console.log("OnboardingHandlers: Payment completed, moving to pre-assessment");
    
    try {
      setPaymentData(paymentData);
      
      localStorage.setItem('myrhythm_payment_complete', 'true');
      
      setTimeout(() => {
        setCurrentStep(6);
      }, 1000);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling payment completion:", error);
      toast.error("Error processing payment completion. Please try again.");
    }
  };

  const handlePreAssessmentComplete = () => {
    console.log("OnboardingHandlers: Pre-assessment completed, moving to rhythm assessment");
    
    try {
      localStorage.setItem('myrhythm_pre_assessment_complete', 'true');
      
      setTimeout(() => {
        setCurrentStep(7);
      }, 1000);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling pre-assessment completion:", error);
      toast.error("Error processing pre-assessment completion. Please try again.");
    }
  };

  const handleRhythmAssessmentComplete = () => {
    console.log("OnboardingHandlers: Rhythm assessment completed, redirecting to dashboard");
    
    try {
      localStorage.setItem('myrhythm_rhythm_assessment_complete', 'true');
      localStorage.setItem('myrhythm_onboarding_complete', 'true');
      
      setTimeout(() => {
        navigate("/dashboard?onboarding_complete=true");
      }, 1500);
      
    } catch (error) {
      console.error("OnboardingHandlers: Error handling rhythm assessment completion:", error);
      toast.error("Error processing rhythm assessment completion. Please try again.");
    }
  };

  const handlePaymentConfirm = async () => {
    console.log("OnboardingHandlers: Payment confirmed, starting trial");
    
    try {
      setShowPaymentConfirmation(false);
  
      // Convert PlanType to SubscriptionTier and create checkout session
      const subscriptionTier = mapPlanToTier(selectedPlan);
      const checkoutUrl = await createCheckoutSession(subscriptionTier);
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error("OnboardingHandlers: Error confirming payment:", error);
      toast.error("Error confirming payment. Please try again.");
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsDirectNavigation(true);
    } else {
      navigate("/");
    }
  };

  return {
    handleUserTypeComplete,
    handlePersonalInfoComplete,
    handleLocationComplete,
    handlePlanSelected,
    handlePaymentComplete,
    handlePreAssessmentComplete,
    handleRhythmAssessmentComplete,
    handlePaymentConfirm,
    goToPreviousStep
  };
};
