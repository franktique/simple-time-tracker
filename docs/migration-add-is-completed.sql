-- Add is_completed column to tasks table
ALTER TABLE tasks ADD COLUMN is_completed BOOLEAN DEFAULT FALSE NOT NULL;

-- Add comment to describe the new column
COMMENT ON COLUMN tasks.is_completed IS 'Indicates whether the task has been completed';