import { describe, it, expect, vi } from 'vitest';
vi.mock('@/integrations/supabase/client', () => ({ supabase: {} }));
vi.mock('@/utils/reminderLadder', () => ({ clearActionReminders: vi.fn() }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn() }) }));
import { closeLinkedAction } from './closeLinkedAction';

function fakeDb(actionId: string | null) {
  const updates: any[] = []; const rpcs: string[] = [];
  const db: any = {
    from: (t: string) => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: t === 'calendar_events' ? { extracted_action_id: actionId } : { status: 'pending', completion_date: null, archived_at: null } }) }) }),
      update: (v: any) => ({ eq: async () => { updates.push(v); return { error: null }; } }),
    }),
    rpc: async (n: string) => { rpcs.push(n); return { data: { notified: 2 } }; },
  };
  return { db, updates, rpcs };
}

describe('closing the loop', () => {
  it('done closes the conversation step and tells the circle', async () => {
    const f = fakeDb('a1');
    const r = await closeLinkedAction('e1', 'done', f.db, false);
    expect(f.updates[0].status).toBe('done');
    expect(f.rpcs).toContain('notify_circle_of_step_completion');
    expect(r?.message).toContain('Support Circle has been told');
  });
  it('let go closes without telling anyone', async () => {
    const f = fakeDb('a1');
    await closeLinkedAction('e1', 'let_go', f.db, false);
    expect(f.updates[0].status).toBe('cancelled');
    expect(f.rpcs).toHaveLength(0);
  });
  it('undo reopens and withdraws the notice', async () => {
    const f = fakeDb('a1');
    const r = await closeLinkedAction('e1', 'done', f.db, false);
    await r!.undo();
    expect(f.updates[1].status).toBe('pending');
    expect(f.rpcs).toContain('withdraw_step_completion_notice');
  });
  it('items not from a conversation are left alone', async () => {
    const f = fakeDb(null);
    expect(await closeLinkedAction('e1', 'done', f.db, false)).toBeNull();
  });
});

describe('reopening', () => {
  it('un-ticking reopens a done conversation step', async () => {
    const updates: any[] = []; const rpcs: string[] = [];
    const db: any = {
      from: (t: string) => ({
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: t === 'calendar_events' ? { extracted_action_id: 'a1' } : { status: 'done' } }) }) }),
        update: (v: any) => ({ eq: async () => { updates.push(v); return { error: null }; } }),
      }),
      rpc: async (n: string) => { rpcs.push(n); return {}; },
    };
    const { reopenLinkedAction } = await import('./closeLinkedAction');
    expect(await reopenLinkedAction('e1', db)).toBe(true);
    expect(updates[0].status).toBe('pending');
    expect(rpcs).toContain('withdraw_step_completion_notice');
  });
});
