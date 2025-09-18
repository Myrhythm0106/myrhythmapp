import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  isCurrent?: boolean;
}

interface NavigationBreadcrumbProps {
  items?: BreadcrumbItem[];
  showBackButton?: boolean;
  showSearchHint?: boolean;
  className?: string;
}

export function NavigationBreadcrumb({ 
  items, 
  showBackButton = true, 
  showSearchHint = true,
  className = '' 
}: NavigationBreadcrumbProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/', icon: <Home className="h-4 w-4" /> }
    ];

    if (path.includes('/mvp/')) {
      breadcrumbs.push({ label: 'Onboarding', path: '/mvp' });
      
      if (path.includes('assessment')) {
        breadcrumbs.push({ label: 'Assessment', isCurrent: true });
      } else if (path.includes('payment')) {
        breadcrumbs.push({ label: 'Payment', isCurrent: true });
      } else if (path.includes('privacy')) {
        breadcrumbs.push({ label: 'Privacy Setup', isCurrent: true });
      }
    } else if (path.includes('/memory-bridge')) {
      breadcrumbs.push({ label: 'Memory Bridge', isCurrent: true });
    } else if (path.includes('/guided-journey')) {
      breadcrumbs.push({ label: 'Guided Setup', isCurrent: true });
    } else if (path.includes('/dashboard')) {
      breadcrumbs.push({ label: 'Dashboard', isCurrent: true });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const canGoBack = window.history.length > 1;

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.path && !item.isCurrent) {
      navigate(item.path);
    }
  };

  return (
    <div className={`flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-border/50 px-4 py-2 ${className}`}>
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        <nav className="flex items-center space-x-1">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Button
                variant={item.isCurrent ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleBreadcrumbClick(item)}
                className={`
                  h-auto py-1 px-2 
                  ${item.isCurrent ? 'cursor-default' : 'cursor-pointer hover:bg-muted'}
                `}
                disabled={item.isCurrent}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </Button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {showSearchHint && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Search className="h-3 w-3 mr-1" />
            Ctrl+K to search
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/search')}
            className="text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}