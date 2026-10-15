/** Only highlight a unique literal quote; never infer provenance from word overlap. */
export function uniqueQuoteMatch(text: string, quote?: string | null): { start: number; end: number } | null {
  const words = quote?.trim().split(/\s+/) || [];
  if (words.length < 3 || words.join(' ').length < 12) return null;
  const pattern = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
  const matches = Array.from(text.matchAll(new RegExp(pattern, 'giu')));
  if (matches.length !== 1) return null;
  const match = matches[0];
  if (match.index === undefined) return null;
  return { start: match.index, end: match.index + match[0].length };
}