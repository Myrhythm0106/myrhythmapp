import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, HelpCircle, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function AccountDropdown() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/launch');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-brand-emerald-50"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-emerald-400 to-brand-teal-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">
            {user?.email?.split('@')[0] || 'My Account'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || 'Not signed in'}
          </p>
        </div>
        
        <DropdownMenuItem 
          onClick={() => navigate('/launch/profile')}
          className="gap-2 py-2.5 cursor-pointer"
        >
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/launch/features')}
          className="gap-2 py-2.5 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Feature Store
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate('/launch/support')}
          className="gap-2 py-2.5 cursor-pointer"
        >
          <HelpCircle className="h-4 w-4" />
          Support
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="gap-2 py-2.5 cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
