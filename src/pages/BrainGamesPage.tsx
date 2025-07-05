
import React from 'react';
import { BrainGamesHub } from '@/components/brain-games/BrainGamesHub';
import { Preview3Background } from '@/components/ui/Preview3Background';

export default function BrainGamesPage() {
  return (
    <Preview3Background>
      <div className="container mx-auto px-4 py-8">
        <BrainGamesHub />
      </div>
    </Preview3Background>
  );
}
