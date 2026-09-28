import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentPlace } from './LaunchYouAreHereDial';

interface LaunchPageHeaderProps {
  title?: string;
  subtitle?: string;
  fallbackPath?: string;
  className?: string;
  inline?: boolean;
}

/**
 * One consistent page header for every Launch page (except Home):
 * 56px Back button, gold "Home / Page" breadcrumb and a one-line purpose.
 */
export function LaunchPageHeader({
  title,
  subtitle,
  fallbackPath = '/launch/home',
  className,
}: LaunchPageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const place = useCurrentPlace();

  if (location.pathname === '/launch/home' || location.pathname === '/launch') return null;

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(fallbackPath);
  };

  const pageTitle = title ?? place.label;
  const purpose = subtitle ?? place.purpose;

  return (
    <div className={cn('mb-6 flex items-center gap-4 border-b border-launch-gold/25 pb-4', className)}>
      <button
        type="button"
        onClick={handleBack}
        aria-label="Go back"
        className="inline-flex shrink-0 items-center gap-2 min-h-[56px] min-w-[56px] px-4 rounded-2xl border border-launch-gold/40 bg-white text-base font-semibold text-launch-ink-deep hover:border-launch-gold active:scale-[0.98] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="text-xs font-medium uppercase tracking-[0.14em] text-launch-gold">
          <Link to="/launch/home" className="hover:underline">Home</Link>
          <span className="mx-1.5" aria-hidden="true">/</span>
          <span aria-current="page">{pageTitle}</span>
        </nav>
        {purpose && <p className="mt-0.5 text-base text-launch-ink/75 truncate">{purpose}</p>}
      </div>
    </div>
  );
}

export default LaunchPageHeader;
