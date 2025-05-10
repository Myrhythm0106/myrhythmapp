
import React from "react";
import { recentGames, gameTypes } from "../data/gamesData";
import { RecentGameCard } from "./RecentGameCard";

interface RecentTabProps {
  handleViewStats: (gameId: string) => void;
  handlePlayGame: (gameId: string, difficultyLevel?: "Low" | "Medium" | "High") => void;
}

export function RecentTab({ handleViewStats, handlePlayGame }: RecentTabProps) {
  return (
    <div className="space-y-4">
      {recentGames.map(game => {
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
