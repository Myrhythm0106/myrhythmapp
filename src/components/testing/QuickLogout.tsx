import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function QuickLogout() {
  const { signOut, user } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="bg-background/80 backdrop-blur-sm"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Test Landing (Logout)
      </Button>
    </div>
  );
}