import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedACT {
  action_text: string;
  category: 'action' | 'watch_out' | 'depends_on' | 'note';
  assigned_to: string;
  due_context: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  scheduling_reason: string | null;
  priority_level: number;
  micro_tasks: { text: string; completed: boolean }[];
  success_criteria: string | null;
  motivation_statement: string | null;
  relationship_impact: string | null;
  emotional_stakes: string | null;
}

interface CalendarEvent {
  date: string;
  time: string;
  title: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { recording_id, transcription } = await req.json();
    
    if (!recording_id) {
      throw new Error('Recording ID is required');
    }

    console.log(`Processing voice recording ${recording_id} for user ${user.id}`);

    // Update status to processing
    await supabase
      .from('voice_recordings')
      .update({ processing_status: 'processing' })
      .eq('id', recording_id)
      .eq('user_id', user.id);

    // Fetch user's calendar events for the next 14 days
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);
    
    const { data: calendarEvents } = await supabase
      .from('calendar_events')
      .select('date, time, title')
      .eq('user_id', user.id)
      .gte('date', today.toISOString().split('T')[0])
      .lte('date', twoWeeksLater.toISOString().split('T')[0])
      .order('date', { ascending: true });

    // Format calendar context for AI
    const calendarContext = (calendarEvents || []).map((e: CalendarEvent) => 
      `${e.date} at ${e.time}: ${e.title}`
    ).join('\n');

    // Get the transcription text - either passed in or from the recording
    let transcriptionText = transcription;
    if (!transcriptionText) {
      const { data: recording } = await supabase
        .from('voice_recordings')
        .select('transcription')
        .eq('id', recording_id)
        .single();
      transcriptionText = recording?.transcription || '';
    }

    if (!transcriptionText) {
      throw new Error('No transcription available for this recording');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];

    // Call Lovable AI for summary and ACTs extraction
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing conversations and extracting actionable insights for people managing ADHD, neurodivergent conditions, or supporting loved ones with these conditions.

Today is ${dayOfWeek}, ${currentDate}.

The user's existing calendar events for the next 2 weeks:
${calendarContext || 'No events scheduled'}

Your job is to:
1. Generate a compassionate, insightful summary of the conversation
2. Extract ACTs (Actions, Watch-outs, Depends-on, Notes) in VERB-first format
3. Suggest optimal dates/times based on the calendar context and any mentioned deadlines

