import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { readLocalFocusValue, writeLocalFocusValue } from '@/hooks/useLaunchFocusDisplay';

export const VISION_AREAS = [
  { id: 'home', label: 'Home', description: 'My home and daily life' },
  { id: 'family', label: 'Family', description: 'My family and close relationships' },
  { id: 'work', label: 'Work', description: 'My work and contribution' },
  { id: 'wellbeing', label: 'Wellbeing', description: 'My health and wellbeing' },
  { id: 'learning', label: 'Learning', description: 'My learning and growth' },
] as const;

export type VisionArea = (typeof VISION_AREAS)[number]['id'];
export type ActionVisionLinks = Record<string, VisionArea>;

const KEY_PREFIX = 'launch.action-vision-links:';
const CHANGE = 'launch-focus-display-change';

function isVisionArea(value: unknown): value is VisionArea {
  return VISION_AREAS.some(area => area.id === value);
}

export function visionAreaLabel(area: VisionArea | null | undefined): string {
  return VISION_AREAS.find(item => item.id === area)?.label ?? '';
}

export function visionCompletionMessage(area: VisionArea | null | undefined): string | null {
  const label = visionAreaLabel(area).toLowerCase();
  return label ? `One step closer to my vision for ${label}.` : null;
}

export function shouldOfferVision(recorded: boolean, vision: string, dismissed: boolean): boolean {
  return recorded && !vision.trim() && !dismissed;
}

const KEYWORDS: Record<VisionArea, RegExp> = {
  home: /\b(home|house|flat|clean|cleaning|laundry|washing|groceries|food shop|shopping|repair|cook|cooking|garden)\b/i,
  family: /\b(family|mum|mom|dad|mother|father|child|children|son|daughter|partner|wife|husband|birthday|school pick[ -]?up)\b/i,
  work: /\b(work|meeting|client|deadline|report|manager|colleague|office|presentation|email|project|team|shift|return to work)\b/i,
  wellbeing: /\b(doctor|dr|gp|clinic|hospital|physio|physiotherapy|therapy|therapist|medicine|medication|prescription|health|nurse|neurologist|sleep|exercise|wellbeing)\b/i,
  learning: /\b(study|studying|lecture|revision|revise|exam|course|homework|chapter|training|learn|learning|assignment)\b/i,
};

/** Suggest only from the action's own words. Nothing is linked until the person chooses it. */
export function suggestVisionArea(actionText: string): VisionArea | null {
  const matches = VISION_AREAS.filter(area => KEYWORDS[area.id].test(actionText));
  return matches.length === 1 ? matches[0].id : null;
}

export function readActionVisionLinks(userId: string | null | undefined): ActionVisionLinks {
  if (!userId) return {};
  const saved = readLocalFocusValue<unknown>(`${KEY_PREFIX}${userId}`, {});
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
  return Object.fromEntries(
    Object.entries(saved).filter((entry): entry is [string, VisionArea] => isVisionArea(entry[1])),
  );
}

export function getActionVisionArea(userId: string | null | undefined, actionId: string | null | undefined): VisionArea | null {
  if (!actionId) return null;
  return readActionVisionLinks(userId)[actionId] ?? null;
}

/** User-scoped, device-local presentation state. It never changes the action or diary record. */
export function useActionVisionLinks() {
  const { user } = useAuth();
  const key = `${KEY_PREFIX}${user?.id ?? 'signed-out'}`;
  const [links, setLinks] = useState<ActionVisionLinks>(() => readActionVisionLinks(user?.id));

  useEffect(() => {
    const sync = () => setLinks(readActionVisionLinks(user?.id));
    sync();
    window.addEventListener(CHANGE, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE, sync);
      window.removeEventListener('storage', sync);
    };
  }, [key, user?.id]);

  const setLink = useCallback((actionId: string, area: VisionArea | null) => {
    if (!user?.id) return;
    const current = readActionVisionLinks(user.id);
    const next = { ...current };
    if (area) next[actionId] = area;
    else delete next[actionId];
    writeLocalFocusValue(key, next);
    setLinks(next);
  }, [key, user?.id]);

  const areaFor = useCallback((actionId: string | null | undefined): VisionArea | null => {
    return actionId ? links[actionId] ?? null : null;
  }, [links]);

  return { links, setLink, areaFor };
}
