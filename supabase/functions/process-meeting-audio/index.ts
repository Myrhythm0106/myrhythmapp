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

    // Convert audio to base64 for AssemblyAI
    const arrayBuffer = await audioData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    let binaryString = '';
    const chunkSize = 32768;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binaryString += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64Audio = btoa(binaryString);

    console.log('🔄 Transcribing audio with AssemblyAI...');

    // Upload audio to AssemblyAI
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('ASSEMBLYAI_API_KEY')!,
        'Content-Type': 'application/octet-stream',
      },
      body: bytes,
    });

    if (!uploadResponse.ok) {
      console.error('❌ AssemblyAI upload error:', await uploadResponse.text());
      throw new Error('Failed to upload audio to AssemblyAI');
    }

    const uploadResult = await uploadResponse.json();
    const audioUrl = uploadResult.upload_url;

    console.log('📤 Audio uploaded to AssemblyAI, starting transcription...');

    // Start transcription
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': Deno.env.get('ASSEMBLYAI_API_KEY')!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        speaker_labels: true,
        auto_chapters: false,
      }),
    });

    if (!transcriptResponse.ok) {
      console.error('❌ AssemblyAI transcription error:', await transcriptResponse.text());
      throw new Error('Failed to start transcription');
    }

    const transcriptJob = await transcriptResponse.json();
    const transcriptId = transcriptJob.id;

    console.log('⏳ Polling for transcription completion...');

    // Poll for completion
    let transcript = '';
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'Authorization': Deno.env.get('ASSEMBLYAI_API_KEY')!,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check transcription status');
      }

      const status = await statusResponse.json();

      if (status.status === 'completed') {
        transcript = status.text;
        console.log('✅ Transcription completed:', transcript.substring(0, 100) + '...');
        break;
      } else if (status.status === 'error') {
        throw new Error(`Transcription failed: ${status.error}`);
      }

      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    if (!transcript) {
      throw new Error('Transcription timeout after 5 minutes');
    }

    // Extract SMART ACTions using OpenAI
    console.log('🧠 Extracting SMART ACTs...');

    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting SMART (Specific, Measurable, Achievable, Relevant, Time-bound) action items from meeting transcripts. 

Extract concrete, actionable commitments that were made during the conversation. Focus on:
- Specific tasks or deliverables someone committed to
- Clear assignees (who will do it)
- Deadlines or timeframes mentioned
- Measurable outcomes
- Suggest realistic completion dates based on urgency and complexity

Return a JSON array of actions with this structure:
{
  "actions": [
    {
      "action": "Clear, specific task description",
      "assignee": "Name or role of person responsible", 
      "deadline": "Specific date/time or relative timeframe",
      "suggested_date": "YYYY-MM-DD format for suggested completion",
      "priority": 3,
      "context": "Relevant context or background",
      "is_commitment": true,
      "category": "work|personal|health|family|other",
      "emotional_stakes": "Why this matters emotionally"
    }
  ]
}

For suggested_date: 
- Use YYYY-MM-DD format
- Consider today's date as reference
- High priority items: suggest within 1-3 days
- Medium priority: suggest within 1-2 weeks  
- Low priority: suggest within 2-4 weeks

Only extract genuine commitments and action items. Don't create generic or vague actions.`
          },
          {
            role: 'user',
            content: `Meeting Title: ${meetingData?.title || 'Recording'}
Meeting Context: Recording captured via MyRhythm app
Participants: ${meetingData?.participants?.map((p: any) => p.name).join(', ') || 'User'}
Today's Date: ${new Date().toISOString().split('T')[0]}

Transcript:
${transcript}`
          }
        ],
        max_tokens: 2000,
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

    // Get user ID from meeting record
    const { data: meetingRecord } = await supabase
      .from('meeting_recordings')
      .select('user_id')
      .eq('id', meetingId)
      .single();

    const userId = meetingRecord?.user_id;
    
    // Save extracted actions to database
    if (extractedActions.length > 0 && userId) {
      const actionsToInsert = extractedActions.map((action: any) => ({
        meeting_recording_id: meetingId,
        user_id: userId,
        action_text: action.action,
        assigned_to: action.assignee || 'self',
        due_context: action.deadline,
        proposed_date: action.suggested_date,
        priority_level: typeof action.priority === 'number' ? action.priority : 3,
        relationship_impact: action.context || '',
        emotional_stakes: action.emotional_stakes || '',
        action_type: 'commitment',
        status: 'pending'
      }));

      const { error: actionsInsertError } = await supabase
        .from('extracted_actions')
        .insert(actionsToInsert);

      if (actionsInsertError) {
        console.error('❌ Error saving extracted actions:', actionsInsertError);
        console.error('Schema mismatch details:', actionsInsertError);
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