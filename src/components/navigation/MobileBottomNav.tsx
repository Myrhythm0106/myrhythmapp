import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Brain, Calendar, User, Target } from 'lucide-react';
import { useNav } from './NavContext';
import { haptics } from '@/utils/haptics/hapticFeedback';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  color: string; // Color semantic: purple, teal, blue, orange
}

const navItems: NavItem[] = [
  {
    icon: Home,
    label: 'Home',
    path: '/dashboard',
    color: 'purple', // Empowerment
  },
  {
    icon: Brain,
    label: 'Memory',
    path: '/memory-bridge',
    color: 'teal', // Cognitive clarity
  },
  {
    icon: Target,
    label: 'Steps',
    path: '/next-steps',
    color: 'green', // Progress & growth
  },
  {
    icon: Calendar,
    label: 'Calendar',
    path: '/calendar',
    color: 'blue', // Trust & structure
  },
  {
    icon: User,
    label: 'Profile',
    path: '/settings',
    color: 'orange', // Action
  },
];

const colorClasses = {
  purple: {
    active: 'bg-neural-purple-500 text-white',
    inactive: 'text-gray-600 hover:text-neural-purple-600',
  },
  teal: {
    active: 'bg-clarity-teal-500 text-white',
    inactive: 'text-gray-600 hover:text-clarity-teal-600',
  },
  green: {
    active: 'bg-brain-health-500 text-white',
    inactive: 'text-gray-600 hover:text-brain-health-600',
  },
  blue: {
    active: 'bg-neural-blue-500 text-white',
    inactive: 'text-gray-600 hover:text-neural-blue-600',
  },
  orange: {
    active: 'bg-brand-orange-500 text-white',
    inactive: 'text-gray-600 hover:text-brand-orange-600',
  },
};

export function MobileBottomNav() {
  const navigate = useNavigate();
  const { isActive } = useNav();

  const handleNavigation = (path: string) => {
    haptics.light();
    navigate(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 pb-safe-bottom"
      style={{ height: 'calc(64px + env(safe-area-inset-bottom))' }}
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neural-purple-500 via-neural-blue-500 to-clarity-teal-500" />
      
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const colors = colorClasses[item.color as keyof typeof colorClasses];

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[64px] min-h-[48px]",
                active ? colors.active : colors.inactive
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn("h-6 w-6", active && "scale-110")} />
              <span className={cn(
                "text-xs font-medium",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
