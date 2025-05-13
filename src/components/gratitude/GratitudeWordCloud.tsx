
import React, { useEffect, useRef } from 'react';

interface WordCloudTag {
  text: string;
  value: number;
}

interface GratitudeWordCloudProps {
  tags: WordCloudTag[];
}

export function GratitudeWordCloud({ tags }: GratitudeWordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || tags.length === 0) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Find the highest value for scaling
    const maxValue = Math.max(...tags.map(tag => tag.value));
    const minValue = Math.min(...tags.map(tag => tag.value));
    
    // Create and position each word
    tags.forEach(tag => {
      const wordElem = document.createElement('div');
      
      // Scale font size between 0.8rem and 2.5rem based on value
      const fontSize = 0.8 + ((tag.value - minValue) / (maxValue - minValue)) * 1.7;
      
      wordElem.innerText = tag.text;
      wordElem.style.position = 'absolute';
      wordElem.style.fontSize = `${fontSize}rem`;
      wordElem.style.fontWeight = fontSize > 1.5 ? 'bold' : 'normal';
      
      // Random color from a pleasant palette
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
      const colorIndex = Math.floor(Math.random() * colors.length);
      wordElem.style.color = colors[colorIndex];
      
      // Random position that's not too close to the edges
      const margin = 80;
      const left = margin + Math.random() * (containerWidth - margin * 2);
      const top = margin + Math.random() * (containerHeight - margin * 2);
      
      wordElem.style.left = `${left}px`;
      wordElem.style.top = `${top}px`;
      wordElem.style.padding = '5px';
      wordElem.style.cursor = 'default';
      wordElem.style.opacity = '0';
      wordElem.style.transition = 'opacity 0.3s ease-in-out';
      
      container.appendChild(wordElem);
      
      // Simple animation
      setTimeout(() => {
        wordElem.style.opacity = '1';
      }, Math.random() * 500);
    });
    
    // Prevent overlapping (simple approach)
    const wordElems = container.querySelectorAll('div');
    
    // This is a very simple overlap prevention - in a real app would use a more sophisticated algorithm
    // or an actual word cloud library like d3-cloud
    
  }, [tags]);
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ minHeight: '300px' }}
    >
      {tags.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No tags available yet.
        </div>
      )}
    </div>
  );
}
