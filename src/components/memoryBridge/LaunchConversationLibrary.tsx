import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, History, Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CONVERSATIONS_PER_PAGE, conversationMonth, filterConversations, LibraryConversation } from '@/lib/memoryBridge/conversationLibrary';

interface Props<T extends LibraryConversation> {
  recordings: T[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
  requestedId: string | null;
  isOpen: (id: string) => boolean;
  setOpen: (id: string, open: boolean) => void;
  renderDetails: (record: T) => React.ReactNode;
  getStatus: (record: T) => string;
  formatDuration: (seconds: number) => string;
}

export function LaunchConversationLibrary<T extends LibraryConversation>({ recordings, loading, failed, onRetry, requestedId, isOpen, setOpen, renderDetails, getStatus, formatDuration }: Props<T>) {
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [until, setUntil] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [focusId, setFocusId] = useState<string | null>(null);
  const lastRequest = useRef<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ordered = useMemo(() => filterConversations(recordings, '', '', ''), [recordings]);
  const filtered = useMemo(() => filterConversations(recordings, search, from, until), [recordings, search, from, until]);
  const pages = Math.max(1, Math.ceil(filtered.length / CONVERSATIONS_PER_PAGE));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * CONVERSATIONS_PER_PAGE, (currentPage + 1) * CONVERSATIONS_PER_PAGE);
  const activeFilters = Boolean(search || from || until);
  const invalidDates = Boolean(from && until && from > until);

