import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserType, UserTypeData } from "@/components/onboarding/steps/UserTypeStep";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

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

  const handleUserTypeComplete = (data: UserTypeData) => {
    console.log("OnboardingHandlers: User type selected:", data.type);
    
    try {
      setUserType(data.type);
      setIsUserTypeSelected(true);
      setIsDirectNavigation(false);
      
      // Store user type
      localStorage.setItem('myrhythm_user_type', data.type);
      
      // Move to personal info step
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
      
      // Store personal info
      localStorage.setItem('myrhythm_personal_info', JSON.stringify(values));
      
      // Sign up user if not already authenticated
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
      
      // Move to location step
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
      
      // Store location data
      localStorage.setItem('myrhythm_location', JSON.stringify(locationData));
      
      // Move to plan selection step
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
      
      // Store plan selection
      localStorage.setItem('myrhythm_selected_plan', plan);
      
      // Move to payment step
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
      
      // Store payment completion
      localStorage.setItem('myrhythm_payment_complete', 'true');
      
      // Move to pre-assessment step
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
      // Store pre-assessment completion
      localStorage.setItem('myrhythm_pre_assessment_complete', 'true');
      
      // Move to rhythm assessment step
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
      // Store rhythm assessment completion
      localStorage.setItem('myrhythm_rhythm_assessment_complete', 'true');
      
      // Set onboarding complete flag
      localStorage.setItem('myrhythm_onboarding_complete', 'true');
      
      // Redirect to dashboard with onboarding_complete param
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
  
      // Start trial via checkout session - convert PlanType to SubscriptionTier
      const subscriptionTier = selectedPlan === 'basic' ? 'basic' : 
                             selectedPlan === 'premium' ? 'premium' : 'family';
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
