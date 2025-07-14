
-- Create enhanced empowerment statements table
CREATE TABLE public.empowerment_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  user_type TEXT NOT NULL, -- 'brain-injury', 'caregiver', 'cognitive-optimization', 'wellness'
  tier TEXT NOT NULL DEFAULT 'free', -- 'free', 'premium', 'family'
  theme TEXT,
  mood TEXT, -- 'great', 'okay', 'struggling'
  season TEXT, -- 'spring', 'summer', 'fall', 'winter'
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  engagement_score DECIMAL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user statement interactions table
CREATE TABLE public.user_statement_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  statement_id UUID NOT NULL REFERENCES public.empowerment_statements(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'viewed', 'favorited', 'shared', 'reflected'
  interaction_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user favorites table
CREATE TABLE public.user_favorite_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  statement_id UUID NOT NULL REFERENCES public.empowerment_statements(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, statement_id)
);

-- Create user statement history table for smart selection
CREATE TABLE public.user_statement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  statement_id UUID NOT NULL REFERENCES public.empowerment_statements(id) ON DELETE CASCADE,
  shown_date DATE NOT NULL DEFAULT CURRENT_DATE,
  user_mood TEXT,
  user_energy INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, statement_id, shown_date)
);

-- Enable RLS on all tables
ALTER TABLE public.empowerment_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_statement_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for empowerment_statements (public read)
CREATE POLICY "Everyone can view empowerment statements" ON public.empowerment_statements
  FOR SELECT USING (true);

-- RLS Policies for user_statement_interactions
CREATE POLICY "Users can create their own interactions" ON public.user_statement_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own interactions" ON public.user_statement_interactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for user_favorite_statements
CREATE POLICY "Users can manage their own favorites" ON public.user_favorite_statements
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_statement_history
CREATE POLICY "Users can manage their own statement history" ON public.user_statement_history
  FOR ALL USING (auth.uid() = user_id);

-- Insert initial free statements (60 total - 15 per category)
INSERT INTO public.empowerment_statements (text, category, subcategory, user_type, tier, theme, tags) VALUES
-- Brain Injury Recovery (15 free)
('#IChoose to honor my brain''s healing journey with gentle patience, knowing every small step builds my strength.', 'healing', 'patience', 'brain-injury', 'free', 'patience', '{"healing", "gentleness", "progress"}'),
('#IChoose to celebrate my victories, no matter how small they seem to others. Each one matters.', 'celebration', 'victories', 'brain-injury', 'free', 'celebration', '{"victory", "progress", "self-compassion"}'),
('#IChoose to trust my brain''s incredible ability to adapt and create new pathways to success.', 'neuroplasticity', 'adaptation', 'brain-injury', 'free', 'trust', '{"adaptation", "neuroplasticity", "potential"}'),
('#IChoose to give myself permission to rest when needed, knowing that healing requires balance.', 'self-care', 'rest', 'brain-injury', 'free', 'balance', '{"self-care", "balance", "permission"}'),
('#IChoose to define myself by my courage and resilience, not by my challenges.', 'identity', 'resilience', 'brain-injury', 'free', 'courage', '{"identity", "resilience", "strength"}'),
('#IChoose to embrace each day as a new opportunity for growth and discovery.', 'growth', 'opportunity', 'brain-injury', 'free', 'growth', '{"growth", "opportunity", "discovery"}'),
('#IChoose to be proud of my progress, even when others cannot see it.', 'progress', 'pride', 'brain-injury', 'free', 'pride', '{"progress", "validation", "self-worth"}'),
('#IChoose to use my experience to inspire and help others on similar journeys.', 'purpose', 'helping', 'brain-injury', 'free', 'purpose', '{"purpose", "inspiration", "community"}'),
('#IChoose to practice self-compassion when facing difficult moments.', 'compassion', 'self-love', 'brain-injury', 'free', 'compassion', '{"self-compassion", "kindness", "acceptance"}'),
('#IChoose to focus on what I can do today, not what I cannot.', 'focus', 'ability', 'brain-injury', 'free', 'focus', '{"focus", "ability", "present-moment"}'),
('#IChoose to celebrate the strength it takes to keep going every day.', 'strength', 'perseverance', 'brain-injury', 'free', 'strength', '{"strength", "perseverance", "daily-courage"}'),
('#IChoose to see setbacks as temporary detours, not permanent destinations.', 'resilience', 'perspective', 'brain-injury', 'free', 'resilience', '{"resilience", "perspective", "hope"}'),
('#IChoose to honor both my struggles and my triumphs as part of my story.', 'acceptance', 'wholeness', 'brain-injury', 'free', 'acceptance', '{"acceptance", "story", "wholeness"}'),
('#IChoose to believe in my capacity for continued healing and growth.', 'belief', 'potential', 'brain-injury', 'free', 'belief', '{"belief", "potential", "healing"}'),
('#IChoose to find joy in small moments and simple pleasures.', 'joy', 'mindfulness', 'brain-injury', 'free', 'joy', '{"joy", "mindfulness", "gratitude"}'),

