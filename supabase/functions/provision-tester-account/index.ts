// Provisions / repairs the permanent tester account.
// Guarded by a shared secret header — not callable by app users.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-provision-key',
};

const TESTER_EMAIL = 'annabelaaron@yahoo.com';
const TESTER_PASSWORD = 'Myrhythm2026';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const provided = req.headers.get('x-provision-key') ?? '';
    const expected = Deno.env.get('TESTER_PROVISION_KEY') ?? '';
    if (!expected || provided !== expected) {
      return json({ error: 'Not authorised' }, 401);
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } }
    );

    // Find the existing user, if any.
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) return json({ error: error.message }, 500);
      const match = data.users.find(
        (u) => (u.email ?? '').toLowerCase() === TESTER_EMAIL
      );
      if (match) userId = match.id;
      if (data.users.length < 200) break;
    }

    let created = false;
    if (userId) {
      const { error } = await admin.auth.admin.updateUserById(userId, {
        password: TESTER_PASSWORD,
        email_confirm: true,
      });
      if (error) return json({ error: error.message }, 500);
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: TESTER_EMAIL,
        password: TESTER_PASSWORD,
        email_confirm: true,
        user_metadata: { name: 'Annabel Aaron' },
      });
      if (error) return json({ error: error.message }, 500);
      userId = data.user?.id ?? null;
      created = true;
    }

    if (!userId) return json({ error: 'No user id resolved' }, 500);

    // Ensure a profile row exists and is comped so no paywall blocks testing.
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    const profileResult = existingProfile
      ? await admin
          .from('profiles')
          .update({ email: TESTER_EMAIL, name: 'Annabel Aaron', founding_comped: true })
          .eq('id', userId)
      : await admin
          .from('profiles')
          .insert({ id: userId, email: TESTER_EMAIL, name: 'Annabel Aaron', founding_comped: true });

    return json({
      ok: true,
      created,
      user_id: userId,
      email: TESTER_EMAIL,
      profile_warning: profileResult.error?.message ?? null,
    });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
