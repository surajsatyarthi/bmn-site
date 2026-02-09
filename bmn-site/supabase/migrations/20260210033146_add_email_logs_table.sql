-- Create email_logs table for webhook tracking
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  from_address TEXT,
  bounce_type TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX idx_email_logs_email_id ON email_logs(email_id);
CREATE INDEX idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX idx_email_logs_event_type ON email_logs(event_type);

-- Add email tracking columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_deliverable BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_email_error TEXT,
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT TRUE;
