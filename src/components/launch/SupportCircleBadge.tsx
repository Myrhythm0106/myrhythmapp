import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupportCircleMessaging } from '@/hooks/use-support-circle-messaging';
import { cn } from '@/lib/utils';

export function SupportCircleBadge() {
  const navigate = useNavigate();
  const { unreadCount } = useSupportCircleMessaging();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate('/launch/support')}
      className={cn(
        "relative h-10 px-3 rounded-xl",
        "hover:bg-brand-emerald-50 transition-colors",
        unreadCount > 0 && "bg-brand-emerald-50"
      )}
    >
      <Users className={cn(
        "h-5 w-5",
        unreadCount > 0 ? "text-brand-emerald-600" : "text-gray-600"
      )} />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      
      <span className="ml-2 text-sm font-medium hidden sm:inline">
        Support
      </span>
    </Button>
  );
}
