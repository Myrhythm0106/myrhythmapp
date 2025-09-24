import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Step2AccountSetupProps {
  selectedPackage: string;
  onSetupComplete: () => void;
}

export function Step2AccountSetup({ selectedPackage, onSetupComplete }: Step2AccountSetupProps) {
  const { signUp, signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(!user);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setIsLoading(false);
          return;
        }

        await signUp(formData.email, formData.password, `${formData.firstName} ${formData.lastName}`);
        
        toast.success('Account created successfully!');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      }

      // Simulate processing time
      setTimeout(() => {
        setIsLoading(false);
        onSetupComplete();
      }, 2000);

    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || 'Authentication failed');
    }
  };

  // If user is already signed in, show quick confirmation
  if (user) {
    return (
      <>
        <LoadingOverlay 
          isVisible={isLoading} 
          message="Preparing your MyRhythm experience..."
        />
        
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-brain-health-900">
              Welcome back, {user.user_metadata?.firstName || 'there'}!
            </h2>
            
            <p className="text-lg text-brain-health-700">
              You're signed in and ready to continue your MyRhythm journey.
            </p>
          </div>

          <Card className="max-w-md mx-auto border-brain-health-200">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-brain-health-600">
                  Selected Plan: <strong className="text-brain-health-800 capitalize">{selectedPackage}</strong>
                </p>
                <p className="text-sm text-brain-health-500">
                  Continue to secure checkout
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(onSetupComplete, 2000);
                }}
                className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:opacity-90 text-white py-6 text-lg"
                disabled={isLoading}
              >
                Continue to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <LoadingOverlay 
        isVisible={isLoading} 
        message={isSignUp ? "Creating your account..." : "Signing you in..."}
      />
      
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-brain-health-900">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-lg text-brain-health-700">
            {isSignUp 
              ? 'Start your cognitive empowerment journey' 
              : 'Sign in to continue your MyRhythm experience'
            }
          </p>
        </div>

        <Card className="max-w-md mx-auto border-brain-health-200">
          <CardHeader>
            <CardTitle className="text-center text-brain-health-800">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-500" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-500" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brain-health-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-memory-emerald-500 to-brain-health-500 hover:opacity-90 text-white py-6 text-lg"
                disabled={isLoading}
              >
                {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
              </Button>
            </form>
            
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-brain-health-600 hover:text-brain-health-800"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : 'Need an account? Sign up'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}