import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // AssemblyAI webhook payload
    const webhookData = await req.json();
    console.log('📨 AssemblyAI webhook received:', webhookData.status);

    const { transcript_id, status } = webhookData;

    if (!transcript_id) {
      throw new Error('No transcript_id in webhook payload');
    }

    // Find the transcription job by job_id (which is the transcript_id from AssemblyAI)
    const { data: job, error: jobError } = await supabase
      .from('transcription_jobs')
      .select('*, meeting_recordings(*)')
      .eq('job_id', transcript_id)
      .single();

    if (jobError || !job) {
      console.error('Job not found for transcript_id:', transcript_id);
      throw new Error('Transcription job not found');
    }

    // Update job status based on webhook
    if (status === 'completed') {
      console.log('✅ Transcription completed, updating status...');

      // Fetch full transcript from AssemblyAI
      const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY');
      const transcriptResponse = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcript_id}`,
        {
          headers: {
            'authorization': ASSEMBLYAI_API_KEY!,
          }
        }
      );

      const transcriptData = await transcriptResponse.json();

      // Update job with transcript text
      await supabase
        .from('transcription_jobs')
        .update({
          status: 'completed',
          transcript_text: transcriptData.text,
          completed_at: new Date().toISOString(),
          metadata: {
            confidence: transcriptData.confidence,
            audio_duration: transcriptData.audio_duration,
            words: transcriptData.words?.length || 0
          }
        })
        .eq('id', job.id);

      // Update meeting processing status to trigger ACT extraction
      await supabase
        .from('meeting_recordings')
        .update({
          processing_status: 'transcription_complete',
          transcript: transcriptData.text
        })
        .eq('id', job.meeting_id);

      console.log('✅ Transcription job and meeting updated successfully');

    } else if (status === 'error') {
      console.error('❌ Transcription failed');

      await supabase
        .from('transcription_jobs')
        .update({
          status: 'failed',
          error_message: webhookData.error || 'Transcription failed'
        })
        .eq('id', job.id);

      await supabase
        .from('meeting_recordings')
        .update({
          processing_status: 'failed',
          processing_error: webhookData.error || 'Transcription failed'
        })
        .eq('id', job.meeting_id);

    } else if (status === 'processing') {
      console.log('⏳ Transcription in progress...');

      await supabase
        .from('transcription_jobs')
        .update({ status: 'processing' })
        .eq('id', job.id);

      await supabase
        .from('meeting_recordings')
        .update({ processing_status: 'transcribing' })
        .eq('id', job.meeting_id);
    }

    return new Response(
      JSON.stringify({ success: true, status }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
