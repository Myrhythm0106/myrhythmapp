
import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { passwordStrengthCheck } from "@/utils/auth/enhancedPasswordValidation";

interface EnhancedPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showStrengthIndicator?: boolean;
  error?: string;
}

export const EnhancedPasswordInput = forwardRef<HTMLInputElement, EnhancedPasswordInputProps>(({
  label = "Password",
  placeholder = "Enter your password",
  showStrengthIndicator = true,
  required = false,
  error,
  className,
  value,
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const currentValue = value as string || '';
  const strengthData = passwordStrengthCheck(currentValue);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return 'Very Weak';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={props.id || "password"} className="flex items-center gap-2">
        <Shield className="h-4 w-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`pr-10 ${error ? 'border-red-500' : ''} ${className || ''}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {showStrengthIndicator && currentValue && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Password strength:</span>
            <Badge variant={strengthData.strength === 'strong' ? 'default' : 'secondary'}>
              {getStrengthText(strengthData.strength)}
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strengthData.strength)}`}
              style={{ width: `${(strengthData.score / 5) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 gap-1 text-xs">
            {Object.entries(strengthData.checks).map(([key, passed]) => (
              <div key={key} className={`flex items-center gap-2 ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                {passed ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                <span>
                  {key === 'length' && '8+ characters'}
                  {key === 'lowercase' && 'Lowercase letter'}
                  {key === 'uppercase' && 'Uppercase letter'}
                  {key === 'number' && 'Number'}
                  {key === 'special' && 'Special character'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedPasswordInput.displayName = "EnhancedPasswordInput";
