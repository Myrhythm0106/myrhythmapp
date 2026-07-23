import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LaunchCard } from '@/components/launch/LaunchCard';
import { LaunchButton } from '@/components/launch/LaunchButton';
import { cn } from '@/lib/utils';

const MAX_MB = 20;
const ALLOWED = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

export interface DocumentImportResult {
  meetingId: string;
  actionsCount: number;
  title: string;
}

interface Props {
  onExtracted: (result: DocumentImportResult) => void;
  compact?: boolean;
}

export function DocumentImportCard({ onExtracted, compact = false }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!user) {
      toast.error('Please sign in first.');
      return;
    }

    // Validate type
    const isDocxByName = file.name.toLowerCase().endsWith('.docx');
    if (!ALLOWED.includes(file.type) && !isDocxByName) {
      toast.error('Unsupported file. Upload PDF, DOCX, an image, or plain text.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File too large. Max ${MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/${Date.now()}-${cleanName}`;
      const mimeType = file.type ||
        (isDocxByName
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'application/octet-stream');

      const { error: upErr } = await supabase.storage
        .from('document-imports')
        .upload(filePath, file, {
          contentType: mimeType,
          upsert: false,
        });
      if (upErr) throw upErr;

      const { data, error } = await supabase.functions.invoke(
        'import-schedule-actions',
        {
          body: {
            filePath,
            fileName: file.name,
            mimeType,
          },
        },
      );

      if (error) {
        console.error('import-schedule-actions error', error);
        toast.error(error.message || 'Could not extract actions from that document.');
        return;
      }

      if (!data?.success) {
        toast.error(data?.error || 'Import failed');
        return;
      }

      if (!data.actionsCount || data.actionsCount === 0) {
        toast.info('No actionable items found in that document.');
        return;
      }

      toast.success(`Found ${data.actionsCount} action${data.actionsCount === 1 ? '' : 's'} — review before adding to your calendar.`);
      onExtracted({
        meetingId: data.meetingId,
        actionsCount: data.actionsCount,
        title: data.title || file.name,
      });
    } catch (err: any) {
      console.error('DocumentImportCard failed', err);
      toast.error(err?.message || 'Import failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <LaunchCard
      className={cn(
        'bg-launch-ivory border-launch-gold/30',
        compact ? 'p-4' : 'p-5 mb-4',
      )}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer?.files ?? null);
        }}
        className={cn(
          'rounded-xl border-2 border-dashed p-5 flex flex-col sm:flex-row items-center gap-4 transition-colors',
          dragging
            ? 'border-launch-ember bg-launch-ember/5'
            : 'border-launch-gold/40 bg-white/60',
        )}
      >
        <div className="w-12 h-12 rounded-xl bg-launch-moss/10 flex items-center justify-center shrink-0">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-launch-moss animate-spin" />
          ) : (
            <FileText className="h-6 w-6 text-launch-moss" />
          )}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="font-semibold text-launch-ink">
            Import from a document
          </p>
          <p className="text-sm text-launch-ink/70 mt-0.5">
            Drop a schedule, discharge letter, care plan, or meeting note. We'll extract actions and slot them into free spaces on your calendar.
          </p>
          <p className="text-xs text-launch-ink/50 mt-1">
            PDF, DOCX, images, or plain text · max {MAX_MB} MB
          </p>
        </div>
        <LaunchButton
          onClick={openPicker}
          disabled={uploading}
          className="bg-launch-ember hover:bg-launch-ember/90 text-white shrink-0"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Extracting…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Choose file
            </>
          )}
        </LaunchButton>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt,.md,.csv,image/png,image/jpeg,image/webp"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </LaunchCard>
  );
}
