
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Brain, Star } from "lucide-react";

interface GameSessionProps {
  gameId: string;
  gameName: string;
  gameIcon: React.ReactNode;
  difficultyLevel: "Low" | "Medium" | "High";
  onClose: () => void;
}

export function GameSession({ gameId, gameName, gameIcon, difficultyLevel, onClose }: GameSessionProps) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game session
  const [gameStarted, setGameStarted] = useState(false);
  const [gameItems, setGameItems] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [round, setRound] = useState(1);

  // Initialize the game
  useEffect(() => {
    if (gameStarted && !gameComplete) {
      // Set up the game items based on difficulty
      const itemCount = difficultyLevel === "Low" ? 3 : 
                        difficultyLevel === "Medium" ? 5 : 7;
      
      // Generate random numbers for the game
      const newItems = Array.from({ length: itemCount }, () => 
        Math.floor(Math.random() * 9) + 1
      );
      
      setGameItems(newItems);
      
      // Start the timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [gameStarted, round, difficultyLevel]);
  
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(60);
    setGameComplete(false);
    toast({
      title: "Game Started!",
      description: `${gameName} - ${difficultyLevel} difficulty`
    });
  };
  
  const endGame = () => {
    setGameComplete(true);
    setGameStarted(false);
    toast({
      title: "Game Complete!",
      description: `You scored ${score} points! Great job!`,
      variant: "default"
    });
  };
  
  const handleItemClick = (item: number) => {
    if (gameComplete) return;
    
    // Add item to selected items
    setSelectedItems(prev => {
      const newSelected = [...prev, item];
      
      // Check if all items are selected correctly
      if (newSelected.length === gameItems.length) {
        // Compare arrays
        const correct = newSelected.every((val, index) => val === gameItems[index]);
        
        if (correct) {
          // Increase score
          setScore(prev => prev + 10 * gameItems.length);
          toast({
            title: "Correct pattern!",
            description: `+${10 * gameItems.length} points`,
          });
          
          // Move to next round
          setRound(prev => prev + 1);
          setSelectedItems([]);
        } else {
          toast({
            title: "Incorrect pattern",
            description: "Try again!",
            variant: "destructive"
          });
          setSelectedItems([]);
        }
      }
      
      return newSelected;
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {gameIcon}
          <CardTitle className="text-xl">{gameName}</CardTitle>
        </div>
        <Badge variant="outline">{difficultyLevel} Difficulty</Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!gameStarted && !gameComplete ? (
          <div className="text-center py-8 space-y-4">
            <Brain className="h-16 w-16 text-primary mx-auto" />
            <h3 className="text-xl font-medium">Ready to play {gameName}?</h3>
            <p className="text-muted-foreground">
              Test your cognitive skills with this brain training game.
              {difficultyLevel === "Low" && " This is a beginner-friendly level."}
              {difficultyLevel === "Medium" && " This is an intermediate challenge."}
              {difficultyLevel === "High" && " This is an advanced level challenge."}
            </p>
          </div>
        ) : gameComplete ? (
          <div className="text-center py-8 space-y-4">
            <Star className="h-16 w-16 text-amber-500 mx-auto animate-pulse" />
            <h3 className="text-xl font-medium">Game Complete!</h3>
            <p className="text-muted-foreground">
              You scored {score} points in {60 - timeLeft} seconds.
            </p>
            <Badge className="mx-auto">Round {round - 1} Completed</Badge>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div>Round: {round}</div>
              <div>Score: {score}</div>
              <div>Time: {timeLeft}s</div>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium mb-2">
                {gameId === "visual-memory" ? "Remember the pattern" : 
                 gameId === "focus-challenge" ? "Focus on the target" :
                 "Complete the task"}
              </h4>
              
              <div className="grid grid-cols-3 gap-3 my-4">
                {gameItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-16 w-16 text-lg font-bold"
                    onClick={() => handleItemClick(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              
              <div className="mt-4">
                <Progress value={(selectedItems.length / gameItems.length) * 100} className="h-2" />
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Library
        </Button>
        
        {!gameStarted ? (
          <Button 
            variant="default" 
            size="sm"
            onClick={gameComplete ? startGame : startGame}
          >
            {gameComplete ? "Play Again" : "Start Game"}
          </Button>
        ) : (
          <Button 
            variant="default"
            size="sm" 
            onClick={endGame}
          >
            End Game
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
