import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Expand, Minimize2 } from "lucide-react";

interface MyRhythmStep {
  letter: string;
  word: string;
  phase: string;
  description: string;
  memoryFocus?: string;
  icon: string;
  imageUrl?: string;
}

interface ExpandableMyRhythmCardsProps {
  steps: MyRhythmStep[];
  variant?: 'landing' | 'onboarding' | 'framework';
  showExpandAll?: boolean;
  className?: string;
}

export function ExpandableMyRhythmCards({ 
  steps, 
  variant = 'landing', 
  showExpandAll = true,
  className = '' 
}: ExpandableMyRhythmCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  
  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };
  
  const expandAll = () => {
    setExpandedCards(new Set(Array.from({ length: steps.length }, (_, i) => i)));
  };
  
  const collapseAll = () => {
    setExpandedCards(new Set());
  };
  
  const allExpanded = expandedCards.size === steps.length;
  const noneExpanded = expandedCards.size === 0;

  // Get appropriate image for each step
  const getStepImage = (index: number) => {
    const images = [
      'photo-1581091226825-a6a2a5aee158', // brain/mindset
      'photo-1500673922987-e212871fec22', // yield/nature
      'photo-1485827404703-89b55fcc595e', // restore/energy
      'photo-1526374965328-7f61d4dc18c5', // harness/community
      'photo-1501854140801-50d01698950b', // yield/victories
      'photo-1485827404703-89b55fcc595e', // take/transform
      'photo-1500673922987-e212871fec22', // heal/hope
      'photo-1526374965328-7f61d4dc18c5'  // multiply/mission
    ];
    return `https://images.unsplash.com/${images[index % images.length]}?w=400&h=200&fit=crop`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Expand/Collapse All Controls */}
      {showExpandAll && (
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            {allExpanded ? (
              <>
                <Minimize2 className="h-4 w-4 mr-2" />
                Collapse All
              </>
            ) : (
              <>
                <Expand className="h-4 w-4 mr-2" />
                Expand All
              </>
            )}
          </Button>
        </div>
      )}

      {/* Cards Grid */}
      <div className={`grid gap-4 ${
        variant === 'onboarding' 
          ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {steps.map((step, index) => {
          const isExpanded = expandedCards.has(index);
          
          return (
            <Collapsible
              key={`${step.letter}-${index}`}
              open={isExpanded}
              onOpenChange={() => toggleCard(index)}
            >
              <div className={`
                relative group bg-gradient-to-br from-white via-purple-50/10 to-blue-50/15 
                border border-purple-200/30 rounded-xl shadow-sm hover:shadow-lg 
                transition-all duration-300 overflow-hidden
                ${isExpanded ? 'shadow-lg border-primary/40' : 'hover:border-primary/20'}
              `}>
                {/* Collapsed State - Always Visible */}
                <CollapsibleTrigger className="w-full text-left p-0 hover:bg-transparent">
                  <div className="p-4 space-y-3">
                    {/* Image */}
                    <div className="relative h-24 w-full rounded-lg overflow-hidden">
                      <img 
                        src={getStepImage(index)}
                        alt={`${step.word} illustration`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute bottom-2 right-2 text-2xl">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Letter Circle */}
                    <div className="flex items-center justify-between">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                        ${isExpanded 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 ring-4 ring-indigo-300' 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                        }
                      `}>
                        {step.letter}
                      </div>
                      
                      {/* Expand/Collapse Indicator */}
                      <div className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    
                    {/* Word and Phase */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{step.word}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{step.phase}</p>
                    </div>
                  </div>
                </CollapsibleTrigger>

                {/* Expanded Content */}
                <CollapsibleContent className="border-t border-purple-100/50">
                  <div className="p-4 space-y-3 bg-gradient-to-b from-purple-50/20 to-transparent">
                    {/* Full Description */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-primary">Description</h4>
                      <p className="text-sm text-foreground leading-relaxed">{step.description}</p>
                    </div>
                    
                    {/* Memory Focus (if provided) */}
                    {step.memoryFocus && (
                      <div className="p-3 bg-gradient-to-r from-purple-50/60 via-blue-50/50 to-teal-50/60 rounded-lg border-l-2 border-l-primary">
                        <h4 className="font-medium text-xs text-primary mb-1">Memory-First Focus:</h4>
                        <p className="text-xs text-muted-foreground">{step.memoryFocus}</p>
                      </div>
                    )}
                    
                    {/* Current Step Indicator */}
                    {isExpanded && (
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          Exploring Step {index + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
      
      {/* Framework Summary (only for landing variant) */}
      {variant === 'landing' && (
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 via-blue-50/30 to-teal-50/30 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
            <span className="font-semibold text-primary">Memory-First Approach</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your personalized journey follows the MyRhythm framework with memory wellness as the foundation. 
            Each phase builds both your memory capabilities and other life skills that support cognitive wellness.
          </p>
        </div>
      )}
    </div>
  );
}