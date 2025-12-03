import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, Camera, Gamepad2, Heart, Compass, Users, Home,
  Map, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  label: string;
  icon: React.ElementType;
  path: string | null;
  color: string;
  action?: string;
}

const quickActions: QuickAction[] = [
  { label: 'Home', icon: Home, path: '/launch/home', color: 'bg-brand-teal-500' },
  { label: 'Calendar', icon: Calendar, path: '/launch/calendar', color: 'bg-blue-500' },
  { label: 'Record Memory', icon: Camera, path: '/launch/memory', color: 'bg-brand-emerald-500' },
  { label: 'Brain Game', icon: Gamepad2, path: '/launch/games', color: 'bg-purple-500' },
  { label: 'Gratitude', icon: Heart, path: '/launch/gratitude', color: 'bg-rose-500' },
  { label: 'Support Circle', icon: Users, path: '/launch/support', color: 'bg-amber-500' },
  { label: 'Take a Tour', icon: Map, path: null, color: 'bg-indigo-500', action: 'tour' },
  { label: 'Help & Guide', icon: HelpCircle, path: '/help/getting-started', color: 'bg-gray-500' },
];

export function LaunchQuickActions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Filter out current page from quick actions (only for path-based actions)
  const availableActions = quickActions.filter(
    action => action.path !== location.pathname
  );

  const handleAction = (action: QuickAction) => {
    if (action.action === 'tour') {
      // Emit event to show tour
      window.dispatchEvent(new CustomEvent('show-launch-tour'));
      setIsOpen(false);
    } else if (action.path) {
      navigate(action.path);
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 md:bottom-20 z-40">
      <div className="relative">
        {/* Quick Action Options */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
            {availableActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleAction(action)}
                className="flex items-center gap-3 bg-white shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl transition-shadow min-h-[48px]"
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", action.color)}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-gray-900 whitespace-nowrap">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-[-1]" 
            onClick={() => setIsOpen(false)} 
          />
        )}

        {/* Main FAB - Compass for Navigation */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
            isOpen 
              ? "bg-gray-900 scale-110" 
              : "bg-gradient-to-br from-brand-emerald-500 to-brand-teal-500"
          )}
        >
          <Compass className={cn("h-6 w-6 text-white transition-transform duration-300", isOpen && "rotate-90")} />
        </button>
      </div>
    </div>
  );
}
