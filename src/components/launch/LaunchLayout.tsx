import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LaunchNav } from './LaunchNav';
import { GrowthFooter } from './GrowthFooter';
import { AccountDropdown } from './AccountDropdown';

import { WhatsNewBadge } from './WhatsNewBadge';
import { LaunchQuickActions } from './LaunchQuickActions';
import { EditionBadge } from './EditionBadge';
import { LaunchPageHeader } from './LaunchPageHeader';
import { LaunchYouAreHereDial } from './LaunchYouAreHereDial';
import { HelpCircle } from 'lucide-react';
import { usePersona } from '@/launch/persona/usePersona';
import { SubjectProvider } from '@/launch/persona/SubjectContext';
import { SubjectSwitch } from '@/launch/persona/SubjectSwitch';
import { useAuth } from '@/hooks/useAuth';
import { useMembershipStatus } from '@/hooks/useMembershipStatus';


const PRE_ACCOUNT_PATHS = new Set([
  '/launch/welcome',
  '/launch/signin',
  '/launch/signup',
  '/launch/user-type',
  '/launch/assessment',
]);

interface LaunchLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
}

export function LaunchLayout({ 
  children, 
  showNav = true, 
  showFooter = true,
  showHeader = true 
}: LaunchLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCaregiver } = usePersona();
  const { user } = useAuth();
  const { hasMembership } = useMembershipStatus();

  const showBack =
    location.pathname !== '/launch/home' && location.pathname !== '/launch';
  // Dial is a premium wayfinder — only surface once the user has a real
  // membership (paid sub, active trial with card on file, or founding code).
  const showDial =
    !!user && hasMembership && !PRE_ACCOUNT_PATHS.has(location.pathname);
  const isWelcomePage = location.pathname === '/launch/welcome';

  return (
    <SubjectProvider>
      <div className={cn(
        "launch-theme min-h-screen flex flex-col",
        isWelcomePage ? "bg-[hsl(var(--launch-cream))]" : "bg-[hsl(var(--launch-cream-light))]"
      )}>

        {/* Top Header Bar */}
        {showHeader && (
          <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[hsl(var(--launch-ink)/0.10)] px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-[hsl(var(--launch-ink))] rounded-lg flex items-center justify-center ring-1 ring-[hsl(var(--launch-gold)/0.55)]">
                  <span className="text-[hsl(var(--launch-gold))] font-semibold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>M</span>
                </div>
                <span className="font-semibold text-lg text-[hsl(var(--launch-ink))] tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                  MyRhythm
                </span>
                <EditionBadge variant="chip" className="hidden sm:inline-flex ml-1" />
              </div>

              {isCaregiver && (
                <div className="hidden md:flex flex-1 justify-center">
                  <SubjectSwitch />
                </div>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                {showDial && <LaunchYouAreHereDial />}
                <WhatsNewBadge />

                {/* Help Button */}
                <button
                  onClick={() => navigate('/help/getting-started')}
                  className="w-9 h-9 rounded-full bg-launch-gold/10 hover:bg-launch-gold/20 flex items-center justify-center transition-colors"
                  title="How to use MyRhythm"
                  aria-label="Help and guides"
                >
                  <HelpCircle className="h-5 w-5 text-launch-ink/70" />
                </button>


                <AccountDropdown />
              </div>
            </div>
            {isCaregiver && (
              <div className="md:hidden mt-2 flex justify-center">
                <SubjectSwitch />
              </div>
            )}
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {showBack && <LaunchPageHeader />}
            {children}
          </div>
        </main>

        {/* Growth Footer */}
        {showFooter && <GrowthFooter />}

        {/* Global Quick Actions - Always visible */}
        <LaunchQuickActions />

        {/* Bottom Navigation (Mobile) */}
        {showNav && <LaunchNav />}
      </div>
    </SubjectProvider>
  );
}
