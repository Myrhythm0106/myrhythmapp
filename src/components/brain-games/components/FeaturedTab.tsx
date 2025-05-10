
import React from "react";
import { gameTypes } from "../data/gamesData";
import { GameCard } from "./GameCard";

interface FeaturedTabProps {
  selectedGameType: string | null;
  setSelectedGameType: (id: string) => void;
  handlePlayGame: (gameId: string, difficultyLevel: "Low" | "Medium" | "High") => void;
  searchQuery: string;
}

export function FeaturedTab({ selectedGameType, setSelectedGameType, handlePlayGame, searchQuery }: FeaturedTabProps) {
  const filteredGames = searchQuery 
    ? gameTypes.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        game.cognitiveDomain.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : gameTypes.slice(0, 3);
  
  if (filteredGames.length === 0) {
    return (
      <div className="py-12 text-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No featured games match your search.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGames.map(game => (
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