For dates mentioned in conversation:
- "today" = ${currentDate}
- "tomorrow" = next day
- "this week" = within 7 days
- "next week" = 7-14 days from now
- "by Friday" = the upcoming Friday
- Be specific with proposed dates, avoid conflicts with existing calendar events`
          },
          {
            role: 'user',
            content: `Please analyze this conversation transcript and extract insights:\n\n${transcriptionText}`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'process_recording',
              description: 'Process the voice recording and extract summary and ACTs',
              parameters: {
                type: 'object',
                properties: {
                  summary: {
                    type: 'string',
                    description: 'A warm, insightful 2-3 sentence summary of the conversation highlighting key themes and emotional undertones'
                  },
                  key_insights: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        insight: { type: 'string', description: 'The insight text' },
                        type: { type: 'string', enum: ['emotional', 'practical', 'relationship', 'health'] },
                        importance: { type: 'string', enum: ['high', 'medium', 'low'] }
                      },
                      required: ['insight', 'type', 'importance']
                    },
                    description: 'Array of 3-5 key insights from the conversation'
                  },
                  extracted_acts: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        action_text: { type: 'string', description: 'VERB-first action (e.g., CALL Dr. Smith, SCHEDULE appointment, EMAIL team)' },
                        category: { type: 'string', enum: ['action', 'watch_out', 'depends_on', 'note'] },
                        assigned_to: { type: 'string', description: 'Who should do this: "me", person name, or "us"' },
                        due_context: { type: 'string', description: 'Original time context mentioned (e.g., "by Friday", "this week")' },
                        proposed_date: { type: 'string', description: 'Suggested date in YYYY-MM-DD format based on context and calendar' },
                        proposed_time: { type: 'string', description: 'Suggested time in HH:MM format (24h)' },
                        scheduling_reason: { type: 'string', description: 'Empowering reason for the suggested time (e.g., "Your peak energy window! ⚡")' },
                        priority_level: { type: 'number', description: '1 (highest) to 5 (lowest) priority' },
                        micro_tasks: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              text: { type: 'string' },
                              completed: { type: 'boolean' }
                            }
                          },
                          description: '2-3 small starter steps to build momentum'
                        },
                        success_criteria: { type: 'string', description: 'How will you know this is done?' },
                        motivation_statement: { type: 'string', description: 'Compassionate encouragement (e.g., "Taking care of your health shows self-compassion 💜")' },
                        relationship_impact: { type: 'string', description: 'How this affects relationships (if applicable)' },
                        emotional_stakes: { type: 'string', description: 'Why this matters emotionally' }
                      },
                      required: ['action_text', 'category', 'assigned_to', 'priority_level']
                    },
                    description: 'Array of extracted ACTs from the conversation'
                  }
                },
                required: ['summary', 'key_insights', 'extracted_acts']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'process_recording' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI processing failed: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    console.log('AI response received');

    // Parse the tool call response
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const processedData = JSON.parse(toolCall.function.arguments);
    const { summary, key_insights, extracted_acts } = processedData;

    console.log(`Extracted ${extracted_acts?.length || 0} ACTs`);

    // Get the voice recording to link to meeting_recordings
    const { data: voiceRecording } = await supabase
      .from('voice_recordings')
      .select('id')
      .eq('id', recording_id)
      .single();

    // Find or create a meeting recording to link ACTs
    let meetingRecordingId: string;
    
    const { data: existingMeeting } = await supabase
      .from('meeting_recordings')
      .select('id')
      .eq('recording_id', recording_id)
      .single();

    if (existingMeeting) {
      meetingRecordingId = existingMeeting.id;
    } else {
      // Create a meeting recording entry for this voice recording
      const { data: newMeeting, error: meetingError } = await supabase
        .from('meeting_recordings')
        .insert({
          user_id: user.id,
          recording_id: recording_id,
          meeting_title: 'Voice Recording',
          meeting_type: 'voice_note',
          transcript: transcriptionText,
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (meetingError) {
        console.error('Error creating meeting recording:', meetingError);
        throw new Error('Failed to create meeting recording link');
      }
      meetingRecordingId = newMeeting.id;
    }

    // Insert extracted actions into the database
    if (extracted_acts && extracted_acts.length > 0) {
      const actionsToInsert = extracted_acts.map((act: ExtractedACT) => ({
        user_id: user.id,
        meeting_recording_id: meetingRecordingId,
        action_text: act.action_text,
        category: act.category,
        assigned_to: act.assigned_to,
        due_context: act.due_context,
        proposed_date: act.proposed_date,
        proposed_time: act.proposed_time,
        priority_level: act.priority_level,
        micro_tasks: act.micro_tasks || [],
        success_criteria: act.success_criteria,
        motivation_statement: act.motivation_statement,
        relationship_impact: act.relationship_impact,
        emotional_stakes: act.emotional_stakes,
        status: 'not_started',
        extraction_method: 'ai-lovable',
        calendar_checked: true
      }));

      const { error: actionsError } = await supabase
        .from('extracted_actions')
        .insert(actionsToInsert);

      if (actionsError) {
        console.error('Error inserting actions:', actionsError);
      }
    }

    // Update the voice recording with AI results
    const { error: updateError } = await supabase
      .from('voice_recordings')
      .update({
        ai_summary: summary,
        key_insights: key_insights,
        extracted_actions_count: extracted_acts?.length || 0,
        processing_status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', recording_id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating voice recording:', updateError);
      throw new Error('Failed to update recording with AI results');
    }

    console.log(`Successfully processed recording ${recording_id}`);

    return new Response(
      JSON.stringify({
        success: true,
        summary,
        key_insights,
        extracted_acts_count: extracted_acts?.length || 0,
        extracted_acts: extracted_acts?.map((act: ExtractedACT) => ({
          action_text: act.action_text,
          category: act.category,
          proposed_date: act.proposed_date,
          proposed_time: act.proposed_time,
          scheduling_reason: act.scheduling_reason,
          priority_level: act.priority_level
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-voice-recording:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
