import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { actionText, actionType, estimatedDuration } = await req.json();

    // Get user's calendar events for next 7 days
    const startDate = new Date();
    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const { data: myRhythmEvents } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    const { data: externalEvents } = await supabase
      .from('external_calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Get user's mood/energy patterns (last 30 days)
    const { data: moodEntries } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: false })
      .limit(30);

    // Build context for AI
    const calendarSummary = [...(myRhythmEvents || []), ...(externalEvents || [])]
      .map(e => `${e.date} ${e.time || 'all-day'}: ${e.title}`)
      .join('\n');

    const energyPattern = moodEntries && moodEntries.length > 0
      ? moodEntries.map(m => `${m.date}: Energy ${m.energy_level}/5`).join('\n')
      : 'No energy data available';

    const prompt = `You are a smart scheduling assistant. Help schedule this action optimally.

Action to Schedule:
"${actionText}"
Type: ${actionType}
Estimated Duration: ${estimatedDuration} minutes

User's Existing Calendar (Next 7 Days):
${calendarSummary || 'No events scheduled'}

User's Recent Energy Patterns:
${energyPattern}

Based on this data:
1. Suggest the 3 BEST time slots in the next 7 days
2. For each slot, provide:
   - date (YYYY-MM-DD format)
   - time (HH:MM format, 24-hour)
   - reason (why this time is optimal)
   - confidence (0-100%)

Consider:
- Avoid conflicts with existing events
- Match task energy requirements (high-priority tasks → high-energy times)
- Allow 15-min buffer before/after meetings
- Suggest times when user historically has good energy

Return ONLY valid JSON array:
[
  { "date": "2025-01-15", "time": "09:00", "reason": "High energy morning slot with no conflicts", "confidence": 92 },
  { "date": "2025-01-16", "time": "14:00", "reason": "Post-lunch focus time", "confidence": 85 },
  { "date": "2025-01-17", "time": "10:30", "reason": "Mid-morning after routine tasks", "confidence": 78 }
]`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a scheduling optimization expert. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI error:', await openAIResponse.text());
      throw new Error('Failed to optimize schedule');
    }

    const openAIData = await openAIResponse.json();
    const suggestionsText = openAIData.choices[0].message.content.trim();
    
    // Parse JSON response
    const suggestions = JSON.parse(suggestionsText);

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Schedule optimization error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
