import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Download, ShieldCheck } from 'lucide-react';
import {
  downloadClinicalExportPdf,
  type ClinicalExportItem,
} from '@/utils/clinicalExport';
import { toast } from 'sonner';

interface ClinicalExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  dateRangeLabel: string;
  items: ClinicalExportItem[];
  summary?: string;
}

export function ClinicalExportDialog({
  open,
  onOpenChange,
  patientName,
  dateRangeLabel,
  items,
  summary,
}: ClinicalExportDialogProps) {
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeItems, setIncludeItems] = useState(true);
  const [includeDob, setIncludeDob] = useState(false);
  const [dob, setDob] = useState('');

  const handleDownload = () => {
    downloadClinicalExportPdf({
      patientName,
      dateOfBirth: includeDob && dob ? dob : undefined,
      dateRangeLabel,
      summary: includeSummary ? summary : undefined,
      items: includeItems ? items : [],
    });
    toast.success('Clinical summary downloaded');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            Share with my clinician
          </DialogTitle>
          <DialogDescription>
            This PDF will include the items you tick below. Nothing is shared
            until you confirm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-stone-200 p-3 bg-stone-50/60">
            <p className="text-sm text-stone-700">
              <strong>{patientName}</strong> · {dateRangeLabel}
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={includeSummary}
                onCheckedChange={(v) => setIncludeSummary(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm text-stone-800">
                Include a short narrative summary
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={includeItems}
                onCheckedChange={(v) => setIncludeItems(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm text-stone-800">
                Include {items.length} captured item{items.length === 1 ? '' : 's'} from this period
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox
                checked={includeDob}
                onCheckedChange={(v) => setIncludeDob(!!v)}
                className="mt-0.5"
              />
              <span className="text-sm text-stone-800">
                Include date of birth (helps your clinician identify you)
              </span>
            </label>

            {includeDob && (
              <div className="ml-7">
                <Label htmlFor="dob" className="text-xs text-stone-600">
                  Date of birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed">
            CONFIDENTIAL — Prepared by you via MyRhythm. Not a clinical record.
            MyRhythm does not diagnose, treat, or cure any condition.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload} className="bg-teal-700 hover:bg-teal-800">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
