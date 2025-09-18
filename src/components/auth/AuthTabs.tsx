
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, UserPlus, LogIn } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { TestAccountButton } from './TestAccountButton';
import { AuthDebugHelper } from './AuthDebugHelper';
import { AuthTestHelper } from './AuthTestHelper';

interface AuthTabsProps {
  onForgotPassword: () => void;
  onResendVerification: (email: string) => void;
  onSignInSuccess: () => void;
  onSignUpSuccess: (email: string) => void;
}

export const AuthTabs = ({ 
  onForgotPassword, 
  onResendVerification, 
  onSignInSuccess, 
  onSignUpSuccess 
}: AuthTabsProps) => {
  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl">Welcome to MyRhythm</CardTitle>
          <p className="text-sm text-muted-foreground">Get started with your 7-day free trial</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignInForm 
                onForgotPassword={onForgotPassword} 
                onSignInSuccess={onSignInSuccess}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm onSignUpSuccess={onSignUpSuccess} />
            </TabsContent>
          </Tabs>
          
          {/* Debug helper for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="space-y-4 mt-6">
              <AuthDebugHelper />
              <AuthTestHelper />
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center mt-6 text-sm text-gray-600">
        <p>Secure authentication powered by Supabase</p>
      </div>
    </>
  );
};
