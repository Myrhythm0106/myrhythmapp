import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { type RoadmapTask, TIMELINE_START, TIMELINE_END, MONTHS } from '@/data/roadmapData';
import { cn } from '@/lib/utils';

interface GanttChartProps {
  tasks: RoadmapTask[];
  printRef?: React.RefObject<HTMLDivElement>;
}

function getDaysBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
}

const totalDays = getDaysBetween(TIMELINE_START, TIMELINE_END);

function getBarStyle(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const leftPct = (getDaysBetween(TIMELINE_START, start) / totalDays) * 100;
  const widthPct = Math.max((getDaysBetween(start, end) / totalDays) * 100, 1.5);
  return { left: `${leftPct}%`, width: `${widthPct}%` };
}

function TaskRow({ task }: { task: RoadmapTask }) {
  const [expanded, setExpanded] = useState(false);
  const barStyle = getBarStyle(task.startDate, task.endDate);

  return (
    <div className="group">
      <div className="flex items-stretch border-b border-border/40 hover:bg-muted/30 transition-colors min-h-[52px]">
        {/* Label */}
        <div className="w-[220px] md:w-[260px] flex-shrink-0 flex items-center gap-2 px-3 py-2 border-r border-border/40">
          {task.subtasks && task.subtasks.length > 0 ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-0.5 rounded hover:bg-muted transition-colors"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span className="text-sm font-medium truncate">
            {task.isMilestone ? '◆ ' : ''}{task.title}
          </span>
        </div>

        {/* Bar area */}
        <div className="flex-1 relative py-2">
          <motion.div
            className={cn(
              'absolute top-1/2 -translate-y-1/2 h-8 rounded-md bg-gradient-to-r shadow-sm cursor-pointer',
              task.color,
              task.isMilestone && 'h-8 w-8 rounded-full flex items-center justify-center'
            )}
            style={task.isMilestone ? { left: barStyle.left, width: '28px' } : barStyle}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            title={`${task.title}\n${task.startDate} → ${task.endDate}`}
          >
            {!task.isMilestone && (
              <span className="absolute inset-0 flex items-center px-2 text-xs text-white font-medium truncate">
                {task.title}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Subtasks */}
      <AnimatePresence>
        {expanded && task.subtasks && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {task.subtasks.map((sub, i) => (
              <div key={i} className="flex items-stretch border-b border-border/20 bg-muted/20 min-h-[36px]">
                <div className="w-[220px] md:w-[260px] flex-shrink-0 flex items-center gap-2 px-3 pl-10 py-1 border-r border-border/40">
                  <span className="text-xs text-muted-foreground">• {sub}</span>
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function GanttChart({ tasks, printRef }: GanttChartProps) {
  return (
    <div ref={printRef} className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
      {/* Month headers */}
      <div className="flex items-stretch border-b border-border bg-muted/50">
        <div className="w-[220px] md:w-[260px] flex-shrink-0 px-3 py-3 border-r border-border/40">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task</span>
        </div>
        <div className="flex-1 flex">
          {MONTHS.map((month, i) => (
            <div
              key={month}
              className="flex-1 text-center py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/20 last:border-r-0"
            >
              {month}
            </div>
          ))}
        </div>
      </div>

      {/* Task rows */}
      <div className="overflow-x-auto">
        {tasks.map(task => (
          <TaskRow key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
