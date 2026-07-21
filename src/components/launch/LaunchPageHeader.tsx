import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LaunchPageHeaderProps {
  title?: string;
  subtitle?: string;
  fallbackPath?: string;
  className?: string;
  /** When true, renders a plain inline row (no sticky white bar). */
  inline?: boolean;
}

/**
 * Consistent back-button row for every Launch page (except Home).
 * 56px touch target, plain-language aria-label.
 */
export function LaunchPageHeader({
  title,
  subtitle,
  fallbackPath = '/launch/home',
  className,
  inline = false,
}: LaunchPageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Never render back on home itself.
  if (location.pathname === '/launch/home' || location.pathname === '/launch') {
    return null;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <div
      className={cn(
        inline
          ? 'flex items-center gap-3 mb-4'
          : 'flex items-center gap-3 mb-5',
        className
      )}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="inline-flex items-center gap-2 min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl text-sm font-medium text-launch-ink hover:bg-launch-ivory active:scale-[0.98] transition"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      {(title || subtitle) && (
        <div className="min-w-0">
          {title && (
            <h1 className="text-base sm:text-lg font-semibold text-launch-ink leading-tight truncate font-display">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-launch-ink/60 truncate">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LaunchPageHeader;

