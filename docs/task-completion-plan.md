# Task Completion Feature Implementation Plan

## Overview
Add a task completion state that allows users to mark tasks as completed through a modal confirmation dialog. Completed tasks will display with a strikethrough style.

## Current Analysis
- The app uses Next.js 15, TypeScript, and Tailwind CSS
- Tasks are stored in a PostgreSQL database with the following structure:
  - `tasks` table: id, name, parent_id, tracking_type, is_expanded, order, created_at, updated_at
- Task interface in `src/types/index.ts` currently has: id, name, parentId, children, trackingType, isExpanded, order
- UI components include TaskRow, TaskTimeRow, and various dialog components
- Already has ConfirmDialog component that can be reused

## Implementation Steps

### 1. Database Schema Updates ✅
- [x] Add `is_completed` boolean column to the `tasks` table
- [x] Create database migration script
- [x] Update the DbTask interface in `src/lib/db/tasks.ts`

### 2. TypeScript Interface Updates ✅
- [x] Add `isCompleted: boolean` field to the Task interface in `src/types/index.ts`
- [x] Ensure the field defaults to `false`

### 3. Database Layer Updates ✅
- [x] Update `dbTaskToTask` function to include the isCompleted field
- [x] Modify `createTask` function to handle isCompleted parameter
- [x] Modify `updateTask` function to handle isCompleted updates
- [x] Update all database queries to select the new column

### 4. API Layer Updates ✅
- [x] Update `src/app/api/tasks/route.ts` POST endpoint to handle isCompleted
- [x] Update `src/app/api/tasks/[id]/route.ts` PUT endpoint to handle isCompleted
- [x] Ensure the field is included in all task responses

### 5. UI Components - TaskCompletionDialog ✅
- [x] Create `src/components/TaskCompletionDialog.tsx` component
- [x] Reuse the existing Dialog components from `src/components/ui/dialog.tsx`
- [x] Add dynamic confirmation message based on completion state
- [x] Support both "Mark as Completed" and "Mark as Incomplete" actions
- [x] Add appropriate icons and colors for each action type

### 6. UI Components - TaskRow Updates ✅
- [x] Add completion icon (checkmark) for incomplete tasks
- [x] Add revert icon (rotate-ccw) for completed tasks
- [x] Icons only show for leaf tasks (tasks without children)
- [x] Add strikethrough styling for completed task names
- [x] Add hover effects for both completion and revert icons
- [x] Integrate the TaskCompletionDialog with dynamic state handling

### 7. State Management Updates ✅
- [x] Update `src/hooks/useTimeTracker.ts` to handle task completion
- [x] Add `onToggleComplete` callback function
- [x] Update localStorage hooks to persist completion state

### 8. Main App Integration ✅
- [x] Update `src/components/TimeTrackerApp.tsx` to pass completion handler
- [x] Update `src/components/TaskSidebar.tsx` to handle completion state
- [x] Ensure proper re-rendering when completion state changes

### 9. Styling Updates ✅
- [x] Add CSS classes for strikethrough text in completed tasks
- [x] Add appropriate opacity/reduced styling for completed tasks
- [x] Ensure completion state is visible in both light and dark themes

### 10. Testing and Validation ✅
- [x] Test completion flow from click to confirmation to state update
- [x] Test revert/uncomplete flow with confirmation dialog
- [x] Verify strikethrough styling appears/disappears correctly
- [x] Test persistence across page refreshes
- [x] Test that parent tasks cannot be completed (only leaf tasks)
- [x] Verify both completion and revert buttons show appropriately
- [x] Verify existing functionality remains intact

## Technical Considerations

### Database Migration
```sql
ALTER TABLE tasks ADD COLUMN is_completed BOOLEAN DEFAULT FALSE NOT NULL;
```

### Component Structure
The TaskCompletionDialog will:
- Use the existing Dialog components
- Accept `isOpen`, `onClose`, `onConfirm`, and `task` props
- Show a confirmation message with the task name
- Include validation to prevent accidental completion

### TaskRow Modifications
- Add checkmark icon from lucide-react
- Conditionally show strikethrough styling based on `task.isCompleted`
- Add the completion icon to the action buttons section
- Handle completion state changes

### State Flow
1. User clicks completion icon in TaskRow
2. TaskCompletionDialog opens
3. User confirms completion
4. API call updates task in database
5. Local state updates
6. UI re-renders with strikethrough styling

## Files to Modify

### New Files
- `docs/task-completion-plan.md` (this file)
- `src/components/TaskCompletionDialog.tsx`

### Modified Files
- `src/types/index.ts` - Add isCompleted to Task interface
- `src/lib/db/tasks.ts` - Update database functions
- `src/app/api/tasks/route.ts` - Update POST endpoint
- `src/app/api/tasks/[id]/route.ts` - Update PUT endpoint
- `src/components/TaskRow.tsx` - Add completion UI
- `src/hooks/useTimeTracker.ts` - Add completion handler
- `src/components/TimeTrackerApp.tsx` - Integrate completion
- `src/components/TaskSidebar.tsx` - Pass completion handler

## Success Criteria
- [ ] Users can click an icon to mark tasks as completed
- [ ] Modal confirmation prevents accidental completion
- [ ] Completed tasks show with strikethrough text
- [ ] Completion state persists in database
- [ ] Only leaf tasks (without children) can be completed
- [ ] Existing functionality remains unchanged
- [ ] Feature works in both light and dark themes