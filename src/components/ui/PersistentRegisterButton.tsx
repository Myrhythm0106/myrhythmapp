
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PersistentRegisterButton() {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/onboarding');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={handleRegisterClick}
        size="lg"
        className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-6 py-3"
      >
        <Crown className="w-5 h-5 mr-2" />
        Register Now
      </Button>
    </div>
  );
}
