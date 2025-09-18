import React from 'react';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { Button } from '@/components/ui/button';
import { Heart, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarWithSearchProps {
  showLogo?: boolean;
  showMenu?: boolean;
  className?: string;
}

export function NavbarWithSearch({ 
  showLogo = true, 
  showMenu = false, 
  className = "" 
}: NavbarWithSearchProps) {
  const navigate = useNavigate();

  return (
    <nav className={`sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {showLogo && (
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-beacon-500 to-beacon-700 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-beacon-600 to-beacon-800 bg-clip-text text-transparent">
                MyRhythm
              </span>
            </div>
          )}

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <GlobalSearch />
          </div>

          {/* Mobile Menu & Search */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Icon */}
            <div className="md:hidden">
              <GlobalSearch />
            </div>
            
            {/* Menu Button */}
            {showMenu && (
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Search hint */}
      <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd>
        </span>
      </div>
    </nav>
  );
}