// Lightweight, auth-free ACT extraction for the MVP prototype.
// Takes a raw transcript, returns structured actions via Lovable AI Gateway.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface ExtractedAct {
  text: string;
  assignee: string;
  dueContext: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  attendees: string[];
  proposedDate?: string;
  proposedTime?: string;
}

const SYSTEM = `You are an executive assistant. From the transcript, extract every concrete action, commitment, follow-up, or task the speaker mentioned.

For each action, return:
- text: short verb-first phrase (e.g. "Book follow-up with Dr Patel")
- assignee: "me" unless another person clearly owns it
- dueContext: phrase from transcript like "tomorrow", "next week", "Friday", or "unspecified"
- priority: "high" | "medium" | "low" (urgency + stakes)
- confidence: 0..1
- attendees: names of other people involved (excluding the speaker)
- proposedDate: ISO date YYYY-MM-DD inferred from dueContext relative to today (${new Date().toISOString().slice(0,10)}), or null
- proposedTime: HH:mm inferred from transcript or sensible default (09:00 morning, 14:00 afternoon, 18:00 evening), or null

Return ONLY valid JSON: { "acts": [...] }. No prose, no markdown.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { transcript } = await req.json();
    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 5) {
      return new Response(JSON.stringify({ acts: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Transcript:\n"""${transcript.slice(0, 20000)}"""` },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('AI gateway error', res.status, errText);
      if (res.status === 429) return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      if (res.status === 402) return new Response(JSON.stringify({ error: 'credits_exhausted' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      return new Response(JSON.stringify({ error: 'ai_failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? '{}';
    let parsed: { acts: ExtractedAct[] } = { acts: [] };
    try { parsed = JSON.parse(content); } catch { parsed = { acts: [] }; }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('prototype-extract-acts error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