  const reveal = (id: string) => {
    const index = ordered.findIndex(record => record.id === id);
    if (index < 0) return;
    setSearch(''); setFrom(''); setUntil('');
    setPage(Math.floor(index / CONVERSATIONS_PER_PAGE));
    setOpen(id, true); setFocusId(id);
  };
  useEffect(() => {
    if (!requestedId || requestedId === lastRequest.current || !ordered.some(record => record.id === requestedId)) return;
    lastRequest.current = requestedId;
    reveal(requestedId);
    // Requests are consumed once, not whenever disclosure preferences change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedId, ordered]);
  useEffect(() => { if (page >= pages) setPage(pages - 1); }, [page, pages]);
  useEffect(() => {
    if (!focusId) return;
    const node = document.getElementById(`conversation-row-${focusId}`);
    if (node) { node.scrollIntoView({ block: 'start' }); node.focus({ preventScroll: true }); setFocusId(null); }
  }, [focusId, currentPage, visible]);

  const reset = () => { setSearch(''); setFrom(''); setUntil(''); setPage(0); };
  const changePage = (next: number) => { setPage(next); listRef.current?.scrollIntoView({ block: 'start' }); };

  return <section aria-labelledby="conversation-library-title" className="mb-10">
    <header className="flex flex-wrap items-end justify-between gap-3 border-b border-launch-gold/30 pb-4 mb-5">
      <div><h2 id="conversation-library-title" className="font-instrument text-3xl md:text-4xl text-launch-ink-deep">My conversations</h2>
        <p className="text-base text-launch-ink mt-2" role="status">{loading ? 'Opening my conversations…' : failed && !recordings.length ? 'Conversations unavailable' : `${recordings.length} ${recordings.length === 1 ? 'conversation' : 'conversations'} loaded`}</p></div>
      {ordered[0] && <Button variant="ghost" className="min-h-14 h-auto text-base text-launch-teal whitespace-normal" onClick={() => reveal(ordered[0].id)}><History className="h-5 w-5 shrink-0" />Last conversation<ArrowRight className="h-4 w-4 shrink-0" /></Button>}
    </header>
    {failed && <div role="alert" className="border-l-2 border-destructive pl-4 mb-5 text-base space-y-2"><p>Could not refresh my conversations. Any conversations already loaded are still here.</p><Button variant="outline" className="min-h-14 text-base border-launch-gold/40 text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10" onClick={onRetry}>Try again</Button></div>}
    {(recordings.length > 0 || activeFilters) && <div className="mb-5 space-y-3">
      <label htmlFor="conversation-search" className="block text-base font-semibold">Find a conversation</label>
      <div className="flex gap-2 items-center">
        <div className="relative min-w-0 flex-1"><Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-launch-ink" /><Input id="conversation-search" type="search" placeholder="Title or reference code" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} className="h-14 pl-12 text-base bg-launch-ivory border-launch-gold/40" /></div>
        <Button variant="outline" aria-expanded={filtersOpen} aria-controls="conversation-date-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="min-h-14 text-base text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10 border-launch-gold/40 bg-launch-ivory"><SlidersHorizontal className="h-5 w-5" /><span className="hidden sm:inline">Filter</span><span className="sm:hidden sr-only">Filter</span>{(from || until) && <span aria-label="Date filter active" className="h-2 w-2 rounded-full bg-launch-teal" />}</Button>
      </div>
      {filtersOpen && <div id="conversation-date-filters" className="flex flex-wrap gap-3 items-end py-3">
        <label className="text-base space-y-2 min-w-0 flex-1"><span className="block">From</span><Input aria-label="From date" type="date" value={from} onChange={event => { setFrom(event.target.value); setPage(0); }} className="h-14 w-full min-w-0 text-base bg-launch-ivory border-launch-gold/40" /></label>
        <label className="text-base space-y-2 min-w-0 flex-1"><span className="block">Until</span><Input aria-label="Until date" type="date" min={from || undefined} value={until} onChange={event => { setUntil(event.target.value); setPage(0); }} className="h-14 w-full min-w-0 text-base bg-launch-ivory border-launch-gold/40" /></label>
      </div>}
      {invalidDates && <p role="alert" className="text-base text-destructive">Choose an Until date on or after the From date.</p>}
      {activeFilters && <div className="flex flex-wrap justify-between items-center gap-2 text-base"><span role="status">{filtered.length} matching {filtered.length === 1 ? 'conversation' : 'conversations'}{(from || until) && ` · ${from || 'Any date'} to ${until || 'Any date'}`}</span><Button variant="ghost" className="min-h-14 text-base border-launch-gold/40 text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10" onClick={reset}><X className="h-4 w-4" />Clear search and filters</Button></div>}
    </div>}
    {loading && recordings.length === 0 ? <p role="status" className="flex gap-2 items-center py-6 text-base"><Loader2 className="h-5 w-5 animate-spin" />Opening my conversations…</p> : !failed && recordings.length === 0 ? <div className="py-6 border-b border-launch-gold/30"><h3 className="text-xl font-semibold mb-3">A conversation worth keeping</h3><p className="text-lg leading-relaxed max-w-xl">An appointment, a family conversation, or an idea I want to return to. My first recording will appear here.</p></div> : filtered.length === 0 && recordings.length > 0 ? <div className="py-8 text-base"><p className="font-semibold text-xl mb-3">No conversations match</p><Button variant="outline" className="min-h-14 text-base border-launch-gold/40 text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10" onClick={reset}>Clear search and filters</Button></div> : <div ref={listRef} className="scroll-mt-28">
      {visible.map((record, index) => {
        const month = conversationMonth(record.created_at);
        const showMonth = index === 0 || month !== conversationMonth(visible[index - 1].created_at);
        const open = isOpen(record.id);
        const date = new Date(record.created_at);
        return <React.Fragment key={record.id}>
          {showMonth && <h3 className="text-base font-semibold text-launch-teal border-b border-launch-gold/40 pt-5 pb-3">{month}</h3>}
          <article id={`conversation-row-${record.id}`} tabIndex={-1} className="scroll-mt-28 border-b border-launch-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-launch-teal">
            <Button variant="ghost" aria-expanded={open} aria-controls={`conversation-${record.id}`} aria-label={`${open ? 'Hide' : 'Show'} details for ${record.title}`} onClick={() => setOpen(record.id, !open)} className="w-full min-h-14 h-auto px-2 sm:px-4 py-4 rounded-none text-left justify-between gap-4 whitespace-normal hover:bg-launch-teal/5">
              <span className="min-w-0 flex-1 space-y-2"><span className="block text-lg font-semibold leading-relaxed break-words text-launch-ink-deep">{record.title}</span><span className="flex flex-wrap gap-x-3 gap-y-1 text-base font-normal text-launch-ink"><span>{Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>{typeof record.duration_seconds === 'number' && record.duration_seconds > 0 && <span>{formatDuration(record.duration_seconds)}</span>}<span className="font-medium">{getStatus(record)}</span></span></span>
              {open ? <ChevronUp className="h-5 w-5 shrink-0 text-launch-teal" /> : <ChevronDown className="h-5 w-5 shrink-0 text-launch-teal" />}
            </Button>
            {open && <div id={`conversation-${record.id}`} role="region" aria-label={`Details for ${record.title}`} className="px-2 sm:px-4 pb-5 pt-2 space-y-4">{renderDetails(record)}</div>}
          </article>
        </React.Fragment>;
      })}
      {filtered.length > 0 && <footer className="pt-5 space-y-3"><p role="status" className="text-base text-launch-ink">{currentPage * CONVERSATIONS_PER_PAGE + 1}–{Math.min((currentPage + 1) * CONVERSATIONS_PER_PAGE, filtered.length)} of {filtered.length}{activeFilters ? ' matching' : ' loaded'} conversations</p>{pages > 1 && <nav aria-label="Conversation pages" className="flex flex-wrap items-center justify-between gap-2"><Button variant="outline" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)} className="min-h-14 text-base text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10 border-launch-gold/40"><ArrowLeft className="h-4 w-4" />Previous</Button><span className="text-base">{currentPage + 1} / {pages}</span><Button variant="outline" disabled={currentPage === pages - 1} onClick={() => changePage(currentPage + 1)} className="min-h-14 text-base text-launch-ink-deep hover:text-launch-ink-deep hover:bg-launch-gold/10 border-launch-gold/40">Next<ArrowRight className="h-4 w-4" /></Button></nav>}</footer>}
    </div>}
  </section>;
}