-- Caregiver Support (15 free)
('#IChoose to support my loved one while honoring my own needs and boundaries.', 'balance', 'boundaries', 'caregiver', 'free', 'balance', '{"boundaries", "self-care", "support"}'),
('#IChoose to see my caregiving as an act of love that transforms both of us.', 'purpose', 'love', 'caregiver', 'free', 'love', '{"purpose", "transformation", "love"}'),
('#IChoose to fill my own cup first, so I can pour into others from abundance.', 'self-care', 'abundance', 'caregiver', 'free', 'abundance', '{"self-care", "abundance", "energy"}'),
('#IChoose to celebrate every small improvement I witness, knowing progress comes in many forms.', 'celebration', 'progress', 'caregiver', 'free', 'progress', '{"celebration", "progress", "awareness"}'),
('#IChoose to ask for help when I need it, understanding that accepting support is a strength.', 'support', 'strength', 'caregiver', 'free', 'strength', '{"help", "community", "strength"}'),
('#IChoose to practice patience, knowing that healing happens in its own time.', 'patience', 'healing', 'caregiver', 'free', 'patience', '{"patience", "healing", "timing"}'),
('#IChoose to find moments of joy and laughter even in challenging times.', 'joy', 'resilience', 'caregiver', 'free', 'joy', '{"joy", "laughter", "resilience"}'),
('#IChoose to remember that my wellbeing matters too.', 'self-worth', 'importance', 'caregiver', 'free', 'self-worth', '{"self-worth", "wellbeing", "importance"}'),
('#IChoose to trust in the strength and resilience of my loved one.', 'trust', 'belief', 'caregiver', 'free', 'trust', '{"trust", "belief", "strength"}'),
('#IChoose to create sacred moments of rest and renewal for myself.', 'rest', 'renewal', 'caregiver', 'free', 'renewal', '{"rest", "renewal", "sacred"}'),
('#IChoose to see the beauty in our shared journey of growth.', 'beauty', 'journey', 'caregiver', 'free', 'beauty', '{"beauty", "journey", "growth"}'),
('#IChoose to honor my feelings without judgment, knowing they are valid.', 'emotions', 'validation', 'caregiver', 'free', 'validation', '{"emotions", "validation", "acceptance"}'),
('#IChoose to communicate my needs clearly and compassionately.', 'communication', 'needs', 'caregiver', 'free', 'communication', '{"communication", "needs", "compassion"}'),
('#IChoose to build a support network that understands my journey.', 'community', 'understanding', 'caregiver', 'free', 'community', '{"community", "understanding", "support"}'),
('#IChoose to find meaning and purpose in the love I give and receive.', 'meaning', 'purpose', 'caregiver', 'free', 'purpose', '{"meaning", "purpose", "reciprocity"}'),

-- Cognitive Optimization (15 free)
('#IChoose to push my cognitive boundaries today, knowing growth happens at the edge of comfort.', 'growth', 'challenge', 'cognitive-optimization', 'free', 'growth', '{"challenge", "growth", "potential"}'),
('#IChoose to focus my mental energy on what matters most, eliminating cognitive clutter.', 'focus', 'clarity', 'cognitive-optimization', 'free', 'focus', '{"focus", "clarity", "priorities"}'),
('#IChoose to treat my mind like the high-performance tool it is, with proper care and challenge.', 'performance', 'optimization', 'cognitive-optimization', 'free', 'performance', '{"optimization", "care", "excellence"}'),
('#IChoose to embrace mental challenges as opportunities to expand my cognitive capacity.', 'challenge', 'expansion', 'cognitive-optimization', 'free', 'expansion', '{"challenge", "capacity", "growth"}'),
('#IChoose to combine focused work with strategic rest, optimizing my mental performance.', 'strategy', 'optimization', 'cognitive-optimization', 'free', 'optimization', '{"strategy", "balance", "performance"}'),
('#IChoose to feed my mind with quality information and meaningful learning.', 'learning', 'quality', 'cognitive-optimization', 'free', 'learning', '{"learning", "quality", "growth"}'),
('#IChoose to practice mental agility through diverse cognitive exercises.', 'agility', 'exercise', 'cognitive-optimization', 'free', 'agility', '{"agility", "exercise", "flexibility"}'),
('#IChoose to measure my progress by my ability to think more clearly and creatively.', 'progress', 'clarity', 'cognitive-optimization', 'free', 'progress', '{"progress", "clarity", "creativity"}'),
('#IChoose to create environments that support peak mental performance.', 'environment', 'performance', 'cognitive-optimization', 'free', 'environment', '{"environment", "optimization", "peak-performance"}'),
('#IChoose to embrace mistakes as valuable data for cognitive improvement.', 'learning', 'improvement', 'cognitive-optimization', 'free', 'learning', '{"mistakes", "data", "improvement"}'),
('#IChoose to challenge my assumptions and expand my thinking patterns.', 'challenge', 'expansion', 'cognitive-optimization', 'free', 'challenge', '{"assumptions", "patterns", "expansion"}'),
('#IChoose to build mental resilience through consistent cognitive training.', 'resilience', 'training', 'cognitive-optimization', 'free', 'resilience', '{"resilience", "training", "consistency"}'),
('#IChoose to seek out complex problems that stretch my mental capabilities.', 'complexity', 'growth', 'cognitive-optimization', 'free', 'complexity', '{"complexity", "problems", "capabilities"}'),
('#IChoose to balance analytical thinking with creative intuition.', 'balance', 'integration', 'cognitive-optimization', 'free', 'balance', '{"analytical", "creative", "intuition"}'),
('#IChoose to invest in my cognitive health as my most valuable asset.', 'investment', 'health', 'cognitive-optimization', 'free', 'investment', '{"investment", "health", "asset"}'),

