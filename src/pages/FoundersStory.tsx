
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function FoundersStory() {
  const navigate = useNavigate();

  return (
    <ScrollArea className="h-[calc(100vh-64px)]">
      <div className="max-w-3xl mx-auto py-8 px-4 md:px-6 text-foreground">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Founder's Story</h1>
        </header>

        <div className="space-y-8 prose prose-zinc max-w-none">
          <section>
            <h2 className="text-2xl font-semibold text-foreground">🧠 The Truth – Let's Say It Out Loud</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p className="font-medium">
                You're not lazy.<br />
                You're not broken.<br />
                You're not "just forgetful."
              </p>
              <p>But that's not what the world tells you.</p>
              <div className="bg-muted/30 p-4 rounded-lg my-6 italic space-y-1 text-foreground">
                <p>"We've already talked about this."</p>
                <p>"How can you forget again?"</p>
                <p>"It's not that hard—just focus."</p>
                <p>"You were fine yesterday."</p>
                <p>"You need to pay more attention."</p>
                <p>"You're not even trying."</p>
                <p>"Why can't you be more organized?"</p>
                <p>"I shouldn't have to keep reminding you."</p>
                <p>"Seriously? You don't remember?"</p>
                <p>"You used to be so sharp."</p>
                <p>"Maybe you're just being lazy."</p>
                <p>"You don't look like anything's wrong."</p>
                <p>"Don't use your injury as an excuse."</p>
                <p>"When are you going to get back to normal?"</p>
              </div>
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
              <p className="font-bold text-foreground">That's exactly what MyRhythm is built for.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">💬 My Story – From Survivor to System Creator</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>Fifteen years ago, a brain aneurysm nearly ended my life.</p>
              <p className="text-foreground">
                Doctors said I might not walk again.<br />
                That I'd never return to work.<br />
                That my memory wouldn't come back.<br />
                That motherhood was out of the question.
              </p>
              <p className="font-medium text-foreground">But I refused to live by those limits.</p>
              <p className="text-foreground">
                Today, I'm a proud mother of two.<br />
                An EMBA graduate.<br />
                An ambitious Change and Project Management leader.<br />
                A global speaker.<br />
                And the founder of MyRhythm—the very tool that helped me reclaim my life.
              </p>
              <p className="text-foreground">This isn't theory. This app is built on what actually worked when everything seemed impossible.</p>
              <p className="text-foreground">
                When I couldn't rely on memory or focus, I created structure.<br />
                When I lost confidence, I built momentum with small wins.<br />
                When I felt invisible, I gave myself visibility—with routines and reflection.
              </p>
              <p className="font-medium text-foreground">
                I used MyRhythm to rebuild my identity.<br />
                Now, it's your turn.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">💡 The Solution – Meet MyRhythm</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>
                MyRhythm isn't just another productivity app.<br />
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

          <section>
            <h2 className="text-2xl font-semibold text-foreground">💪 Why It Works – Built on Lived Experience and Science</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>Recovery can be unpredictable. But MyRhythm brings back predictability—not with pressure, but with rhythm.</p>
              <p className="text-foreground">
                When short-term memory failed me, I needed more than sticky notes and reminders.<br />
                I needed a system that worked with my brain, not against it.
              </p>
              <p className="text-foreground">I used what I created to:</p>
              <ul className="list-disc pl-5 my-4 space-y-2 text-foreground">
                <li>Pass my Executive MBA</li>
                <li>Manage complex international projects</li>
                <li>Show up fully as a mother and partner</li>
                <li>Restore my joy, my focus, and my rhythm</li>
              </ul>
              <p className="font-medium text-foreground">And that same framework is now inside MyRhythm—designed to serve you.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">📱 Who It's For – This Was Made For You</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>MyRhythm is for you if:</p>
              <ul className="list-disc pl-5 my-4 space-y-2 text-foreground">
                <li>You've experienced a brain injury, stroke, or cognitive change</li>
                <li>You're exhausted from trying to explain what you're going through</li>
                <li>You hear things like "just try harder" or "you don't look sick"</li>
                <li>You're a parent, professional, student—or all of the above—and just need a better way to manage your day</li>
                <li>You want to stop apologizing and start organizing, your way</li>
              </ul>
              <p className="font-medium text-foreground">If you've felt unseen, unheard, or underestimated—this is your app.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">👨‍👩‍👧‍👦 Built for the People Around You, Too</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>Recovery is never just yours. It affects everyone who loves you—and often, they don't know how to help.</p>
              <p className="text-foreground">That's why MyRhythm gently includes them in your journey:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 text-foreground">
                <div className="bg-muted/20 p-4 rounded-lg">
                  <p className="font-medium">📩 Loved ones</p>
                  <p>can send uplifting notes or helpful reminders</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <p className="font-medium">🩺 Medical professionals</p>
                  <p>can track your rhythms and provide encouragement</p>
                </div>
                <div className="bg-muted/20 p-4 rounded-lg">
                  <p className="font-medium">📊 You</p>
                  <p>stay in charge—no micromanaging, just meaningful support</p>
                </div>
              </div>
              <p className="font-medium text-foreground">You don't have to choose between independence and connection. With MyRhythm, you get both.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">💌 Your Rhythm Begins Here</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>
                I didn't create this app to impress anyone.<br />
                I built it because I needed it—and it worked.
              </p>
              <p className="font-medium text-foreground">Now, it's your turn.</p>
              <p className="text-foreground">🎉 Join thousands of others taking back their time, clarity, and confidence with MyRhythm.</p>
              <p className="text-foreground">👇 Tap below to begin. Because waiting for "normal" isn't the answer—taking control is.</p>
              <div className="flex justify-center my-8">
                <Button 
                  onClick={() => navigate("/onboarding")}
                  className="text-xl px-8 py-6 h-auto"
                >
                  Get MyRhythm Now 🔒
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground">🧡 Final Word – From My Heart to Yours</h2>
            <div className="space-y-4 mt-3 text-foreground">
              <p>
                You're not just rebuilding memory.<br />
                You're rebuilding belief.
              </p>
              <p className="text-foreground">
                You are not your setbacks.<br />
                You are your strength.
              </p>
              <p className="text-foreground">And if you've been waiting for a sign that it's time to try again—this is it.</p>
              <p className="text-foreground">
                I'm living proof that your story can shift.<br />
                And MyRhythm? It's not just how I made it through.<br />
                It's how I took my power back.
              </p>
              <p className="font-medium text-foreground">Now you can too.</p>
              <div className="mt-8 pt-4 border-t border-muted">
                <p className="text-right font-medium italic text-foreground">
                  – Bella A.<br />
                  <span className="text-sm">Brain Health Coach | Survivor | Founder of MyRhythm</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ScrollArea>
  );
}
