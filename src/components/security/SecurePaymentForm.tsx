
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface SecurePaymentFormProps {
  selectedPlan: {
    name: string;
    price: string;
    features: string[];
  };
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export function SecurePaymentForm({ selectedPlan, onPaymentSuccess, onBack }: SecurePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'demo'>('stripe');

  const handleSecurePayment = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'demo') {
        // Demo mode for development - clearly marked as insecure
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Demo payment completed (NOT REAL)");
        onPaymentSuccess();
      } else {
        // This should integrate with a real payment processor like Stripe
        toast.error("Payment processing not yet configured. Please contact support.");
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">{selectedPlan.name}</h3>
          <p className="text-2xl font-bold text-primary">{selectedPlan.price}</p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment information is encrypted and secure. We never store payment details on our servers.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="payment-method">Payment Method</Label>
            <select 
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'demo')}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="stripe">Stripe (Secure)</option>
              <option value="demo">Demo Mode (Development Only)</option>
            </select>
          </div>

          {paymentMethod === 'demo' && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription className="text-orange-800">
                ⚠️ Demo mode is for development only. No real payment will be processed.
              </AlertDescription>
            </Alert>
          )}

          {paymentMethod === 'stripe' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Stripe integration is not yet configured. Please use demo mode for testing.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={handleSecurePayment}
            disabled={isProcessing || paymentMethod === 'stripe'}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {paymentMethod === 'demo' ? 'Demo Payment' : 'Pay Securely'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
