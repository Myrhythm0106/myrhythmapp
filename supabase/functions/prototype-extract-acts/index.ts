// Lightweight, auth-free ACT extraction for the MVP prototype.
// Takes a raw transcript, returns structured actions via Lovable AI Gateway.
// v7.12: silent context classification + context-shaped ACT fields.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

type ContextId = 'doctor' | 'family' | 'work' | 'therapy' | 'general';

interface ExtractedAct {
  text: string;
  assignee: string;
  dueContext: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  attendees: string[];
  proposedDate?: string;
  proposedTime?: string;
  actType?: string;
  clinician?: string;
}

// Silent classifier — runs before the LLM call so we can inject the
// right prompt addendum. The user never sees this happen.
function classifyContext(transcript: string): { contextId: ContextId; confidence: number } {
  const t = transcript || '';
  const patterns: Record<Exclude<ContextId, 'general'>, RegExp> = {
    doctor: /\b(mg|mcg|dose|dosage|prescription|pharmacy|scan|x-?ray|mri|referral|follow[- ]?up|appointment|symptom|blood test|specialist|consultant|gp|doctor|dr\.?|nurse|clinic|medication|metformin|tablet|pill)\b/gi,
    family: /\b(mum|mom|dad|son|daughter|wife|husband|kids?|school|dinner|weekend|family|grandma|grandpa|nan)\b/gi,
    work: /\b(project|deadline|client|deliverable|sprint|q[1-4]|quarter|stakeholder|launch|roadmap|kpi)\b/gi,
    therapy: /\b(therapist|therapy|counsell?or|feelings?|anxious|anxiety|grief|trauma|coping|reflect|journal)\b/gi,
  };
  let bestId: ContextId = 'general';
  let bestScore = 0;
  (Object.keys(patterns) as Array<Exclude<ContextId, 'general'>>).forEach(id => {
    const m = t.match(patterns[id]);
    const n = m ? m.length : 0;
    if (n > bestScore) { bestScore = n; bestId = id; }
  });
  const confidence = Math.min(1, bestScore / 4);
  return bestScore >= 2 ? { contextId: bestId, confidence } : { contextId: 'general', confidence: 0 };
}

const ADDENDA: Record<ContextId, string> = {
  doctor: `This is a doctor visit. For every ACT also set:
- actType: one of "medication" | "follow_up" | "test" | "referral" | "lifestyle" | "question"
- clinician: name of the clinician mentioned (e.g. "Dr Patel"), or null
Medication changes, follow-ups and referrals are high priority by default.`,
  family: `This is a family conversation. Owner defaults to the named family member when one is clearly responsible.`,
  work: `This is a work conversation. Surface project/topic context inside the text. Owner defaults to the named colleague.`,
  therapy: `This is a therapy session. Mark personal reflections with actType "reflection" and assigned tasks with actType "homework". Never include attendees other than "me".`,
  general: '',
};

function systemPrompt(contextId: ContextId): string {
  return `You are an executive assistant. From the transcript, extract every concrete action, commitment, follow-up, or task the speaker mentioned.

For each action, return:
- text: short verb-first phrase (e.g. "Book follow-up with Dr Patel")
- assignee: "me" unless another person clearly owns it
- dueContext: phrase from transcript like "tomorrow", "next week", "Friday", or "unspecified"
- priority: "high" | "medium" | "low" (urgency + stakes)
- confidence: 0..1
- attendees: names of other people involved (excluding the speaker)
- proposedDate: ISO date YYYY-MM-DD inferred from dueContext relative to today (${new Date().toISOString().slice(0,10)}), or null
- proposedTime: HH:mm inferred from transcript or sensible default (09:00 morning, 14:00 afternoon, 18:00 evening), or null
- actType: optional category (see context note below)
- clinician: optional clinician name

${ADDENDA[contextId]}

Return ONLY valid JSON: { "acts": [...] }. No prose, no markdown.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json();
    const transcript: string = body?.transcript ?? '';
    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 5) {
      return new Response(JSON.stringify({ acts: [], contextId: 'general' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Honour explicit override from the client (one-tap pill), otherwise infer.
    const override: ContextId | undefined = body?.contextId;
    const detected = classifyContext(transcript);
    const contextId: ContextId = override ?? detected.contextId;

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
          { role: 'system', content: systemPrompt(contextId) },
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

    return new Response(JSON.stringify({
      acts: parsed.acts || [],
      contextId,
      contextConfidence: override ? 1 : detected.confidence,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('prototype-extract-acts error', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
