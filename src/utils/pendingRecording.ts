/**
 * Durable holding area for a just-finished recording.
 *
 * The recorded audio used to live only in an in-memory ref, so anything that
 * remounted the page (phone backgrounding the tab, auth refresh, reload)
 * silently threw the recording away. We persist it to IndexedDB the moment
 * recording stops and restore it when the review screen mounts.
 */

const DB_NAME = 'myrhythm-capture';
const STORE = 'pending';
const KEY = 'current';

export interface PendingRecording {
  blob: Blob;
  mimeType: string;
  extension: string;
  duration: number;
  title: string;
  savedAt: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest,
): Promise<T | null> {
  try {
    const db = await openDb();
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const req = fn(tx.objectStore(STORE));
      req.onsuccess = () => resolve((req.result as T) ?? null);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('pendingRecording: IndexedDB unavailable', err);
    return null;
  }
}

export async function savePendingRecording(entry: PendingRecording): Promise<void> {
  await withStore('readwrite', (store) => store.put(entry, KEY));
}

export async function loadPendingRecording(): Promise<PendingRecording | null> {
  const entry = await withStore<PendingRecording>('readonly', (store) => store.get(KEY));
  if (!entry || !(entry.blob instanceof Blob) || entry.blob.size === 0) return null;
  // Drop anything older than 24h so a stale capture never resurfaces.
  if (Date.now() - entry.savedAt > 24 * 60 * 60 * 1000) {
    await clearPendingRecording();
    return null;
  }
  return entry;
}

export async function clearPendingRecording(): Promise<void> {
  await withStore('readwrite', (store) => store.delete(KEY));
}
