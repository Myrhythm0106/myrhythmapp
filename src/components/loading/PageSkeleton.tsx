import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Full-page skeleton loader for lazy-loaded routes
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-purple-50/30 via-neural-blue-50/20 to-clarity-teal-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 bg-gradient-to-r from-neural-purple-200/50 to-neural-blue-200/50" />
          <Skeleton className="h-4 w-96 bg-clarity-teal-200/50" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl bg-gradient-to-br from-clarity-teal-100/50 to-neural-purple-100/50" />
              <Skeleton className="h-4 w-3/4 bg-neural-blue-200/50" />
              <Skeleton className="h-4 w-1/2 bg-clarity-teal-200/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
