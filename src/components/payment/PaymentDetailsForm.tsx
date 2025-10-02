import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock, Shield } from "lucide-react";
import { toast } from "sonner";

interface PaymentDetailsFormProps {
  selectedPlan: {
    name: string;
    price: string;
    trialDays?: number;
  };
  onSubmit: (paymentDetails: PaymentDetails) => void;
  onCancel: () => void;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function PaymentDetailsForm({ selectedPlan, onSubmit, onCancel }: PaymentDetailsFormProps) {
  // Get pre-filled data from registration
  const registrationData = JSON.parse(localStorage.getItem('registration_data') || '{}');
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: registrationData.fullName || "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardholderName) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSubmit(paymentDetails);
      toast.success(
        selectedPlan.trialDays ? 
          "Success! A confirmation email has been sent to your email address. Please check your inbox to complete your account setup." :
          "Payment processed successfully! A confirmation email has been sent to your email address."
      );
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
          <div>
            <p className="font-medium">{selectedPlan.name}</p>
            <p className="text-sm text-muted-foreground">{selectedPlan.price}</p>
          </div>
          {selectedPlan.trialDays && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {selectedPlan.trialDays} Day Free Trial
            </Badge>
          )}
        </div>
        {selectedPlan.trialDays && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <Shield className="h-4 w-4 inline mr-1" />
              Your card will be securely stored but not charged for {selectedPlan.trialDays} days. 
              You can cancel anytime during the trial period.
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Card Information</h3>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  cardNumber: formatCardNumber(e.target.value)
                }))}
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                    setPaymentDetails(prev => ({ ...prev, expiryDate: formatted }));
                  }}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    cvv: e.target.value.replace(/\D/g, '')
                  }))}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={paymentDetails.cardholderName}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  cardholderName: e.target.value
                }))}
                required
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                placeholder="123 Main St"
                value={paymentDetails.billingAddress.street}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, street: e.target.value }
                }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={paymentDetails.billingAddress.city}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, city: e.target.value }
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={paymentDetails.billingAddress.state}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    billingAddress: { ...prev.billingAddress, state: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="10001"
                value={paymentDetails.billingAddress.zipCode}
                onChange={(e) => setPaymentDetails(prev => ({
                  ...prev,
                  billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                }))}
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Your payment information is encrypted and secure. We use industry-standard SSL encryption.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Processing..." : selectedPlan.trialDays ? "Start Free Trial" : "Complete Payment"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}