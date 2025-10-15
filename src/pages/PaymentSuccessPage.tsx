import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        
        if (!sessionId) {
          toast.error('Invalid payment session');
          navigate('/subscribe');
          return;
        }

        // Mark assessment as paid
        const assessmentId = localStorage.getItem('current_assessment_id');
        if (assessmentId) {
          const { error } = await supabase
            .from('assessment_results')
            .update({ payment_status: 'paid' })
            .eq('id', assessmentId);

          if (error) throw error;
          
          localStorage.setItem('assessment_payment_complete', 'true');
        }

        // Set subscription flags
        localStorage.setItem('subscription_active', 'true');
        localStorage.setItem('trial_start_date', new Date().toISOString());
        
        toast.success('Payment successful! Welcome to Premium! 🎉');
        setIsProcessing(false);

      } catch (error) {
        console.error('Error processing payment:', error);
        toast.error('Error processing payment. Please contact support.');
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">
            {isProcessing ? 'Processing Payment...' : 'Payment Successful!'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!isProcessing && (
            <>
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Your 7-day premium trial has started. You now have access to:
                </p>
                <ul className="text-sm text-left space-y-2 mb-6">
                  <li>✓ Full assessment results & insights</li>
                  <li>✓ Unlimited memory bridge recordings</li>
                  <li>✓ Next Steps extraction</li>
                  <li>✓ Support circle (up to 5 members)</li>
                  <li>✓ Advanced analytics & reports</li>
                </ul>
              </div>

              <Button 
                onClick={() => navigate('/path-selection')}
                className="w-full bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Continue to MyRhythm
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
