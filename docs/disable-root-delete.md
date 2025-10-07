# Disable Root Delete - Implementation Plan

**Branch:** `disable-root-delete`
**Date:** October 7, 2025

## Overview
Implement safety features to prevent accidental deletion of tasks with subtasks and add confirmation for all task deletions.

## Requirements
1. Hide the delete button for tasks that have children (subtasks)
2. Show a confirmation dialog when deleting tasks without children
3. Ensure user cannot accidentally delete entire task hierarchies

## Current Implementation Analysis

### Files to Modify
- **`src/components/TaskRow.tsx`** (lines 183-191)
  - Currently shows delete button for all tasks on hover
  - Delete action calls `onDelete(task.id)` directly without confirmation
  - Has `hasChildren` variable that checks if task has subtasks

- **`src/components/TimeTrackerApp.tsx`**
  - Passes `deleteTask` function to TaskSidebar
  - May need to handle confirmation dialog at this level

### Available Data
- `task.children` array - indicates if task has subtasks
- `hasChildren` boolean - already computed in TaskRow component (line 37)

## Implementation Plan

### Task List

- [x] **1. Add confirmation dialog component**
  - Create a simple confirmation dialog component (or use native `confirm()`)
  - Dialog should have clear message, Cancel and Delete buttons
  - Dialog should return boolean promise for async handling

- [x] **2. Modify delete button visibility logic in TaskRow**
  - Update line 183-191 in `src/components/TaskRow.tsx`
  - Add conditional rendering: only show delete button when `!hasChildren`
  - Ensure button is completely hidden (not just disabled) for parent tasks

- [x] **3. Add confirmation to delete action**
  - Wrap `onDelete` call with confirmation dialog
  - Show message like "Are you sure you want to delete '[task name]'?"
  - Only proceed with deletion if user confirms

- [x] **4. Test all scenarios**
  - Test delete button is hidden for tasks with children
  - Test delete button appears for tasks without children
  - Test confirmation dialog appears when clicking delete
  - Test canceling the confirmation keeps the task
  - Test confirming the deletion removes the task
  - Test that expanding/collapsing tasks doesn't affect button visibility

- [x] **5. Manual verification**
  - Start the dev server and verify UI changes
  - Test edge cases (single task, nested tasks, empty tasks)
  - Verify hover states work correctly

## Technical Details

### Delete Button Conditional Rendering
```tsx
{/* Only show delete button for tasks without children */}
{!hasChildren && (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => handleDelete()}
    className="w-5 h-5 p-0 hover:bg-red-100 hover:text-red-600"
    title="Delete task"
  >
    <Trash2 className="w-3 h-3" />
  </Button>
)}
```

### Confirmation Handler
```tsx
const handleDelete = () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${task.name}"? This action cannot be undone.`
  );
  if (confirmed) {
    onDelete(task.id);
  }
};
```

## Implementation Notes
- Using native `window.confirm()` for simplicity (no new dependencies needed)
- If a more sophisticated dialog is needed later, can use shadcn/ui dialog component
- The `hasChildren` check ensures we never show delete for parent tasks
- This prevents cascade deletions from the UI level

## Success Criteria
- ✅ Delete button is completely hidden when task has subtasks
- ✅ Delete button visible only for leaf tasks (no children)
- ✅ Confirmation dialog appears before any deletion
- ✅ User can cancel deletion from confirmation dialog
- ✅ User can confirm deletion and task is removed
- ✅ No regression in other task functionality

## Implementation Summary

**Status:** ✅ COMPLETED

### Changes Made
1. Added `handleDelete()` function in `TaskRow.tsx:69-76` that shows confirmation dialog before deletion
2. Modified delete button rendering to conditionally show only when `!hasChildren` (line 193)
3. Updated delete button onClick to use `handleDelete` instead of direct `onDelete` call

### Verification Results
- ✅ Build successful with no TypeScript errors
- ✅ Parent tasks (PRIORIDADES, WORKANA) show NO delete button on hover
- ✅ Child tasks show both "Add subtask" and "Delete task" buttons on hover
- ✅ Confirmation dialog displays with correct task name and warning message
- ✅ Canceling dialog preserves the task (no deletion occurs)

### Files Modified
- `src/components/TaskRow.tsx` - Added confirmation handler and conditional delete button rendering

## Update: Custom Confirmation Dialog

**Date:** October 7, 2025

The implementation has been enhanced with a custom confirmation dialog to replace the native browser `window.confirm()`. See `docs/custom-confirmation-dialog.md` for full details.

### Additional Changes
- `src/components/ui/dialog.tsx` - Added shadcn/ui dialog component
- `src/components/ConfirmDialog.tsx` - Created reusable confirmation dialog
- `src/components/TaskRow.tsx` - Updated to use ConfirmDialog instead of window.confirm()

### Benefits
- ✅ No "localhost:3000 says" browser chrome
- ✅ Professional, theme-aware styling
- ✅ Accessible (keyboard navigation, ARIA)
- ✅ Reusable across the application

## Related Files
- `src/components/TaskRow.tsx` - Main component to modify
- `src/types/index.ts` - Task type definitions
- `src/components/TimeTrackerApp.tsx` - Parent component handling delete

## Notes
- Current branch already exists: `disable-root-delete`
- Git status shows clean working directory
- PostgreSQL storage is being used (recent migration)
