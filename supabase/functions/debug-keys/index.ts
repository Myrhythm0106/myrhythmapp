import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log('🔍 Checking API keys configuration...');
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const assemblyaiKey = Deno.env.get('ASSEMBLYAI_API_KEY');
    
    const results = {
      openai: { 
        present: !!openaiKey, 
        length: openaiKey?.length || 0,
        prefix: openaiKey?.substring(0, 10) || 'none'
      },
      assemblyai: { 
        present: !!assemblyaiKey,
        length: assemblyaiKey?.length || 0,
        prefix: assemblyaiKey?.substring(0, 10) || 'none'
      }
    };

    console.log('🔑 API Key check results:', results);

    return new Response(JSON.stringify({
      success: true,
      results,
      message: 'API key configuration checked successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error checking API keys:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});