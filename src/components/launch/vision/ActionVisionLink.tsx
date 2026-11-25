import React from 'react';
import { Compass } from 'lucide-react';
import { useLaunchSavedVision } from '@/hooks/useLaunchFocusDisplay';
import { suggestVisionArea, useActionVisionLinks, VISION_AREAS, visionAreaLabel, type VisionArea } from '@/launch/vision/actionVision';
import { cn } from '@/lib/utils';

interface Props {
  actionId: string;
  actionText: string;
  className?: string;
}

/** One optional disclosure per action. A suggestion is never saved without a tap. */
export function ActionVisionLink({ actionId, actionText, className }: Props) {
  const savedVision = useLaunchSavedVision();
  const { areaFor, setLink } = useActionVisionLinks();
  const area = areaFor(actionId);
  const suggestion = suggestVisionArea(actionText);

  if (!savedVision) return null;

  return (
    <details className={cn('group mt-2 rounded-lg border border-launch-teal/20 bg-launch-teal/5', className)}>
      <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs font-semibold text-launch-teal marker:content-none">
        <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{area ? `My Vision: ${visionAreaLabel(area)}` : 'Link to My Vision (optional)'}</span>
      </summary>
      <div className="space-y-3 border-t border-launch-teal/15 px-3 py-3">
        {!area && suggestion && (
          <button
            type="button"
            onClick={() => setLink(actionId, suggestion)}
            className="min-h-[44px] rounded-lg bg-launch-teal px-3 text-sm font-semibold text-primary-foreground"
          >
            Use suggested area: {visionAreaLabel(suggestion)}
          </button>
        )}
        <label className="block text-xs font-semibold text-launch-ink">
          Which part of my life does this step serve?
          <select
            value={area ?? ''}
            onChange={event => setLink(actionId, (event.target.value || null) as VisionArea | null)}
            className="mt-1 min-h-[48px] w-full rounded-lg border border-launch-teal/25 bg-launch-ivory px-3 text-sm font-normal text-launch-ink"
            aria-label={`My Vision area for ${actionText}`}
          >
            <option value="">Not linked</option>
            {VISION_AREAS.map(item => <option key={item.id} value={item.id}>{item.description}</option>)}
          </select>
        </label>
        <p className="text-xs leading-relaxed text-launch-ink/60">Saved on this device. This does not change the action, diary time or reminders.</p>
      </div>
    </details>
  );
}
