
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, ExternalLink } from "lucide-react";
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

  const handleContactSupport = () => {
    toast.info("Please contact support for payment setup");
    // In a real implementation, this would open a support ticket or redirect to contact form
  };

  const handleSecureRedirect = () => {
    toast.info("Redirecting to secure payment processor...");
    // In a real implementation, this would redirect to Stripe/PayPal/etc
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.error("Payment integration not yet configured. Please contact support.");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">{selectedPlan.name}</h3>
          <p className="text-2xl font-bold text-primary">{selectedPlan.price}</p>
          <ul className="mt-2 text-sm text-gray-600">
            {selectedPlan.features.map((feature, index) => (
              <li key={index}>• {feature}</li>
            ))}
          </ul>
        </div>

        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            <strong>Payment Integration Required:</strong> This application requires proper payment processor integration (Stripe, PayPal, etc.) to handle real transactions securely.
          </AlertDescription>
        </Alert>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Promise:</strong> We never store payment information on our servers. All payments are processed through PCI-compliant payment processors with end-to-end encryption.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Secure Payment Options:</h4>
          
          <Button 
            onClick={handleSecureRedirect}
            disabled={isProcessing}
            className="w-full"
            variant="default"
          >
            {isProcessing ? (
              "Redirecting to secure payment..."
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Proceed to Secure Payment
              </>
            )}
          </Button>

          <Button 
            onClick={handleContactSupport}
            variant="outline"
            className="w-full"
          >
            Contact Support for Payment Setup
          </Button>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <h5 className="font-medium text-blue-900 mb-1">Payment Security Features:</h5>
          <ul className="text-blue-800 space-y-1">
            <li>• SSL/TLS encryption for all transactions</li>
            <li>• PCI DSS compliant payment processing</li>
            <li>• No payment data stored on our servers</li>
            <li>• Fraud detection and prevention</li>
            <li>• Secure tokenization of payment methods</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back to Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
