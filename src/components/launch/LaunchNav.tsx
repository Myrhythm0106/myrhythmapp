import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Mic, CheckSquare, Activity, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// The bottom bar is the 4C loop + Home. Everything else lives one tap away
// on Home tiles or in the You-Are-Here dial.
const navItems = [
  { title: 'Home', url: '/launch/home', icon: Home },
  { title: 'Capture', url: '/launch/capture', icon: Mic },
  { title: 'Commit', url: '/launch/commit', icon: CheckSquare },
  { title: 'Calibrate', url: '/launch/calibrate', icon: Activity },
  { title: 'Celebrate', url: '/launch/celebrate', icon: Sparkles },
];

export function LaunchNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-launch-ivory/95 backdrop-blur-md border-t border-launch-gold/20 md:hidden pb-safe">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all min-w-[56px] min-h-[56px] justify-center relative",
              isActive ? "text-launch-ink" : "text-launch-ink/40 hover:text-launch-ink/80"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
                <span className={cn("text-[11px]", isActive ? "font-semibold" : "font-medium")}>
                  {item.title}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-launch-ember" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
