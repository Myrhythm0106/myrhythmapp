import { isPublicPath } from './publicPaths';

/** The app's own list of visited in-app pages, so Back never relies on browser history or leaves for the landing page. */
let stack: string[] = [];
let going = false;

export function recordPath(pathname: string) {
  if (going) { going = false; return; }
  if (stack[stack.length - 1] === pathname) return;
  stack.push(pathname);
  if (stack.length > 50) stack = stack.slice(-50);
}

/** True when going back would stay inside the signed-in app. */
export function canGoBackInApp(prev: string | null = previousPath()): boolean {
  return !!prev && !isPublicPath(prev);
}

/** Last in-app page before the current one, skipping public pages. */
export function previousPath(): string | null {
  for (let i = stack.length - 2; i >= 0; i--) if (!isPublicPath(stack[i])) return stack[i];
  return null;
}

/** Pops the stack to the previous in-app page and returns it (or null). */
export function popBack(): string | null {
  for (let i = stack.length - 2; i >= 0; i--) {
    if (!isPublicPath(stack[i])) { const to = stack[i]; stack = stack.slice(0, i + 1); going = true; return to; }
  }
  return null;
}

export function resetHistoryForTest() { stack = []; going = false; }
