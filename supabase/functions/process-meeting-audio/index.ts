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
    
    const systemPrompt = `You are a Memory Bridge AI specialized in helping people with memory challenges. Analyze this conversation transcript and extract:

1. **Commitments & Promises**: Any agreements, commitments, or promises made
2. **Action Items**: Tasks or things that need to be done
3. **Follow-ups**: Things to check on or revisit later
4. **Relationship Context**: Emotional stakes, why things matter, relationship dynamics
5. **Intent Behind**: The underlying motivations and reasons

For each item found, provide:
- The exact text from conversation
- Who is responsible
- When it should happen (if mentioned)
- Why it matters emotionally/relationally
- Priority level (1-5)
- Confidence score (0-1)

Return response as JSON with this structure:
{
  "actions": [
    {
      "action_text": "exact commitment or task",
      "action_type": "commitment|promise|task|reminder|follow_up",
      "assigned_to": "who is responsible",
      "due_context": "when this should happen",
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
  "key_insights": "important patterns or themes for memory assistance"
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

    console.log('Extracted actions:', extractedData.actions?.length || 0);

    // Step 3: Store extracted actions in database
    if (extractedData.actions && extractedData.actions.length > 0) {
      const actionsToInsert = extractedData.actions.map((action: any) => ({
        user_id: userId,
        meeting_recording_id: meetingId,
        action_text: action.action_text,
        action_type: action.action_type || 'commitment',
        assigned_to: action.assigned_to,
        due_context: action.due_context,
        priority_level: action.priority_level || 3,
        confidence_score: action.confidence_score || 0.5,
        relationship_impact: action.relationship_impact,
        emotional_stakes: action.emotional_stakes,
        intent_behind: action.intent_behind,
        transcript_excerpt: action.transcript_excerpt,
        timestamp_in_recording: action.timestamp_seconds || 0,
        status: 'pending'
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
      actions_found: extractedData.actions?.length || 0,
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