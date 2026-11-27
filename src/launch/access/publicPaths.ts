/**
 * Pages anyone can open without signing in. Everything else needs an account:
 * beyond the landing page, people must be signed in.
 * Kept to the front door, sign-in itself, legal pages and invitation links.
 */
const PUBLIC_EXACT = new Set<string>([
  // Front door and the addresses that simply redirect to it
  '/', '/start', '/landing', '/launch', '/mvp',
  '/launch/landingpage',
  // Getting an account / getting back in
  '/launch/register',
  '/launch/signin',
  '/auth',
  '/email-verification',
  // Invitation links for new Support Circle members
  '/accept-invitation',
  // Legal pages must always be readable
  '/privacy-policy',
  '/terms',
  '/legal/disclaimer',
  // Investor decks are shared with people who don't have an account
  '/investor-deck',
  '/investor-deck-productivity',
  // MVP presentation, shared with people who don't have an account
  '/mvp-deck',
]);

export function isPublicPath(pathname: string): boolean {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return PUBLIC_EXACT.has(clean.toLowerCase());
}
