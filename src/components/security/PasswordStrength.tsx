
import React from "react";
import { PasswordValidator } from "@/utils/security/passwordValidator";

interface PasswordStrengthProps {
  password: string;
  showErrors?: boolean;
}

export function PasswordStrength({ password, showErrors = true }: PasswordStrengthProps) {
  const validation = PasswordValidator.validatePassword(password);
  
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return '🔒';
      case 'medium': return '🔐';
      default: return '🔓';
    }
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className={`text-xs px-3 py-2 rounded border ${getStrengthColor(validation.strength)}`}>
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {getStrengthIcon(validation.strength)} Password strength: {validation.strength}
          </span>
          <span className="text-xs">
            Score: {validation.score}/6
          </span>
        </div>
      </div>
      
      {showErrors && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs font-medium text-red-600 mb-1">Requirements not met:</p>
          <ul className="text-xs text-red-600 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {validation.isValid && (
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <p className="text-xs text-green-600">✓ Password meets all security requirements</p>
        </div>
      )}
    </div>
  );
}
