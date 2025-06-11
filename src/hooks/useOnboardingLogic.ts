
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { PersonalInfoFormValues } from "@/components/onboarding/steps/PersonalInfoStep";
import { PlanType } from "@/components/onboarding/steps/PlanStep";
import { PaymentFormValues } from "@/components/onboarding/steps/PaymentStep";
import { UserType } from "@/components/onboarding/steps/UserTypeStep";

type LocationFormValues = {
  country: string;
  state: string;
  town: string;
};

export const useOnboardingLogic = (totalSteps: number) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize currentStep from URL parameter with proper validation
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const stepFromUrl = parseInt(stepParam, 10);
      if (stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
        return stepFromUrl;
      }
    }
    return 1;
  });
  
  // Core state
  const [userType, setUserType] = useState<UserType | null>(null);
  const [location, setLocation] = useState<LocationFormValues | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormValues | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("basic");
  const [paymentData, setPaymentData] = useState<PaymentFormValues | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  
  // Form validation states for auto-progression
  const [isUserTypeSelected, setIsUserTypeSelected] = useState(false);
  const [isPersonalInfoValid, setIsPersonalInfoValid] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [isPlanSelected, setIsPlanSelected] = useState(false);
  
  // Track if user came from direct navigation to disable auto-progression
  const [isDirectNavigation, setIsDirectNavigation] = useState(() => {
    const stepParam = searchParams.get('step');
    return stepParam !== null && parseInt(stepParam, 10) > 1;
  });

  // Sync URL with current step
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const stepFromUrl = stepParam ? parseInt(stepParam, 10) : null;
    
    if (stepFromUrl !== currentStep) {
      setSearchParams({ step: currentStep.toString() });
    }
  }, [currentStep, searchParams, setSearchParams]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const stepParam = new URLSearchParams(window.location.search).get('step');
      const stepFromUrl = stepParam ? parseInt(stepParam, 10) : 1;
      
      if (stepFromUrl >= 1 && stepFromUrl <= totalSteps) {
        setCurrentStep(stepFromUrl);
        setIsDirectNavigation(true);
      } else {
        navigate("/");
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [navigate, totalSteps]);

  // Clear any potentially insecure data from localStorage on component mount
  useEffect(() => {
    localStorage.removeItem('myrhythm_security_answers');
  }, []);

  return {
    currentStep,
    setCurrentStep,
    userType,
    setUserType,
    location,
    setLocation,
    personalInfo,
    setPersonalInfo,
    selectedPlan,
    setSelectedPlan,
    paymentData,
    setPaymentData,
    showPaymentConfirmation,
    setShowPaymentConfirmation,
    isUserTypeSelected,
    setIsUserTypeSelected,
    isPersonalInfoValid,
    setIsPersonalInfoValid,
    isLocationValid,
    setIsLocationValid,
    isPlanSelected,
    setIsPlanSelected,
    isDirectNavigation,
    setIsDirectNavigation,
  };
};
