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
    
    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
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
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: `You are a SMART ACTS extraction AI. Extract actionable items from the transcript.

SMART ACTS format:
- **S**pecific: Clear, unambiguous action
- **M**easurable: Quantifiable outcome  
- **A**ssignable: Clear ownership
- **R**elevant: Contextually important
- **T**ime-bound: Deadline or timeframe

Return ONLY a JSON array of objects with this structure:
{
  "action": "specific action description",
  "assignee": "person responsible or 'self' if unclear",
  "deadline": "YYYY-MM-DD or relative like 'next week'",
  "priority": "high|medium|low",
  "context": "relevant meeting context"
}

Return empty array [] if no clear actions found.`
          },
          {
            role: 'user',
            content: `Extract SMART ACTS from this transcript:\n\n${transcript}`
          }
        ],
        max_completion_tokens: 600
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
      meeting_id: meetingId,
      user_id: userId,
      action_text: action.action,
      assignee: action.assignee,
      deadline: action.deadline,
      priority: action.priority,
      context: action.context,
      status: 'pending',
      is_realtime: true,
      created_at: new Date().toISOString()
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