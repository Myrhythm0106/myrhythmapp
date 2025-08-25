import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!);

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

async function transcribeAudio(audioData: Uint8Array): Promise<string> {
  const formData = new FormData();
  const blob = new Blob([audioData], { type: 'audio/webm' });
  formData.append('file', blob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${await response.text()}`);
  }

  const result = await response.json();
  return result.text;
}

async function extractActions(transcription: string, meetingData: any): Promise<any[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting actionable commitments, tasks, and insights from meeting transcriptions. Your role is to identify meaningful actions that strengthen relationships and accountability.

CRITICAL: Always return a valid JSON array, even if no actions are found. If no clear actions exist, return at least one general reflection or awareness item.

For each action you extract, provide:
- action_text: Clear, specific description of what needs to be done
- action_type: One of "commitment", "task", "reminder", "follow_up"
- assigned_to: Who is responsible (use names from the meeting context)
- due_context: When this should be done (be specific if mentioned)
- priority_level: 1-5 (1 = highest priority)
- confidence_score: 0.0-1.0 how confident you are this is a real commitment
- relationship_impact: How this action affects relationships (1-2 sentences)
- emotional_stakes: The emotional importance of this action
- intent_behind: The deeper motivation or purpose behind this commitment
- transcript_excerpt: The relevant quote from the transcription

Focus on:
1. Explicit commitments ("I will...", "I'll...", "I promise...")
2. Implied responsibilities from the context
3. Relationship-building actions
4. Follow-up items that were discussed
5. Awareness or mindfulness reminders

Meeting Context:
- Title: ${meetingData.title}
- Type: ${meetingData.type}
- Participants: ${JSON.stringify(meetingData.participants)}
- Context: ${meetingData.context || 'Not specified'}

Return ONLY a JSON array of actions. No additional text or explanation.`
          },
          {
            role: 'user',
            content: `Please extract all actionable items from this meeting transcription:\n\n${transcription}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      console.log('No content from OpenAI, creating default action');
      return createDefaultAction();
    }

    try {
      // Try to parse the JSON response
      let actions = JSON.parse(content);
      
      // Ensure we have an array
      if (!Array.isArray(actions)) {
        actions = [actions];
      }
      
      // Validate and clean up actions
      actions = actions.map(action => ({
        action_text: action.action_text || "Follow up on this conversation",
        action_type: action.action_type || "reminder", 
        assigned_to: action.assigned_to || "You",
        due_context: action.due_context || "Soon",
        priority_level: Math.min(5, Math.max(1, action.priority_level || 3)),
        confidence_score: Math.min(1.0, Math.max(0.0, action.confidence_score || 0.7)),
        relationship_impact: action.relationship_impact || "Helps maintain connection",
        emotional_stakes: action.emotional_stakes || "Important for relationship",
        intent_behind: action.intent_behind || "To show care and follow through",
        transcript_excerpt: action.transcript_excerpt || "From conversation"
      }));

      // Ensure we have at least one action
      if (actions.length === 0) {
        actions.push(createDefaultAction());
      }

      return actions;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.log('Raw response:', content);
      
      // Return a default action if parsing fails
      return [createDefaultAction()];
    }
  } catch (error) {
    console.error('Error in extractActions:', error);
    // Return a fallback action even if the API call fails
    return [createDefaultAction()];
  }
}

function createDefaultAction() {
  return {
    action_text: "Reflect on the key points from this conversation",
    action_type: "reminder",
    assigned_to: "You", 
    due_context: "Within the next few days",
    priority_level: 3,
    confidence_score: 0.8,
    relationship_impact: "Taking time to process shows the conversation was meaningful",
    emotional_stakes: "Moderate - demonstrates respect for the discussion",
    intent_behind: "To ensure important points aren't forgotten and can be acted upon",
    transcript_excerpt: "General conversation reflection"
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, meetingId, meetingData } = await req.json();
    
    if (!audio || !meetingId) {
      throw new Error('Audio data and meeting ID are required');
    }

    console.log('Processing meeting audio for meeting:', meetingId);
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Transcribe audio
    console.log('Transcribing audio...');
    const transcription = await transcribeAudio(binaryAudio);
    
    // Extract actions from transcription
    console.log('Extracting actions from transcription...');
    const extractedActions = await extractActions(transcription, meetingData);
    
    // Get user ID from meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meeting_recordings')
      .select('user_id')
      .eq('id', meetingId)
      .single();
    
    if (meetingError) throw meetingError;
    
    // Save extracted actions to database
    console.log(`Saving ${extractedActions.length} actions to database...`);
    const actionsToInsert = extractedActions.map(action => ({
      user_id: meeting.user_id,
      meeting_recording_id: meetingId,
      action_text: action.action_text,
      action_type: action.action_type || 'task',
      assigned_to: action.assigned_to,
      due_context: action.due_context,
      priority_level: action.priority_level || 3,
      confidence_score: action.confidence_score || 0.5,
      relationship_impact: action.relationship_impact,
      emotional_stakes: action.emotional_stakes,
      intent_behind: action.intent_behind,
      transcript_excerpt: action.transcript_excerpt,
      timestamp_in_recording: action.timestamp_in_recording || 0
    }));
    
    const { error: insertError } = await supabase
      .from('extracted_actions')
      .insert(actionsToInsert);
    
    if (insertError) throw insertError;
    
    // Update voice recording with transcription
    if (meetingData.recording_id) {
      await supabase
        .from('voice_recordings')
        .update({ transcription })
        .eq('id', meetingData.recording_id);
    }
    
    console.log('Meeting processing completed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        transcription,
        actionsExtracted: extractedActions.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-meeting-audio function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});