-- Add date column to active_timers table
ALTER TABLE active_timers ADD COLUMN IF NOT EXISTS date DATE;

-- Since we're changing the structure, we need to update the primary key
-- First, drop the existing primary key constraint
ALTER TABLE active_timers DROP CONSTRAINT IF EXISTS active_timers_pkey;

-- Add composite primary key on task_id and date
ALTER TABLE active_timers ADD PRIMARY KEY (task_id, date);

-- Create index for querying by task_id alone
CREATE INDEX IF NOT EXISTS idx_active_timers_task_id ON active_timers(task_id);
