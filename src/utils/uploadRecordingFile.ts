import { supabase } from '@/integrations/supabase/client';

/**
 * Upload an existing audio/video file as a Memory Bridge recording so it can be
 * transcribed and turned into next steps exactly like a live capture.
 */

export interface UploadedRecording {
  id: string;
  title: string;
  durationSeconds: number;
}

const ACCEPTED_PREFIXES = ['audio/', 'video/'];

export function isSupportedRecordingFile(file: File): boolean {
  if (ACCEPTED_PREFIXES.some(p => (file.type || '').startsWith(p))) return true;
  // Some phones hand over an empty MIME type — fall back to the extension.
  return /\.(m4a|mp3|wav|aac|ogg|webm|mp4|mov|caf|flac)$/i.test(file.name);
}

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  if ((file.type || '').includes('mp4')) return 'm4a';
  if ((file.type || '').includes('wav')) return 'wav';
  return 'webm';
}

/** Best-effort duration read from the browser; 0 when the container can't be probed. */
export async function readMediaDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement((file.type || '').startsWith('video/') ? 'video' : 'audio');
    const done = (value: number) => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(value) && value > 0 ? Math.round(value) : 0);
    };
    el.preload = 'metadata';
    el.onloadedmetadata = () => done(el.duration);
    el.onerror = () => done(0);
    window.setTimeout(() => done(el.duration || 0), 8000);
    el.src = url;
  });
}

export async function uploadRecordingFile(
  file: File,
  userId: string,
  title: string,
): Promise<UploadedRecording> {
  const durationSeconds = await readMediaDuration(file);
  const contentType = file.type || 'audio/mpeg';
  const path = `${userId}/${Date.now()}.${extensionFor(file)}`;

  const { error: uploadError } = await supabase.storage
    .from('voice-recordings')
    .upload(path, file, { contentType, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from('voice_recordings')
    .insert({
      user_id: userId,
      title,
      category: 'memory-bridge',
      description: `Uploaded file: ${file.name}`,
      file_path: path,
      file_size_bytes: file.size,
      duration_seconds: durationSeconds,
      access_level: 'private',
    })
    .select('id')
    .single();
  if (error) throw error;

  return { id: data.id, title, durationSeconds };
}
