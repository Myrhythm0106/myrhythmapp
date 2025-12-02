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
    primary: 'bg-gradient-to-r from-brand-emerald-500 to-brand-teal-500 text-white hover:from-brand-emerald-600 hover:to-brand-teal-600 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-brand-emerald-700 border-2 border-brand-emerald-200 hover:bg-brand-emerald-50 hover:border-brand-emerald-300',
    ghost: 'bg-transparent text-brand-emerald-700 hover:bg-brand-emerald-50',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-200 hover:bg-gray-50',
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
