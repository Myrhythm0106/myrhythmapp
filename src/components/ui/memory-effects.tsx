
import React from "react";
import { cn } from "@/lib/utils";

interface MemoryNodeProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple-blue' | 'blue-teal' | 'teal-purple' | 'brain-health';
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MemoryNode({ 
  size = 'md', 
  color = 'purple-blue', 
  delay = 0, 
  className,
  style 
}: MemoryNodeProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    'purple-blue': 'bg-gradient-to-r from-purple-400 to-blue-400',
    'blue-teal': 'bg-gradient-to-r from-blue-400 to-teal-400',
    'teal-purple': 'bg-gradient-to-r from-teal-400 to-purple-400',
    'brain-health': 'bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500'
  };

  return (
    <div 
      className={cn(
        "rounded-full animate-pulse opacity-70 border border-emerald-200/20",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{ animationDelay: `${delay}s`, ...style }}
    />
  );
}

interface NeuralPathwayProps {
  from: { x: string; y: string };
  to: { x: string; y: string };
  delay?: number;
  opacity?: number;
  className?: string;
  variant?: 'default' | 'therapeutic';
}

export function NeuralPathway({ 
  from, 
  to, 
  delay = 0, 
  opacity = 0.4,
  className,
  variant = 'default'
}: NeuralPathwayProps) {
  const gradientId = `neural-gradient-${delay}-${variant}`;
  
  return (
    <svg className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          {variant === 'therapeutic' ? (
            <>
              <stop offset="0%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
              <stop offset="25%" style={{stopColor:'#3B82F6', stopOpacity: opacity * 0.8}} />
              <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity: opacity}} />
              <stop offset="60%" style={{stopColor:'#10B981', stopOpacity: opacity * 0.3}} />
              <stop offset="75%" style={{stopColor:'#0891b2', stopOpacity: opacity * 0.8}} />
              <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
            </>
          ) : (
            <>
              <stop offset="0%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
              <stop offset="30%" style={{stopColor:'#3B82F6', stopOpacity: opacity}} />
              <stop offset="70%" style={{stopColor:'#14B8A6', stopOpacity: opacity}} />
              <stop offset="100%" style={{stopColor:'#8B5CF6', stopOpacity:0}} />
            </>
          )}
        </linearGradient>
      </defs>
      <path 
        d={`M ${from.x} ${from.y} Q 50% 30% ${to.x} ${to.y}`}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        className="animate-pulse"
        style={{ animationDelay: `${delay}s` }}
      />
    </svg>
  );
}

interface MemoryEffectsContainerProps {
  children: React.ReactNode;
  nodeCount?: number;
  showPathways?: boolean;
  className?: string;
  variant?: 'default' | 'brain-focus';
}

export function MemoryEffectsContainer({ 
  children, 
  nodeCount = 4, 
  showPathways = true,
  className,
  variant = 'default'
}: MemoryEffectsContainerProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Memory Nodes - purple-blue-teal dominant with tiny emerald therapeutic touches */}
      {Array.from({ length: nodeCount }).map((_, i) => (
        <MemoryNode
          key={i}
          size={i % 2 === 0 ? 'sm' : 'md'}
          color={variant === 'brain-focus' 
            ? (i % 4 === 0 ? 'brain-health' : i % 4 === 1 ? 'purple-blue' : i % 4 === 2 ? 'blue-teal' : 'teal-purple')
            : (i % 3 === 0 ? 'purple-blue' : i % 3 === 1 ? 'blue-teal' : 'teal-purple')
          }
          delay={i * 0.5}
          className="absolute"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}
      
      {/* Neural Pathways - purple-blue-teal with tiny emerald therapeutic touches */}
      {showPathways && (
        <>
          <NeuralPathway
            from={{ x: '20%', y: '30%' }}
            to={{ x: '80%', y: '70%' }}
            delay={0}
            variant={variant === 'brain-focus' ? 'therapeutic' : 'default'}
          />
          <NeuralPathway
            from={{ x: '70%', y: '20%' }}
            to={{ x: '30%', y: '80%' }}
            delay={1}
            variant={variant === 'brain-focus' ? 'therapeutic' : 'default'}
          />
        </>
      )}
      
      {children}
    </div>
  );
}
