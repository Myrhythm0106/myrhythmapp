
import React from "react";
import { NegativeStatementsGrid } from "./NegativeStatementsGrid";

export function TruthSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">🧠 The Truth – Let's Say It Out Loud</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p>
          April 1st, 2010 – the world calls it April Fools' Day.<br />
          For me, it was the day my brain ruptured — and nothing about it was a joke.
        </p>
        
        <p>
          A brain aneurysm tried to silence my future. Doctors told me I'd die.<br />
          That I'd never return to work.<br />
          That my memory wouldn't come back.<br />
          That motherhood would have to wait… at least five years.
        </p>
        
        <p className="font-medium">
          But here's the punchline:<br />
          I'm still here. And I rewrote the script.
        </p>
        
        <p className="font-medium">
          You're not lazy.<br />
          You're not broken.<br />
          You're not "just forgetful."
        </p>
        
        <p>That's what I had to start telling myself. Because the world tells you this instead:</p>
        
        <NegativeStatementsGrid />

        <p className="text-foreground">
          These words?<br />
          They don't help.<br />
          They hurt.<br />
          They isolate.<br />
          They strip away your confidence.
        </p>
        
        <p className="text-foreground">But let me tell you the truth:</p>
        
        <p className="font-medium text-foreground">
          🔁 You don't need to "go back to normal."<br />
          You need a rhythm that works for who you are now.<br />
          Because when you find your rhythm, everything changes.
        </p>
      </div>
    </section>
  );
}
