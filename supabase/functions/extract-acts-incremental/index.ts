import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required Supabase environment variables');
    }
    
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key not configured - ACT extraction unavailable'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { transcript, meetingId, userId } = await req.json();

    if (!transcript || !meetingId || !userId) {
      throw new Error('Missing required parameters: transcript, meetingId, userId');
    }

    console.log('Processing incremental transcript for meeting:', meetingId);

    // Extract ACTs from the current transcript
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a SMART ACTS extraction AI. Extract actions, decisions, and issues from the transcript.

SMART ACTS format:
- **S**pecific: Clear, unambiguous item
- **M**easurable: Quantifiable outcome  
- **A**ssignable: Clear ownership (who)
- **R**elevant: Contextually important (why)
- **T**ime-bound: Deadline or timeframe (when)

Extract these types:
1. **ACTIONS**: Tasks, commitments, follow-ups (Action: I will...)
2. **DECISIONS**: Choices made, conclusions reached (Decision: We decided...)
3. **ISSUES**: Problems, concerns, risks identified (Issue: The problem is...)

Return ONLY a JSON array with this structure:
{
  "type": "action|decision|issue",
  "action": "specific description starting with Action:/Decision:/Issue:",
  "assignee": "person responsible or 'self' if unclear",
  "deadline": "YYYY-MM-DD or relative like 'next week'",
  "suggested_date": "YYYY-MM-DD format for suggested completion",
  "priority": 3,
  "context": "relevant meeting context",
  "emotional_stakes": "why this matters",
  "severity": "high|medium|low" // for issues only
}

EXTRACTION RULES:
- ONLY extract items that start with "Action:", "Decision:", or "Issue:"
- MUST have clear ownership (who will do it)
- MUST have timeframe (when it will happen)
- MUST be specific and actionable
- Reject vague statements like "we should think about it"
- Reject incomplete items missing who/when/what

For suggested_date (today: ${new Date().toISOString().split('T')[0]}):
- High priority: within 1-3 days
- Medium priority: within 1-2 weeks  
- Low priority: within 2-4 weeks

Return [] if no properly formatted SMART items found.`
          },
          {
            role: 'user',
            content: `Extract SMART ACTS from this transcript:\n\n${transcript}`
          }
        ],
        max_tokens: 700,
        temperature: 0.1
      })
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    let extractedActions = [];

    try {
      const content = openAIData.choices[0]?.message?.content?.trim();
      if (content && content !== '[]') {
        extractedActions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback: return empty array instead of failing
      extractedActions = [];
    }

    console.log(`Extracted ${extractedActions.length} actions from transcript`);

    // Store the extracted actions
    const actionsToInsert = extractedActions.map((action: any) => ({
      meeting_recording_id: meetingId,
      user_id: userId,
      action_text: action.action,
      assigned_to: action.assignee || 'self',
      due_context: action.deadline,
      proposed_date: action.suggested_date,
      priority_level: typeof action.priority === 'number' ? action.priority : 3,
      relationship_impact: action.context || '',
      emotional_stakes: action.emotional_stakes || '',
      action_type: action.type || 'commitment',
      status: 'pending',
      is_realtime: true // Mark for realtime updates
    }));

    if (actionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('extracted_actions')
        .insert(actionsToInsert);

      if (insertError) {
        console.error('Error inserting actions:', insertError);
        throw insertError;
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      actionsCount: extractedActions.length,
      actions: extractedActions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-acts-incremental function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});