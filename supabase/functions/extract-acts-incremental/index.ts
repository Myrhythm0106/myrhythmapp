import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty').max(500000, 'Transcript too long'),
  meetingId: z.string().uuid('Invalid meeting ID format'),
  userId: z.string().uuid('Invalid user ID format'),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required Supabase environment variables');
    }
    
    if (!LOVABLE_API_KEY) {
      console.warn('Lovable AI API key not configured - will use rule-based fallback.');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Validate request body
    const rawBody = await req.json();
    const validation = requestSchema.safeParse(rawBody);
    
    if (!validation.success) {
      console.error('❌ Invalid request:', validation.error);
      return new Response(JSON.stringify({ 
        error: 'Invalid request data',
        details: validation.error.errors 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { transcript, meetingId, userId } = validation.data;

    console.log('🚀 PROCESSING TRANSCRIPT with Lovable AI (Gemini) for meeting:', meetingId);
    console.log('🔑 Lovable AI API Key available:', !!LOVABLE_API_KEY);
    console.log('📝 Transcript length:', transcript.length);

    // Update meeting status to extracting
    await supabase
      .from('meeting_recordings')
      .update({ processing_status: 'extracting_actions' })
      .eq('id', meetingId);

    // Extract ACTs from the current transcript with resilient fallbacks
    let extractedActions: any[] = [];
    let extractionMethod = 'rule-based';

    // Helper: COMPREHENSIVE fallback with ALL structured fields
    const localExtractActions = (text: string) => {
      try {
        console.log('🔄 Using enhanced rule-based fallback extraction');
        const sentences = text
          .replace(/\n+/g, ' ')
          .split(/(?<=[.!?])\s+/)
          .slice(0, 50);
        
        // Better pattern matching for actual commitments and actions
        const candidates = sentences.filter(s => 
          /\b(I will|I'll|I commit to|I need to|I should|I'm going to|let me|I plan to|I promise to|we need to|let's|we'll|we should|I have to|I must)\b/i.test(s) &&
          s.length > 10 && s.length < 200
        );
        
        console.log(`🔍 Found ${candidates.length} candidate actions from ${sentences.length} sentences`);
        
        const duePhrases = ['today', 'tomorrow', 'this week', 'next week', 'by', 'on', 'before', 'after', 'soon'];
        const currentDate = new Date();
        
        const results = candidates.slice(0, 3).map((s, index) => {
          console.log(`🎯 Processing candidate ${index + 1}: "${s}"`);
          
          const lower = s.toLowerCase();
          const due_context = duePhrases.find(p => lower.includes(p)) ? 
            s.match(/\b(by [^,.!?]+|tomorrow|today|this week|next week|on [^,.!?]+|before [^,.!?]+|soon)/i)?.[0] || 'unspecified' : 'unspecified';
          
          // Convert to VERB-first format (CRITICAL FIX)
          let actionText = s.replace(/^\s*[-*•]\s*/, '').trim();
          if (actionText.match(/^I (will|need to|should|have to|must|plan to)/i)) {
            actionText = actionText.replace(/^I (will|need to|should|have to|must|plan to)\s*/i, '').trim();
          }
          
          // Extract the verb and make it VERB-first
          const verbMatch = actionText.match(/^(call|contact|email|schedule|book|create|write|send|complete|finish|start|begin|review|prepare|organize|plan|discuss|meet|talk|visit|check|update|follow|confirm|arrange|set)/i);
          if (verbMatch) {
            actionText = verbMatch[0].toUpperCase() + ' ' + actionText.replace(/^[^a-z]+/i, '').trim();
          } else {
            // If no clear verb, add one based on context
            if (lower.includes('call') || lower.includes('phone')) {
              actionText = 'CALL ' + actionText.replace(/call|phone/gi, '').trim();
            } else if (lower.includes('email') || lower.includes('send')) {
              actionText = 'EMAIL ' + actionText.replace(/email|send/gi, '').trim();  
            } else if (lower.includes('schedule') || lower.includes('book')) {
              actionText = 'SCHEDULE ' + actionText.replace(/schedule|book/gi, '').trim();
            } else {
              actionText = 'COMPLETE ' + actionText;
            }
          }
          
          // Infer dates with better logic
          let startDate = null;
          let completionDate = null;
          let endDate = null;
          
          if (due_context.includes('today')) {
            completionDate = currentDate.toISOString().split('T')[0];
            startDate = currentDate.toISOString().split('T')[0];
          } else if (due_context.includes('tomorrow')) {
            const tomorrow = new Date(currentDate);
            tomorrow.setDate(tomorrow.getDate() + 1);
            completionDate = tomorrow.toISOString().split('T')[0];
            startDate = currentDate.toISOString().split('T')[0];
          } else if (due_context.includes('this week')) {
            const endOfWeek = new Date(currentDate);
            endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
            completionDate = endOfWeek.toISOString().split('T')[0];
            startDate = currentDate.toISOString().split('T')[0];
            endDate = endOfWeek.toISOString().split('T')[0];
          } else if (due_context.includes('next week')) {
            const nextWeekEnd = new Date(currentDate);
            nextWeekEnd.setDate(nextWeekEnd.getDate() + 14);
            completionDate = nextWeekEnd.toISOString().split('T')[0];
            startDate = currentDate.toISOString().split('T')[0];
          } else {
            // Default: 3 days for simple tasks, 1 week for complex
            const defaultDays = actionText.length > 50 ? 7 : 3;
            const defaultTarget = new Date(currentDate);
            defaultTarget.setDate(defaultTarget.getDate() + defaultDays);
            completionDate = defaultTarget.toISOString().split('T')[0];
            startDate = currentDate.toISOString().split('T')[0];
          }
          
          const actionObj = {
            action_text: actionText,
            success_criteria: `You'll know you're done when ${actionText.toLowerCase().replace(/^[A-Z]+\s/, '')} is completed successfully and confirmed`,
            motivation_statement: `This will help you stay on track with your commitments and build momentum for your goals`,
            what_outcome: `${actionText.replace(/^[A-Z]+\s/, '')} will be completed and you'll have a clear result`,
            how_steps: [
              'Identify specific requirements needed',
              'Take the first concrete action step',  
              'Follow through until complete'
            ],
            micro_tasks: [
              { text: 'Review what needs to be done', completed: false },
              { text: 'Take the first small step', completed: false }
            ],
            assigned_to: /\b(we|let's|team)\b/i.test(s) ? 'team' : 'me',
            priority_level: /\b(urgent|asap|priority|critical|important)\b/i.test(s) ? 1 : /\b(soon|quickly)\b/i.test(s) ? 2 : 3,
            due_context,
            start_date: startDate,
            end_date: endDate,
            completion_date: completionDate,
            relationship_impact: 'Following through shows commitment and builds trust with others',
            emotional_stakes: 'Completing this will build confidence and reduce stress about unfinished commitments',
            intent_behind: 'Taking concrete action toward stated goals and commitments',
            confidence_score: 0.75,
            reasoning: 'Enhanced rule-based extraction with full structured data and VERB-first formatting'
          };
          
          console.log(`✅ Created structured action: ${actionObj.action_text}`);
          return actionObj;
        });
        
        console.log(`🎉 Rule-based extraction complete: ${results.length} structured actions created`);
        return results;
      } catch (err) {
        console.error('❌ Local extraction error:', err);
        return [];
      }
    };

    // 1) Try Lovable AI (Gemini) first - FASTEST & CHEAPEST
    let conversationSummary = '';
    let smartScheduleSuggestions: any[] = [];
    
    if (LOVABLE_API_KEY) {
      try {
        const geminiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { 
                role: 'system', 
                content: `You are a brain-health assistant that helps people with memory challenges capture and organize their commitments from conversations.

FIRST: Summarize the key topics discussed in 3-5 bullet points.
THEN: Extract VERB-FIRST action items.

🎯 CATEGORIZE INTO 4 TYPES:
1. ACTIONS ✅ - "CALL Dr. Martinez", "SCHEDULE appointment"
2. WATCH-OUTS ⚠️ - "Watch for side effects" 
3. DEPENDS ON 🔗 - "Depends on doctor approval"
4. NOTES 📝 - "Important contact info"

📋 KEY RULES:
- Start with VERB (CALL, EMAIL, SCHEDULE, BOOK, CREATE, COMPLETE, etc.)
- Include WHO + WHAT + WHY
- Infer dates: "by Friday" → actual date, "soon" → tomorrow
- Break complex tasks into 2-3 micro-tasks
- Include emotional stakes for motivation
- Suggest optimal scheduling times (morning for important tasks, afternoon for calls)

🗓️ SMART SCHEDULING:
- For each action, suggest 2-3 optimal times based on task type
- Morning (8-11am): High-focus tasks, important decisions
- Afternoon (2-4pm): Meetings, calls, collaborative work
- Evening (5-7pm): Planning, reflection, light tasks

Current date: ${new Date().toISOString().split('T')[0]}

Be encouraging and supportive - remember these users may have memory challenges.`
              },
              { role: 'user', content: `TRANSCRIPT: ${transcript}` }
            ],
            tools: [{
              type: 'function',
              function: {
                name: 'extract_meeting_content',
                description: 'Extract summary, actions, and scheduling suggestions from transcript',
                parameters: {
                  type: 'object',
                  properties: {
                    conversation_summary: {
                      type: 'object',
                      properties: {
                        key_topics: { type: 'array', items: { type: 'string' } },
                        main_decisions: { type: 'array', items: { type: 'string' } },
                        participants_mentioned: { type: 'array', items: { type: 'string' } },
                        overall_tone: { type: 'string' },
                        empowering_takeaway: { type: 'string' }
                      }
                    },
                    actions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          action_text: { type: 'string' },
                          category: { type: 'string', enum: ['action', 'watch_out', 'depends_on', 'note'] },
                          assigned_to: { type: 'string' },
                          due_context: { type: 'string' },
                          completion_date: { type: 'string' },
                          priority_level: { type: 'integer' },
                          confidence_score: { type: 'number' },
                          success_criteria: { type: 'string' },
                          micro_tasks: { 
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                text: { type: 'string' },
                                completed: { type: 'boolean' }
                              }
                            }
                          },
                          motivation_statement: { type: 'string' },
                          what_outcome: { type: 'string' },
                          how_steps: { type: 'array', items: { type: 'string' } },
                          suggested_times: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                time_of_day: { type: 'string' },
                                reason: { type: 'string' },
                                confidence: { type: 'number' }
                              }
                            }
                          }
                        },
                        required: ['action_text', 'category', 'assigned_to', 'priority_level', 'confidence_score']
                      }
                    }
                  },
                  required: ['conversation_summary', 'actions']
                }
              }
            }],
            tool_choice: { type: 'function', function: { name: 'extract_meeting_content' } }
          })
        });

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          console.log('✅ Gemini API SUCCESS - Status:', geminiResponse.status);
          
          // Extract from tool call
          const toolCall = geminiData.choices?.[0]?.message?.tool_calls?.[0];
          if (toolCall && toolCall.function?.arguments) {
            try {
              const parsedArgs = typeof toolCall.function.arguments === 'string' 
                ? JSON.parse(toolCall.function.arguments)
                : toolCall.function.arguments;
              
              // Extract conversation summary
              if (parsedArgs.conversation_summary) {
                const summary = parsedArgs.conversation_summary;
                conversationSummary = JSON.stringify({
                  key_topics: summary.key_topics || [],
                  main_decisions: summary.main_decisions || [],
                  participants_mentioned: summary.participants_mentioned || [],
                  overall_tone: summary.overall_tone || 'neutral',
                  empowering_takeaway: summary.empowering_takeaway || 'You captured important commitments from this conversation!'
                });
                console.log('✅ Conversation summary extracted:', conversationSummary);
              }
              
              extractedActions = parsedArgs.actions || [];
              console.log('✅ SUCCESS: Parsed', extractedActions.length, 'actions via Gemini');
              console.log('✅ First action sample:', JSON.stringify(extractedActions[0] || {}, null, 2));
              
              // Validate the structure
              if (Array.isArray(extractedActions) && extractedActions.length > 0) {
                console.log('✅ Gemini extraction complete with', extractedActions.length, 'structured actions');
                extractionMethod = 'gemini-2.5-flash';
              } else {
                console.log('❌ Gemini returned empty array, falling back');
                extractedActions = [];
              }
            } catch (parseError) {
              console.error('❌ PARSE ERROR - Failed to parse Gemini tool call:', parseError);
              console.error('❌ Raw tool call was:', JSON.stringify(toolCall, null, 2));
              extractedActions = [];
            }
          } else {
            console.log('❌ Gemini returned empty/null tool call');
            extractedActions = [];
          }
        } else {
          const errorText = await geminiResponse.text();
          console.error('Gemini API error - Status:', geminiResponse.status, 'Text:', errorText);
        }
      } catch (err) {
        console.error('Gemini fetch failed:', err);
      }
    }

    // 2) Last resort: local rule-based extractor
    if (extractedActions.length === 0) {
      extractedActions = localExtractActions(transcript);
      console.log('ACTs extracted via local fallback:', extractedActions.length);
      
      // Generate basic summary for fallback
      if (!conversationSummary) {
        conversationSummary = JSON.stringify({
          key_topics: ['Meeting content captured'],
          main_decisions: [],
          participants_mentioned: [],
          overall_tone: 'neutral',
          empowering_takeaway: 'You took the important step of capturing this conversation!'
        });
      }
    }

    console.log(`🎯 Pre-validation: ${extractedActions.length} actions extracted`);

    // Import validation module
    const { validateExtractedAction } = await import('./validators.ts');

    // Validate and filter actions
    const validatedActions = [];
    for (const action of extractedActions) {
      const validation = validateExtractedAction(action);
      
      if (validation.isValid) {
        validatedActions.push({
          ...action,
          extraction_method: extractionMethod,
          validation_score: validation.score,
          validation_issues: JSON.stringify(validation.issues),
          requires_review: validation.score < 90
        });
        console.log(`✅ Action passed validation (score: ${validation.score}): "${action.action_text}"`);
      } else {
        console.log(`❌ Action rejected (score: ${validation.score}): "${action.action_text}" - ${validation.issues.join(', ')}`);
      }
    }

    console.log(`✅ Post-validation: ${validatedActions.length}/${extractedActions.length} actions passed quality check`);

    // Store the validated actions
    const actionsToInsert = validatedActions.map((action: any) => ({
      meeting_recording_id: meetingId,
      user_id: userId,
      action_text: action.action_text || action.action || 'DEFINE next step needed',
      extraction_method: action.extraction_method || extractionMethod,
      validation_score: action.validation_score || 0,
      validation_issues: action.validation_issues || '[]',
      requires_review: action.requires_review || false,
      category: action.category || 'action',
      success_criteria: action.success_criteria || null,
      motivation_statement: action.motivation_statement || null,
      what_outcome: action.what_outcome || null,
      how_steps: action.how_steps || [],
      micro_tasks: action.micro_tasks || [],
      assigned_to: action.assigned_to || action.assignee || 'me',
      owner: action.owner || action.assigned_to || action.assignee || 'me',
      created_by: userId,
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
      support_circle_notified: false,
      // Enhanced reliability fields
      momentum_builder: action.momentum_builder || null,
      two_minute_starter: action.two_minute_starter || null,
      celebration_trigger: action.celebration_trigger || null,
      potential_barriers: action.potential_barriers || [],
      if_stuck: action.if_stuck || null,
      best_time: action.best_time || null,
      next_natural_steps: action.next_natural_steps || [],
      detail_level: action.detail_level || 'standard',
      alternative_phrasings: action.alternative_phrasings || [],
      completion_criteria_specific: action.completion_criteria_specific || null,
      verb_category: action.verb_category || null
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
      processingMethod = LOVABLE_API_KEY ? 'lovable-ai' : 'rule_based';
      if (processingMethod === 'lovable-ai') confidenceScore += 15;
    }
    
    // Cap at 100
    confidenceScore = Math.min(confidenceScore, 100);

    // Update meeting recording with summary
    if (conversationSummary) {
      await supabase
        .from('meeting_recordings')
        .update({ 
          processing_status: 'completed',
          proposed_schedule: conversationSummary
        })
        .eq('id', meetingId);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      actionsCount: extractedActions.length,
      actions: extractedActions,
      conversationSummary: conversationSummary ? JSON.parse(conversationSummary) : null,
      confidenceScore,
      processingMethod,
      transcriptLength: transcript.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-acts-incremental function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});