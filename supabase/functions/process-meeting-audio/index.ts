import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🎤 Processing meeting audio...');
    
    const { filePath, meetingId, meetingData } = await req.json();
    
    if (!filePath || !meetingId) {
      throw new Error('Missing required parameters: filePath and meetingId');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`📁 Processing file: ${filePath} for meeting: ${meetingId}`);

    // Get the audio file from storage
    const { data: audioData, error: downloadError } = await supabase.storage
      .from('voice-recordings')
      .download(filePath);

    if (downloadError) {
      console.error('❌ Error downloading audio:', downloadError);
      throw new Error(`Failed to download audio: ${downloadError.message}`);
    }

    console.log('✅ Audio file downloaded successfully');

    // Convert to base64 for OpenAI API
    const arrayBuffer = await audioData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Process in chunks to avoid memory issues
    let binaryString = '';
    const chunkSize = 32768;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64Audio = btoa(binaryString);

    console.log('🔄 Transcribing audio with OpenAI...');

    // Transcribe with OpenAI
    const formData = new FormData();
    const audioBlob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('❌ OpenAI transcription error:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcript = transcriptionResult.text;

    console.log('✅ Transcription completed:', transcript.substring(0, 100) + '...');

    // Extract SMART ACTions using OpenAI
    console.log('🧠 Extracting SMART ACTs...');

    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting SMART (Specific, Measurable, Achievable, Relevant, Time-bound) action items from meeting transcripts. 

Extract concrete, actionable commitments that were made during the conversation. Focus on:
- Specific tasks or deliverables someone committed to
- Clear assignees (who will do it)
- Deadlines or timeframes mentioned
- Measurable outcomes

Return a JSON array of actions with this structure:
{
  "actions": [
    {
      "action": "Clear, specific task description",
      "assignee": "Name or role of person responsible", 
      "deadline": "Specific date/time or relative timeframe",
      "priority": "high|medium|low",
      "context": "Relevant context or background",
      "is_commitment": true,
      "category": "work|personal|health|family|other"
    }
  ]
}

Only extract genuine commitments and action items. Don't create generic or vague actions.`
          },
          {
            role: 'user',
            content: `Meeting Title: ${meetingData?.title || 'Recording'}
Meeting Context: Recording captured via MyRhythm app
Participants: ${meetingData?.participants?.map((p: any) => p.name).join(', ') || 'User'}

Transcript:
${transcript}`
          }
        ],
        max_completion_tokens: 2000,
        temperature: 0.1
      }),
    });

    if (!extractionResponse.ok) {
      const errorText = await extractionResponse.text();
      console.error('❌ ACT extraction error:', errorText);
      throw new Error(`ACT extraction failed: ${errorText}`);
    }

    const extractionResult = await extractionResponse.json();
    let extractedActions = [];

    try {
      const content = extractionResult.choices[0].message.content;
      const parsed = JSON.parse(content);
      extractedActions = parsed.actions || [];
    } catch (parseError) {
      console.warn('⚠️ Failed to parse ACT extraction result, trying fallback');
      extractedActions = [];
    }

    console.log(`✅ Extracted ${extractedActions.length} SMART ACTs`);

    // Update meeting record with transcript
    const { error: meetingUpdateError } = await supabase
      .from('meeting_recordings')
      .update({
        transcript,
        status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (meetingUpdateError) {
      console.error('❌ Error updating meeting record:', meetingUpdateError);
    }

    // Save extracted actions to database
    if (extractedActions.length > 0) {
      const actionsToInsert = extractedActions.map((action: any) => ({
        meeting_id: meetingId,
        action: action.action,
        assignee: action.assignee,
        deadline: action.deadline,
        priority: action.priority || 'medium',
        context: action.context || '',
        category: action.category || 'other',
        is_commitment: action.is_commitment || true,
        status: 'pending',
        is_realtime: false
      }));

      const { error: actionsInsertError } = await supabase
        .from('extracted_actions')
        .insert(actionsToInsert);

      if (actionsInsertError) {
        console.error('❌ Error saving extracted actions:', actionsInsertError);
      } else {
        console.log(`✅ Saved ${actionsToInsert.length} actions to database`);
      }
    }

    console.log('🎉 Meeting processing completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        meetingId,
        transcript,
        actionsCount: extractedActions.length,
        message: 'Meeting processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error processing meeting audio:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});