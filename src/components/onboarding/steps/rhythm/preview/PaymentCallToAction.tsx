
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

interface PaymentCallToActionProps {
  onPaymentSelect: (option: 'trial' | 'monthly' | 'annual' | 'skip') => void;
}

export function PaymentCallToAction({ onPaymentSelect }: PaymentCallToActionProps) {
  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardContent className="text-center space-y-6 py-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Unlock Your Complete Personalized Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get your full assessment results, personalized action plans, goal templates, 
            and ongoing support to achieve your rhythm and recovery goals.
          </p>
        </div>
        
        <div className="grid gap-3 max-w-md mx-auto">
          <Button
            onClick={() => onPaymentSelect('trial')}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start 7-Day Free Trial
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => onPaymentSelect('monthly')}
              variant="outline"
              size="sm"
            >
              Pay Monthly
            </Button>
            <Button
              onClick={() => onPaymentSelect('annual')}
              variant="outline"
              size="sm"
              className="relative"
            >
              <Zap className="h-4 w-4 mr-1" />
              Annual (Save 20%)
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
