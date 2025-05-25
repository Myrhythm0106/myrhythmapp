
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SpatialGameProps {
  level: number;
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
}

export function SpatialGame({ level, onComplete }: SpatialGameProps) {
  const [gameState, setGameState] = useState<'showing' | 'waiting' | 'playing' | 'complete'>('showing');
  const [gridSize] = useState(Math.min(3 + Math.floor(level / 4), 6));
  const [targetPositions, setTargetPositions] = useState<number[]>([]);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [showingPositions, setShowingPositions] = useState<number[]>([]);
  const [startTime] = useState(Date.now());
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);

  const numTargets = Math.min(2 + Math.floor(level / 2), 8);
  const displayTime = Math.max(2000 - (level * 100), 1000);

  useEffect(() => {
    startNewRound();
  }, [level]);

  const startNewRound = () => {
    const totalCells = gridSize * gridSize;
    const positions: number[] = [];
    
    while (positions.length < numTargets) {
      const randomPos = Math.floor(Math.random() * totalCells);
      if (!positions.includes(randomPos)) {
        positions.push(randomPos);
      }
    }
    
    setTargetPositions(positions);
    setUserSelections([]);
    setShowingPositions([]);
    
    // Show positions one by one
    showTargetPositions(positions);
  };

  const showTargetPositions = async (positions: number[]) => {
    setGameState('showing');
    
    for (let i = 0; i < positions.length; i++) {
      setShowingPositions([positions[i]]);
      await new Promise(resolve => setTimeout(resolve, displayTime / positions.length));
    }
    
    setShowingPositions([]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setGameState('playing');
  };

  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'playing') return;
    if (userSelections.includes(cellIndex)) return;

    const newSelections = [...userSelections, cellIndex];
    setUserSelections(newSelections);

    if (newSelections.length === targetPositions.length) {
      // Check if all selections are correct
      const correctSelections = newSelections.filter(pos => targetPositions.includes(pos));
      const accuracy = Math.round((correctSelections.length / targetPositions.length) * 100);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      
      if (correctSelections.length === targetPositions.length) {
        // Perfect round
        const roundScore = Math.round((numTargets * 100) / timeSpent);
        setScore(prev => prev + roundScore);
        
        if (currentRound >= 3) {
          // Game complete
          setGameState('complete');
          onComplete(score + roundScore, accuracy, timeSpent);
        } else {
          // Next round
          setCurrentRound(prev => prev + 1);
          setTimeout(() => startNewRound(), 1000);
        }
      } else {
        // Some mistakes
        setGameState('complete');
        onComplete(score, accuracy, timeSpent);
      }
    }
  };

  const getCellStyle = (cellIndex: number) => {
    if (showingPositions.includes(cellIndex)) {
      return 'bg-blue-500 text-white';
    }
    if (userSelections.includes(cellIndex)) {
      if (targetPositions.includes(cellIndex)) {
        return 'bg-green-500 text-white';
      } else {
        return 'bg-red-500 text-white';
      }
    }
    return 'bg-gray-200 hover:bg-gray-300';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {gameState === 'showing' && 'Remember these positions...'}
              {gameState === 'playing' && 'Click the positions you saw!'}
              {gameState === 'complete' && 'Round complete!'}
            </h3>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Round: {currentRound}/3</span>
              <span>Targets: {numTargets}</span>
              <span>Selected: {userSelections.length}/{targetPositions.length}</span>
            </div>
            <Progress 
              value={(userSelections.length / targetPositions.length) * 100} 
              className="w-full mt-2" 
            />
          </div>

          <div 
            className="grid gap-2 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              maxWidth: `${gridSize * 60}px`
            }}
          >
            {Array.from({ length: gridSize * gridSize }, (_, index) => (
              <Button
                key={index}
                className={`h-12 w-12 p-0 transition-all duration-200 ${getCellStyle(index)}`}
                onClick={() => handleCellClick(index)}
                disabled={gameState !== 'playing'}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
