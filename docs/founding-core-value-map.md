# Founding Core — Value Map

**Audience:** marketing, support, investors, the founder.
**Purpose:** in one page, show what a Founding Member actually gets for £7–£20/mo and why each piece is worth more than the price.

## How we describe MyRhythm (locked wording)

**User-facing:**
> MyRhythm is a digital life empowerment and productivity companion for planning, prioritisation, reminders, emotional check-ins, and everyday follow-through. Designed for people who carry a lot — including those with memory and cognitive challenges.

**Investor / About:**
> Built with project scoping, user-centred design, requirements thinking, and continuous improvement — a wellness, productivity and cognitive support tool. Not a medical device, diagnosis, or treatment.

Never say "emotional regulation" in customer copy — it reads as a medical claim. Use "emotional check-ins" or "mood tracking". Source of truth: `src/config/appDescription.ts` and `mem://brand/app-description`.

> For the end-to-end user journey across these 9 routes, see [`docs/v0.1-founding-core-flow.md`](./v0.1-founding-core-flow.md).

---

## For £7–£20/month, a Founding Member gets:

```
  Home           — the 4C loop, one screen, every day
  Capture        — never lose a clinical/family conversation again
  Commit         — turn captured moments into actions you'll actually do
  Calibrate      — schedule against real energy, not wishful thinking
  Memory Bridge  — one private, searchable home for everything captured
  Calendar       — day-of view that respects cognitive load
  Support Circle — invite family/clinician; nothing auto-shared
  Settings       — retention, MFA, calendar links, edition transparency
  Profile        — identity + persona-correct experience
```

Plus the **Founding promise**:
- Locked introductory pricing for 6 months.
- Automatic upgrade to every new capability as it ships.
- Direct line to the founder via in-app Feedback.
- Founding Edition badge + early access to v0.2 (Memory Library overhaul, AI synthesis upgrades).

---

## Why each route is worth the price

### Home — `/launch/home`
One calm screen showing today's captures, today's commitments, today's energy plan. The cost it removes: the 15–30 minutes a day a brain-injured, ADHD, post-natal or burnt-out user spends just **deciding where to start**. One month of that time back is worth the year's subscription.

### Capture — `/launch/capture`
One-tap voice or text capture for clinical appointments, family conversations, work meetings, midnight thoughts. The cost it removes: paying a private OT or scribe (£40–£80/hr), or — more commonly — losing the conversation entirely and having to book a second appointment.

### Commit — `/launch/commit`
Turns raw captures into committed actions with owner, due date, and energy fit. The cost it removes: the 70%+ drop-off between "I should do that" and "I did that." For a caregiver coordinating appointments, missed follow-ups have real clinical and financial cost.

### Calibrate — `/launch/calibrate`
Schedules the day against the user's actual energy and brain-health signals, not a generic productivity template. The cost it removes: the crash-and-burn cycle — one over-scheduled day costs two or three recovery days, which costs work hours and family time.

### Memory Bridge — `/launch/memory`
One private, searchable home for every recording, summary, action and follow-up. Copy, edit, email and export from one place. The cost it removes: the "where did I save that?" tax across Notes, WhatsApp, email and paper, and the anxiety of not being able to find what the consultant said when it matters.

### Calendar — `/launch/calendar`
Day-of view that respects cognitive load — colour-coded by energy demand, with built-in buffers. The cost it removes: double-booking, missed appointments, the £80 NHS DNA cost, and the silent cost of arriving at appointments already depleted.

### Support Circle — `/launch/support`
Invite family, partner, or clinician with explicit permissions. Nothing is auto-shared. The cost it removes: the exhausting "explain it again" loop and the isolation of carrying everything alone. For caregivers, it removes the panic of being the single point of failure.

### Settings — `/launch/settings`
Retention controls, MFA, calendar links, Founding Edition transparency, and a direct feedback line to the founder. The cost it removes: the trust deficit. Users know exactly what is stored, for how long, who can see it, and how to be heard.

