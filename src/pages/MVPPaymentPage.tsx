import React from 'react';
import { MVPPaymentFlow } from '@/components/mvp/MVPPaymentFlow';
import { useNavigate } from 'react-router-dom';

export default function MVPPaymentPage() {
  const navigate = useNavigate();

  const handlePaymentComplete = () => {
    // After payment completion, navigate to welcome or onboarding
    navigate('/welcome');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <MVPPaymentFlow 
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
      />
    </div>
  );
}