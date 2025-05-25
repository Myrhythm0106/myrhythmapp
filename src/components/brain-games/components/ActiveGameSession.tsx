
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, ArrowLeft, Volume2 } from "lucide-react";
import { SequenceGame } from "./games/SequenceGame";
import { MatchingGame } from "./games/MatchingGame";
import { SpatialGame } from "./games/SpatialGame";

interface ActiveGameSessionProps {
  gameType: 'sequence' | 'matching' | 'spatial';
  level: number;
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
}

export function ActiveGameSession({ gameType, level, onComplete, onExit }: ActiveGameSessionProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const gameInfo = {
    sequence: {
      title: "Sequence Recall",
      description: "Watch the sequence carefully, then repeat it exactly",
      icon: <Target className="h-6 w-6" />
    },
    matching: {
      title: "Matching Pairs",
      description: "Find all matching pairs by flipping cards",
      icon: <Brain className="h-6 w-6" />
    },
    spatial: {
      title: "Spatial Memory",
      description: "Remember the locations of highlighted items",
      icon: <Brain className="h-6 w-6" />
    }
  };

  const currentGame = gameInfo[gameType];

  const handleGameStart = () => {
    setGameState('playing');
  };

  const handleGameComplete = (finalScore: number, finalAccuracy: number, finalTimeSpent: number) => {
    setScore(finalScore);
    setAccuracy(finalAccuracy);
    setTimeSpent(finalTimeSpent);
    setGameState('complete');
    
    // Play success sound
    // In a real app, you'd play an actual sound effect here
    console.log("Game completed with success sound!");
  };

  const handleContinue = () => {
    onComplete(score, accuracy, timeSpent);
  };

  if (gameState === 'intro') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentGame.icon}
            </div>
            <CardTitle className="text-2xl">{currentGame.title}</CardTitle>
            <p className="text-muted-foreground">{currentGame.description}</p>
            <Badge variant="outline" className="w-fit mx-auto">
              Level {level}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">How to Play:</h4>
              {gameType === 'sequence' && (
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Watch the sequence of lights or sounds</li>
                  <li>• Wait for the "Your Turn" signal</li>
                  <li>• Repeat the sequence in the exact same order</li>
                  <li>• Complete all rounds to advance</li>
                </ul>
              )}
              {gameType === 'matching' && (
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click cards to flip them over</li>
                  <li>• Find pairs of matching symbols</li>
                  <li>• Match all pairs to complete the level</li>
                  <li>• Fewer attempts = higher score</li>
                </ul>
              )}
              {gameType === 'spatial' && (
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Study the highlighted positions</li>
                  <li>• Remember where each item was located</li>
                  <li>• Click the correct positions when prompted</li>
                  <li>• Get all positions right to advance</li>
                </ul>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onExit} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleGameStart} className="flex-1">
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'complete') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Great Job!</CardTitle>
            <p className="text-muted-foreground">You completed Level {level}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{score}</p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{accuracy}%</p>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{timeSpent}s</p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">Excellent work!</p>
              <p className="text-green-700 text-sm">
                Keep practicing to improve your memory and cognitive abilities.
              </p>
            </div>

            <Button onClick={handleContinue} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the actual game based on type
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onExit}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
          <Badge variant="outline">Level {level}</Badge>
        </div>
        <h2 className="text-lg font-semibold">{currentGame.title}</h2>
      </div>

      {gameType === 'sequence' && (
        <SequenceGame 
          level={level} 
          onComplete={handleGameComplete}
        />
      )}
      {gameType === 'matching' && (
        <MatchingGame 
          level={level} 
          onComplete={handleGameComplete}
        />
      )}
      {gameType === 'spatial' && (
        <SpatialGame 
          level={level} 
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
}
