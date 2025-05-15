
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function BrainRecoveryHomeSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 p-6 md:p-10 h-[300px] md:h-[350px]">
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-full" />
          
          <div className="bg-gray-200 p-4 rounded-lg mt-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
      
      {/* Essential Tools Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4 shadow-sm">
              <Skeleton className="h-6 w-32 mb-2" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Why MyRhythm Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-72" />
        
        <div className="border rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-2/3 mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4 mt-2" />
          </div>
        </div>
      </div>
      
      {/* Our Story Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        
        <div className="border rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gray-100 p-6 flex items-center justify-center">
              <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            
            <div className="md:w-2/3 p-6">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <Skeleton className="h-10 w-32 mt-2" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Community CTA Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-72" />
        
        <div className="border rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-1/2 mb-4" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-10 w-full" />
            ))}
          </div>
          
          <Skeleton className="h-px w-full my-4" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full sm:w-64" />
          </div>
        </div>
        
        <div className="text-center py-6">
          <Skeleton className="h-4 w-72 mx-auto mb-2" />
          <div className="flex justify-center gap-4 mt-2">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-4 w-20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
