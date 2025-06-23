
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Lock } from "lucide-react";

interface PaymentCallToActionProps {
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
}

export function PaymentCallToAction({ onPaymentSelect }: PaymentCallToActionProps) {
  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="text-center space-y-6 py-8">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">Premium Access Required</span>
          </div>
          
          <h2 className="text-2xl font-bold">Unlock Your Complete Personalized Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium access unlocks your full assessment results, personalized action plans, goal templates, 
            and ongoing support to achieve your rhythm and recovery goals.
          </p>
          
          <div className="bg-white/80 p-4 rounded-lg border border-primary/20 max-w-lg mx-auto">
            <p className="text-sm text-gray-700 font-medium">
              🔒 What you'll unlock with Premium:
            </p>
            <ul className="text-xs text-gray-600 mt-2 space-y-1 text-left">
              <li>• Complete assessment analysis & insights</li>
              <li>• Personalized action plans & strategies</li>
              <li>• Goal templates tailored to your focus area</li>
              <li>• Progress tracking & celebration system</li>
              <li>• Ongoing support & guidance</li>
            </ul>
          </div>
        </div>
        
        <div className="grid gap-3 max-w-md mx-auto">
          <Button
            onClick={() => onPaymentSelect('trial')}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start 7-Day Premium Trial
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onPaymentSelect('monthly')}
              variant="outline"
              size="sm"
            >
              Premium Monthly
            </Button>
            <Button
              onClick={() => onPaymentSelect('annual')}
              variant="outline"
              size="sm"
              className="relative"
            >
              <Zap className="h-4 w-4 mr-1" />
              Premium Annual (Save 20%)
            </Button>
          </div>
          
          <Button
            onClick={() => onPaymentSelect('skip')}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Continue with limited access
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
