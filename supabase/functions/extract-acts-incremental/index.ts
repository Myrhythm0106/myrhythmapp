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
            content: `You are an expert ACT extraction AI for meetings. Extract Actions, Decisions, and Issues from conversation transcripts.

INTELLIGENT EXTRACTION RULES:
1. **ACTIONS** - Tasks, commitments, follow-ups, things to do
   - Look for: "I will", "we need to", "let's", "should", action verbs (call, send, schedule, meet, review, etc.)
   - Extract even if not explicitly prefixed with "Action:"
   - Include: WHO will do WHAT by WHEN and WHY

2. **DECISIONS** - Choices made, conclusions reached, agreements
   - Look for: "we decided", "I've chosen", "let's go with", "the plan is", "we agreed"
   - Extract even if not explicitly prefixed with "Decision:"
   - Include: WHAT was decided, WHO made it, WHY it matters

3. **ISSUES** - Problems, concerns, risks, blockers identified
   - Look for: "problem", "issue", "concern", "risk", "challenge", "blocker", "stuck"
   - Extract even if not explicitly prefixed with "Issue:"
   - Include: WHAT the problem is, WHO it affects, HOW SEVERE it is

SMART CRITERIA (flag if missing):
- **Specific**: Clear, unambiguous description
- **Measurable**: Quantifiable outcome or clear deliverable
- **Assignable**: Clear ownership (who will do it)
- **Relevant**: Context about why it matters
- **Time-bound**: Deadline or timeframe

JSON RESPONSE FORMAT:
[
  {
    "type": "action|decision|issue",
    "action": "Clear description of what needs to happen",
    "assignee": "person responsible (extract from context, use 'speaker' if unclear)",
    "deadline": "extracted timeframe or 'unspecified'",
    "suggested_date": "YYYY-MM-DD format",
    "priority": 1-5 (1=urgent, 5=low),
    "context": "why this matters/background",
    "emotional_stakes": "relationship/emotional impact",
    "confidence": 0.1-1.0 (how certain you are about this extraction),
    "missing_smart_criteria": ["specific", "measurable"] // array of missing SMART elements
  }
]

EXTRACTION STRATEGY:
- Be GENEROUS in extraction - capture implied actions/decisions/issues
- Look for conversational commitments: "I'll handle that", "let me check on this"
- Extract follow-ups: "we should follow up on...", "need to circle back on..."
- Flag uncertainty with lower confidence scores
- Use context clues for assignee (who spoke, who was addressed)
- Infer reasonable deadlines from urgency cues

Today's date: ${new Date().toISOString().split('T')[0]}

Return [] only if absolutely nothing actionable is found.`
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
      due_context: action.deadline || 'unspecified',
      proposed_date: action.suggested_date,
      priority_level: typeof action.priority === 'number' ? action.priority : 3,
      relationship_impact: action.context || '',
      emotional_stakes: action.emotional_stakes || '',
      action_type: action.type || 'commitment',
      status: 'pending',
      confidence_score: action.confidence || 0.8,
      user_notes: action.missing_smart_criteria?.length > 0 ? 
        `AI flagged missing: ${action.missing_smart_criteria.join(', ')}` : null
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