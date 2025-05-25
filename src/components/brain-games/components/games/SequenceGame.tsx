
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SequenceGameProps {
  level: number;
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
}

export function SequenceGame({ level, onComplete }: SequenceGameProps) {
  const [gameState, setGameState] = useState<'showing' | 'waiting' | 'playing' | 'complete'>('showing');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const [activeButton, setActiveButton] = useState<number | null>(null);

  const sequenceLength = Math.min(3 + level, 12);
  const displaySpeed = Math.max(800 - (level * 50), 300);

  useEffect(() => {
    // Generate random sequence
    const newSequence = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    
    // Show sequence
    showSequence(newSequence);
  }, [level]);

  const showSequence = async (seq: number[]) => {
    setGameState('showing');
    
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, displaySpeed));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, displaySpeed));
      setActiveButton(null);
    }
    
    setGameState('playing');
  };

  const handleButtonClick = (buttonIndex: number) => {
    if (gameState !== 'playing') return;

    const newUserSequence = [...userSequence, buttonIndex];
    setUserSequence(newUserSequence);

    if (buttonIndex === sequence[userSequence.length]) {
      // Correct
      if (newUserSequence.length === sequence.length) {
        // Sequence complete
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalScore = Math.round((sequence.length * 100) / timeSpent);
        const accuracy = 100;
        
        setScore(finalScore);
        setGameState('complete');
        onComplete(finalScore, accuracy, timeSpent);
      }
    } else {
      // Incorrect
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((userSequence.length / sequence.length) * 100);
      
      setGameState('complete');
      onComplete(score, accuracy, timeSpent);
    }
  };

  const getButtonColor = (index: number) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    const activeColors = ['bg-red-600', 'bg-blue-600', 'bg-green-600', 'bg-yellow-600'];
    
    return activeButton === index ? activeColors[index] : colors[index];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {gameState === 'showing' && 'Watch the sequence...'}
              {gameState === 'playing' && 'Now repeat the sequence!'}
              {gameState === 'complete' && 'Sequence complete!'}
            </h3>
            <Progress 
              value={(userSequence.length / sequence.length) * 100} 
              className="w-full" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {[0, 1, 2, 3].map((index) => (
              <Button
                key={index}
                className={`h-20 w-20 rounded-full ${getButtonColor(index)} hover:opacity-80 transition-all duration-200`}
                onClick={() => handleButtonClick(index)}
                disabled={gameState !== 'playing'}
              />
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Sequence length: {sequence.length}</p>
            <p>Progress: {userSequence.length}/{sequence.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
