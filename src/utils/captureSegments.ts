/**
 * Continuous safe-keeping for a live capture.
 *
 * A conversation is written to the device in short segments *while* it is being
 * recorded, so a crash, a flat battery, a closed tab or a forgotten stop never
 * loses what was already said. Each live capture is a "session"; segments are
 * appended as they arrive and the whole thing can be reassembled later.
 */

const DB_NAME = 'myrhythm-capture-segments';
const DB_VERSION = 1;
const SESSIONS = 'sessions';
const SEGMENTS = 'segments';

export interface CaptureSessionMeta {
  id: string;
  title: string;
  mimeType: string;
  startedAt: number;
  updatedAt: number;
  /** seconds captured so far (best effort) */
  duration: number;
  bytes: number;
  /** false while capture is live, true once it ended cleanly */
  finished: boolean;
  /** how the session ended, for honest copy on the recovery card */
  endedBy?: 'user' | 'quiet' | 'limit' | 'calendar';
  /** true when capture began after the meeting had already started */
  lateStart?: boolean;
}

interface SegmentRow {
  key: string;
  sessionId: string;
  index: number;
  blob: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SESSIONS)) {
        db.createObjectStore(SESSIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(SEGMENTS)) {
        const store = db.createObjectStore(SEGMENTS, { keyPath: 'key' });
        store.createIndex('sessionId', 'sessionId', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(
  stores: string | string[],
  mode: IDBTransactionMode,
  run: (t: IDBTransaction) => Promise<T> | T,
): Promise<T | null> {
  try {
    const db = await openDb();
    const t = db.transaction(stores, mode);
    const result = await run(t);
    await new Promise<void>((resolve, reject) => {
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
    db.close();
    return result;
  } catch (err) {
    console.warn('captureSegments: IndexedDB unavailable', err);
    return null;
  }
}

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export function newCaptureSessionId(): string {
  return `cap-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function beginCaptureSession(meta: {
  id: string;
  title: string;
  mimeType: string;
  lateStart?: boolean;
}): Promise<void> {
  const row: CaptureSessionMeta = {
    id: meta.id,
    title: meta.title,
    mimeType: meta.mimeType,
    startedAt: Date.now(),
    updatedAt: Date.now(),
    duration: 0,
    bytes: 0,
    finished: false,
    lateStart: meta.lateStart,
  };
  await tx(SESSIONS, 'readwrite', (t) => {
    t.objectStore(SESSIONS).put(row);
  });
}

export async function appendCaptureSegment(
  sessionId: string,
  blob: Blob,
  index: number,
  durationSeconds: number,
): Promise<void> {
  await tx([SESSIONS, SEGMENTS], 'readwrite', async (t) => {
    const seg: SegmentRow = {
      key: `${sessionId}:${index.toString().padStart(6, '0')}`,
      sessionId,
      index,
      blob,
    };
    t.objectStore(SEGMENTS).put(seg);

    const sessions = t.objectStore(SESSIONS);
    const existing = await request(sessions.get(sessionId) as IDBRequest<CaptureSessionMeta | undefined>);
    if (existing) {
      sessions.put({
        ...existing,
        updatedAt: Date.now(),
        duration: Math.max(existing.duration, Math.floor(durationSeconds)),
        bytes: existing.bytes + blob.size,
      });
    }
  });
}

export async function finishCaptureSession(
  sessionId: string,
  endedBy: CaptureSessionMeta['endedBy'],
  durationSeconds?: number,
): Promise<void> {
  await tx(SESSIONS, 'readwrite', async (t) => {
    const store = t.objectStore(SESSIONS);
    const existing = await request(store.get(sessionId) as IDBRequest<CaptureSessionMeta | undefined>);
    if (!existing) return;
    store.put({
      ...existing,
      finished: true,
      endedBy,
      updatedAt: Date.now(),
      duration: durationSeconds ? Math.floor(durationSeconds) : existing.duration,
    });
  });
}

/** Captures that never made it through save — the ones worth rescuing. */
export async function listRecoverableSessions(): Promise<CaptureSessionMeta[]> {
  const rows = await tx(SESSIONS, 'readonly', (t) =>
    request(t.objectStore(SESSIONS).getAll() as IDBRequest<CaptureSessionMeta[]>),
  );
  if (!rows) return [];
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const fresh = rows.filter((r) => r.updatedAt >= cutoff && r.bytes > 0);
  // Anything older than a week is tidied away so nothing stale resurfaces.
  for (const stale of rows.filter((r) => r.updatedAt < cutoff)) {
    await deleteCaptureSession(stale.id);
  }
  return fresh.sort((a, b) => b.startedAt - a.startedAt);
}

export async function assembleCaptureSession(
  sessionId: string,
): Promise<{ blob: Blob; meta: CaptureSessionMeta } | null> {
  const result = await tx([SESSIONS, SEGMENTS], 'readonly', async (t) => {
    const meta = await request(
      t.objectStore(SESSIONS).get(sessionId) as IDBRequest<CaptureSessionMeta | undefined>,
    );
    if (!meta) return null;
    const segs = await request(
      t.objectStore(SEGMENTS).index('sessionId').getAll(sessionId) as IDBRequest<SegmentRow[]>,
    );
    return { meta, segs };
  });

  if (!result) return null;
  const { meta, segs } = result;
  if (!segs.length) return null;
  const ordered = segs.sort((a, b) => a.index - b.index).map((s) => s.blob);
  const blob = new Blob(ordered, { type: meta.mimeType || 'audio/webm' });
  if (blob.size === 0) return null;
  return { blob, meta };
}

export async function deleteCaptureSession(sessionId: string): Promise<void> {
  await tx([SESSIONS, SEGMENTS], 'readwrite', async (t) => {
    t.objectStore(SESSIONS).delete(sessionId);
    const index = t.objectStore(SEGMENTS).index('sessionId');
    const keys = await request(index.getAllKeys(sessionId) as IDBRequest<IDBValidKey[]>);
    keys.forEach((k) => t.objectStore(SEGMENTS).delete(k));
  });
}
