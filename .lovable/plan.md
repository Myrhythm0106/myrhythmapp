# One app flow for everyone, with freedom to move

## The idea
One shared journey, five ways in. Everyone travels the same seven stops. Only the wording and the first suggestion change for each group. You can move freely at any point using a bar along the bottom with five tabs. The You-Are-Here dial stays for everything else.

```text
Landing -> Account + card -> Who it's for -> Welcome -> Home
                                                       |
   Record -> My report -> Actions in my diary -> Reminders -> Done
                 \______ Support Circle sees / helps (if I allow) ______/
```

## The seven stops
1. **Landing page.** One promise and two buttons: Log In or Get Started. Below that, five short "This is for you if..." lines, one for each group.
2. **Account and card.** Pick the free 7 days or full membership, add a card, done. This stays as it is.
3. **Who it's for.** All five groups are shown together, plus "Not sure, carry on". The Questions can be done later. They are never forced.
4. **Home.** Up to three priorities, one Next line, and a big **Record** button.
5. **Record to report.** Tap Record, or upload from my phone or watch. The report gives a key summary, the actions (Agreed, Implied, Ideas) and the full transcript to download.
6. **Into my diary.** Accept actions with one tap each. Times are suggested from my best hours. Undo is always there. I can invite people by email or from my Support Circle.
7. **Reminders and closure.** I get a get-ready prompt, then Done or Snooze, one gentle follow-up, and an end-of-day Still open list. When I tick Done, the action is closed in the conversation too, and my Support Circle is told.

## Moving freely (new)
- **A bar along the bottom with five tabs** on every signed-in page: Home, Record, Diary, Circle, More. Record is always one tap away.
- **Back always works.** Leaving partway through set-up saves my place, and Home shows "Pick up where I left off".
- **Nothing is locked behind set-up.** I can skip the Questions and go straight to recording. MyRhythm asks again later, gently.
- **The dial (More) covers everything else:** My Vision, Questions, Snapshot, Settings and Help.

## How it adapts for each group
| Who | What they see first | Support Circle's role |
|---|---|---|
| Rebuilding after a brain injury | Record my appointment, a gentle pace, care-team targets | A carer or family member who can see my day or help with it |
| Supporting someone (carer) | Their diary, shared actions, my own wellbeing | Linked to the person they support |
| Too much to hold in my head (stress or overwhelm) | Record and clear my head, Still open list | Optional, off by default |
| Staying sharp at work | Meeting to actions, invite owners | Colleagues invited by email |
| Studying | Lecture to notes and deadlines | A study buddy or parent, optional |

The steps are the same for everyone. Only the words and the first suggestion change.

## Then I test it
I'll walk through the full flow on a phone-sized screen for each of the five groups, from Landing to Done, and confirm I can move between any tabs without losing my place.

## Technical details
- New `LaunchBottomTabs` in LaunchLayout (safe-area aware, 56px targets); the dial stays as the secondary map (roadmap/`routes.ts` unchanged).
- Resume point: store the last set-up step on the device; a Home card links back to it.
- Persona copy is mapped from the existing user-type values; no new flows.
- Update the navigation rule in AGENTS.md (bottom tabs plus dial).
