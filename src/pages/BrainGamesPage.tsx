
import React from 'react';
import { BrainGamesHub } from '@/components/brain-games/BrainGamesHub';
import { Preview3Background } from '@/components/ui/Preview3Background';

export default function BrainGamesPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Brain Games
          </h1>
          <p className="text-muted-foreground">
            Strengthen your cognitive abilities with our Memory1st brain training games
          </p>
        </div>
        <BrainGamesHub />
      </div>
    </Preview3Background>
  );
}
