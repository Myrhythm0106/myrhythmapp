
import React from 'react';
import { cn } from '@/lib/utils';

interface PainPointImageCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  className?: string;
}

export const PainPointImageCard = ({ 
  title, 
  description, 
  imageUrl, 
  imageAlt, 
  className 
}: PainPointImageCardProps) => {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl",
      className
    )}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <div className="transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm md:text-base opacity-90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      
      {/* Subtle Border Effect */}
      <div className="absolute inset-0 border border-white/20 rounded-2xl" />
      
      {/* Accessibility */}
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="sr-only" 
        aria-hidden="true" 
      />
    </div>
  );
};
