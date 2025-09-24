import { useEffect } from 'react';

export function AutoRedirectToAuth() {
  useEffect(() => {
    // Redirect to auth page
    window.location.href = '/auth';
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/60 via-blue-50/50 to-teal-50/60 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  );
}