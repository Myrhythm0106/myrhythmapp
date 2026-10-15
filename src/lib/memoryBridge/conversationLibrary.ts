export interface LibraryConversation {
  id: string;
  title: string;
  created_at: string;
  reference_code?: string | null;
  duration_seconds?: number;
}

export const CONVERSATIONS_PER_PAGE = 10;

export function filterConversations<T extends LibraryConversation>(records: T[], search: string, from: string, until: string): T[] {
  const query = search.trim().toLocaleLowerCase();
  return records.filter(record => {
    const date = new Date(record.created_at);
    const localDay = Number.isNaN(date.getTime()) ? '' : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return (!query || `${record.title} ${record.reference_code ?? ''}`.toLocaleLowerCase().includes(query))
      && (!from || localDay >= from) && (!until || localDay <= until);
  }).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function conversationMonth(createdAt: string): string {
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}