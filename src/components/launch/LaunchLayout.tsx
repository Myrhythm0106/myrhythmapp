import React, { ReactNode } from 'react';
import { LaunchNav } from './LaunchNav';
import { GrowthFooter } from './GrowthFooter';
import { AccountDropdown } from './AccountDropdown';
import { SupportCircleBadge } from './SupportCircleBadge';
import { WhatsNewBadge } from './WhatsNewBadge';
import { LaunchQuickActions } from './LaunchQuickActions';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-memory-emerald-50 via-brain-health-50/40 to-clarity-teal-50 flex flex-col">
      {/* Top Header Bar */}
      {showHeader && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-teal-200/50 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-teal-500 via-brand-emerald-500 to-brand-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-brand-teal-600 to-brand-emerald-600 bg-clip-text text-transparent">
                MyRhythm
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <WhatsNewBadge />
              <SupportCircleBadge />
              <AccountDropdown />
            </div>
          </div>
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
  );
}
