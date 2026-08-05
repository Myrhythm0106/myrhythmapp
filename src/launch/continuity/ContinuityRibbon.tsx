import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WeekBucket, CompletionStatus } from './buildContinuityReport';

interface Props {
  buckets: WeekBucket[];
  baseColor?: string;
  accentColor?: string;
  inkColor?: string;
  emptyMessage?: string;
}

export function ContinuityRibbon({
  buckets,
  baseColor = '#f5f0e0',
  accentColor = '#c9a84c',
  inkColor = '#064e3b',
  emptyMessage = 'No activity yet for this week.',
}: Props) {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const maxTotal = Math.max(1, ...buckets.map(b => b.total));

  return (
    <div className="w-full">
      <div className="relative h-48 md:h-56 flex items-end gap-1 md:gap-2">
        {/* Guide ticks */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className="absolute left-0 right-0 border-t border-dashed"
              style={{ bottom: `${(n / 3) * 100}%`, borderColor: `${accentColor}22` }}
            />
          ))}
        </div>

        {buckets.map((b, i) => {
          const totalHeight = b.total ? (b.total / maxTotal) * 100 : 0;
          const completedH = b.total ? (b.completed / b.total) * totalHeight : 0;
          const partialH = b.total ? (b.partial / b.total) * totalHeight : 0;
          const notMetH = b.total ? (b.notMet / b.total) * totalHeight : 0;
          const isSelected = selectedWeek === i;

          return (
            <motion.button
              key={b.weekStart}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelectedWeek(isSelected ? null : i)}
              className="flex-1 h-full flex flex-col justify-end group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
              style={{ focusVisibleRingColor: accentColor }}
              aria-label={`Week ${i + 1}: ${b.completed} completed, ${b.partial} partial, ${b.notMet} not met`}
            >
              <div
                className="w-full rounded-sm relative overflow-hidden transition-all"
                style={{
                  height: `${Math.max(totalHeight, 4)}%`,
                  backgroundColor: `${baseColor}80`,
                  boxShadow: isSelected ? `0 0 0 2px ${accentColor}` : 'none',
                }}
              >
                {b.total === 0 ? (
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: `${inkColor}15` }} />
                ) : (
                  <>
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-[height] duration-700 ease-out"
                      style={{ height: `${notMetH}%`, backgroundColor: `${inkColor}25` }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-[height] duration-700 ease-out"
                      style={{ height: `${notMetH + partialH}%`, backgroundColor: `${accentColor}55` }}
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-[height] duration-700 ease-out"
                      style={{ height: `${notMetH + partialH + completedH}%`, backgroundColor: accentColor }}
                    />
                  </>
                )}
              </div>
              <span
                className="mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wide text-center"
                style={{ color: `${inkColor}99`, fontFamily: "'Sora', sans-serif" }}
              >
                W{i + 1}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedWeek !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden border-l-2 pl-4"
            style={{ borderColor: accentColor }}
          >
            <WeekDetail bucket={buckets[selectedWeek]} weekNumber={selectedWeek + 1} inkColor={inkColor} accentColor={accentColor} />
          </motion.div>
        )}
      </AnimatePresence>

      {buckets.length === 0 && (
        <p className="text-xs italic text-center py-8" style={{ color: `${inkColor}66` }}>
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

function WeekDetail({
  bucket,
  weekNumber,
  inkColor,
  accentColor,
}: {
  bucket: WeekBucket;
  weekNumber: number;
  inkColor: string;
  accentColor: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: inkColor, fontFamily: "'Sora', sans-serif" }}>
        Week {weekNumber} · {bucket.weekStart} → {bucket.weekEnd}
      </p>
      <div className="flex flex-wrap gap-3 text-xs" style={{ color: `${inkColor}cc` }}>
        <StatusPill count={bucket.completed} label="carried through" color={accentColor} />
        <StatusPill count={bucket.partial} label="partially met" color={`${accentColor}99`} />
        <StatusPill count={bucket.notMet} label="not met" color={`${inkColor}40`} />
      </div>
      {bucket.total === 0 && (
        <p className="text-xs italic" style={{ color: `${inkColor}80` }}>
          Nothing was scheduled this week. That is information too.
        </p>
      )}
    </div>
  );
}

function StatusPill({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ backgroundColor: `${color}20` }}>
      <span className="font-bold" style={{ color }}>{count}</span>
      <span style={{ color: '#1c1917' }}>{label}</span>
    </span>
  );
}

export default ContinuityRibbon;
