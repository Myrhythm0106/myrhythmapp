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
6. Confidence: 0.0-1.0 score of certainty this is a genuine commitment
7. Reasoning: Brief explanation of why this is an ACT

Return ONLY a JSON array:
[
  {"action":"string","assignee":"string","priority":"high|medium|low","due_context":"string","context":"string","confidence":0.95,"reasoning":"string"}
]`
              },
              { role: 'user', content: `Extract SMART ACTS from this transcript and return JSON only.\n\n${transcript}` }
            ],
            max_tokens: 700,
            temperature: 0.1
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
      processingMethod = openaiApiKey ? 'openai' : 'rule_based';
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