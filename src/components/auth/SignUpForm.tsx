
import React from "react";
import { SecurityEnhancedSignUpForm } from "./SecurityEnhancedSignUpForm";

interface SignUpFormProps {
  onSignUpSuccess?: (email: string) => void;
}

const SignUpForm = ({ onSignUpSuccess }: SignUpFormProps) => {
  return <SecurityEnhancedSignUpForm onSignUpSuccess={onSignUpSuccess} />;
};

export default SignUpForm;
