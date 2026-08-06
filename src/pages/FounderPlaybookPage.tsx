import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Circle,
  AlertCircle,
  Target,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import {
  GATES,
  HORIZONS,
  LEGAL_ITEMS,
  METRICS,
  MVP_CHECKLIST,
  OBJECTIVES,
  PLAN_WEEKS,
  RISKS,
  type PlaybookProgressRow,
  type PlaybookStatus,
} from '@/founder/playbook';
import { buildPlaybookWorkbook, downloadPlaybookXlsx, parsePlaybookXlsx } from '@/founder/playbookXlsx';

const statusOrder: Record<PlaybookStatus, number> = {
  'Not started': 0,
  'In progress': 1,
  Blocked: 2,
  Done: 3,
};

const statusClass: Record<string, string> = {
  'Not started': 'bg-muted text-muted-foreground',
  'In progress': 'bg-amber-100 text-amber-900',
  Done: 'bg-emerald-100 text-emerald-900',
  Blocked: 'bg-destructive/10 text-destructive',
};

function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-2xl font-semibold text-foreground mt-1">{value}</div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function FounderPlaybookPage() {
  const [progress, setProgress] = useState<Record<string, PlaybookProgressRow>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('founder_playbook_progress').select('*');
    if (error) {
      toast.error('Could not load playbook progress');
      console.error(error);
    } else {
      const map: Record<string, PlaybookProgressRow> = {};
      data?.forEach((r) => {
        map[r.item_key] = r as PlaybookProgressRow;
      });
      setProgress(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const statusOf = (key: string) => progress[key]?.status ?? 'Not started';

  const stats = useMemo(() => {
    const mvpDone = MVP_CHECKLIST.filter((c) => statusOf(c.key) === 'Done').length;
    const mvpTotal = MVP_CHECKLIST.length;
    const gatesDone = GATES.filter((g) => statusOf(g.key) === 'Done').length;
    const gatesTotal = GATES.length;
    const legalDone = LEGAL_ITEMS.filter((l) => statusOf(l.key) === 'Done').length;
    const legalTotal = LEGAL_ITEMS.length;
    const weeksDone = PLAN_WEEKS.filter((w) => statusOf(w.key) === 'Done').length;
    const activeWeek = PLAN_WEEKS.find((w) => statusOf(w.key) === 'In progress') ?? PLAN_WEEKS[0];
    return { mvpDone, mvpTotal, gatesDone, gatesTotal, legalDone, legalTotal, weeksDone, activeWeek };
  }, [progress]);

  const handleDownload = async () => {
    setBusy(true);
    try {
      await downloadPlaybookXlsx(progress);
      toast.success('Playbook downloaded');
    } catch (e) {
      toast.error('Download failed');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { rows, matched, ignored } = await parsePlaybookXlsx(file);
      if (rows.length === 0) {
        toast('No recognised rows found in the sheet.');
        return;
      }
      const upserts = rows.map((r) => ({
        horizon: r.horizon,
        item_key: r.item_key,
        status: r.status,
        value: r.value,
        note: r.note,
      }));
      const { error } = await supabase.from('founder_playbook_progress').upsert(upserts, { onConflict: 'item_key' });
      if (error) throw error;
      await fetchProgress();
      toast.success(`Imported ${matched} rows${ignored.length ? `, ignored ${ignored.length} unknown keys` : ''}`);
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const currentHorizon = HORIZONS[0];
  const nextGate = GATES.find((g) => statusOf(g.key) !== 'Done') ?? GATES[GATES.length - 1];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MyRhythm Playbook</h1>
          <p className="text-muted-foreground mt-1">
            MVP → 5 years. Sheet-first working surface, mirrored here as the record.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={handleUpload}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={busy || loading}>
            <Upload className="h-4 w-4 mr-2" />
            Upload sheet
          </Button>
          <Button onClick={handleDownload} disabled={busy || loading}>
            <Download className="h-4 w-4 mr-2" />
            Download sheet
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric
              label="Live horizon"
              value={currentHorizon.name}
              sub={`Question: ${currentHorizon.question}`}
            />
            <Metric
              label="Next gate"
              value={nextGate.name}
              sub={`Due ${new Date(nextGate.date).toLocaleDateString('en-GB')}`}
            />
            <Metric
              label="MVP checklist"
              value={`${stats.mvpDone}/${stats.mvpTotal}`}
              sub={<Progress value={(stats.mvpDone / stats.mvpTotal) * 100} className="h-2 mt-2" />}
            />
            <Metric
              label="Active week"
              value={stats.activeWeek?.key ?? '—'}
              sub={stats.activeWeek?.theme}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                How this works
              </CardTitle>
              <CardDescription>
                The spreadsheet is the working surface. Edit Status, Value and Note columns, then upload the same file back. The app stores the changes and becomes the record.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex gap-3">
                  <Download className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Download</strong> the current playbook to work in Google Sheets or Excel.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Upload className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Upload</strong> the edited file. Rows match on the Key column; unknown keys are ignored.
                  </p>
                </div>
                <div className="flex gap-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Claim discipline</strong> stays in the Metrics tab: Confidence, Identity, Behaviour, Quality of Life and Commercial only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Gates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {GATES.map((g) => {
                  const s = statusOf(g.key);
                  return (
                    <div key={g.key} className="flex items-start justify-between gap-4 p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-foreground">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.passCondition}</p>
                      </div>
                      <Badge className={statusClass[s] ?? 'bg-muted'}>{s}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Next 4 weeks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {PLAN_WEEKS.slice(0, 4).map((w) => {
                  const s = statusOf(w.key);
                  const Icon = s === 'Done' ? CheckCircle2 : s === 'In progress' ? Circle : AlertCircle;
                  return (
                    <div key={w.key} className="flex items-start gap-3 p-3 rounded-lg border">
                      <Icon className={`h-4 w-4 mt-1 shrink-0 ${s === 'Done' ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">{w.theme}</p>
                          <span className="text-xs text-muted-foreground">{w.dates}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{w.target} · {w.owner}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Metrics snapshot</CardTitle>
              <CardDescription>
                These are the measures that sit inside permitted claim domains and align to standards references where relevant.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">Metric</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Domain</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Standard / reference</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Value</th>
                      <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {METRICS.map((m) => {
                      const p = progress[m.key];
                      return (
                        <tr key={m.key} className="border-b last:border-0">
                          <td className="py-2 text-foreground">{m.metric}</td>
                          <td className="py-2 text-muted-foreground">{m.domain}</td>
                          <td className="py-2 text-muted-foreground">{m.standardRef}</td>
                          <td className="py-2 text-foreground font-medium">{p?.value || '—'}</td>
                          <td className="py-2">
                            <Badge className={statusClass[p?.status ?? 'Not started'] ?? 'bg-muted'}>
                              {p?.status ?? 'Not started'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
