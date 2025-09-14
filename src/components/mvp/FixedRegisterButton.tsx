import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FixedRegisterButton() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/mvp/user-type-selection");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={handleRegisterClick}
        size="lg"
        className="bg-gradient-to-r from-memory-emerald-500 to-clarity-teal-500 hover:from-memory-emerald-600 hover:to-clarity-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-lg rounded-full animate-pulse"
      >
        <Sparkles className="h-5 w-5 mr-2" />
        Register Now
      </Button>
    </div>
  );
}