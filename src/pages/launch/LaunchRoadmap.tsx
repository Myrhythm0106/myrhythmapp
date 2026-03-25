import React, { useRef, useState } from 'react';
import { LaunchLayout } from '@/components/launch/LaunchLayout';
import { GanttChart } from '@/components/roadmap/GanttChart';
import { MilestoneCards } from '@/components/roadmap/MilestoneCards';
import { exportToCSV, copyShareLink } from '@/components/roadmap/roadmapExports';
import { roadmapTasks, type TaskPhase } from '@/data/roadmapData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Download, Share2, FileSpreadsheet, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';

type Filter = 'all' | TaskPhase;

export default function LaunchRoadmap() {
  const [filter, setFilter] = useState<Filter>('all');
  const printRef = useRef<HTMLDivElement>(null);

  const filteredTasks = filter === 'all'
    ? roadmapTasks
    : roadmapTasks.filter(t => t.phase === filter);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'MyRhythm_Roadmap_2026',
  });

  const handleCSV = () => {
    exportToCSV(filteredTasks);
    toast.success('CSV downloaded — open in Google Sheets via File → Import');
  };

  const handleShare = () => {
    copyShareLink();
    toast.success('Roadmap link copied to clipboard');
  };

  return (
    <LaunchLayout>
      <div className="space-y-8">
        <PageHeader
          title="MyRhythm CCM Roadmap"
          subtitle="Interactive development timeline — April to December 2026"
        >
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </PageHeader>

        {/* Phase filter */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All Phases</TabsTrigger>
            <TabsTrigger value="mvp">MVP (Apr–Jun)</TabsTrigger>
            <TabsTrigger value="full-launch">Full Launch (Jul–Dec)</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Gantt Chart */}
        <GanttChart tasks={filteredTasks} printRef={printRef} />

        {/* Milestones */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Key Milestones</h2>
          <MilestoneCards filter={filter} />
        </div>
      </div>
    </LaunchLayout>
  );
}
