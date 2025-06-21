
import React, { useState } from "react";
import { SwipeableContainer } from "@/components/ui/SwipeableContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Play, Star, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface BrainGame {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  duration: string;
  rating: number;
  plays: number;
  thumbnail?: string;
}

interface SwipeableBrainGamesProps {
  games: BrainGame[];
  onGameSelect?: (game: BrainGame) => void;
  title?: string;
}

export function SwipeableBrainGames({ games, onGameSelect, title = "Brain Games" }: SwipeableBrainGamesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : games.length - 1));
    if (isMobile) {
      toast.success("Previous game", { duration: 1000 });
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < games.length - 1 ? prev + 1 : 0));
    if (isMobile) {
      toast.success("Next game", { duration: 1000 });
    }
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Games refreshed", { duration: 2000 });
  };

  const handleGameSelect = (game: BrainGame) => {
    if (onGameSelect) {
      onGameSelect(game);
    } else {
      toast.info(`Starting ${game.title}`);
    }
  };

  const handleGameAction = (game: BrainGame, action: "favorite" | "share") => {
    if (action === "favorite") {
      toast.success(`Added ${game.title} to favorites`);
    } else {
      toast.success(`Sharing ${game.title}`);
    }
  };

  if (games.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">No brain games available</p>
        </CardContent>
      </Card>
    );
  }

  const currentGame = games[currentIndex];

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {!isMobile && games.length > 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Swipeable game container */}
      <SwipeableContainer
        enableHorizontalSwipe={isMobile && games.length > 1}
        enablePullToRefresh={isMobile}
        onSwipeLeft={{
          label: "Next Game",
          icon: <ChevronRight className="h-4 w-4" />,
          color: "#22c55e",
          action: handleNext
        }}
        onSwipeRight={{
          label: "Previous Game",
          icon: <ChevronLeft className="h-4 w-4" />,
          color: "#3b82f6",
          action: handlePrevious
        }}
        onPullToRefresh={handleRefresh}
        className="min-h-[300px]"
      >
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl">{currentGame.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentGame.description}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{currentGame.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Game info */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{currentGame.category}</Badge>
                <Badge variant={
                  currentGame.difficulty === "Easy" ? "default" :
                  currentGame.difficulty === "Medium" ? "secondary" : "destructive"
                }>
                  {currentGame.difficulty}
                </Badge>
                <Badge variant="outline">{currentGame.duration}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{currentGame.plays.toLocaleString()} plays</span>
                {games.length > 1 && (
                  <span>{currentIndex + 1} of {games.length}</span>
                )}
              </div>

              {/* Game actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleGameSelect(currentGame)}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Game
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleGameAction(currentGame, "favorite")}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SwipeableContainer>

      {/* Mobile navigation indicators */}
      {isMobile && games.length > 1 && (
        <div className="flex justify-center space-x-2">
          {games.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "w-6 bg-primary" 
                  : "w-2 bg-muted hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Mobile swipe hints */}
      {isMobile && games.length > 1 && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to browse games • Pull down to refresh
          </p>
        </div>
      )}
    </div>
  );
}
