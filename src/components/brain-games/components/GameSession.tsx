
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Import our components
import { GameHeader } from "./game-session/GameHeader";
import { GameIntro } from "./game-session/GameIntro";
import { GameComplete } from "./game-session/GameComplete";
import { GamePlayArea } from "./game-session/GamePlayArea";
import { GameControls } from "./game-session/GameControls";
import { useGameLogic } from "../hooks/useGameLogic";

interface GameSessionProps {
  gameId: string;
  gameName: string;
  gameIcon: React.ReactNode;
  difficultyLevel: "Low" | "Medium" | "High";
  onClose: () => void;
}

export function GameSession({ gameId, gameName, gameIcon, difficultyLevel, onClose }: GameSessionProps) {
  const {
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
  } = useGameLogic({ gameId, difficultyLevel, gameName });
  
  return (
    <Card className="w-full">
      <GameHeader 
        gameIcon={gameIcon}
        gameName={gameName}
        difficultyLevel={difficultyLevel}
      />
      
      <CardContent className="space-y-4">
        {!gameStarted && !gameComplete ? (
          <GameIntro
            gameName={gameName}
            difficultyLevel={difficultyLevel}
          />
        ) : gameComplete ? (
          <GameComplete
            score={score}
            timeElapsed={60 - timeLeft}
            round={round - 1}
          />
        ) : (
          <GamePlayArea
            gameId={gameId}
            round={round}
            score={score}
            timeLeft={timeLeft}
            gameItems={gameItems}
            selectedItems={selectedItems}
            onItemClick={handleItemClick}
          />
        )}
      </CardContent>
      
      <CardFooter>
        <GameControls
          gameStarted={gameStarted}
          gameComplete={gameComplete}
          onClose={onClose}
          onStart={startGame}
          onEnd={endGame}
        />
      </CardFooter>
    </Card>
  );
}
