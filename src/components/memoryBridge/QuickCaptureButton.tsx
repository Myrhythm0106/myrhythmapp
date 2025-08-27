import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Zap, Mic } from 'lucide-react';

interface QuickCaptureButtonProps {
  variant?: 'default' | 'floating' | 'compact';
  className?: string;
}

export function QuickCaptureButton({ variant = 'default', className = '' }: QuickCaptureButtonProps) {
  const navigate = useNavigate();

  const handleQuickCapture = () => {
    navigate('/quick-capture');
  };

  if (variant === 'floating') {
    return (
      <Button
        onClick={handleQuickCapture}
        size="lg"
        className={`fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 ${className}`}
      >
        <Mic className="h-6 w-6" />
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleQuickCapture}
        size="sm"
        className={`gap-2 bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 ${className}`}
      >
        <Zap className="h-4 w-4" />
        Quick Capture
      </Button>
    );
  }

  return (
    <Button
      onClick={handleQuickCapture}
      size="lg"
      className={`gap-2 bg-gradient-to-r from-memory-emerald-600 to-brain-health-600 hover:from-memory-emerald-700 hover:to-brain-health-700 text-white px-8 py-4 ${className}`}
    >
      <Zap className="h-5 w-5" />
      Quick Capture
      <Mic className="h-5 w-5" />
    </Button>
  );
}