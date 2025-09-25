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
    console.log('🧪 Testing API keys...');
    
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    const assemblyaiKey = Deno.env.get('ASSEMBLYAI_API_KEY');
    
    console.log('📋 API Key Check:');
    console.log(`- OpenAI Key: ${openaiKey ? `Present (${openaiKey.length} chars, starts with: ${openaiKey.substring(0, 10)}...)` : 'Missing'}`);
    console.log(`- AssemblyAI Key: ${assemblyaiKey ? `Present (${assemblyaiKey.length} chars, starts with: ${assemblyaiKey.substring(0, 10)}...)` : 'Missing'}`);

    const results = {
      openai: { available: !!openaiKey, valid: false, error: null as string | null },
      assemblyai: { available: !!assemblyaiKey, valid: false, error: null as string | null }
    };

    // Test OpenAI API
    if (openaiKey) {
      try {
        console.log('🤖 Testing OpenAI API...');
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (openaiResponse.ok) {
          results.openai.valid = true;
          console.log('✅ OpenAI API key is valid');
        } else {
          const errorText = await openaiResponse.text();
          results.openai.error = `${openaiResponse.status}: ${errorText}`;
          console.log(`❌ OpenAI API key invalid: ${results.openai.error}`);
        }
      } catch (error) {
        results.openai.error = error instanceof Error ? error.message : String(error);
        console.log(`❌ OpenAI API test failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // Test AssemblyAI API
    if (assemblyaiKey) {
      try {
        console.log('🎤 Testing AssemblyAI API...');
        const assemblyaiResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
          method: 'GET',
          headers: {
            'Authorization': assemblyaiKey,
            'Content-Type': 'application/json',
          },
        });

        if (assemblyaiResponse.ok) {
          results.assemblyai.valid = true;
          console.log('✅ AssemblyAI API key is valid');
        } else {
          const errorText = await assemblyaiResponse.text();
          results.assemblyai.error = `${assemblyaiResponse.status}: ${errorText}`;
          console.log(`❌ AssemblyAI API key invalid: ${results.assemblyai.error}`);
        }
      } catch (error) {
        results.assemblyai.error = error instanceof Error ? error.message : String(error);
        console.log(`❌ AssemblyAI API test failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    console.log('🏁 API key test results:', JSON.stringify(results, null, 2));

    return new Response(JSON.stringify({
      success: true,
      results,
      recommendations: {
        openai: results.openai.valid ? 'API key is working correctly' : 'Check API key format and validity',
        assemblyai: results.assemblyai.valid ? 'API key is working correctly' : 'Check API key format and validity'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('💥 API key test failed:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});