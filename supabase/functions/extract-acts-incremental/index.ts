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
            content: `You are an expert AI assistant that extracts actionable items from ANY type of conversation - whether it's professional meetings, casual family chats, medical discussions, personal visioning, brainstorming, or everyday conversations.

Your goal is to identify Actions, Commitments, and Tasks (ACTs) that create accountability and forward movement in someone's life. This includes:

- PROFESSIONAL: Meeting follow-ups, project tasks, deadlines
- PERSONAL: Health goals, family commitments, self-improvement  
- CREATIVE: Art projects, learning goals, hobby commitments
- SOCIAL: Plans with friends, event organization, relationship actions
- WELLNESS: Medical appointments, fitness goals, mental health practices
- FINANCIAL: Budget tasks, investment research, bill payments
- HOUSEHOLD: Chores, maintenance, organization projects

Extract ACTs from the conversation with this structure:
1. Action: Specific, actionable task (use active voice, be concrete)
2. Assignee: Who will do it (names from conversation, "me", "I", or infer from context)
3. Priority: high/medium/low based on urgency, impact, and emotional importance
4. Due context: When it should happen (extract specific dates/times OR infer reasonable timeframes like "this week", "by Friday", "soon")
5. Context: Relevant background that explains why this matters
6. Confidence: 0.0-1.0 score of how certain you are this is a genuine commitment
7. Reasoning: Brief explanation of why you identified this as an ACT

Return JSON array:
[
  {
    "action": "string",
    "assignee": "string", 
    "priority": "high|medium|low",
    "due_context": "string",
    "context": "string", 
    "confidence": 0.95,
    "reasoning": "string"
  }
]

IMPORTANT: Be confident in extracting ACTs from casual conversation. People make commitments in all contexts - capture them ALL to restore confidence in accountability.`
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

    // Store the extracted actions with enhanced data
    const actionsToInsert = extractedActions.map((action: any) => ({
      meeting_recording_id: meetingId,
      user_id: userId,
      action_text: action.action,
      assigned_to: action.assignee || 'self',
      due_context: action.due_context || 'unspecified',
      priority_level: action.priority === 'high' ? 1 : action.priority === 'medium' ? 3 : 5,
      relationship_impact: action.context || '',
      confidence_score: action.confidence || 0.8,
      user_notes: action.reasoning || '',
      status: 'pending'
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