import type { LetterId } from '@/data/launchAssessmentBanks';
import type { Persona } from './usePersona';

// One persona-specific line per letter, shown in the free MYRHYTHM snapshot teaser.
// These are not medical claims — they connect the facet to the user's likely context.

export const SNAPSHOT_TEASERS: Record<Persona, Record<LetterId, string>> = {
  recovery: {
    mindset: 'After a neurological event, confidence can be the first thing to dip and the last thing to return.',
    yesReality: 'Your baseline may shift day to day — honest data beats brave performance.',
    rhythm: 'Clear windows can move after injury; tracking them protects you from overdoing it.',
    harnessSupport: 'You do not have to manage appointments, memory, and follow-up alone.',
    yourVictories: 'Small wins often disappear into recovery work — catching them rebuilds identity.',
    transform: 'Change can feel risky when your system is still settling. One tiny experiment is enough.',
    heal: 'Rest is not laziness; it is the work that lets everything else happen.',
    multiply: 'Purpose may feel distant right now, but meaning often returns through small roles first.',
  },
  caregiver: {
    mindset: 'Holding the line for someone else can quietly erode your own sense of competence.',
    yesReality: 'Your today may not match the care plan — naming what is real prevents burnout.',
    rhythm: 'Your best window is probably not when the person you care for needs you most.',
    harnessSupport: 'Delegation is a skill, not a failure — even one reliable hand changes the maths.',
    yourVictories: 'Caregiver wins are invisible to most people; recording them is self-rescue.',
    transform: 'One boundary protected is a bigger win than one more task absorbed.',
    heal: 'You cannot pour from an empty cup, and the cup empties faster than it looks.',
    multiply: 'Your care matters because the person matters — and so do you.',
  },
  productivity: {
    mindset: 'High output can hide declining confidence in your own attention.',
    yesReality: 'Your calendar is not your real capacity — honest baselines protect leverage.',
    rhythm: 'Deep work needs a defended window; most schedules leak it away.',
    harnessSupport: 'The right delegate, watcher, or note-taker multiplies your output.',
    yourVictories: 'Wins evaporate into the next deadline unless you pause to register them.',
    transform: 'One small system change beats a dozen ambitious resolutions.',
    heal: 'Rest is not recovery from work; it is preparation for the next level of work.',
    multiply: 'Purpose turns output into legacy — connect tasks to the bigger bet.',
  },
  student: {
    mindset: 'Academic pressure can make your brain feel broken when it is just overloaded.',
    yesReality: 'Your capacity changes across the term — planning from peak week is a trap.',
    rhythm: 'Study quality depends on when you study more than how long.',
    harnessSupport: 'Study groups, tutors, and mentors turn isolation into momentum.',
    yourVictories: 'Progress in learning is invisible; proof-points keep you going.',
    transform: 'One revision habit fixed is worth ten new resources downloaded.',
    heal: 'Sleep is the first study tool most students abandon — and the most important.',
    multiply: 'What you are learning connects to who you want to become.',
  },
};

export function getSnapshotTeaser(persona: Persona, letterId: LetterId): string {
  return SNAPSHOT_TEASERS[persona]?.[letterId] ?? SNAPSHOT_TEASERS.recovery[letterId];
}
