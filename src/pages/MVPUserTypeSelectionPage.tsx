import React from 'react';
import { UserTypeStep } from '@/components/onboarding/steps/UserTypeStep';
import { useNavigate } from 'react-router-dom';

export default function MVPUserTypeSelectionPage() {
  const navigate = useNavigate();

  const handleUserTypeComplete = (data: any) => {
    // Navigate to payment page with user type parameter
    navigate(`/mvp-payment?userType=${data.type.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <UserTypeStep 
          onComplete={handleUserTypeComplete}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}