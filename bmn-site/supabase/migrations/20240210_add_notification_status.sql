
-- Migration to add notification_status for tracking email history
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notification_status jsonb DEFAULT '{}'::jsonb;

-- Comment on column
COMMENT ON COLUMN profiles.notification_status IS 'Tracks sent emails: { welcome: boolean, l1: boolean, l2: boolean, l3_count: number }';
