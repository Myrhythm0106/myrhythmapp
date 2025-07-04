
import React from "react";
import { cn } from "@/lib/utils";

interface MemoryNodeProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'emerald' | 'teal' | 'brain-health';
  delay?: number;
  className?: string;
}

export function MemoryNode({ 
  size = 'md', 
  color = 'emerald', 
  delay = 0, 
  className 
}: MemoryNodeProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colorClasses = {
    emerald: 'bg-memory-emerald-400',
    teal: 'bg-clarity-teal-400',
    'brain-health': 'bg-brain-health-400'
  };

  return (
    <div 
      className={cn(
        "rounded-full animate-memory-pulse opacity-70",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

interface NeuralPathwayProps {
  from: { x: string; y: string };
  to: { x: string; y: string };
  delay?: number;
  opacity?: number;
  className?: string;
}

export function NeuralPathway({ 
  from, 
  to, 
  delay = 0, 
  opacity = 0.4,
  className 
}: NeuralPathwayProps) {
  return (
    <svg className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}>
      <defs>
        <linearGradient id={`neural-gradient-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#10B981', stopOpacity:0}} />
          <stop offset="50%" style={{stopColor:'#14B8A6', stopOpacity: opacity}} />
          <stop offset="100%" style={{stopColor:'#10B981', stopOpacity:0}} />
        </linearGradient>
      </defs>
      <path 
        d={`M ${from.x} ${from.y} Q 50% 30% ${to.x} ${to.y}`}
        stroke={`url(#neural-gradient-${delay})`}
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
}

export function MemoryEffectsContainer({ 
  children, 
  nodeCount = 4, 
  showPathways = true,
  className 
}: MemoryEffectsContainerProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Memory Nodes */}
      {Array.from({ length: nodeCount }).map((_, i) => (
        <MemoryNode
          key={i}
          size={i % 2 === 0 ? 'sm' : 'md'}
          color={i % 3 === 0 ? 'emerald' : i % 3 === 1 ? 'teal' : 'brain-health'}
          delay={i * 0.5}
          className={`absolute`}
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
        />
      ))}
      
      {/* Neural Pathways */}
      {showPathways && (
        <>
          <NeuralPathway
            from={{ x: '20%', y: '30%' }}
            to={{ x: '80%', y: '70%' }}
            delay={0}
          />
          <NeuralPathway
            from={{ x: '70%', y: '20%' }}
            to={{ x: '30%', y: '80%' }}
            delay={1}
          />
        </>
      )}
      
      {children}
    </div>
  );
}
