import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { MyRhythmGCard } from '@/launch/growth/MyRhythmGCard';
import { ChevronLeft } from 'lucide-react';

/**
 * Read-only Support Circle view of another user's MyRHYTHM-G.
 * RLS enforces access via `has_growth_view_access(_owner, _viewer)`.
 */
export default function LaunchCircleGrowth() {
  const { memberId } = useParams<{ memberId: string }>();

  return (
    <LaunchLayout>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Link
          to="/launch/support"
          className="inline-flex items-center gap-1 text-sm text-brain-health-600 hover:text-brain-health-800"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Support Circle
        </Link>

        {memberId ? (
          <MyRhythmGCard ownerId={memberId} />
        ) : (
          <p className="text-sm text-brain-health-500">Member not found.</p>
        )}

        <p className="text-[11px] text-brain-health-500 leading-snug">
          You can see this because they've turned on MyRHYTHM-G sharing. It's a read-only
          view — no scores, no streaks.
        </p>
      </div>
    </LaunchLayout>
  );
}
