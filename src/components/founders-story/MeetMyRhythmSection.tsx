
import React from "react";

export function MeetMyRhythmSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">💡 Meet MyRhythm</h2>
      <div className="space-y-4 mt-3 text-foreground">
        <p className="font-medium text-lg text-foreground italic">
          "A world where no one loses their independence because their memory fails them."
        </p>
        <p>
          MyRhythm isn't just another productivity app — it's LEAP-OS — the world's first Cognitive Operating System. Aligning memory, biological rhythm, and follow-through to turn daily actions into long-term performance and outcomes.<br />
          It's the wellness system I designed to survive—and thrive—after brain injury.
        </p>
        <p className="text-foreground">Whether you're navigating recovery, burnout, or just trying to stay organized when life feels like too much, MyRhythm helps you:</p>
        <ul className="list-none space-y-2 my-4 text-foreground">
          <li className="flex items-start">
            <span className="mr-2">✅</span> 
            <span>Structure your day with clarity—even when your mind feels cloudy</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span> 
            <span>Create simple, repeatable routines that bring peace and progress</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span> 
            <span>Track tasks, notes, wins, and reflections without mental overload</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span> 
            <span>Invite support from loved ones and care teams without feeling micromanaged</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span> 
            <span>Build confidence and independence, step by step, rhythm by rhythm</span>
          </li>
        </ul>
        <p className="font-medium text-foreground">This app didn't just support me—it changed my life. And now it's ready to change yours.</p>
      </div>
    </section>
  );
}
