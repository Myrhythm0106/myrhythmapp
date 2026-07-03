/**
 * MyRhythm — canonical app descriptions.
 * Single source of truth. Do not paraphrase in UI; import from here.
 *
 * Wording rules (see mem://brand/app-description):
 * - "emotional regulation" is BANNED (medical claim). Use "emotional check-ins".
 * - Always pair with DISCLAIMER_TEXT on public-facing surfaces.
 */

export const APP_DESCRIPTION_USER =
  "MyRhythm is a digital life empowerment and productivity companion for planning, prioritisation, reminders, emotional check-ins, and everyday follow-through. Designed for people who carry a lot — including those with memory and cognitive challenges.";

export const APP_DESCRIPTION_INVESTOR =
  "Built with project scoping, user-centred design, requirements thinking, and continuous improvement — a wellness, productivity and cognitive support tool. Not a medical device, diagnosis, or treatment.";

export const APP_DESCRIPTION_SHORT =
  "A life empowerment and productivity companion for planning, prioritisation, reminders, and follow-through.";

export const DISCLAIMER_TEXT =
  "MyRhythm is a wellness, productivity and cognitive support tool. It is not a medical device, diagnosis, or treatment.";

/**
 * Memory-First Design™ — the visible brand descriptor.
 * See mem://brand/memory-first-design.
 * Priority order (verbatim in docs/About/Cheat Sheet): memory challenges first,
 * older population second, anyone with a busy or tired brain third.
 * In-app functional labels (Capture/Commit/Calibrate/Celebrate, doors, persona
 * copy) never carry this phrase. It appears only as a chip near the logo, a
 * footer tagline, and one About-page section.
 */
export const APP_DESCRIPTION_INCLUSIVE =
  "MyRhythm is designed for memory challenges first — for people rebuilding after a brain injury or stroke. Secondly for the older population. Thirdly so that anyone with a busy or tired brain benefits. Planning, prioritisation, reminders, emotional check-ins, and everyday follow-through. Works on any phone, tablet, or laptop.";

export const MEMORY_FIRST_DESIGN_TAGLINE = "Built with Memory-First Design.";

export const MEMORY_FIRST_DESIGN_EXPLAINER =
  "Memory-First Design means we designed for the hardest case first: someone rebuilding after a brain injury, stroke, or living with memory challenges. Then for the older population managing full lives. Then for anyone with a busy or tired brain. If it works clearly for them, it works beautifully for everyone.";

/**
 * Three problems MyRhythm exists to fix.
 * See mem://brand/clinical-life-ready-gap and mem://brand/third-problem-ideal-brain.
 * Do not paraphrase for investor or landing surfaces — import these strings.
 */
export const THREE_PROBLEMS_SHORT = {
  dischargeCliff:
    "The Discharge Cliff — at discharge, every support structure disappears at once. Survivors fall silently into re-admission, isolation, depression, and lost livelihoods.",
  lifeReadyGap:
    "The Clinical-Ready vs Life-Ready Gap — a discharge letter confirms clinical readiness, not life readiness. No one currently owns the gap between them.",
  idealBrainAssumption:
    "The Ideal-Brain Assumption — productivity and reminder tools are built for brains that never forget, fatigue or overwhelm. Real brains — under ADHD, dementia, stress or ordinary load — need external memory, energy-aware scheduling and a support circle.",
} as const;

/**
 * Verified stats for Problem 3. Every entry is cited to a primary source.
 * If a claim is not in this map, it does not go into a doc or the UI.
 */
export const THIRD_PROBLEM_STATS = {
  dementia: {
    figure: "57M globally (2021); 78M by 2030; 139M by 2050",
    source:
      "WHO, Global Status Report on the Public Health Response to Dementia (2021); WHO Dementia fact sheet (2023–2025)",
  },
  adhdPersistent: {
    figure: "2.58% of adults (~139M) live with persistent ADHD",
    source:
      "Song et al., Journal of Global Health, 2021, doi:10.7189/jogh.11.04009",
  },
  adhdSymptomatic: {
    figure: "6.76% of adults (~366M) show symptomatic ADHD",
    source:
      "Song et al., Journal of Global Health, 2021, doi:10.7189/jogh.11.04009",
  },
  stress: {
    figure:
      "41% of employees report a lot of stress the previous day; 20% experience daily loneliness",
    source: "Gallup, State of the Global Workplace 2024",
  },
  focus: {
    figure:
      "Workers get ~2–3 hours of uninterrupted focus per day; distraction costs a typical knowledge worker ~581 hours/year",
    source:
      "Hubstaff Workplace Productivity Report 2026; Economist Impact / Dropbox 2023",
  },
} as const;

/**
 * 4R vocabulary — Remove / Reduce / Return / Reconnect.
 * Canonical mapping of Founding Core features to the four outcomes.
 * See docs/founding-core-value-map.md for the canonical rendered matrix.
 */
export const FEATURE_4R_MAP = {
  Capture: {
    remove: "missed information from clinical & family conversations",
    reduce: "recall effort and mental load of holding open loops",
    return: "details that would otherwise be lost minutes later",
    reconnect: "shares captured notes with the Support Circle",
  },
  Commit: {
    remove: "decision paralysis between capture and action",
    reduce: "overwhelm by breaking intent into owned, dated steps",
    return: "follow-through on things you meant to do",
    reconnect: "aligns the Support Circle on the plan without extra effort",
  },
  Calibrate: {
    remove: "crash days from over-scheduling against real energy",
    reduce: "symptom severity by respecting cognitive peaks",
    return: "frequency of good, high-function days",
    reconnect: "signals the Support Circle early when energy is low",
  },
  Celebrate: {
    remove: "demoralisation loops after setbacks",
    reduce: "dropout risk in week two and beyond",
    return: "a felt sense of progress that burnout erases",
    reconnect: "lets the Support Circle see and share the wins",
  },
  MemoryBridge: {
    remove: "'it's gone' moments after clinical or family conversations",
    reduce: "time spent hunting across Notes, WhatsApp, email and paper",
    return: "conversations the person thought were lost",
    reconnect: "lets family replay a shared memory together",
  },
  SupportCircle: {
    remove: "isolation and single-point-of-failure caregiving",
    reduce: "caregiver overload and repeat-explanation fatigue",
    return: "shared history so no one has to start from scratch",
    reconnect: "rebuilds the network of family, clinicians and carers around the person — no one walks alone",
  },
  Assessments: {
    remove: "guesswork about when to schedule demanding work",
    reduce: "mis-scheduling that triggers avoidable crashes",
    return: "self-awareness of personal rhythm",
    reconnect: "gives the Support Circle a shared understanding of needs",
  },
} as const;
