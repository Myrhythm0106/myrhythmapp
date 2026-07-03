import React from 'react';
import { MVPPaymentFlow } from '@/components/mvp/MVPPaymentFlow';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function MVPPaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'general-wellness';

  const handlePaymentComplete = () => {
    // After payment completion, hand off to the Founding Core welcome (v0.1 canonical entry).
    localStorage.setItem('mvp_trial_started', 'true');
    localStorage.setItem('mvp_trial_start_date', new Date().toISOString());
    navigate('/launch/welcome');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <MVPPaymentFlow 
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
        userType={userType}
      />
    </div>
  );
}