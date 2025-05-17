
import React from "react";
import { NegativeStatementsGrid } from "./NegativeStatementsGrid";

export function TruthSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">🧠 The Truth – Let's Say It Out Loud</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p className="font-medium">
          You're not lazy.<br />
          You're not broken.<br />
          You're not "just forgetful."
        </p>
        <p>This is what I say to myself regularly. But that's not what the world tells you. They say...</p>
        
        <NegativeStatementsGrid />

        <p className="text-foreground">
          These statements don't help.<br />
          They hurt.<br />
          They isolate.<br />
          They make you doubt your ability to ever thrive again.
        </p>
        <p className="font-medium text-foreground">
          But here's the truth:<br />
          You don't need to "go back to normal." You need a rhythm that works for who you are now.
        </p>
        <p className="font-bold text-foreground">Knowing and working with your own rhythm will make the difference!</p>
      </div>
    </section>
  );
}
