import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Users, Target, Leaf, Building2, Stethoscope, Plus, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { UserType } from "@/types/user";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const userTypes = [
  {
    id: "brain-injury" as const,
    title: "Brain Injury Recovery",
    description: "You are so much stronger than what happened to you. Let's rebuild your confidence and create a rhythm that honors your unique healing journey.",
    icon: Brain,
    color: "bg-gradient-to-br from-brain-health-500 to-brain-health-600 hover:from-brain-health-600 hover:to-brain-health-700",
  },
  {
    id: "caregiver" as const,
    title: "Caregiver Support", 
    description: "Your love runs deep, but so does your exhaustion. You deserve tools that understand the weight you carry and build resilience that sustains both you and your loved one.",
    icon: Heart,
    color: "bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700",
  },
  {
    id: "cognitive-optimization" as const,
    title: "Cognitive Optimization",
    description: "You know there's more inside you waiting to emerge. Let's unlock the brilliant mind you've always known you have with personalized cognitive training.",
    icon: Target,
    color: "bg-gradient-to-br from-beacon-500 to-beacon-600 hover:from-beacon-600 hover:to-beacon-700",
  },
  {
    id: "wellness" as const,
    title: "General Wellness",
    description: "You have everything it takes to thrive. Build mental resilience and sustainable wellness habits that honor your journey.",
    icon: Leaf,
    color: "bg-gradient-to-br from-memory-emerald-500 to-memory-emerald-600 hover:from-memory-emerald-600 hover:to-memory-emerald-700",
  },
  {
    id: "medical-professional" as const,
    title: "Medical Professional",
    description: "Your expertise matters, your time is precious. Streamline patient interactions and access evidence-based cognitive wellness resources.",
    icon: Stethoscope,
    color: "bg-gradient-to-br from-clarity-teal-500 to-clarity-teal-600 hover:from-clarity-teal-600 hover:to-clarity-teal-700",
  },
  {
    id: "colleague" as const,
    title: "Workplace Wellness",
    description: "You deserve to flourish at work. Empower your workplace with cognitive wellness tools that help you and your colleagues thrive together.",
    icon: Building2,
    color: "bg-gradient-to-br from-sunrise-amber-500 to-sunrise-amber-600 hover:from-sunrise-amber-600 hover:to-sunrise-amber-700",
  },
  {
    id: "other" as const,
    title: "Other",
    description: "Tell us about your unique situation and we'll personalize MyRhythm for your specific needs",
    icon: Plus,
    color: "bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
  }
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const { signUpFreemium, resendVerification, emailVerificationStatus } = useAuth();
  const [step, setStep] = useState<'user-type' | 'personal-info'>('user-type');
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [customType, setCustomType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedUserType(type);
    
    if (type !== 'other') {
      // Store user type and move to personal info
      localStorage.setItem('userType', type);
      setStep('personal-info');
    }
  };

  const handleOtherTypeComplete = () => {
    if (customType.trim()) {
      localStorage.setItem('userType', 'other');
      localStorage.setItem('customUserType', customType.trim());
      setStep('personal-info');
    }
  };

  const handlePersonalInfoComplete = async () => {
    // Validate required fields
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in both name and email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsCreatingAccount(true);

    try {
      // Create the user account first
      const { error } = await signUpFreemium(email.trim(), name.trim());
      
      if (error) {
        setIsCreatingAccount(false);
        return; // Error handling is done in signUpFreemium
      }

      // Store personal info for assessment flow
      localStorage.setItem('userName', name.trim());
      localStorage.setItem('userEmail', email.trim());
      
      setAccountCreated(true);
      setIsCreatingAccount(false);

      // Navigate directly to assessment flow with user context
      const userTypeParam = selectedUserType === 'other' ? 'other' : selectedUserType;
      navigate(`/mvp/assessment-flow?userType=${userTypeParam}&flow=get-started`);
      
    } catch (error) {
      console.error('Account creation error:', error);
      toast.error('Failed to create account. Please try again.');
      setIsCreatingAccount(false);
    }
  };

  const handleResendVerification = async () => {
    if (email) {
      await resendVerification(email);
    }
  };

  const handleBack = () => {
    if (step === 'personal-info') {
      setStep('user-type');
    } else {
      navigate('/');
    }
  };

  const selectedTypeData = userTypes.find(type => type.id === selectedUserType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">MyRhythm</h1>
            <p className="text-sm text-muted-foreground">
              Step {step === 'user-type' ? '1' : '2'} of 3
            </p>
          </div>
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: step === 'user-type' ? '33%' : '66%' }}
          />
        </div>

        {step === 'user-type' ? (
          // Step 1: User Type Selection
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Your Story Matters. Your Recovery is Real.
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every breakthrough starts with someone who truly understands your journey. We see you, we believe in you, and we're here to help.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {userTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedUserType === type.id;
                
                return (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleUserTypeSelect(type.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${type.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold text-foreground mb-1">
                            {type.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {type.description}
                          </p>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {isSelected && type.id === 'other' && (
                      <CardContent className="pt-0 pb-3 space-y-3">
                        <Input
                          placeholder="Please describe your situation..."
                          value={customType}
                          onChange={(e) => setCustomType(e.target.value)}
                          className="w-full"
                          autoFocus
                        />
                        {customType.trim() && (
                          <Button onClick={handleOtherTypeComplete} className="w-full gap-2">
                            Continue with "{customType}"
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          // Step 2: Personal Information
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Perfect! Let's personalize your experience
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                As a <strong>{selectedTypeData?.title}</strong>, we'll tailor everything specifically for your needs. Just a couple quick details to get started.
              </p>
            </div>

            {/* Selected User Type Display */}
            {selectedTypeData && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${selectedTypeData.color} flex items-center justify-center`}>
                      <selectedTypeData.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold text-foreground">
                        {selectedTypeData.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Selected path</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* Personal Info Form */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <p className="text-sm text-muted-foreground">
                  We'll use this to personalize your assessment and save your progress
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll use this to save your progress and send your personalized results
                  </p>
                </div>

                <Button 
                  onClick={handlePersonalInfoComplete}
                  className="w-full gap-2 mt-6"
                  disabled={!name.trim() || !email.trim() || isCreatingAccount}
                >
                  {isCreatingAccount ? (
                    <>Creating Your Account...</>
                  ) : (
                    <>
                      Start My Personalized Assessment
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Email verification status and resend button */}
                {accountCreated && emailVerificationStatus === 'pending' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800 mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Check your email to verify your account</span>
                    </div>
                    <p className="text-sm text-amber-700 mb-3">
                      We've sent a verification email to <strong>{email}</strong>. 
                      Please check your inbox and click the link to unlock all features.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleResendVerification}
                      className="text-amber-700 border-amber-300 hover:bg-amber-100"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Resend Verification Email
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              🔒 Your information is secure and will never be shared with third parties
            </div>
          </div>
        )}
      </div>
    </div>
  );
}