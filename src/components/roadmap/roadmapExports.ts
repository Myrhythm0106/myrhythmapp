import { roadmapTasks, type RoadmapTask } from '@/data/roadmapData';

export function exportToCSV(tasks: RoadmapTask[] = roadmapTasks) {
  const headers = ['Task', 'Phase', 'Start Date', 'End Date', 'Status', 'Dependencies', 'Description', 'Subtasks'];
  const rows = tasks.map(t => [
    t.title,
    t.phase === 'mvp' ? 'MVP (Apr-Jun 2026)' : 'Full Launch (Jul-Dec 2026)',
    t.startDate,
    t.endDate,
    t.status.replace('-', ' '),
    (t.dependencies || []).join('; '),
    t.description || '',
    (t.subtasks || []).join('; '),
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MyRhythm_Roadmap_2026.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function copyShareLink() {
  const url = `${window.location.origin}/launch/roadmap`;
  navigator.clipboard.writeText(url);
}
