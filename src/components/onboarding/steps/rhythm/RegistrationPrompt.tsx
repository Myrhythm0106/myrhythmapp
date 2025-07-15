import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserCheck, Mail } from "lucide-react";
import { UserType } from "@/types/user";

interface RegistrationPromptProps {
  onRegister: (email: string, userType: UserType) => void;
}

export function RegistrationPrompt({ onRegister }: RegistrationPromptProps) {
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<UserType>("brain-injury");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setIsSubmitting(true);
    onRegister(email, userType);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Register to Get Started
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter your email to create an account and start your personalized empowerment journey.
        </p>
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <div>
          <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
            Select your user type
          </label>
          <select
            id="user-type"
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="brain-injury">Brain Injury</option>
            <option value="caregiver">Caregiver</option>
            <option value="professional">Professional</option>
            <option value="general">General User</option>
          </select>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!email || isSubmitting} 
          className="w-full flex items-center justify-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </CardContent>
    </Card>
  );
}
