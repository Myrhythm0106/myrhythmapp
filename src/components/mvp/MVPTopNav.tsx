import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BackButton } from '@/components/ui/BackButton';

interface MVPTopNavProps {
  showBack?: boolean;
}

export function MVPTopNav({ showBack = true }: MVPTopNavProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAuthAction = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-brain-health-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showBack && (
              <BackButton 
                variant="ghost" 
                size="sm" 
                className="text-brain-health-600 hover:bg-brain-health-50"
              />
            )}
            <Brain className="h-8 w-8 text-memory-emerald-600" />
            <span className="text-2xl font-bold text-brain-health-900">MyRhythm</span>
          </div>
          <Button
            onClick={handleAuthAction}
            variant="outline"
            size="sm"
            className="border-brain-health-300 text-brain-health-700 hover:bg-brain-health-50 hover:text-brain-health-900 transition-colors"
          >
            <User className="h-4 w-4 mr-2" />
            {user ? 'Dashboard' : 'Log In'}
          </Button>
        </div>
      </div>
    </nav>
  );
}