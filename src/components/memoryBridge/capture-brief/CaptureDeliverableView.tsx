import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  Share2,
  Stethoscope,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { buildCaptureBrief } from './model/buildCaptureBrief';
import { CaptureBriefModel, SectionKey } from './model/types';
import { CaptureBriefPreview } from './CaptureBriefPreview';
import { CaptureBriefToggles } from './CaptureBriefToggles';

const DEFAULT_SECTIONS: Record<SectionKey, boolean> = {
  summary: true,
  actions: true,
  decisions: true,
  questions: true,
  transcript: false,
};

export function CaptureDeliverableView() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<CaptureBriefModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [exporting, setExporting] = useState<null | 'pdf' | 'docx' | 'xlsx' | 'clinician'>(null);
  const [togglesOpen, setTogglesOpen] = useState(false);

  useEffect(() => {
    if (!meetingId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const m = await buildCaptureBrief(meetingId);
        if (!cancelled) setModel(m);
      } catch (e: any) {
        toast.error(e?.message || 'Could not load capture brief');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  const handleActionUpdate = (id: string, updates: Partial<typeof model.actions[number]>) => {
    setModel(prev => prev ? {
      ...prev,
      actions: prev.actions.map(a => a.id === id ? { ...a, ...updates } : a),
    } : prev);
  };

  const filename = useMemo(() => {
    if (!model) return 'capture-brief';
    const safe = model.title.replace(/[^a-z0-9-_ ]+/gi, '').replace(/\s+/g, '-').toLowerCase();
    const date = new Date().toISOString().slice(0, 10);
    return `${safe || 'capture-brief'}-${date}`;
  }, [model]);

  async function handleExport(kind: 'pdf' | 'docx' | 'xlsx' | 'clinician') {
    if (!model) return;
    try {
      setExporting(kind);
      if (kind === 'clinician') {
        const { exportClinicianPdf } = await import('./exporters/clinicianPdf');
        await exportClinicianPdf(model, filename);
      } else {
        const opts = { sections, filename, includeSchedule };
        if (kind === 'pdf') {
          const { exportCaptureBriefPdf } = await import('./exporters/pdf');
          await exportCaptureBriefPdf(model, opts);
        } else if (kind === 'docx') {
          const { exportCaptureBriefDocx } = await import('./exporters/docx');
          await exportCaptureBriefDocx(model, opts);
        } else {
          const { exportCaptureBriefXlsx } = await import('./exporters/xlsx');
          await exportCaptureBriefXlsx(model, opts);
        }
      }
      toast.success(`Downloaded ${kind === 'clinician' ? 'clinician summary' : kind.toUpperCase()}`);
    } catch (e: any) {
      toast.error(e?.message || `Could not export ${kind === 'clinician' ? 'clinician summary' : kind.toUpperCase()}`);
    } finally {
      setExporting(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange-600 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Composing your capture brief…</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm">
          <p className="text-foreground font-semibold mb-2">We couldn't find this capture.</p>
          <p className="text-sm text-muted-foreground mb-4">
            It may still be processing, or the link may be invalid.
          </p>
          <Button onClick={() => navigate('/launch/memory')}>Back to Memory Bridge</Button>
        </div>
      </div>
    );
  }

  const exportBusy = !!exporting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="min-h-[44px]">
            <ArrowLeft className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Back</span>
          </Button>
          <div className="text-xs text-muted-foreground hidden lg:block truncate">
            Capture Brief · {model.title}
          </div>

          {/* Phone: one Share / Export sheet */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="min-h-[44px] bg-brand-orange-600 hover:bg-brand-orange-700 text-white"
                  disabled={exportBusy}
                >
                  {exportBusy ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Share2 className="h-4 w-4 mr-2" />
                  )}
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
                <DropdownMenuItem className="min-h-[44px]" onClick={() => handleExport('pdf')}>
                  <FileDown className="h-4 w-4 mr-2" /> PDF
                </DropdownMenuItem>
                <DropdownMenuItem className="min-h-[44px]" onClick={() => handleExport('docx')}>
                  <FileText className="h-4 w-4 mr-2" /> Word / Google Docs
                </DropdownMenuItem>
                <DropdownMenuItem className="min-h-[44px]" onClick={() => handleExport('xlsx')}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Sheet
                </DropdownMenuItem>
                <DropdownMenuItem className="min-h-[44px]" onClick={() => handleExport('clinician')}>
                  <Stethoscope className="h-4 w-4 mr-2" /> Clinician summary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tablet and up: explicit buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px]"
              onClick={() => handleExport('xlsx')}
              disabled={exportBusy}
            >
              {exporting === 'xlsx' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 mr-2" />}
              .xlsx
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px]"
              onClick={() => handleExport('docx')}
              disabled={exportBusy}
            >
              {exporting === 'docx' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
              .docx
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px]"
              onClick={() => handleExport('clinician')}
              disabled={exportBusy}
            >
              {exporting === 'clinician' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Stethoscope className="h-4 w-4 mr-2" />}
              Clinician
            </Button>
            <Button
              size="sm"
              className="min-h-[44px] bg-brand-orange-600 hover:bg-brand-orange-700 text-white"
              onClick={() => handleExport('pdf')}
              disabled={exportBusy}
            >
              {exporting === 'pdf' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}
              PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 md:py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8">
        {/* Section toggles: collapsible on phones, sidebar on large screens */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="lg:hidden">
            <Collapsible open={togglesOpen} onOpenChange={setTogglesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full min-h-[48px] justify-between">
                  What's included
                  <ChevronDown className={`h-4 w-4 transition-transform ${togglesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <CaptureBriefToggles
                  sections={sections}
                  onChange={setSections}
                  includeSchedule={includeSchedule}
                  onIncludeScheduleChange={setIncludeSchedule}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="hidden lg:block">
            <CaptureBriefToggles
              sections={sections}
              onChange={setSections}
              includeSchedule={includeSchedule}
              onIncludeScheduleChange={setIncludeSchedule}
            />
            <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed px-1">
              Exports run locally — your transcript never leaves your device for this step. The .docx
              opens cleanly in Google Docs and the .xlsx in Google Sheets.
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <CaptureBriefPreview
            model={model}
            sections={sections}
            includeSchedule={includeSchedule}
            onActionUpdate={handleActionUpdate}
          />
        </main>
      </div>
    </div>
  );
}

export default CaptureDeliverableView;

