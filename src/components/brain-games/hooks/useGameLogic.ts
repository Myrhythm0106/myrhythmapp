
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface UseGameLogicProps {
  gameId: string;
  difficultyLevel: "Low" | "Medium" | "High";
  gameName: string;
}

export function useGameLogic({ gameId, difficultyLevel, gameName }: UseGameLogicProps) {
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

  return {
    score,
    timeLeft,
    gameStarted,
    gameItems,
    selectedItems,
    gameComplete,
    round,
    startGame,
    endGame,
    handleItemClick
  };
}
