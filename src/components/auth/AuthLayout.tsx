
import React from 'react';
import { Heart } from 'lucide-react';
import { AuthTabs } from './AuthTabs';

interface AuthLayoutProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">MyRhythm</h1>
          </div>
          <p className="text-gray-600">{title}</p>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {children || <AuthTabs />}
      </div>
    </div>
  );
};
