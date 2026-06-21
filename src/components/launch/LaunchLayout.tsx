import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LaunchNav } from './LaunchNav';
import { GrowthFooter } from './GrowthFooter';
import { AccountDropdown } from './AccountDropdown';

import { WhatsNewBadge } from './WhatsNewBadge';
import { LaunchQuickActions } from './LaunchQuickActions';
import { EditionBadge } from './EditionBadge';
import { LaunchPageHeader } from './LaunchPageHeader';
import { HelpCircle } from 'lucide-react';
import { usePersona } from '@/launch/persona/usePersona';
import { SubjectProvider } from '@/launch/persona/SubjectContext';
import { SubjectSwitch } from '@/launch/persona/SubjectSwitch';

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
  const { isCaregiver } = usePersona();

  return (
    <SubjectProvider>
      <div className="min-h-screen bg-[#fafbfc] flex flex-col">
        {/* Top Header Bar */}
        {showHeader && (
          <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-brain-health-100 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 bg-brand-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">M</span>
                </div>
                <span className="font-semibold text-lg text-brain-health-900 tracking-tight">
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
                <WhatsNewBadge />

                {/* Help Button */}
                <button
                  onClick={() => navigate('/help/getting-started')}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  title="How to use MyRhythm"
                  aria-label="Help and guides"
                >
                  <HelpCircle className="h-5 w-5 text-gray-600" />
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
