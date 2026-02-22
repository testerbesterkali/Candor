-- Setup pg_cron and pg_net for edge function automation
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- NOTE: Replace 'YOUR_SUPABASE_SERVICE_ROLE_KEY' with your actual service_role key from the Supabase Dashboard
-- URL for your project's edge functions
-- https://sscdqiqhaprpldgevvxc.supabase.co/functions/v1/

-- 1. Nightly Candor Score Updating (Runs at 00:00 every day)
SELECT cron.schedule(
  'nightly-score-update',
  '0 0 * * *',
  $$
    SELECT net.http_post(
        url:='https://sscdqiqhaprpldgevvxc.supabase.co/functions/v1/score-candor',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY"}'::jsonb
    );
  $$
);

-- 2. Weekly Voice Feedback Loop / Drift Check (Runs every Sunday at 02:00)
SELECT cron.schedule(
  'weekly-voice-feedback',
  '0 2 * * 0',
  $$
    SELECT net.http_post(
        url:='https://sscdqiqhaprpldgevvxc.supabase.co/functions/v1/process-feedback-loop',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY"}'::jsonb
    );
  $$
);

-- 3. Hourly ATS Polling / Sync (Runs at minute 0 past every hour)
-- (Assuming an edge function named 'sync-ats' handles this)
-- SELECT cron.schedule(
--   'hourly-ats-sync',
--   '0 * * * *',
--   $$ ... $$
-- );
