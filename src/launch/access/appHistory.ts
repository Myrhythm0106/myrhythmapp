import { isPublicPath } from './publicPaths';

/** Remembers the previous in-app path so Back never leaves the app for the landing page. */
let current: string | null = null;
let previous: string | null = null;

export function recordPath(pathname: string) {
  if (pathname === current) return;
  previous = current;
  current = pathname;
}

/** True when going back would stay inside the signed-in app. */
export function canGoBackInApp(prev: string | null = previous): boolean {
  return !!prev && !isPublicPath(prev);
}
