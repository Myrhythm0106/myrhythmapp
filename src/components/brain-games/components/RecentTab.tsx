
import React from "react";
import { recentGames, gameTypes } from "../data/gamesData";
import { RecentGameCard } from "./RecentGameCard";

interface RecentTabProps {
  handleViewStats: (gameId: string) => void;
  handlePlayGame: (gameId: string, difficultyLevel?: "Low" | "Medium" | "High") => void;
  searchQuery: string;
}

export function RecentTab({ handleViewStats, handlePlayGame, searchQuery }: RecentTabProps) {
  const filteredGames = searchQuery 
    ? recentGames.filter(game => {
        const gameDetails = gameTypes.find(g => g.id === game.id);
        return gameDetails?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               gameDetails?.cognitiveDomain.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : recentGames;
  
  if (filteredGames.length === 0) {
    return (
      <div className="py-12 text-center bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">No recent games match your search.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {filteredGames.map(game => {
        const gameDetails = gameTypes.find(g => g.id === game.id);
        return (
          <RecentGameCard
            key={game.id}
            game={game}
            icon={gameDetails?.icon}
            onViewStats={handleViewStats}
            onContinue={() => handlePlayGame(game.id)}
          />
        );
      })}
    </div>
  );
}
