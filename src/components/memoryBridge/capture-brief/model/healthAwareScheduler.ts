import type { ActionMilestone } from './types';

export interface HealthSignals {
  // Anything missing is silently skipped — never blocks.
  recoveryStage?: 'early' | 'mid' | 'established';
  lastNightSleepHours?: number;
  recentSymptomSeverity?: number; // 0-5 max across 48h
  medicationWindows?: { start: string; end: string }[]; // HH:mm
  clinicalEventsToday?: { startISO: string; endISO: string; kind: string }[];
}

/**
 * Lightweight pass that adjusts each milestone's time + reason based on
 * brain/overall health signals. Pure, deterministic, never throws.
 *
 * Reason chips are user-facing and never use medical language.
 */
export function applyHealthAwareAdjustments(
  milestones: ActionMilestone[],
  signals: HealthSignals,
): ActionMilestone[] {
  if (!milestones.length) return milestones;

  let heavyCountToday = 0;
  const todayStr = new Date().toISOString().slice(0, 10);

  return milestones.map(m => {
    const adjustments: string[] = [];
    let time = m.time ?? '10:30';
    let loadTier = m.loadTier ?? 'med';

    // Low-sleep shift: first morning slot of the day +90min, lower load.
    if (
      signals.lastNightSleepHours !== undefined &&
      signals.lastNightSleepHours < 6 &&
      m.date === todayStr &&
      time < '12:00'
    ) {
      time = shiftTime(time, 90);
      loadTier = loadTier === 'high' ? 'med' : 'low';
      adjustments.push('Gentle start after short sleep');
    }

    // Recovery stage modifier (early stage = mornings only, 45-min max)
    if (signals.recoveryStage === 'early' && time > '12:00') {
      time = '10:00';
      adjustments.push('Morning window protected');
    }

    // Cognitive load cap (3/day)
    if (loadTier === 'high' && m.date === todayStr) {
      heavyCountToday += 1;
      if (heavyCountToday > 3) {
        loadTier = 'med';
        adjustments.push('Daily focus cap honoured');
      }
    }

    // Post-clinical 2h buffer
    if (signals.clinicalEventsToday?.length) {
      for (const evt of signals.clinicalEventsToday) {
        if (evt.endISO.slice(0, 10) !== m.date) continue;
        const evtEnd = evt.endISO.slice(11, 16);
        const buffered = shiftTime(evtEnd, 120);
        if (time < buffered) {
          time = buffered;
          adjustments.push('Recovery window after appointment');
          break;
        }
      }
    }

    // Medication windows: shift +30min if overlap
    if (signals.medicationWindows?.length) {
      for (const w of signals.medicationWindows) {
        if (time >= w.start && time <= w.end) {
          time = shiftTime(w.end, 30);
          adjustments.push('Medication window respected');
          break;
        }
      }
    }

    // Symptom severity cap
    if ((signals.recentSymptomSeverity ?? 0) >= 3 && loadTier === 'high') {
      loadTier = 'med';
      adjustments.push('Lighter session while recovering');
    }

    const reason = adjustments.length
      ? adjustments.join(' · ')
      : m.scheduleReason || 'Strong-focus window';

    return {
      ...m,
      time,
      loadTier,
      scheduleReason: reason,
      healthAdjustments: adjustments.length ? adjustments : m.healthAdjustments,
    };
  });
}

function shiftTime(hhmm: string, deltaMin: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  const total = Math.min(22 * 60, h * 60 + m + deltaMin);
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
}
