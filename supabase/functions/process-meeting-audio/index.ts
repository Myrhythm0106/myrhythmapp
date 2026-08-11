import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

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
    
    console.log('🚀 Starting process-meeting-audio function');
    console.log('🔐 Environment check:', {
      hasOpenAI: !!OPENAI_API_KEY,
      hasAssemblyAI: !!ASSEMBLYAI_API_KEY,
      hasSupabaseURL: !!SUPABASE_URL,
      hasSupabaseKey: !!SUPABASE_SERVICE_ROLE_KEY,
      openAILength: OPENAI_API_KEY?.length || 0,
      assemblyAILength: ASSEMBLYAI_API_KEY?.length || 0,
      supabaseURL: SUPABASE_URL || 'MISSING'
    });
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase environment variables');
      throw new Error('Missing required Supabase environment variables');
    }
    
    if (!ASSEMBLYAI_API_KEY && !OPENAI_API_KEY) {
      console.error('❌ No transcription provider configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'No transcription provider configured - Audio processing unavailable'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }


    console.log('✅ All environment variables validated');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log('📋 Reading request body...');
    const requestBody = await req.json();
    
    // Validate request body
    const requestSchema = z.object({
      filePath: z.string().optional(),
      meetingId: z.string().uuid('Invalid meeting ID'),
      userId: z.string().uuid('Invalid user ID').optional(),
      audio: z.string().optional(),
      meetingData: z.record(z.any()).optional(),
    }).refine(
      (data) => data.filePath || data.audio,
      { message: 'Either filePath or audio must be provided' }
    );
    
    const validation = requestSchema.safeParse(requestBody);
    if (!validation.success) {
      console.error('❌ Invalid request:', validation.error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid request data',
        details: validation.error 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { filePath, meetingId, meetingData, audio, userId } = validation.data;
    
    console.log('📝 Request data received:', {
      hasFilePath: !!filePath,
      filePath: filePath || 'NOT_PROVIDED',
      hasMeetingId: !!meetingId,
      meetingId: meetingId || 'NOT_PROVIDED',
      hasAudio: !!audio,
      audioLength: audio?.length || 0,
      hasUserId: !!userId,
      userId: userId || 'NOT_PROVIDED',
      hasMeetingData: !!meetingData,
      meetingDataKeys: meetingData ? Object.keys(meetingData) : [],
      rawBodyKeys: Object.keys(requestBody)
    });

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
        throw new Error(`Storage access error: ${storageError instanceof Error ? storageError.message : 'Unknown storage error'}`);
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
      console.log('🎤 Using AssemblyAI for transcription');
      
      try {
        // Test AssemblyAI API connection
        console.log('🎤 Using AssemblyAI for transcription');
        console.log('🔑 AssemblyAI Key format check:', {
          keyLength: ASSEMBLYAI_API_KEY?.length || 0,
          keyPrefix: ASSEMBLYAI_API_KEY?.substring(0, 10) || 'none',
          keyType: typeof ASSEMBLYAI_API_KEY
        });
        
        // Upload file to AssemblyAI
        console.log('📤 Uploading to AssemblyAI...');
        const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
          method: 'POST',
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/octet-stream'
          },
          body: audioBlob
        });

        console.log('📤 AssemblyAI upload response:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          ok: uploadResponse.ok,
          headers: Object.fromEntries(uploadResponse.headers.entries())
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.log('❌ AssemblyAI upload failed:', errorText);
          console.log('🔍 Debug info:', {
            requestHeaders: {
              'Authorization': `${ASSEMBLYAI_API_KEY?.substring(0, 10)}...`,
              'Content-Type': 'application/octet-stream'
            },
            bodySize: audioBlob.size,
            bodyType: audioBlob.type
          });
          throw new Error(`AssemblyAI upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`);
        }
        
        const uploadData = await uploadResponse.json();
        console.log('✅ Upload successful, URL received:', !!uploadData.upload_url);
        
        // Request transcription
        console.log('🎯 Requesting transcription...');
        const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
          method: 'POST',
          headers: {
            'Authorization': ASSEMBLYAI_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            audio_url: uploadData.upload_url,
            speaker_labels: true
          })
        });
        
        console.log('🎯 Transcription request response:', {
          status: transcriptionResponse.status,
          statusText: transcriptionResponse.statusText,
          ok: transcriptionResponse.ok
        });
        
        if (!transcriptionResponse.ok) {
          const errorText = await transcriptionResponse.text();
          console.error('❌ AssemblyAI transcription request failed:', errorText);
          throw new Error(`AssemblyAI transcription failed: ${transcriptionResponse.status} ${transcriptionResponse.statusText} - ${errorText}`);
        }
        
        const transcriptionData = await transcriptionResponse.json();
        const transcriptId = transcriptionData.id;
        console.log('✅ Transcription job started, ID:', transcriptId);
        
        // Poll for completion (optimized for faster processing)
        let attempts = 0;
        const maxAttempts = 20; // 60 seconds max (3s * 20)
        
        console.log('⏳ Polling for transcription completion...');
        while (attempts < maxAttempts) {
          console.log(`🔄 Polling attempt ${attempts + 1}/${maxAttempts}...`);
          
          const statusResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
            headers: { 
              'Authorization': ASSEMBLYAI_API_KEY
            }
          });
          
          console.log('📊 Status check response:', {
            status: statusResponse.status,
            ok: statusResponse.ok
          });
          
          if (!statusResponse.ok) {
            console.error('❌ Status check failed:', statusResponse.statusText);
            throw new Error(`Status check failed: ${statusResponse.statusText}`);
          }
          
          const statusData = await statusResponse.json();
          console.log('📊 Transcription status:', {
            status: statusData.status,
            hasText: !!statusData.text,
            textLength: statusData.text?.length || 0
          });
          
          if (statusData.status === 'completed') {
            transcriptText = statusData.text;
            console.log('✅ Transcription completed successfully!');
            break;
          } else if (statusData.status === 'error') {
            console.error('❌ Transcription error:', statusData.error);
            throw new Error(`Transcription failed: ${statusData.error}`);
          }
          
          console.log(`⏳ Status: ${statusData.status}, waiting 3 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
          attempts++;
        }
        
        if (!transcriptText) {
          console.warn('⚠️ Transcription timeout after 60 seconds, using partial transcript');
          transcriptText = statusData.text || '';
          // If still no text, we'll proceed with rule-based extraction
        }
      } catch (assemblyError) {
        console.error('❌ AssemblyAI processing failed:', assemblyError);
        throw new Error(`AssemblyAI processing failed: ${assemblyError instanceof Error ? assemblyError.message : 'Unknown error'}`);
      }
    } else {
      // Fallback to OpenAI Whisper
      console.log('🎤 Using OpenAI Whisper for transcription');
      
      try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        
        console.log('📤 Sending to OpenAI Whisper...');
        const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData
        });
        
        console.log('🎤 Whisper response:', {
          status: transcriptionResponse.status,
          ok: transcriptionResponse.ok
        });
        
        if (!transcriptionResponse.ok) {
          const errorText = await transcriptionResponse.text();
          console.error('❌ Whisper transcription failed:', errorText);
          throw new Error(`Whisper transcription failed: ${transcriptionResponse.status} - ${errorText}`);
        }
        
        const transcriptionData = await transcriptionResponse.json();
        transcriptText = transcriptionData.text;
        console.log('✅ Whisper transcription completed');
      } catch (whisperError) {
        console.error('❌ OpenAI Whisper processing failed:', whisperError);
        throw new Error(`Whisper processing failed: ${whisperError instanceof Error ? whisperError.message : 'Unknown error'}`);
      }
    }

    console.log('🎯 Transcription completed:', {
      length: transcriptText.length,
      preview: transcriptText.substring(0, 100) + (transcriptText.length > 100 ? '...' : '')
    });

    // Update meeting record with transcript
    console.log('💾 Updating meeting record with transcript...');
    const { error: updateError } = await supabase
      .from('meeting_recordings')
      .update({ 
        transcript: transcriptText,
        processing_status: 'extracting_actions'
      })
      .eq('id', meetingId);

    if (updateError) {
      console.error('❌ Error updating meeting record:', updateError);
    } else {
      console.log('✅ Meeting record updated successfully');
    }

    // Extract ACTs using the existing function with resolved userId
    console.log('🎯 Extracting ACTs with userId:', resolvedUserId);
    const { data: extractionData, error: extractionError } = await supabase.functions.invoke('extract-acts-incremental', {
      body: {
        transcript: transcriptText,
        meetingId: meetingId,
        userId: resolvedUserId
      }
    });

    if (extractionError) {
      console.error('❌ Error extracting ACTs:', extractionError);
      console.error('🔍 Extraction error details:', JSON.stringify(extractionError, null, 2));
      
      // Mark as completed even if extraction fails
      await supabase
        .from('meeting_recordings')
        .update({ 
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString(),
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', meetingId);
    } else {
      console.log('✅ ACT extraction successful, found:', extractionData?.actionsCount || 0, 'actions');
      
      // Mark as completed after successful extraction
      await supabase
        .from('meeting_recordings')
        .update({ 
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString(),
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', meetingId);
    }

    console.log('🎉 Processing completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      transcriptLength: transcriptText.length,
      actionsExtracted: extractionData?.actionsCount || 0,
      meetingId: meetingId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 CRITICAL ERROR in process-meeting-audio function:', error);
    console.error('🔍 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Update meeting record with error
    try {
      console.log('💾 Attempting to update meeting record with error status...');
      const body = await req.clone().json();
      if (body.meetingId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );
        
        const { error: updateError } = await supabase
          .from('meeting_recordings')
          .update({ 
            processing_status: 'error',
            processing_error: error instanceof Error ? error.message : 'Unknown error occurred'
          })
          .eq('id', body.meetingId);
          
        if (updateError) {
          console.error('❌ Failed to update meeting with error status:', updateError);
        } else {
          console.log('✅ Meeting record updated with error status');
        }
      }
    } catch (updateError) {
      console.error('❌ Error updating meeting with error status:', updateError);
    }
    
    const errorResponse = {
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
      function: 'process-meeting-audio'
    };
    
    console.error('🚨 Returning error response:', errorResponse);
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});