-- Update bizsynth@gmail.com to pro tier
UPDATE users
SET
  tier = 'pro',
  daily_limit = 999999,
  updated_at = NOW()
WHERE email = 'bizsynth@gmail.com';

-- Verify the update
SELECT id, email, tier, daily_limit, daily_usage, total_processed, created_at, updated_at
FROM users
WHERE email = 'bizsynth@gmail.com';
