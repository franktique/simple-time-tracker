-- Migration 002: Add Unique and Habit tracking types with check entries

-- Update tasks table tracking_type constraint
ALTER TABLE tasks
DROP CONSTRAINT IF EXISTS tasks_tracking_type_check,
ADD CONSTRAINT tasks_tracking_type_check
CHECK (tracking_type IN ('manual', 'automatic', 'unique', 'habit'));

-- Create check_entries table for tracking checkmarks
CREATE TABLE IF NOT EXISTS check_entries (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, date)
);

-- Create indexes for check entries
CREATE INDEX IF NOT EXISTS idx_check_entries_task_id ON check_entries(task_id);
CREATE INDEX IF NOT EXISTS idx_check_entries_date ON check_entries(date);
CREATE INDEX IF NOT EXISTS idx_check_entries_task_date ON check_entries(task_id, date);

-- Update user_preferences table default_tracking_type constraint
ALTER TABLE user_preferences
DROP CONSTRAINT IF EXISTS user_preferences_default_tracking_type_check,
ADD CONSTRAINT user_preferences_default_tracking_type_check
CHECK (default_tracking_type IN ('manual', 'automatic', 'unique', 'habit'));

-- Create trigger for check_entries updated_at
CREATE TRIGGER update_check_entries_updated_at BEFORE UPDATE ON check_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();