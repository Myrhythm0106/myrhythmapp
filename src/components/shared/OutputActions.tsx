import React from 'react';
import { Copy, Mail, Download, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface OutputActionsProps {
  /** The plain-text payload to copy / email / download. */
  text: string;
  /** Optional subject for the email "mailto:" link and download filename. */
  subject?: string;
  /** Called when the user taps Edit. Hide button if omitted. */
  onEdit?: () => void;
  /** Override visible buttons. Defaults to all four. */
  show?: Partial<Record<'copy' | 'email' | 'download' | 'edit', boolean>>;
  /** Compact = icon-only; full = icon + label. */
  size?: 'compact' | 'full';
  className?: string;
  /** Optional label for the success toast on copy. */
  copyToastLabel?: string;
}

/**
 * Shared output toolbar for every artefact a user can take away
 * (transcript, summary, action list, brief, reflection).
 *
 * Cognitive-load rules:
 * - Minimum 44px tap target (compact) / 56px (full).
 * - Every icon-only button carries an aria-label.
 * - Plain-language tooltips; no jargon.
 * - Reversible: copy/email/download do not mutate data.
 */
export function OutputActions({
  text,
  subject = 'From MyRhythm',
  onEdit,
  show,
  size = 'compact',
  className,
  copyToastLabel = 'Copied to clipboard',
}: OutputActionsProps) {
  const visible = {
    copy: show?.copy ?? true,
    email: show?.email ?? true,
    download: show?.download ?? true,
    edit: show?.edit ?? Boolean(onEdit),
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(copyToastLabel);
    } catch {
      toast.error('Could not copy. Try selecting the text by hand.');
    }
  };

  const handleEmail = () => {
    const body = encodeURIComponent(text);
    const subj = encodeURIComponent(subject);
    window.location.href = `mailto:?subject=${subj}&body=${body}`;
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safe = subject.replace(/[^a-z0-9-_ ]/gi, '').trim() || 'myrhythm-export';
    a.download = `${safe}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  const base =
    size === 'compact'
      ? 'inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-3 rounded-xl text-sm font-medium bg-white/90 hover:bg-white border border-white/60 text-foreground shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-500'
      : 'inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-xl text-base font-medium bg-white/90 hover:bg-white border border-white/60 text-foreground shadow-sm hover:shadow transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange-500';

  return (
    <div
      className={cn('flex flex-wrap items-center gap-2', className)}
      role="group"
      aria-label="Output actions"
    >
      {visible.copy && (
        <button type="button" onClick={handleCopy} className={base} aria-label="Copy to clipboard" title="Copy">
          <Copy className="h-4 w-4" aria-hidden="true" />
          {size === 'full' && <span>Copy</span>}
        </button>
      )}
      {visible.email && (
        <button type="button" onClick={handleEmail} className={base} aria-label="Send by email" title="Email">
          <Mail className="h-4 w-4" aria-hidden="true" />
          {size === 'full' && <span>Email</span>}
        </button>
      )}
      {visible.download && (
        <button type="button" onClick={handleDownload} className={base} aria-label="Download as text file" title="Download">
          <Download className="h-4 w-4" aria-hidden="true" />
          {size === 'full' && <span>Download</span>}
        </button>
      )}
      {visible.edit && onEdit && (
        <button type="button" onClick={onEdit} className={base} aria-label="Edit" title="Edit">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {size === 'full' && <span>Edit</span>}
        </button>
      )}
    </div>
  );
}

export default OutputActions;
