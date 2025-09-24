
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { personalInfoBaseSchema, personalInfoPremiumSchema, PersonalInfoFormValues } from "./personal-info/personalInfoSchema";
import { PersonalInfoFormFields } from "./personal-info/PersonalInfoFormFields";
import { AccountRecoveryInfo } from "./personal-info/AccountRecoveryInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";

export type { PersonalInfoFormValues };

interface PersonalInfoStepProps {
  onComplete: (values: PersonalInfoFormValues) => void;
  initialValues?: PersonalInfoFormValues;
}

export const PersonalInfoStep = ({ onComplete, initialValues }: PersonalInfoStepProps) => {
  const { user, signUp, emailVerificationStatus, resendVerification } = useAuth();
  const [isFreemium, setIsFreemium] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);
  
  const currentSchema = isFreemium ? personalInfoBaseSchema : personalInfoPremiumSchema;
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: initialValues || {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      age: "",
      isFreemium: isFreemium,
      password: "",
      confirmPassword: "",
    },
    mode: "onChange", 
  });

  // Auto-populate form with authenticated user data
  useEffect(() => {
    if (user && !initialValues) {
      console.log("PersonalInfoStep: Auto-populating with authenticated user data");
      form.setValue("name", user.user_metadata?.name || user.email?.split('@')[0] || "");
      form.setValue("email", user.email || "");
    }
  }, [user, initialValues, form]);

  // Update form validation when switching modes
  useEffect(() => {
    form.setValue("isFreemium", isFreemium);
  }, [isFreemium, form]);

  const handleSubmit = async (values: PersonalInfoFormValues) => {
    console.log("PersonalInfoStep: Form submitted", { isFreemium, values });
    setIsSubmitting(true);

    try {
      if (!user && isFreemium) {
        // Freemium signup - no password required
        console.log("Creating freemium account...");
        const tempPassword = crypto.randomUUID(); // Generate temporary password
        const { error } = await signUp(values.email, tempPassword, values.name);
        
        if (error) {
          console.error("Freemium signup error:", error);
          return;
        }
        
        setHasSignedUp(true);
        // Don't proceed to next step yet - let user verify email first
        return;
      } else if (!user && !isFreemium && values.password) {
        // Premium signup - password required
        console.log("Creating premium account...");
        const { error } = await signUp(values.email, values.password, values.name);
        
        if (error) {
          console.error("Premium signup error:", error);
          return;
        }
        
        setHasSignedUp(true);
        return;
      }
      
      // User is already authenticated or continuing with limited access
      onComplete(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueWithLimitedAccess = () => {
    const currentValues = form.getValues();
    onComplete(currentValues);
  };

  const handleToggleMode = () => {
    setIsFreemium(!isFreemium);
    // Reset password fields when switching modes
    if (isFreemium) {
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    }
  };

  // Show email verification prompt if user just signed up
  if (hasSignedUp && emailVerificationStatus === 'pending') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-800">Check Your Email</h3>
            <p className="text-blue-600">
              We've sent a verification link to {form.getValues("email")}
            </p>
          </div>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Verification sent!</strong> Click the link in your email to activate your account.
            {isFreemium && " You can also continue with limited access below."}
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {isFreemium && (
            <Button 
              onClick={handleContinueWithLimitedAccess}
              variant="outline"
              className="w-full gap-2"
            >
              Continue with Limited Access <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <button 
              type="button"
              className="text-primary hover:underline"
              onClick={() => user?.email && resendVerification(user.email)}
            >
              resend verification
            </button>
          </p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show a simplified view
  if (user && emailVerificationStatus === 'verified') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800">Account Verified</h3>
            <p className="text-green-600">
              Welcome back, {user.user_metadata?.name || user.email?.split('@')[0]}!
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-medium text-green-800 mb-2">Your Account Details</h4>
          <div className="space-y-2 text-sm text-green-700">
            <p><strong>Name:</strong> {user.user_metadata?.name || "Not provided"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Status:</strong> Authenticated ✓</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button 
            onClick={() => handleSubmit({
              name: user.user_metadata?.name || user.email?.split('@')[0] || "",
              email: user.email || "",
              password: ""
            })}
            className="gap-2"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Main registration form for new users
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Welcome to MyRhythm</h2>
          <p className="text-muted-foreground">
            {isFreemium 
              ? "Get started with your free assessment - no password required" 
              : "Create your secure account with full features"
            }
          </p>
        </div>
        
        <PersonalInfoFormFields 
          form={form} 
          isFreemium={isFreemium}
          onToggleMode={handleToggleMode}
        />
        
        {!isFreemium && <AccountRecoveryInfo />}
        
        <div className="pt-4 space-y-3">
          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={!form.formState.isValid || isSubmitting}
          >
            {isSubmitting 
              ? "Creating Account..." 
              : isFreemium 
                ? "Start Free Assessment" 
                : "Create Account"
            } 
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          {isFreemium && (
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you'll receive a verification email. You can start your assessment immediately.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};
