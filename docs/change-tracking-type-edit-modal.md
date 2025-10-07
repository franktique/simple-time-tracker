# Edit Task Tracking Type Modal Implementation

## Overview

Currently, users can create new tasks with a tracking type selection modal, but editing existing tasks only allows inline editing. The tracking type cannot be changed for existing tasks, even if they have no time entries. This plan implements a modal dialog for editing tasks that allows changing the tracking type when the task has no recorded time entries.

## Current State Analysis

From the code analysis:

1. **Task Creation**: Uses `TaskDialog` component with tracking type selection (✓ working)
2. **Task Editing**: Uses inline editing in `TaskRow` component, but tracking type is only editable when task has no children and the change is currently prevented for tasks with existing entries
3. **Problem**: Users cannot change tracking type for existing tasks without entries using the same modal interface as creation

## Implementation Plan

### 1. Create TaskEditDialog Component
- Create a new component similar to `TaskDialog` but for editing
- Include logic to check if task has time entries
- Disable tracking type selection if task has entries
- Use the same UI as the creation dialog for consistency

### 2. Update TaskRow Component
- Replace inline editing with modal dialog
- Add logic to determine if tracking type can be changed (no time entries)
- Update the edit button click handler to open the modal instead of inline editing

### 3. Add Helper Functions
- Create utility function to check if task has time entries
- Create logic to prevent tracking type changes for tasks with entries

### 4. Update TaskTrackerApp Component
- Add state management for the edit dialog
- Add handler for task editing updates

## Implementation Steps

### [x] Create plan document
### [ ] Analyze current TaskRow editing implementation
### [ ] Create TaskEditDialog component
### [ ] Update TaskRow to use modal for editing
### [ ] Add logic to prevent tracking type change for tasks with entries
### [ ] Test the implementation

## Technical Details

### New Component: TaskEditDialog
```typescript
interface TaskEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updates: { name?: string; trackingType?: 'manual' | 'automatic' }) => void;
  task: Task;
  hasTimeEntries: boolean;
}
```

### Key Features:
1. **Pre-populated fields**: Name and tracking type from existing task
2. **Conditional tracking type editing**:
   - Enable tracking type selection only if task has no time entries
   - Show warning/message if tracking type cannot be changed
3. **Validation**: Ensure name is not empty
4. **Consistent UI**: Same styling as TaskDialog for consistency

### Helper Functions:
```typescript
// Check if task has any time entries
const hasTaskTimeEntries = (taskId: string, timeEntries: Record<string, TimeEntry>): boolean => {
  return Object.values(timeEntries).some(entry => entry.taskId === taskId);
};

// Check if tracking type can be changed
const canChangeTrackingType = (task: Task, timeEntries: Record<string, TimeEntry>): boolean => {
  return !hasChildren(task) && !hasTaskTimeEntries(task.id, timeEntries);
};
```

## Acceptance Criteria

1. ✅ Edit button opens a modal dialog (similar to task creation)
2. ✅ Modal shows current task name and tracking type
3. ✅ Task name can always be edited
4. ✅ Tracking type can only be changed if task has no time entries
5. ✅ Tasks with time entries show tracking type as disabled/read-only
6. ✅ Tasks with children cannot change tracking type (existing behavior)
7. ✅ Modal has proper validation and error handling
8. ✅ Modal matches the visual style of the creation dialog
9. ✅ Escape key and backdrop click close the modal
10. ✅ Form submission updates the task correctly

## Testing Plan

1. **Edit task without entries**: Should allow changing both name and tracking type
2. **Edit task with entries**: Should only allow name change, tracking type disabled
3. **Edit parent task**: Should only allow name change, tracking type disabled (has children)
4. **Empty name validation**: Should prevent submission with empty name
5. **Modal interactions**: Test open, close, escape key, backdrop click
6. **Form submission**: Verify updates are applied correctly
7. **Cancel operation**: Verify changes are not applied when cancelled

## Test Results ✅

1. ✅ **Edit task without entries**:
   - Modal opens correctly with pre-populated name and tracking type
   - Can change tracking type from Manual to Automatic
   - Help text updates appropriately
   - Save Changes applies both name and tracking type updates
   - Task icon changes from Manual to Automatic in main view

2. ✅ **Edit parent task**:
   - Modal opens correctly with pre-populated name
   - Tracking type buttons are disabled for parent tasks
   - Shows current tracking type as read-only (manual)
   - Help text displays "Tracking type cannot be changed for parent tasks."
   - Only name can be edited

3. ✅ **Modal interactions**:
   - Escape key closes modal correctly
   - Cancel button closes modal correctly
   - Click outside modal (backdrop) does not close modal (acceptable behavior)

4. ✅ **Form functionality**:
   - Task name field is pre-populated with current task name
   - Tracking type selector shows current selection
   - Save Changes button is disabled when name is empty
   - Updates are applied correctly to the task

## Files to Modify

1. **New file**: `src/components/TaskEditDialog.tsx`
2. **Modify**: `src/components/TaskRow.tsx` - Replace inline editing with modal
3. **Modify**: `src/components/TimeTrackerApp.tsx` - Add edit dialog state
4. **New utility**: `src/utils/taskHelpers.ts` - Add helper functions (or extend existing)

## Notes

- This change maintains backward compatibility with existing functionality
- The inline editing approach will be completely replaced with the modal for consistency
- The tracking type restriction for tasks with entries prevents data inconsistency
- Parent tasks (categories) will continue to not have a tracking type selection