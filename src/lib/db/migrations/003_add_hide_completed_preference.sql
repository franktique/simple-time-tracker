-- Add hide_completed column to user_preferences table
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS hide_completed BOOLEAN NOT NULL DEFAULT false;

-- Update existing default preferences if they exist
UPDATE user_preferences
SET hide_completed = false
WHERE id = 'default' AND hide_completed IS NULL;
