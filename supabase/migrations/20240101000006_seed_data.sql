
-- 6. Seed Data for Journeys, Challenges, Mentors, Learners

-- We cannot easily seed auth.users in raw SQL without hashing passwords, 
-- so we'll assume the frontend signs up these accounts, 
-- or we provide mock UUIDs for demonstration.

-- Because we can't safely INSERT into auth.users here, we'll create a table 
-- just for predefined journey templates and challenges, and let the app handle the rest.

CREATE TABLE public.journey_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_days INTEGER NOT NULL
);

INSERT INTO public.journey_templates (title, description, duration_days) VALUES
('AI Internship Portfolio Sprint', 'Build an AI-powered portfolio in 14 days', 14),
('Full-Stack Job Ready Sprint', 'Master full-stack development and ace interviews', 30),
('Data Analyst Sprint', 'Learn SQL, Python, and Tableau for data roles', 21);

CREATE TABLE public.challenge_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES public.journey_templates(id),
    day INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

-- Seed challenges for AI Internship (10 templates)
WITH ai_journey AS (SELECT id FROM public.journey_templates WHERE title = 'AI Internship Portfolio Sprint' LIMIT 1)
INSERT INTO public.challenge_templates (journey_id, day, title, description) VALUES
((SELECT id FROM ai_journey), 1, 'Setup OpenAI API Key & Environment', 'Initialize your project and verify API access.'),
((SELECT id FROM ai_journey), 2, 'Build a CLI Chatbot', 'Create a simple terminal-based assistant.'),
((SELECT id FROM ai_journey), 3, 'Implement RAG Pipeline', 'Read a text file and use embeddings to search it.'),
((SELECT id FROM ai_journey), 4, 'Create a Web UI for Chatbot', 'Use Next.js or React to wrap your CLI bot.'),
((SELECT id FROM ai_journey), 5, 'Add Authentication', 'Protect your AI app with user logins.'),
((SELECT id FROM ai_journey), 6, 'Handle Streaming Responses', 'Stream tokens from the LLM for better UX.'),
((SELECT id FROM ai_journey), 7, 'Implement Tool Calling', 'Let your agent fetch the current weather.'),
((SELECT id FROM ai_journey), 8, 'Deploy to Vercel/Cloud Run', 'Get your app live on the internet.'),
((SELECT id FROM ai_journey), 9, 'Write Unit Tests for AI Logic', 'Ensure your prompts return expected JSON formats.'),
((SELECT id FROM ai_journey), 10, 'Submit Portfolio & Record Demo', 'Record a 2-min Loom video demonstrating your project.');

