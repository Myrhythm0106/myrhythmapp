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
    const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required Supabase environment variables');
    }
    
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured - will use fallback extractors (AssemblyAI LeMUR or local).');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { transcript, meetingId, userId } = await req.json();

    if (!transcript || !meetingId || !userId) {
      throw new Error('Missing required parameters: transcript, meetingId, userId');
    }

    console.log('Processing incremental transcript for meeting:', meetingId);

    // Extract ACTs from the current transcript with resilient fallbacks
    let extractedActions: any[] = [];

    // Helper: simple deterministic fallback when external LLMs are unavailable
    const localExtractActions = (text: string) => {
      try {
        const sentences = text
          .replace(/\n+/g, ' ')
          .split(/(?<=[.!?])\s+/)
          .slice(0, 30);
        const candidates = sentences.filter(s => /\b(I will|I'll|let's|we need to|I need to|I'll try|remind|schedule|follow up|send|call|email|finish|complete|set up|book|prepare|review|share|draft|fix)\b/i.test(s));
        const duePhrases = ['today', 'tomorrow', 'this week', 'next week', 'by', 'on'];
        const results = candidates.slice(0, 5).map(s => {
          const lower = s.toLowerCase();
          const due_context = duePhrases.find(p => lower.includes(p)) ? s.match(/\b(by [^,.!?]+|tomorrow|today|this week|next week|on [^,.!?]+)/i)?.[0] || 'unspecified' : 'unspecified';
          return {
            action: s.replace(/^\s*[-*•]\s*/, '').trim(),
            assignee: /\b(we|let's)\b/i.test(s) ? 'team' : 'me',
            priority: /\b(urgent|asap|priority|critical)\b/i.test(s) ? 'high' : 'medium',
            due_context,
            context: 'Extracted via rule-based fallback',
            confidence: 0.55,
            reasoning: 'Matched common commitment/action patterns in the transcript'
          };
        });
        return results;
      } catch (_) {
        return [];
      }
    };

    // 1) Try OpenAI first (if key present)
    if (OPENAI_API_KEY) {
      try {
        const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              model: 'gpt-5-mini-2025-08-07',
              max_completion_tokens: 2000,
              messages: [{
                role: 'system',
                content: `EXTRACT ACTIONABLE CLOSING TASKS (ACTs) from meeting transcripts.

CONTEXT: This is for someone with brain injury who needs CRYSTAL CLEAR, VERB-FIRST structured actions that inspire pride and follow-through.

CRITICAL: ALL ACTION TEXT MUST START WITH AN ACTION VERB (CREATE, SCHEDULE, CALL, SEND, COMPLETE, BOOK, WRITE, DRAFT, SET UP, FOLLOW UP, etc.)

EXTRACTION RULES:
1. ACTION TEXT: MANDATORY VERB-FIRST format. Transform "I will call the therapist" → "CALL therapist to schedule session"
2. SUCCESS CRITERIA: Clear observable completion marker: "You'll know you're done when you have confirmation email"
3. MOTIVATION: Empowering statement: "This will help you maintain your health routine and reduce anxiety"
4. OUTCOME: Specific result: "Therapy session scheduled for next week"
5. HOW STEPS: Break complex actions into 2-4 concrete micro-steps
6. DATES: Extract or infer realistic completion dates (YYYY-MM-DD format)
7. START/END: If timeframe mentioned, set start_date and end_date
8. MICRO TASKS: Tiny first steps to reduce overwhelm
9. IMPACT: Why this matters for wellbeing/relationships
10. STAKES: Emotional cost of not completing

CRITICAL DATE EXTRACTION:
- Listen for: "by Friday", "next week", "tomorrow", "this month"
- Convert to actual dates based on context
- If no date mentioned, infer realistic timeframe based on action complexity
- Simple actions: 1-3 days, Complex actions: 1-2 weeks

For each action found, provide a JSON object with these exact fields:
- action_text: VERB-FIRST action (e.g., "CALL therapist to schedule appointment")
- success_criteria: "You'll know you're done when..." (specific, observable)
- motivation_statement: "This will help you..." (empowering, pride-worthy)
- assigned_to: Who will do it (name or "me")
- due_context: When it should be done (from transcript context)
- start_date: When to begin (YYYY-MM-DD or null)
- end_date: Latest completion date (YYYY-MM-DD or null)
- completion_date: Target completion date (YYYY-MM-DD format)
- relationship_impact: How this affects relationships/wellbeing
- emotional_stakes: What's at risk emotionally if not done
- intent_behind: The deeper "why" for this action
- what_outcome: Specific, observable result when complete
- how_steps: Array of 2-4 concrete micro-steps for complex actions
- micro_tasks: Array of tiny first steps to reduce overwhelm
- priority_level: 1-5 (1=highest priority, 5=lowest)
- confidence_score: 0.0-1.0 how confident you are this is a real commitment

EXAMPLE OUTPUT:
[{
  "action_text": "CALL Dr. Smith to schedule follow-up appointment",
  "success_criteria": "You'll know you're done when you have confirmation with date and time",
  "motivation_statement": "This will help you stay on top of your health and reduce worry",
  "assigned_to": "me",
  "due_context": "by end of week",
  "start_date": "2025-01-17",
  "end_date": "2025-01-19",
  "completion_date": "2025-01-19",
  "relationship_impact": "Shows self-care and responsibility",
  "emotional_stakes": "Anxiety about health if delayed",
  "intent_behind": "Maintaining health and peace of mind",
  "what_outcome": "Follow-up appointment scheduled and confirmed",
  "how_steps": ["Find doctor's contact info", "Call during office hours", "Write down appointment details"],
  "micro_tasks": [{"text": "Find phone number", "completed": false}, {"text": "Pick up phone", "completed": false}],
  "priority_level": 2,
  "confidence_score": 0.9
}]

Return ONLY a JSON array of action objects. No explanations.`
            }, {
              role: 'user',
              content: `TRANSCRIPT: ${transcript}`
            }]
          })
        });

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          try {
            const content = openAIData.choices?.[0]?.message?.content?.trim();
            if (content && content !== '[]') {
              extractedActions = JSON.parse(content);
              console.log('ACTs extracted via OpenAI:', extractedActions.length);
            }
          } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
          }
        } else {
          const errorText = await openAIResponse.text();
          console.error('OpenAI API error:', errorText);
        }
      } catch (err) {
        console.error('OpenAI fetch failed:', err);
      }
    }

    // 2) Fallback to AssemblyAI LeMUR if nothing extracted and key present
    if (extractedActions.length === 0 && ASSEMBLYAI_API_KEY) {
      try {
        const lemurPrompt = `Extract Actionable items (ACTs) from the following conversation. Output ONLY a JSON array with objects having keys: action, assignee, priority (high|medium|low), due_context, context, confidence (0-1), reasoning. Be concise and concrete.`;
        const lemurRes = await fetch('https://api.assemblyai.com/v2/lemur/tasks', {
          method: 'POST',
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: lemurPrompt,
            final_model: 'claude_sonnet_4_20250514',
            input_text: transcript,
            max_output_size: 1500,
            temperature: 0.1
          })
        });

        if (lemurRes.ok) {
          const lemurData = await lemurRes.json();
          const text = (lemurData?.response || '').trim();
          try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              extractedActions = parsed;
              console.log('ACTs extracted via AssemblyAI LeMUR:', extractedActions.length);
            }
          } catch (e) {
            console.error('Failed to parse LeMUR response as JSON array');
          }
        } else {
          const errText = await lemurRes.text();
          console.error('LeMUR API error:', errText);
        }
      } catch (err) {
        console.error('AssemblyAI LeMUR fetch failed:', err);
      }
    }

    // 3) Last resort: local rule-based extractor
    if (extractedActions.length === 0) {
      extractedActions = localExtractActions(transcript);
      console.log('ACTs extracted via local fallback:', extractedActions.length);
    }

    console.log(`Extracted ${extractedActions.length} actions from transcript`);
    console.log(`Extracted ${extractedActions.length} actions from transcript`);

    // Store the extracted actions preserving AI-structured data
    const actionsToInsert = extractedActions.map((action: any) => ({
      meeting_recording_id: meetingId,
      user_id: userId,
      // Preserve AI-extracted data, only use fallbacks if truly missing
      action_text: action.action_text || action.action || 'DEFINE action needed',
      success_criteria: action.success_criteria || null,
      motivation_statement: action.motivation_statement || null,
      what_outcome: action.what_outcome || null,
      how_steps: action.how_steps || [],
      micro_tasks: action.micro_tasks || [],
      assigned_to: action.assigned_to || action.assignee || 'me',
      due_context: action.due_context || null,
      start_date: action.start_date || null,
      end_date: action.end_date || null,
      completion_date: action.completion_date || null,
      priority_level: action.priority_level || (action.priority === 'high' ? 1 : action.priority === 'medium' ? 3 : 5),
      relationship_impact: action.relationship_impact || null,
      emotional_stakes: action.emotional_stakes || null,
      intent_behind: action.intent_behind || null,
      confidence_score: action.confidence_score || action.confidence || 0.5,
      user_notes: action.reasoning || '',
      status: 'not_started',
      calendar_checked: false,
      support_circle_notified: false
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

    // Calculate confidence score based on processing method and results
    let confidenceScore = 50; // Base score
    let processingMethod = 'fallback';
    
    if (extractedActions.length > 0) {
      // Higher confidence if we found actions
      confidenceScore += 30;
      
      // Bonus for structured actions with clear commitments
      const structuredActions = extractedActions.filter(action => 
        action.action_text.includes('will') || 
        action.action_text.includes('commit') ||
        action.assigned_to
      );
      confidenceScore += Math.min(structuredActions.length * 5, 20);
    }
    
    // Determine processing method used (for UI display)
    if (transcript.length > 100) {
      processingMethod = OPENAI_API_KEY ? 'openai' : 'rule_based';
      if (processingMethod === 'openai') confidenceScore += 15;
    }
    
    // Cap at 100
    confidenceScore = Math.min(confidenceScore, 100);

    return new Response(JSON.stringify({ 
      success: true, 
      actionsCount: extractedActions.length,
      actions: extractedActions,
      confidenceScore,
      processingMethod,
      transcriptLength: transcript.length
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