### Profile — `/launch/profile`
Identity plus persona, so the rest of the app speaks the user's language — brain injury, ADHD, post-natal recovery, caregiver, professional burnout, etc. The cost it removes: the "this app isn't for me" friction that kills retention in week two.

---

## The three problems MyRhythm exists to fix

1. **The Discharge Cliff** — every support structure disappears at discharge; there is no graded step-down.
2. **The Clinical-Ready vs Life-Ready Gap** — a discharge letter confirms clinical readiness, not life readiness.
3. **The Ideal-Brain Assumption** — mainstream productivity and reminder tools are built for brains that never forget, fatigue or overwhelm. Real brains — under ADHD (~366M symptomatic adults²¹), dementia/MCI (57M rising to 139M by 2050¹⁶), stress (41% high-stress daily²²), or ordinary distraction (~581 hours/year lost²³) — need external memory, energy-aware scheduling and a support circle.

MyRhythm was purpose-built for problems 1 and 2. The exact same design closes problem 3 for everyone else.

Sources: see `docs/myrhythm-one-page-pitch.md` references 16, 21–24 and `mem://brand/third-problem-ideal-brain`.

---

## The 4R design — Remove / Reduce / Return / Reconnect

Every Founding Core feature is designed to do one or more of four things. This is the canonical vocabulary, used verbatim everywhere:

- **Remove** — stop the problem from happening.
- **Reduce** — shrink its frequency, severity, or cost.
- **Return** — recover ground already lost.
- **Reconnect** — rebuild the support network so no one walks alone. Reconnect is Support Circle's home column and aligns with the "No one walks alone" brand promise.

### Canonical 4R feature matrix (source of truth)

| Feature | Remove | Reduce | Return | Reconnect |
|---|---|---|---|---|
| **Capture** | Missed information | Recall effort & mental load | Details lost minutes later | Shares notes to Support Circle |
| **Commit** | Decision paralysis | Overwhelm | Follow-through | Aligns Circle on the plan |
| **Calibrate** | Crash days | Symptom severity | Frequency of good days | Signals Circle early |
| **Celebrate** | Demoralisation | Dropout risk | Felt sense of progress | Circle sees & shares wins |
| **Memory Bridge** | "It's gone" moments | Search-time tax | Lost conversations | Family replays a shared memory |
| **Support Circle** | Isolation | Caregiver overload | Shared history | Rebuilds the network — no one walks alone |
| **Assessments** | Scheduling guesswork | Mis-scheduling crashes | Self-awareness of rhythm | Circle understands needs |

---

## Why each route is worth the price

Each route paragraph uses Remove / Reduce / Return / Reconnect verbs explicitly.

### Home — `/launch/home`
One calm screen showing today's captures, today's commitments, today's energy plan. **Removes** the "where do I start" freeze that costs a brain-injured, ADHD, post-natal or burnt-out user 15–30 minutes every morning. **Reduces** the load of holding today in the head. **Returns** a sense of agency at the start of the day. **Reconnects** the Support Circle to the same shared view.

### Capture — `/launch/capture`
One-tap voice or text capture for clinical appointments, family conversations, work meetings, midnight thoughts. **Removes** the "I'll remember it later" moment. **Reduces** the cost of a private OT or scribe (£40–£80/hr) — and of the second appointment that gets booked when the first is lost. **Returns** the exact wording of conversations minutes, days or months later. **Reconnects** family and clinicians to the same source of truth.

### Commit — `/launch/commit`
Turns raw captures into committed actions with owner, due date, and energy fit. **Removes** the 70%+ drop-off between "I should" and "I did." **Reduces** overwhelm by breaking intent into owned, dated steps. **Returns** follow-through on things that had already slipped. **Reconnects** the Support Circle so they can see and back the plan without extra effort.

