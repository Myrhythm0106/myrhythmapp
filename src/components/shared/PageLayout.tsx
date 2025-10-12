
import React from 'react';
import { Preview3Background } from '@/components/ui/Preview3Background';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function PageLayout({ children, title, description, className = "" }: PageLayoutProps) {
  return (
    <Preview3Background>
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neural-purple-600 via-neural-magenta-600 to-neural-blue-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </Preview3Background>
  );
}
