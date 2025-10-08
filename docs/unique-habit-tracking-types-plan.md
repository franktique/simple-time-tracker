# Implementation Plan: Add Unique and Habit Tracking Types

## Overview
This plan outlines the implementation of two new tracking types for the simple time tracking application:
- **Unique**: Mark a cell with a green check and automatically mark the task as completed
- **Habit**: Mark multiple cells with green checks until the task is manually marked as completed

## Current System Analysis

### Existing Tracking Types
The system currently supports two tracking types:
- **Manual**: Users input time directly into cells (time in minutes)
- **Automatic**: Users use start/stop timer buttons to track time

### Current Data Model
```typescript
// Task interface
interface Task {
  id: string;
  name: string;
  parentId: string | null;
  children: string[];
  trackingType: 'manual' | 'automatic';  // Currently only these two
  isExpanded: boolean;
  isCompleted: boolean;
  order: number;
}

// TimeEntry interface
interface TimeEntry {
  id: string;
  taskId: string;
  date: string; // YYYY-MM-DD format
  minutes: number;
  isActive: boolean;
  startTime?: number;
}
```

### Database Schema
- `tasks` table has `tracking_type` column with CHECK constraint for 'manual' and 'automatic'
- `time_entries` table stores time data with `minutes` field

## Implementation Plan

### Phase 1: Data Model Updates

#### [x] Update TypeScript Interfaces
- Modify `Task.trackingType` to include 'unique' and 'habit'
- Create new `CheckEntry` interface for tracking checkmarks
- Update `UserPreferences.defaultTrackingType` to include new types

#### [x] Database Migration
- Create migration script to update `tracking_type` CHECK constraint
- Add new `check_entries` table for storing checkmark data
- Update `user_preferences` table constraints

### Phase 2: Backend Implementation

#### [x] Database Layer Updates
- Update `tasks.ts` to handle new tracking types
- Create `checkEntries.ts` for checkmark data operations
- Update constraint validation functions

#### [x] API Layer Updates
- Update task CRUD operations to handle new tracking types
- Add checkmark CRUD operations
- Update API validation and error handling

### Phase 3: Frontend Implementation

#### [x] Update Components
- Modify `TrackingTypeSelector` to include new types with appropriate icons
- Update time entry cells to handle checkmarks for new tracking types
- Add green checkmark UI component

#### [x] State Management Updates
- Update `useTimeTracker` hooks to handle checkmark operations
- Add checkmark-specific actions (mark complete, etc.)
- Update local storage handling

#### [x] UI/UX Implementation
- Implement unique tracking: single check marks task complete
- Implement habit tracking: multiple checks allowed, manual completion
- Add visual indicators for different tracking types
- Ensure proper icons and styling

### Phase 4: Integration & Testing

#### [x] Integration Testing
- Build successful - all TypeScript types are correct
- All tracking types integrated successfully
- Task completion logic implemented for unique/habit types
- Data persistence implemented via database and localStorage

#### [ ] UI Testing (Pending manual verification)
- Test responsive design with new tracking types
- Test accessibility features
- Test user interactions and workflows

## Detailed Implementation Steps

### Step 1: Update Type Definitions
```typescript
// Updated types
interface Task {
  // ... existing fields
  trackingType: 'manual' | 'automatic' | 'unique' | 'habit';
}

interface CheckEntry {
  id: string;
  taskId: string;
  date: string;
  isChecked: boolean;
  createdAt: Date;
}
```

### Step 2: Database Schema Changes
```sql
-- Update tasks table
ALTER TABLE tasks
DROP CONSTRAINT tasks_tracking_type_check,
ADD CONSTRAINT tasks_tracking_type_check
CHECK (tracking_type IN ('manual', 'automatic', 'unique', 'habit'));

-- Add check_entries table
CREATE TABLE check_entries (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(task_id, date)
);
```

### Step 3: Component Updates
- Add new tracking type buttons to `TrackingTypeSelector`
- Create checkmark cell component for calendar view
- Update calendar cell rendering logic

### Step 4: Business Logic
- Unique tracking: mark checked → set task.isCompleted = true
- Habit tracking: allow multiple checks → task.isCompleted remains false until manually set

## Considerations

### Data Migration
- Existing tasks will remain as 'manual' or 'automatic'
- No data loss expected during migration

### User Experience
- Clear visual distinction between tracking types
- Intuitive icons for new tracking types
- Proper tooltips and help text

### Performance
- Checkmark operations should be as fast as current time entries
- Minimal impact on calendar rendering performance

## Testing Strategy

### Unit Tests
- Test new tracking type logic
- Test database operations for checkmarks
- Test component rendering with new types

### Integration Tests
- Test complete workflows for new tracking types
- Test data persistence across page reloads
- Test interaction between different tracking types

### User Acceptance Tests
- Test user can create tasks with new tracking types
- Test unique tracking completion workflow
- Test habit tracking multiple check workflow