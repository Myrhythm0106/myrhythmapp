
import React from "react";
import { gameTypes } from "../data/gamesData";
import { GameCard } from "./GameCard";

interface FeaturedTabProps {
  selectedGameType: string | null;
  setSelectedGameType: (id: string) => void;
  handlePlayGame: (gameId: string, difficultyLevel: "Low" | "Medium" | "High") => void;
}

export function FeaturedTab({ selectedGameType, setSelectedGameType, handlePlayGame }: FeaturedTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {gameTypes.slice(0, 3).map(game => (
        <GameCard
          key={game.id}
          game={game}
          isSelected={selectedGameType === game.id}
          onSelect={setSelectedGameType}
          onPlay={handlePlayGame}
        />
      ))}
    </div>
  );
}
