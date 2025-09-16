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
              max_tokens: 3000,
              messages: [{
                role: 'system',
                content: `EXTRACT ACTIONABLE CLOSING TASKS (ACTs) from meeting transcripts.

CONTEXT: This is for someone with brain injury who needs CRYSTAL CLEAR, VERB-FIRST structured actions that inspire pride and follow-through.

🎯 CRITICAL REQUIREMENTS:
1. ALL ACTION TEXT MUST START WITH AN ACTION VERB (CREATE, SCHEDULE, CALL, SEND, COMPLETE, BOOK, WRITE, DRAFT, SET UP, FOLLOW UP, REVIEW, PREPARE, CONTACT, etc.)
2. Transform passive statements: "I will call the therapist" → "CALL therapist to schedule session"
3. Make it empowering and specific: "I need to think about..." → "DEFINE specific goals for treatment plan"

📋 EXTRACTION STANDARDS:
- ACTION TEXT: Bold, clear VERB-first command that inspires action
- SUCCESS CRITERIA: Crystal clear completion marker - "You'll know you're done when..."
- MOTIVATION: Empowering personal benefit - "This will help you..."
- OUTCOME: Specific, observable result after completion
- HOW STEPS: 2-4 concrete micro-steps for complex actions
- DATES: Always infer realistic dates based on urgency and complexity
- MICRO TASKS: Tiny first steps that reduce overwhelm and build momentum

🗓️ SMART DATE INFERENCE:
Current date context: ${new Date().toISOString().split('T')[0]}
- "by Friday" → Calculate actual Friday date
- "next week" → Add 7-10 days from current date
- "soon/ASAP" → Tomorrow or next business day
- "this month" → Within 2-3 weeks
- No timeframe? Simple task = 2-3 days, Complex = 1 week

💡 BRAIN INJURY OPTIMIZATION:
- Use encouraging, pride-building language
- Break complex actions into micro-steps
- Include emotional stakes to motivate follow-through
- Provide clear success markers to prevent confusion

JSON SCHEMA (EXACT FIELDS REQUIRED):
{
  "action_text": "VERB + specific action (e.g., 'CALL therapist to schedule appointment')",
  "success_criteria": "You'll know you're done when [specific completion marker]",
  "motivation_statement": "This will help you [specific personal benefit]",
  "assigned_to": "Who does it (name or 'me')",
  "due_context": "Original timeline from transcript",
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null", 
  "completion_date": "YYYY-MM-DD (target date)",
  "relationship_impact": "How this affects relationships/wellbeing",
  "emotional_stakes": "What's at risk emotionally if not completed",
  "intent_behind": "The deeper 'why' behind this action",
  "what_outcome": "Specific result when complete",
  "how_steps": ["Step 1", "Step 2", "Step 3"],
  "micro_tasks": [{"text": "Tiny first step", "completed": false}],
  "priority_level": 1-5 (1=highest priority),
  "confidence_score": 0.0-1.0
}

🌟 PERFECT EXAMPLE:
[{
  "action_text": "CALL Dr. Martinez to schedule next therapy session",
  "success_criteria": "You'll know you're done when you have appointment confirmation with date, time, and location",
  "motivation_statement": "This will help you maintain momentum in your recovery and reduce anxiety about gaps in care",
  "assigned_to": "me",
  "due_context": "by Friday this week",
  "start_date": "2025-01-17",
  "end_date": "2025-01-19", 
  "completion_date": "2025-01-19",
  "relationship_impact": "Shows commitment to healing and reduces family worry",
  "emotional_stakes": "Risk of losing progress momentum and feeling defeated",
  "intent_behind": "Maintaining consistent care for optimal recovery",
  "what_outcome": "Next therapy session scheduled and confirmed in calendar",
  "how_steps": ["Find Dr. Martinez contact info", "Call during business hours 9am-5pm", "Write appointment details in calendar"],
  "micro_tasks": [{"text": "Find phone number in contacts", "completed": false}, {"text": "Pick up phone", "completed": false}],
  "priority_level": 2,
  "confidence_score": 0.95
}]

Return ONLY a JSON array. No explanations or commentary.`
            }, {
              role: 'user',
              content: `TRANSCRIPT: ${transcript}`
            }]
          })
        });

        if (openAIResponse.ok) {
          const openAIData = await openAIResponse.json();
          console.log('✅ OpenAI API SUCCESS - Status:', openAIResponse.status);
          console.log('✅ OpenAI full response:', JSON.stringify(openAIData, null, 2));
          
          const content = openAIData.choices?.[0]?.message?.content?.trim();
          console.log('✅ Raw OpenAI content:', content);
          
          if (content && content !== '[]' && content !== '') {
            try {
              // Clean the content to ensure it's valid JSON
              let cleanContent = content;
              if (!cleanContent.startsWith('[')) {
                // If it starts with text, try to find the JSON array
                const arrayMatch = cleanContent.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                  cleanContent = arrayMatch[0];
                } else {
                  throw new Error('No JSON array found in content');
                }
              }
              
              extractedActions = JSON.parse(cleanContent);
              console.log('✅ SUCCESS: Parsed', extractedActions.length, 'actions via OpenAI');
              console.log('✅ First action sample:', JSON.stringify(extractedActions[0] || {}, null, 2));
              
              // Validate the structure
              if (Array.isArray(extractedActions) && extractedActions.length > 0) {
                console.log('✅ OpenAI extraction complete with', extractedActions.length, 'structured actions');
              } else {
                console.log('❌ OpenAI returned empty array, falling back');
                extractedActions = [];
              }
            } catch (parseError) {
              console.error('❌ PARSE ERROR - Failed to parse OpenAI JSON:', parseError);
              console.error('❌ Raw content was:', JSON.stringify(content, null, 2));
              extractedActions = [];
            }
          } else {
            console.log('❌ OpenAI returned empty/null content');
            extractedActions = [];
          }
        } else {
          const errorText = await openAIResponse.text();
          console.error('OpenAI API error - Status:', openAIResponse.status, 'Text:', errorText);
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