import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Calendar, Camera, Gamepad2, Heart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Home', url: '/launch/home', icon: Home },
  { title: 'Calendar', url: '/launch/calendar', icon: Calendar },
  { title: 'Memory', url: '/launch/memory', icon: Camera },
  { title: 'Games', url: '/launch/games', icon: Gamepad2 },
  { title: 'Gratitude', url: '/launch/gratitude', icon: Heart },
  { title: 'Support', url: '/launch/support', icon: Users },
];

export function LaunchNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brain-health-100 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px] min-h-[56px] justify-center relative",
              isActive(item.url)
                ? "text-brain-health-900"
                : "text-brain-health-400 hover:text-brain-health-700"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={1.75} />
            <span className={cn(
              "text-[11px]",
              isActive(item.url) ? "font-semibold" : "font-medium"
            )}>
              {item.title}
            </span>
            {isActive(item.url) && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-[hsl(var(--launch-ember))]" />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
