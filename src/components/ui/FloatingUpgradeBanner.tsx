import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingUpgradeBannerProps {
  show?: boolean;
  onClose?: () => void;
}

export function FloatingUpgradeBanner({ show = true, onClose }: FloatingUpgradeBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200 && !hasScrolled) {
        setHasScrolled(true);
        setIsVisible(true);
      }
    };

    if (show) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [show, hasScrolled]);

  const handleUpgrade = () => {
    navigate('/subscribe');
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible || !show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-from-top">
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 animate-pulse" />
            <span className="font-bold text-sm">
              🧠 Your transformation awaits!
            </span>
          </div>
          
          <Badge className="bg-yellow-400 text-black font-bold animate-bounce">
            LIMITED TIME
          </Badge>
          
          <Button 
            onClick={handleUpgrade}
            size="sm"
            className="bg-white text-teal-600 hover:bg-gray-100 font-bold shadow-lg"
          >
            <Crown className="h-4 w-4 mr-1" />
            UPGRADE NOW
          </Button>
          
          <Button
            onClick={handleClose}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}