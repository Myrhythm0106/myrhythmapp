
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

interface AppStorePaymentStepProps {
  selectedPlan: 'basic' | 'premium' | 'family' | null;
  onPaymentComplete: () => void;
  onBack: () => void;
}

export function AppStorePaymentStep({ selectedPlan, onPaymentComplete, onBack }: AppStorePaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTouchId, setShowTouchId] = useState(false);

  const planDetails = {
    basic: { name: 'MyRhythm Align', price: '£5.99', description: 'Perfect for getting started' },
    premium: { name: 'MyRhythm Flow', price: '£9.99', description: 'Most popular choice' },
    family: { name: 'MyRhythm Thrive', price: '£19.99', description: 'Perfect for families' }
  };

  const currentPlan = selectedPlan ? planDetails[selectedPlan] : null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate App Store payment flow
    setTimeout(() => {
      setShowTouchId(true);
      setTimeout(() => {
        setShowTouchId(false);
        setIsProcessing(false);
        onPaymentComplete();
      }, 2000);
    }, 1000);
  };

  if (showTouchId) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="text-3xl">👆</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Touch ID Required</h3>
              <p className="text-slate-600">Use Touch ID to complete your purchase</p>
            </div>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Purchase</h2>
        <p className="text-slate-600">Secure payment through App Store</p>
      </div>

      <Card className="border-2 border-teal-200 bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
          <CardTitle className="text-center">
            <Smartphone className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            App Store Purchase
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {currentPlan && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-slate-800">{currentPlan.name}</h3>
                  <p className="text-sm text-slate-600">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-800">{currentPlan.price}</div>
                  <div className="text-sm text-slate-500">per month</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-600 pt-2 border-t border-slate-200">
                <span>7-day free trial included</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🍎</span>
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Secure App Store Payment</p>
                  <p className="text-sm text-blue-700">Protected by Apple's security</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Your payment will be charged to your iTunes Account</p>
              <p>• Subscription automatically renews unless auto-renew is turned off</p>
              <p>• Manage subscriptions in App Store settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white shadow-lg py-3"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  Complete Purchase {currentPlan?.price}/month
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="w-full text-slate-600 hover:text-slate-800"
              disabled={isProcessing}
            >
              Back to Plans
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
