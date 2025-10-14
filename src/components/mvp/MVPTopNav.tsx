import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BackButton } from '@/components/ui/BackButton';
import { useHideOnScroll } from '@/hooks/useHideOnScroll';

interface MVPTopNavProps {
  showBack?: boolean;
}

export function MVPTopNav({ showBack = true }: MVPTopNavProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isVisible } = useHideOnScroll();

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
      navigate('/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className={`bg-gradient-to-r from-neural-purple-50/90 to-neural-blue-50/90 backdrop-blur-sm border-b border-neural-purple-200/50 sticky top-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`}>
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
            {user ? 'Sign Out' : 'Log In'}
          </Button>
        </div>
      </div>
    </nav>
  );
}