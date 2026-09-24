import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LaunchNav } from './LaunchNav';
import { GrowthFooter } from './GrowthFooter';
import { AccountDropdown } from './AccountDropdown';

import { WhatsNewBadge } from './WhatsNewBadge';
import { CaptureDock } from './CaptureDock';
import { EditionBadge } from './EditionBadge';
import { LaunchPageHeader } from './LaunchPageHeader';
import { LaunchYouAreHereDial } from './LaunchYouAreHereDial';
import { HelpCircle } from 'lucide-react';
import { usePersona } from '@/launch/persona/usePersona';
import { SubjectProvider } from '@/launch/persona/SubjectContext';
import { SubjectSwitch } from '@/launch/persona/SubjectSwitch';
import { useAuth } from '@/hooks/useAuth';
import { useAppReady } from '@/hooks/useAppReady';




// Onboarding steps — the dial stays hidden until the user reaches Home.
const ONBOARDING_PATHS = new Set([
  '/launch/welcome',
  '/launch/signin',
  '/launch/signup',
  '/launch/register',
  '/launch/user-type',
  '/launch/assessment',
  '/launch/payment',
  '/launch/welcome',
]);

// Full-screen self-contained onboarding screens. They render their own
// h-[100svh] shell with internal scrolling and their own back button, so
// the layout must not add header, back row, page padding or bottom nav
// on top (that caused duplicate back buttons and double scrollbars).
const SELF_CONTAINED_PATHS = new Set([
  '/launch/register',
  '/launch/user-type',
  '/launch/payment',
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
  const appReady = useAppReady();
  const isOnboardingPath = ONBOARDING_PATHS.has(location.pathname);
  const isSelfContained = SELF_CONTAINED_PATHS.has(location.pathname);

  const showBack =
    location.pathname !== '/launch/home' && location.pathname !== '/launch';
  // Dial appears once onboarding is done and the user has landed on Home,
  // then stays available everywhere inside the app.
  const showDial = appReady && !isOnboardingPath;

  const isWelcomePage = location.pathname === '/launch/welcome';


  return (
    <SubjectProvider>
      <div className={cn(
        "launch-theme min-h-[100svh] flex flex-col pb-safe px-safe",
        isWelcomePage ? "bg-[hsl(var(--launch-cream))]" : "bg-[hsl(var(--launch-cream-light))]"
      )}>

        {/* Top Header Bar */}
        {showHeader && !isSelfContained && (
          <header className="sticky top-0 z-[75] bg-launch-ivory/90 backdrop-blur-md border-b border-launch-gold/30 px-4 py-3 pt-safe">

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
        {isSelfContained ? (
          <main className="flex-1">{children}</main>
        ) : (
          <main className="flex-1 pb-20 md:pb-6">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {showBack && <LaunchPageHeader />}
              {children}
            </div>
          </main>
        )}

        {/* Growth Footer */}
        {showFooter && <GrowthFooter />}

        {/* Persistent capture — one tap from anywhere */}
        {!isOnboardingPath && <CaptureDock />}

        {/* Bottom Navigation (Mobile) */}
        {showNav && <LaunchNav />}

      </div>
    </SubjectProvider>
  );
}
