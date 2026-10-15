import { useCallback, useEffect, useState } from 'react';

export function useConversationDisclosure(userId?: string) {
  const key = userId ? `myrhythm:conversation-details:${userId}` : null;
  const [choices, setChoices] = useState<{ key: string | null; values: Record<string, boolean> }>({ key: null, values: {} });
  useEffect(() => {
    let values: Record<string, boolean> = {};
    try {
      const parsed = key ? JSON.parse(localStorage.getItem(key) || '{}') : {};
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        values = Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === 'boolean')) as Record<string, boolean>;
      }
    } catch { /* Unavailable storage leaves conversations compact. */ }
    setChoices({ key, values });
  }, [key]);
  const setOpen = useCallback((id: string, open: boolean) => {
    setChoices(prev => {
      const values = { ...(prev.key === key ? prev.values : {}), [id]: open };
      try { if (key) localStorage.setItem(key, JSON.stringify(values)); } catch { /* Session choice still works. */ }
      return { key, values };
    });
  }, [key]);
  return { isOpen: (id: string) => choices.key === key && choices.values[id] === true, setOpen };
}