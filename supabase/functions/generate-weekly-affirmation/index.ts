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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { year, weekNumber } = await req.json();
    const currentYear = year || new Date().getFullYear();
    const currentWeek = weekNumber || Math.ceil((new Date().getTime() - new Date(currentYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

    // Get yearly theme
    const { data: annualPriority } = await supabase
      .from('annual_priorities')
      .select('*')
      .eq('user_id', user.id)
      .eq('year', currentYear)
      .single();

    // Get current month's theme
    const currentMonth = new Date().getMonth() + 1;
    const { data: monthlyTheme } = await supabase
      .from('monthly_themes')
      .select('*')
      .eq('user_id', user.id)
      .eq('year', currentYear)
      .eq('month', currentMonth)
      .single();

    const yearlyThemeText = annualPriority?.yearly_theme || 'Personal Growth';
    const monthlyThemeText = monthlyTheme?.theme || 'Focus & Clarity';

    // Generate affirmation using OpenAI
    const prompt = `User's Yearly Theme: "${yearlyThemeText}"
User's Monthly Theme: "${monthlyThemeText}"

Generate a short, empowering "I Choose..." affirmation for this week that:
- Supports the monthly theme
- Aligns with the yearly vision
- Is phrased in first person present tense
- Is 5-10 words maximum
- Is specific and actionable

Example format: "I choose to embrace growth today"

Return ONLY the affirmation text, no explanation or quotes.`;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a compassionate life coach creating empowering affirmations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 50
      })
    });

    if (!openAIResponse.ok) {
      console.error('OpenAI error:', await openAIResponse.text());
      throw new Error('Failed to generate affirmation');
    }

    const openAIData = await openAIResponse.json();
    const affirmation = openAIData.choices[0].message.content.trim().replace(/^["']|["']$/g, '');

    // Save to database
    const { data: savedAffirmation, error: saveError } = await supabase
      .from('weekly_affirmations')
      .upsert({
        user_id: user.id,
        year: currentYear,
        week_number: currentWeek,
        affirmation,
        monthly_theme_id: monthlyTheme?.id || null,
        annual_priority_id: annualPriority?.id || null
      }, {
        onConflict: 'user_id,year,week_number'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      throw saveError;
    }

    return new Response(
      JSON.stringify({ affirmation: savedAffirmation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Affirmation generation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