-- Wellness & Productivity (15 free)
('#IChoose to build systems that support my highest potential and deepest values.', 'systems', 'potential', 'wellness', 'free', 'potential', '{"systems", "values", "potential"}'),
('#IChoose to prioritize what truly matters and release what no longer serves me.', 'priorities', 'clarity', 'wellness', 'free', 'clarity', '{"priorities", "release", "clarity"}'),
('#IChoose to create sustainable habits that compound into extraordinary results.', 'habits', 'sustainability', 'wellness', 'free', 'sustainability', '{"habits", "sustainability", "results"}'),
('#IChoose to honor both my ambition and my need for rest, creating sustainable success.', 'balance', 'sustainability', 'wellness', 'free', 'sustainability', '{"ambition", "rest", "sustainability"}'),
('#IChoose to measure my success by alignment with my values, not just achievements.', 'values', 'alignment', 'wellness', 'free', 'alignment', '{"values", "success", "alignment"}'),
('#IChoose to design my days around energy management, not just time management.', 'energy', 'design', 'wellness', 'free', 'energy', '{"energy", "design", "management"}'),
('#IChoose to create boundaries that protect my peace and productivity.', 'boundaries', 'protection', 'wellness', 'free', 'boundaries', '{"boundaries", "peace", "productivity"}'),
('#IChoose to invest in relationships that energize and inspire me.', 'relationships', 'energy', 'wellness', 'free', 'relationships', '{"relationships", "energy", "inspiration"}'),
('#IChoose to practice gratitude as a foundation for abundance thinking.', 'gratitude', 'abundance', 'wellness', 'free', 'gratitude', '{"gratitude", "abundance", "foundation"}'),
('#IChoose to embrace continuous learning as a path to personal evolution.', 'learning', 'evolution', 'wellness', 'free', 'learning', '{"learning", "evolution", "growth"}'),
('#IChoose to listen to my body''s wisdom and honor its needs.', 'wisdom', 'body', 'wellness', 'free', 'wisdom', '{"wisdom", "body", "needs"}'),
('#IChoose to simplify complexity and focus on what creates the most impact.', 'simplicity', 'impact', 'wellness', 'free', 'simplicity', '{"simplicity", "focus", "impact"}'),
('#IChoose to view challenges as opportunities for strength and character building.', 'challenges', 'strength', 'wellness', 'free', 'strength', '{"challenges", "strength", "character"}'),
('#IChoose to create rituals that center me and connect me to my purpose.', 'rituals', 'purpose', 'wellness', 'free', 'rituals', '{"rituals", "center", "purpose"}'),
('#IChoose to live with intention, making choices that reflect my authentic self.', 'intention', 'authenticity', 'wellness', 'free', 'intention', '{"intention", "choices", "authenticity"}');

-- Create indexes for performance
CREATE INDEX idx_empowerment_statements_category ON public.empowerment_statements(category);
CREATE INDEX idx_empowerment_statements_user_type ON public.empowerment_statements(user_type);
CREATE INDEX idx_empowerment_statements_tier ON public.empowerment_statements(tier);
CREATE INDEX idx_user_statement_history_user_date ON public.user_statement_history(user_id, shown_date);
CREATE INDEX idx_user_favorite_statements_user ON public.user_favorite_statements(user_id);
