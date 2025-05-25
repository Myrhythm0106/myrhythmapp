
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MatchingGameProps {
  level: number;
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
}

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export function MatchingGame({ level, onComplete }: MatchingGameProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime] = useState(Date.now());

  const gridSize = Math.min(4 + Math.floor(level / 3), 6);
  const totalPairs = Math.floor((gridSize * gridSize) / 2);
  const symbols = ['🎵', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎤', '🎧', '🎬', '🎮', '🎳', '🎰', '🎡', '🎢', '🎠'];

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const selectedSymbols = symbols.slice(0, totalPairs);
    const gameSymbols = [...selectedSymbols, ...selectedSymbols];
    
    // Shuffle the symbols
    for (let i = gameSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameSymbols[i], gameSymbols[j]] = [gameSymbols[j], gameSymbols[i]];
    }

    const newCards: GameCard[] = gameSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setAttempts(0);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      
      setTimeout(() => {
        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.symbol === secondCard.symbol) {
          // Match found
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true } 
              : card
          ));
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          if (newMatchedPairs === totalPairs) {
            // Game complete
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            const accuracy = Math.round((totalPairs / attempts) * 100);
            const score = Math.round((totalPairs * 100) / Math.max(attempts, 1));
            
            onComplete(score, accuracy, timeSpent);
          }
        } else {
          // No match
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false } 
              : card
          ));
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Find the matching pairs!</h3>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Pairs found: {matchedPairs}/{totalPairs}</span>
              <span>Attempts: {attempts}</span>
            </div>
          </div>

          <div 
            className="grid gap-2 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              maxWidth: `${gridSize * 80}px`
            }}
          >
            {cards.map((card) => (
              <Button
                key={card.id}
                className={`h-16 w-16 text-2xl p-0 ${
                  card.isMatched 
                    ? 'bg-green-100 text-green-800' 
                    : card.isFlipped 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-200 text-gray-400'
                }`}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isMatched || flippedCards.length >= 2}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
