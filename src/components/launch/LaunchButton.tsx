import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LaunchButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'default' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}

export function LaunchButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'default',
  onClick,
  disabled,
  loading,
  type = 'button'
}: LaunchButtonProps) {
  const variants = {
    primary: 'bg-launch-ember text-launch-ivory hover:bg-launch-ink shadow-md hover:shadow-lg',
    secondary: 'bg-launch-ivory text-launch-moss border-2 border-launch-teal/40 hover:bg-launch-teal/10 hover:border-launch-teal',
    ghost: 'bg-transparent text-launch-moss hover:bg-launch-teal/10',
    outline: 'bg-transparent text-launch-ink border-2 border-launch-gold/40 hover:bg-launch-gold/10',
  };

  const sizes = {
    default: 'h-14 px-6 text-base',
    lg: 'h-16 px-8 text-lg',
    icon: 'h-14 w-14',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2",
        "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