### Calibrate — `/launch/calibrate`
Schedules the day against the user's actual energy and brain-health signals, not a generic productivity template. **Removes** the crash-and-burn cycle where one over-scheduled day costs two or three recovery days. **Reduces** symptom severity by respecting cognitive peaks. **Returns** the frequency of high-function days. **Reconnects** the Circle with an early signal when energy is low, so support arrives before crisis.

### Memory Bridge — `/launch/memory`
One private, searchable home for every recording, summary, action and follow-up. **Removes** the "it's gone" moment after clinical or family conversations. **Reduces** the search-time tax across Notes, WhatsApp, email and paper. **Returns** conversations the person thought were lost. **Reconnects** family by letting them replay a shared memory together.

### Calendar — `/launch/calendar`
Day-of view that respects cognitive load — colour-coded by energy demand, with built-in buffers. **Removes** double-booking. **Reduces** missed-appointment cost (the £80 NHS DNA fee) and the silent cost of arriving depleted. **Returns** reliability to a schedule that had stopped being trusted. **Reconnects** attendees via calendar invites so the plan is shared, not carried alone.

### Support Circle — `/launch/support`
Invite family, partner, or clinician with explicit permissions. Nothing is auto-shared. **Removes** isolation and single-point-of-failure caregiving. **Reduces** repeat-explanation fatigue and caregiver overload. **Returns** shared history so no one has to start from scratch. **Reconnects** the network of family, clinicians and carers around the person — the literal delivery of "No one walks alone."

### Settings — `/launch/settings`
Retention controls, MFA, calendar links, Founding Edition transparency, and a direct feedback line to the founder. **Removes** the trust deficit. **Reduces** anxiety about what is stored and who can see it. **Returns** control over one's own data. **Reconnects** the user to the founder via in-app Feedback.

### Profile — `/launch/profile`
Identity plus persona, so the rest of the app speaks the user's language — brain injury, ADHD, post-natal recovery, caregiver, professional burnout, dementia/MCI family. **Removes** the "this app isn't for me" friction that kills retention in week two. **Reduces** onboarding effort. **Returns** a sense of fit. **Reconnects** the person to a product built for their real brain, not an ideal one.

---

## Pain-to-price mapping

| Founding pain | Problem group | Routes that solve it | 4Rs engaged | Cost avoided |
|---|---|---|---|---|
| Lost conversations | 1, 2, 3 | Capture, Memory Bridge | Remove, Return, Reconnect | £40–£80/hr scribe or repeat appointment |
| Dropped actions | 1, 2, 3 | Commit, Calendar | Remove, Reduce, Return | Missed appointments, lost work hours |
| Energy-blind scheduling | 1, 2, 3 | Calibrate, Calendar | Remove, Reduce | 2–3 recovery days per over-scheduled day |
| Isolated caregiving | 1, 2 | Support Circle, Memory Bridge | Reduce, Reconnect | Caregiver burnout, repeat-explanation fatigue |
| Trust deficit | 1, 2, 3 | Settings, Profile, Edition page | Remove, Reconnect | Churn in week two |
| **ADHD task initiation & drop-off** | 3 | Capture, Commit, Calibrate, Support Circle | Remove, Reduce, Reconnect | Missed deadlines; coaching costs (£60–£120/hr) |
| **Dementia / MCI daily forgetting** | 3 | Capture, Memory Bridge, Support Circle | Remove, Return, Reconnect | "Explain it again" loop; family relationship strain |
| **Stress & burnout cognitive fog** | 3 | Capture, Calibrate, Celebrate, Support Circle | Remove, Reduce, Reconnect | Sick days; disengagement (Gallup 2024²²) |
| **Focus loss in knowledge work** | 3 | Capture, Calibrate, Memory Bridge | Remove, Reduce, Return | ~581 hours/year of distraction cost²³ |

If MyRhythm solves **even one** of these for a Founding Member in a single month, the subscription has paid for itself.

---

*MyRhythm does not diagnose, treat, cure, or prevent any medical condition. All summaries, actions, and exports are user-generated notes — not clinical advice. Use of the Support Circle, Calendar, and Memory Bridge does not replace professional medical care.*
