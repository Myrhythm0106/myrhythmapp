import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Key, 
  Mail,
  Database,
  Shield,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export function AuthTestHelper() {
  const { user, session, signIn, signUp } = useAuth();
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [supabaseConfig, setSupabaseConfig] = useState<any>(null);

  const checkSupabaseConfig = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      const configInfo = {
        hasSession: !!data.session,
        authError: error?.message || 'None',
        connected: true
      };
      setSupabaseConfig(configInfo);
      toast.success('Configuration checked');
    } catch (error) {
      toast.error('Failed to check configuration');
    }
  };

  const createTestUser = async () => {
    setIsCreatingTestUser(true);
    try {
      const testEmail = 'test@myrhythm.app';
      const testPassword = 'TestPassword123!';
      const testName = 'Test User';

      console.log('Creating test user:', testEmail);
      
      const { error } = await signUp(testEmail, testPassword, testName);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.success('Test user already exists - you can now try signing in!');
          setTestResult({ 
            success: true, 
            message: 'Test user exists',
            email: testEmail,
            password: testPassword
          });
        } else {
          toast.error(`Test user creation failed: ${error.message}`);
          setTestResult({ success: false, error: error.message });
        }
      } else {
        toast.success('Test user created successfully!');
        setTestResult({ 
          success: true, 
          message: 'Created successfully',
          email: testEmail,
          password: testPassword
        });
      }
    } catch (error: any) {
      toast.error('Failed to create test user');
      setTestResult({ success: false, error: error.message });
    }
    setIsCreatingTestUser(false);
  };

  const testSignIn = async () => {
    if (!testResult?.email) {
      toast.error('Create test user first');
      return;
    }

    try {
      console.log('Testing sign in with:', testResult.email);
      const { error } = await signIn(testResult.email, testResult.password);
      
      if (error) {
        toast.error(`Sign in test failed: ${error.message}`);
      } else {
        toast.success('Sign in test successful!');
      }
    } catch (error: any) {
      toast.error('Sign in test failed');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Authentication Debug Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">User Status</span>
            </div>
            <Badge variant={user ? "default" : "secondary"}>
              {user ? `Logged in: ${user.email}` : 'Not logged in'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span className="text-sm font-medium">Session Status</span>
            </div>
            <Badge variant={session ? "default" : "secondary"}>
              {session ? 'Active session' : 'No session'}
            </Badge>
          </div>
        </div>

        {/* Supabase Configuration Check */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Supabase Configuration</span>
            </div>
            <Button size="sm" variant="outline" onClick={checkSupabaseConfig}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Check Config
            </Button>
          </div>

          {supabaseConfig && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Badge variant="outline">Connected: {supabaseConfig.connected ? 'Yes' : 'No'}</Badge>
              <Badge variant={supabaseConfig.hasSession ? "default" : "secondary"}>
                Session: {supabaseConfig.hasSession ? 'Active' : 'None'}
              </Badge>
              <Badge variant={supabaseConfig.authError === 'None' ? "default" : "destructive"}>
                Auth: {supabaseConfig.authError}
              </Badge>
            </div>
          )}
        </div>

        {/* Test User Creation */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Test User Creation</span>
          </div>
          
          <Button 
            onClick={createTestUser} 
            disabled={isCreatingTestUser}
            className="w-full"
          >
            {isCreatingTestUser ? 'Creating...' : 'Create Test User'}
          </Button>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>{testResult.message || testResult.error}</p>
                  {testResult.success && testResult.email && (
                    <div className="text-xs space-y-1">
                      <p><strong>Test Email:</strong> {testResult.email}</p>
                      <p><strong>Test Password:</strong> {testResult.password}</p>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Test Sign In */}
        {testResult?.success && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm font-medium">Test Sign In</span>
            </div>
            <Button onClick={testSignIn} className="w-full" variant="outline">
              Test Sign In with Created User
            </Button>
          </div>
        )}

        {/* Common Issues */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Common Issues</span>
          </div>
          <div className="text-xs space-y-2 text-muted-foreground">
            <p>• <strong>Invalid credentials:</strong> User doesn't exist or wrong password</p>
            <p>• <strong>Email not confirmed:</strong> Check email for verification link</p>
            <p>• <strong>Site URL issues:</strong> Check Supabase Auth settings</p>
            <p>• <strong>Too many requests:</strong> Wait a moment before retrying</p>
          </div>
        </div>

        {/* Development Tips */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Development Tips:</strong>
            <ul className="mt-1 space-y-1">
              <li>• Disable email confirmation in Supabase Auth settings for faster testing</li>
              <li>• Check Supabase logs for detailed error messages</li>
              <li>• Ensure redirect URLs are properly configured</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}