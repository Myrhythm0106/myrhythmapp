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
    const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required Supabase environment variables');
    }
    
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'OpenAI API key not configured - Audio processing unavailable'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { filePath, meetingId, meetingData, audio, userId } = await req.json();

    console.log('🎬 Processing meeting audio for meeting:', meetingId);
    console.log('🔧 Parameters received:', { 
      hasFilePath: !!filePath, 
      hasMeetingId: !!meetingId, 
      hasAudio: !!audio, 
      hasUserId: !!userId,
      meetingDataKeys: meetingData ? Object.keys(meetingData) : []
    });

    // Get userId - enhanced resolution with better error handling
    let resolvedUserId = userId || meetingData?.userId || meetingData?.user_id;
    
    if (!resolvedUserId) {
      console.log('📋 UserId not provided, fetching from meeting record...');
      const { data: meetingRecord, error: meetingError } = await supabase
        .from('meeting_recordings')
        .select('user_id')
        .eq('id', meetingId)
        .single();
      
      if (meetingError) {
        console.error('❌ Failed to fetch meeting record:', meetingError);
        throw new Error(`Failed to fetch meeting record: ${meetingError.message}`);
      }
      
      resolvedUserId = meetingRecord.user_id;
      console.log('✅ Resolved userId from meeting record:', resolvedUserId);
    } else {
      console.log('✅ Using provided userId:', resolvedUserId);
    }

    let audioBlob;
    let transcriptText = '';

    // Handle different input types
    if (filePath) {
      // File-based processing (preferred for large files)
      console.log('🎵 Processing audio file from storage:', filePath);
      
      try {
        // Get the audio file from storage with explicit bucket and path
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('voice-recordings')
          .download(filePath);
        
        if (downloadError) {
          console.error('❌ Storage download error:', downloadError);
          throw new Error(`Failed to download audio file: ${downloadError.message}`);
        }
        
        if (!fileData) {
          throw new Error('No audio file data received from storage');
        }
        
        console.log('✅ Audio file downloaded successfully, size:', fileData.size, 'bytes');
        audioBlob = fileData;
      } catch (storageError) {
        console.error('❌ Storage access failed:', storageError);
        throw new Error(`Storage access error: ${storageError.message}`);
      }
    } else if (audio) {
      // Direct audio data (base64)
      console.log('🎵 Processing direct audio data');
      
      // Convert base64 to blob
      const binaryString = atob(audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      audioBlob = new Blob([bytes], { type: 'audio/webm' });
    } else {
      throw new Error('No audio file path or data provided');
    }

    // Transcribe audio using AssemblyAI (or OpenAI Whisper)
    if (ASSEMBLYAI_API_KEY) {
      console.log('Using AssemblyAI for transcription');
      
      // Upload to AssemblyAI
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/octet-stream'
        },
        body: audioBlob
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`AssemblyAI upload failed: ${uploadResponse.statusText}`);
      }
      
      const { upload_url } = await uploadResponse.json();
      
      // Request transcription
      const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLYAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audio_url: upload_url,
          speaker_labels: true
        })
      });
      
      if (!transcriptionResponse.ok) {
        throw new Error(`AssemblyAI transcription failed: ${transcriptionResponse.statusText}`);
      }
      
      const { id: transcriptId } = await transcriptionResponse.json();
      
      // Poll for completion (simplified - in production use webhooks)
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max
      
      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: { 'Authorization': ASSEMBLYAI_API_KEY }
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          transcriptText = statusData.text;
          break;
        } else if (statusData.status === 'error') {
          throw new Error(`Transcription failed: ${statusData.error}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        attempts++;
      }
      
      if (!transcriptText) {
        throw new Error('Transcription timed out');
      }
    } else {
      // Fallback to OpenAI Whisper
      console.log('Using OpenAI Whisper for transcription');
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      
      const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData
      });
      
      if (!transcriptionResponse.ok) {
        throw new Error(`Whisper transcription failed: ${transcriptionResponse.statusText}`);
      }
      
      const transcriptionData = await transcriptionResponse.json();
      transcriptText = transcriptionData.text;
    }

    console.log('Transcription completed, length:', transcriptText.length);

    // Update meeting record with transcript
    const { error: updateError } = await supabase
      .from('meeting_recordings')
      .update({ 
        transcript: transcriptText,
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', meetingId);

    if (updateError) {
      console.error('Error updating meeting record:', updateError);
    }

    // Extract ACTs using the existing function with resolved userId
    console.log('Extracting ACTs with userId:', resolvedUserId);
    const { data: extractionData, error: extractionError } = await supabase.functions.invoke('extract-acts-incremental', {
      body: {
        transcript: transcriptText,
        meetingId: meetingId,
        userId: resolvedUserId
      }
    });

    if (extractionError) {
      console.error('Error extracting ACTs:', extractionError);
      console.error('Extraction error details:', JSON.stringify(extractionError, null, 2));
    } else {
      console.log('ACT extraction successful, found:', extractionData?.actionsCount || 0, 'actions');
    }

    console.log('Processing completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      transcriptLength: transcriptText.length,
      actionsExtracted: extractionData?.actionsCount || 0,
      meetingId: meetingId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-meeting-audio function:', error);
    
    // Update meeting record with error
    if (req.body) {
      try {
        const body = await req.json();
        if (body.meetingId) {
          const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          );
          
          await supabase
            .from('meeting_recordings')
            .update({ 
              processing_status: 'error',
              processing_error: error.message
            })
            .eq('id', body.meetingId);
        }
      } catch (updateError) {
        console.error('Error updating meeting with error status:', updateError);
      }
    }
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});