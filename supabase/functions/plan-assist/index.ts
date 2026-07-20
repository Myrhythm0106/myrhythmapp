// Edge function: plan-assist
// Generates a gentle Core / Key / Stretch draft for a planning scope.
// Uses Lovable AI Gateway. Brain-injury-aware tone. No medical claims.

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

type Scope = 'day' | 'week' | 'month' | 'year';

interface PlanAssistRequest {
  scope: Scope;
  period_start: string; // yyyy-MM-dd
  feeling?: 'low' | 'steady' | 'strong';
  aspiration?: string; // "one thing you'd love to be true"
  existing_commitments?: string;
}

interface PlanAssistResponse {
  core: string;
  key: string;
  stretch: string;
  rationale: string;
}

const scopeLabel: Record<Scope, string> = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  year: 'this year',
};

async function fetchParentContext(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  scope: Scope,
) {
  if (scope === 'year') return { yearVision: null, monthTheme: null };
  const { data } = await supabase
    .from('planning_scopes')
    .select('scope, vision_text, core, key, stretch')
    .eq('user_id', userId)
    .in('scope', ['year', 'month']);
  const year = (data ?? []).find((r) => r.scope === 'year');
  const month = (data ?? []).find((r) => r.scope === 'month');
  return {
    yearVision: year?.vision_text ?? null,
    monthTheme: month?.vision_text ?? month?.core ?? null,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing LOVABLE_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'not_authenticated' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as PlanAssistRequest;
    if (!body?.scope || !body?.period_start) {
      return new Response(JSON.stringify({ error: 'invalid_body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { yearVision, monthTheme } = await fetchParentContext(supabase, user.id, body.scope);

    const systemPrompt = `You are MyRhythm's gentle planning assistant. You help people — including those with brain injury, ADHD, or high stress — draft a small, kind plan for ${scopeLabel[body.scope]}.

Rules (non-negotiable):
- Never diagnose, treat, cure, or mention any medical condition.
- Never promise outcomes. Suggest, don't prescribe.
- Tone: warm, plain, short sentences. No jargon. No emojis.
- Cognitive load: Core, Key, and Stretch each MUST be ≤ 8 words and start with a verb.
- Rationale ≤ 2 short sentences, plain English, references what the user said.
- Core = one small, non-negotiable win. Key = important but flexible. Stretch = only if energy allows.
- If feeling is "low", keep Core very small (a single doable action). Never push.
- Respect the user's existing commitments — do not duplicate them.
- Cascade from context: if a year vision or monthly theme is present, gently align.

Return strict JSON: { "core": string, "key": string, "stretch": string, "rationale": string }.`;

    const userPrompt = `Scope: ${body.scope} (${body.period_start}).
Feeling: ${body.feeling ?? 'not shared'}.
One thing they'd love to be true by end of ${scopeLabel[body.scope]}: ${body.aspiration ?? 'not shared'}.
Already committed to: ${body.existing_commitments ?? 'nothing shared'}.
Year vision: ${yearVision ?? 'not set'}.
Monthly theme: ${monthTheme ?? 'not set'}.

Draft a Core, Key, and Stretch commitment plus a short rationale. Return only JSON.`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': key,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error(`AI gateway failed [${aiRes.status}]:`, errText);
      return new Response(
        JSON.stringify({ error: 'ai_failed', status: aiRes.status, details: errText }),
        {
          status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        },
      );
    }

    const aiJson = await aiRes.json();
    const content = aiJson?.choices?.[0]?.message?.content ?? '{}';
    let parsed: PlanAssistResponse;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(JSON.stringify({ error: 'parse_failed', raw: content }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('plan-assist error', e);
    return new Response(JSON.stringify({ error: 'internal', message: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
