import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, UserPlus, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [status, setStatus] = useState<'loading' | 'valid' | 'invalid' | 'accepted' | 'error'>('loading');
  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setStatus('invalid');
      setIsLoading(false);
      return;
    }

    validateInvitation();
  }, [token, email]);

  const validateInvitation = async () => {
    try {
      setIsLoading(true);
      
      // Check if invitation exists and is valid
      const { data, error } = await supabase
        .from('support_circle_members')
        .select('*')
        .eq('invitation_token', token)
        .eq('member_email', email)
        .eq('status', 'pending')
        .single();

      if (error || !data) {
        setStatus('invalid');
        return;
      }

      // Check if invitation has expired
      if (data.invitation_expires_at && new Date(data.invitation_expires_at) < new Date()) {
        setStatus('invalid');
        setError('This invitation has expired');
        return;
      }

      setInvitationData(data);
      setStatus('valid');
    } catch (error) {
      console.error('Error validating invitation:', error);
      setStatus('error');
      setError('Failed to validate invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!token || !email) return;

    try {
      setIsAccepting(true);
      
      // Call the database function to accept invitation
      const { data, error } = await supabase.rpc('accept_invitation', {
        p_token: token,
        p_user_email: email
      });

      if (error) {
        throw error;
      }

      const result = data as any;
      if (!result?.success) {
        setError(result?.error || 'Failed to accept invitation');
        setStatus('error');
        return;
      }

      setStatus('accepted');
      setInvitationData(result);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      setError(error.message || 'Failed to accept invitation');
      setStatus('error');
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-muted-foreground">Validating invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                {error || 'This invitation link is invalid or has expired.'}
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'accepted') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-700">Welcome to the Support Circle!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You've successfully joined {invitationData?.member_name}'s support circle as their {invitationData?.relationship}.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you to login...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={validateInvitation} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">
                  Go to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invitation - show acceptance UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <UserPlus className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <CardTitle>You're Invited to a Support Circle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Invitation Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Invited by:</strong> {invitationData?.member_name}</p>
              <p><strong>Your relationship:</strong> {invitationData?.relationship}</p>
              <p><strong>Role:</strong> {invitationData?.role}</p>
              <p><strong>Your email:</strong> {email}</p>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              By accepting this invitation, you'll be able to support {invitationData?.member_name} on their wellness journey. 
              You can view the information they choose to share with you and provide encouragement when needed.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              By accepting this invitation, you agree to:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Respect their privacy and confidentiality</li>
              <li>Provide supportive and encouraging communication</li>
              <li>Use shared information responsibly</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={acceptInvitation} 
              disabled={isAccepting}
              className="flex-1"
            >
              {isAccepting ? 'Accepting...' : 'Accept Invitation'}
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            This invitation will expire in 48 hours for your security.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}