import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', path: '/', icon: <Home className="h-3 w-3" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ label, path: currentPath });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.path}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className="h-auto p-1 text-xs hover:text-primary flex items-center gap-1"
          >
            {item.icon}
            {item.label}
          </Button>
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="h-3 w-3" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}