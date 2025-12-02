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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-brand-teal-200/50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px] min-h-[56px] justify-center",
              isActive(item.url) 
                ? "bg-brand-emerald-100 text-brand-emerald-700" 
                : "text-gray-500 hover:text-brand-emerald-600 hover:bg-brand-emerald-50"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 transition-transform",
              isActive(item.url) && "scale-110"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isActive(item.url) && "font-semibold"
            )}>
              {item.title}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
