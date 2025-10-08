# Hide Completed Tasks Feature Plan

**Branch:** `hide-completed`
**Date:** October 8, 2025

## Overview
Add a checkbox control in the header that allows users to hide completed tasks. A task should be hidden if:
1. It is marked as completed (`isCompleted: true`)
2. It has subtasks AND all of its subtasks are completed

## Implementation Plan

### Phase 1: Add State Management
- [x] Add `hideCompleted` boolean state to `AppState` interface in `src/types/index.ts`
- [x] Add `hideCompleted` to user preferences in localStorage (default: `false`)
- [x] Update `useTimeTracker` hook to manage `hideCompleted` state
- [x] Create action to toggle `hideCompleted` state

### Phase 2: Implement Filtering Logic
- [x] Create helper function `isTaskFullyCompleted(task, tasks)` in `src/utils/taskHelpers.ts`
  - Returns `true` if task is completed
  - Returns `true` if task has children and ALL children are recursively completed
  - Returns `false` otherwise
- [x] Create helper function `shouldHideTask(task, tasks, hideCompleted)` in `src/utils/taskHelpers.ts`
  - Uses `isTaskFullyCompleted` to determine visibility
  - Returns `true` if `hideCompleted` is enabled AND task is fully completed
- [x] Update `getVisibleTasks` function to accept `hideCompleted` parameter
  - Filter tasks using `shouldHideTask` before adding to visible list
  - Maintain proper task hierarchy and ordering

### Phase 3: Update UI Components
- [x] Add checkbox control to `Header` component (`src/components/Header.tsx`)
  - Add checkbox with label "Hide completed tasks"
  - Position next to Export/Import buttons
  - Wire up to `hideCompleted` state
- [x] Update `TimeTrackerApp` component (`src/components/TimeTrackerApp.tsx`)
  - Pass `hideCompleted` state from hook
  - Pass `hideCompleted` to `getVisibleTasks` function
  - Ensure filtered tasks are rendered correctly
- [x] Update `TaskSidebar` component if needed
  - Ensure sidebar reflects the same filtered tasks
  - Maintain alignment between sidebar and time grid

### Phase 4: Testing & Refinement
- [x] Run database migration to add hide_completed column
- [x] Development server started - ready for manual testing
- [ ] Test with tasks that have no subtasks (MANUAL TESTING REQUIRED)
  - Verify completed tasks are hidden when checkbox is checked
  - Verify completed tasks are shown when checkbox is unchecked
- [ ] Test with tasks that have subtasks (MANUAL TESTING REQUIRED)
  - Verify parent task is hidden when all children are completed
  - Verify parent task is visible when at least one child is incomplete
  - Test nested hierarchies (3+ levels deep)
- [ ] Test edge cases (MANUAL TESTING REQUIRED)
  - Empty task list
  - All tasks completed
  - Mixed completed/incomplete tasks
  - Expanding/collapsing tasks while filter is active
- [ ] Verify state persistence (MANUAL TESTING REQUIRED)
  - Test that preference is saved to database
  - Test that preference is loaded on app restart

## Files to Modify

1. **`src/types/index.ts`**
   - Add `hideCompleted` to `UserPreferences` interface

2. **`src/utils/taskHelpers.ts`**
   - Add `isTaskFullyCompleted` helper function
   - Add `shouldHideTask` helper function
   - Update `getVisibleTasks` to support filtering

3. **`src/hooks/useTimeTracker.ts`**
   - Add `hideCompleted` state management
   - Add `toggleHideCompleted` action
   - Persist to localStorage

4. **`src/components/Header.tsx`**
   - Add checkbox control for hide completed
   - Add state and handler props

5. **`src/components/TimeTrackerApp.tsx`**
   - Pass `hideCompleted` to relevant components
   - Update `getVisibleTasks` call with filter parameter

## Technical Notes

### Filtering Logic Details
The `isTaskFullyCompleted` function needs to handle:
- Direct completion: Task's `isCompleted` flag is `true`
- Recursive completion: Task has children AND all children are fully completed
- This requires traversing the task tree recursively

### Performance Considerations
- Filtering happens on every render when task list changes
- Should remain efficient even with 100+ tasks
- Consider memoization if performance issues arise

### UX Considerations
- Checkbox should be clearly visible in header
- State should persist across sessions
- Hiding tasks should not affect data or task completion status
- Users should be able to quickly toggle visibility to verify completions

## Definition of Done
- [x] All implementation tasks are completed
- [x] Database migration applied successfully
- [x] Checkbox control added to header
- [x] State management implemented with persistence
- [x] Filtering logic implemented for tasks and subtasks
- [ ] Manual testing completed (USER TESTING REQUIRED)
- [ ] No visual glitches or alignment issues verified (USER TESTING REQUIRED)
- [ ] Code is tested with various scenarios (USER TESTING REQUIRED)

## Implementation Summary

### What Was Done:
1. ✅ Added `hideCompleted` boolean to `UserPreferences` type
2. ✅ Created database migration (003_add_hide_completed_preference.sql)
3. ✅ Updated database layer to handle the new preference
4. ✅ Implemented filtering helper functions:
   - `isTaskFullyCompleted()` - recursively checks if task/subtasks are all completed
   - `shouldHideTask()` - determines if a task should be hidden
5. ✅ Updated `getVisibleTasks()` to support filtering
6. ✅ Added checkbox control to Header component
7. ✅ Wired up state management in `useTimeTracker` hook
8. ✅ Updated all relevant components to pass and use `hideCompleted` state

### How It Works:
- Checkbox in the header toggles the `hideCompleted` preference
- Preference is saved to PostgreSQL database and persists across sessions
- When enabled, tasks are filtered using the following logic:
  - Leaf tasks (no children): Hidden if `isCompleted` is true
  - Parent tasks: Hidden if ALL children are recursively completed
- Filtering is applied consistently in both the sidebar and time grid
- Task alignment is maintained between sidebar and grid

### Testing Instructions:
1. Open http://localhost:3002
2. Check the "Hide completed" checkbox in the header
3. Verify completed tasks disappear from both sidebar and time grid
4. Verify parent tasks with all completed children also disappear
5. Verify parent tasks remain visible if at least one child is incomplete
6. Uncheck the box and verify all tasks reappear
7. Refresh the page and verify the preference persists
