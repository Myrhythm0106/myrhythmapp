import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, meetingId, userId } = await req.json();

    if (!audioData || !meetingId || !userId) {
      throw new Error('Missing required parameters');
    }

    // Step 1: Transcribe audio using OpenAI Whisper
    console.log('Starting transcription for meeting:', meetingId);
    
    const binaryAudio = atob(audioData);
    const bytes = new Uint8Array(binaryAudio.length);
    for (let i = 0; i < binaryAudio.length; i++) {
      bytes[i] = binaryAudio.charCodeAt(i);
    }

    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', blob, 'meeting_audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      throw new Error(`Transcription failed: ${await transcriptionResponse.text()}`);
    }

    const transcription = await transcriptionResponse.json();
    console.log('Transcription completed:', transcription.text.substring(0, 100) + '...');

    // Step 2: Extract actions and context using GPT-4o
    console.log('Starting action extraction...');
    
    const systemPrompt = `You are an InControl Life Management AI specialized in helping people with memory challenges organize their conversations. Analyze this conversation transcript and extract items using the InControl framework:

**I - Intentions**: What is the primary purpose or goal of the conversation or meeting?
**N - Next Steps**: What actions need to be taken as a result of the discussion?
**C - Commitments**: Who is responsible for what? Clear assignments and accountability.
**O - Outcomes**: What was the result or conclusion? What decisions were made?
**N - Notes**: Any other relevant details, context, or observations.
**T - Timelines**: What are the deadlines or timeframes for next steps and commitments?
**R - Resources**: What tools, people, or information are needed to complete next steps?
**O - Obstacles**: What potential challenges or roadblocks were identified?
**L - Learning**: What did you learn from the conversation?

For each InControl item found, provide:
- Clear categorization (intentions, next_steps, commitments, outcomes, notes, timelines, resources, obstacles, learning)
- The exact text from conversation
- Who is responsible (if applicable)
- Priority level (1-5)
- Confidence score (0-1)

Return response as JSON with this structure:
{
  "incontrol_items": [
    {
      "item_text": "exact text from conversation",
      "incontrol_type": "intentions|next_steps|commitments|outcomes|notes|timelines|resources|obstacles|learning",
      "assigned_to": "who is responsible (if applicable)",
      "due_context": "when this should happen (if mentioned)",
      "priority_level": 1-5,
      "confidence_score": 0.0-1.0,
      "relationship_impact": "how this affects relationships",
      "emotional_stakes": "why this matters emotionally",
      "intent_behind": "underlying motivation",
      "transcript_excerpt": "original conversation snippet",
      "timestamp_seconds": approximate_time_in_recording
    }
  ],
  "conversation_summary": "overall summary focusing on relationship dynamics and emotional context",
  "key_insights": "important patterns or themes for life management"
}`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Transcript to analyze:\n\n${transcription.text}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`Analysis failed: ${await analysisResponse.text()}`);
    }

    const analysis = await analysisResponse.json();
    let extractedData;
    
    try {
      extractedData = JSON.parse(analysis.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse AI response:', analysis.choices[0].message.content);
      extractedData = { actions: [], conversation_summary: analysis.choices[0].message.content, key_insights: "" };
    }

    console.log('Extracted InControl items:', extractedData.incontrol_items?.length || 0);

    // Step 3: Store extracted InControl items in database
    if (extractedData.incontrol_items && extractedData.incontrol_items.length > 0) {
      const actionsToInsert = extractedData.incontrol_items.map((item: any) => ({
        user_id: userId,
        meeting_recording_id: meetingId,
        action_text: item.item_text,
        action_type: item.incontrol_type || 'notes',
        assigned_to: item.assigned_to,
        due_context: item.due_context,
        priority_level: item.priority_level || 3,
        confidence_score: item.confidence_score || 0.5,
        relationship_impact: item.relationship_impact,
        emotional_stakes: item.emotional_stakes,
        intent_behind: item.intent_behind,
        transcript_excerpt: item.transcript_excerpt,
        timestamp_in_recording: item.timestamp_seconds || 0,
        status: 'pending',
        // InControl specific fields
        intentions: item.incontrol_type === 'intentions' ? item.item_text : null,
        next_steps: item.incontrol_type === 'next_steps' ? item.item_text : null,
        commitments: item.incontrol_type === 'commitments' ? item.item_text : null,
        outcomes: item.incontrol_type === 'outcomes' ? item.item_text : null,
        notes: item.incontrol_type === 'notes' ? item.item_text : null,
        timelines: item.incontrol_type === 'timelines' ? item.item_text : null,
        resources: item.incontrol_type === 'resources' ? item.item_text : null,
        obstacles: item.incontrol_type === 'obstacles' ? item.item_text : null,
        learning: item.incontrol_type === 'learning' ? item.item_text : null
      }));

      const { error: insertError } = await supabase
        .from('extracted_actions')
        .insert(actionsToInsert);

      if (insertError) {
        console.error('Failed to insert actions:', insertError);
        throw new Error('Failed to store extracted actions');
      }
    }

    // Step 4: Update meeting recording with summary
    const { error: updateError } = await supabase
      .from('meeting_recordings')
      .update({
        ended_at: new Date().toISOString(),
        is_active: false,
      })
      .eq('id', meetingId);

    if (updateError) {
      console.error('Failed to update meeting:', updateError);
    }

    console.log('Processing completed successfully');

    return new Response(JSON.stringify({
      success: true,
      transcript: transcription.text,
      incontrol_items_found: extractedData.incontrol_items?.length || 0,
      summary: extractedData.conversation_summary,
      insights: extractedData.key_insights
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing meeting audio:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});