// Edge function: compose-vision
// Weaves a person's life-section answers into one first-person vision paragraph
// plus a Who / What / Where / When / Why / How summary. No medical claims.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';

const Body = z.object({
  level: z.enum(['year', 'three', 'long']),
  sections: z.array(z.object({ label: z.string().max(60), text: z.string().max(600) })).min(1).max(10),
  anchors: z.record(z.string().max(300)).optional(),
});

const levelText: Record<string, string> = {
  year: 'within the next 12 months',
  three: 'over the next 3 years',
  long: 'over the long term (5 years and beyond)',
};

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['paragraph', 'who', 'what', 'where', 'when', 'why', 'how'],
  properties: {
    paragraph: { type: 'string' },
    who: { type: 'string' }, what: { type: 'string' }, where: { type: 'string' },
    when: { type: 'string' }, why: { type: 'string' }, how: { type: 'string' },
  },
};

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const key = Deno.env.get('LOVABLE_API_KEY');
  if (!key) return json({ error: 'Vision writer is not set up yet.' }, 500);

  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return json({ error: 'Please fill in at least one section first.' }, 400);
  const { level, sections, anchors } = parsed.data;

  const instructions = `You help someone write their personal life vision. Write in the first person ("I"), warm, confident, professional and plain English a 13-year-old understands.
Use ONLY what the person wrote. Never invent names, places, numbers or facts. Keep their own words where possible.
No medical, diagnostic or treatment language. Never mention any programme or expert.
Timeframe: ${levelText[level]}.
Return:
- paragraph: one flowing paragraph of 80-120 words weaving all sections together, naturally covering who, what, where, when, why and how.
- who, what, where, when, why, how: each one short sentence (max 20 words) in first person. If the person gave nothing for an anchor, write a gentle neutral line based on what they did write, without inventing specifics.`;

  const input = [
    'My sections:',
    ...sections.map((s) => `- ${s.label}: ${s.text}`),
    ...(anchors && Object.values(anchors).some((v) => v.trim())
      ? ['Extra details:', ...Object.entries(anchors).filter(([, v]) => v.trim()).map(([k, v]) => `- ${k}: ${v}`)]
      : []),
  ].join('\n');

  try {
    const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      signal: req.signal,
      headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'fetch' },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        instructions,
        input,
        stream: true,
        store: false,
        reasoning: { effort: 'low' },
        text: { format: { type: 'json_schema', name: 'vision', strict: true, schema } },
      }),
    });
    if (!res.ok || !res.body) {
      const t = await res.text().catch(() => '');
      console.error('gateway', res.status, t);
      const msg = res.status === 429 ? 'Busy right now — please try again in a minute.'
        : res.status === 402 ? 'The vision writer is paused (AI credits). Your text is safe.'
        : 'Could not write a draft just now. Your text is safe.';
      return json({ error: msg }, res.status === 429 || res.status === 402 || res.status === 403 ? res.status : 502);
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '', out = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const d = line.slice(5).trim();
        if (!d || d === '[DONE]') continue;
        try {
          const ev = JSON.parse(d);
          if (ev.type === 'response.output_text.delta') out += ev.delta ?? '';
          if (ev.type === 'response.refusal.delta' || ev.type === 'error' || ev.type === 'response.failed') {
            return json({ error: 'Could not write a draft for this text.' }, 422);
          }
        } catch { /* partial */ }
      }
    }
    const result = JSON.parse(out);
    return json(result);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error(e);
    return json({ error: 'Could not write a draft just now. Your text is safe.' }, 500);
  }
});
