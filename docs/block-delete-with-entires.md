# Block Delete Button for Tasks with Entries

## Overview

Implement a feature to disable the delete button for tasks that have time entries, and display a tooltip explaining why deletion is blocked.

## Branch

`block-delete-with-entires`

## Current Behavior

- All leaf tasks (tasks without children) can be deleted regardless of whether they have time entries
- The delete button is visible and clickable on all leaf tasks
- Deleting a task with entries would result in orphaned time entries

## Desired Behavior

- Tasks with time entries should have a disabled delete button
- A tooltip should appear on hover explaining: "Cannot delete task with time entries"
- Tasks without time entries can still be deleted normally
- Visual indication (e.g., opacity, cursor) should show the button is disabled

## Technical Analysis

### Files to Modify

1. **`src/components/TaskRow.tsx`** (Lines 225-236)

   - Current delete button implementation
   - Need to add disabled state based on `hasTaskTimeEntries()`
   - Add tooltip component for disabled state

2. **`src/utils/taskHelpers.ts`** (Lines 66-68)
   - `hasTaskTimeEntries()` function already exists
   - Can be reused for the disabled logic

### Components Involved

- **TaskRow** - Main component containing the delete button
- Potentially create or use a **Tooltip** component for the hover explanation

## Implementation Plan

### Step 1: Research Tooltip Options

- [x] Check if a Tooltip component already exists in the codebase
- [x] Determine if we need to install a tooltip library (e.g., Radix UI Tooltip) or create a custom one
- [x] Review existing UI patterns in the codebase for consistency

### Step 2: Create/Install Tooltip Component

- [x] If needed, install tooltip dependency (e.g., `@radix-ui/react-tooltip`)
- [x] Create `src/components/ui/tooltip.tsx` with proper styling
- [x] Ensure tooltip matches the app's design system (colors, spacing, animations)

### Step 3: Update TaskRow Component

- [x] Import `hasTaskTimeEntries` from `@/utils/taskHelpers`
- [x] Calculate whether task has entries: `const hasEntries = hasTaskTimeEntries(task.id, timeEntries)`
- [x] Update delete button to have disabled state when `hasEntries` is true
- [x] Add conditional styling for disabled state (opacity, cursor)
- [x] Wrap delete button with Tooltip component
- [x] Set tooltip message: "Cannot delete task with time entries"
- [x] Ensure tooltip only shows when button is disabled

### Step 4: Style the Disabled Button

- [x] Add appropriate disabled styles (e.g., `opacity-50`, `cursor-not-allowed`)
- [x] Ensure hover effects don't apply when disabled
- [x] Keep consistent with existing button styling in the app

### Step 5: Testing

- dont perform any automatic test, I'll do it manually

### Step 6: Edge Cases

- [ ] Verify behavior when all entries for a task are deleted (button should become enabled)
- [ ] Test with completed vs incomplete tasks
- [ ] Ensure proper behavior in different theme modes (light/dark)

## Technical Details

### Expected Code Changes

**TaskRow.tsx** (approximate location: lines 225-236):

```tsx
// Calculate if task has entries
const hasEntries = hasTaskTimeEntries(task.id, timeEntries);

// In the JSX:
<Tooltip
  content={hasEntries ? "Cannot delete task with time entries" : undefined}
>
  <Button
    variant="ghost"
    size="icon"
    onClick={handleDelete}
    disabled={hasEntries}
    className={`w-5 h-5 p-0 ${
      hasEntries
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-red-100 hover:text-red-600"
    }`}
    title={hasEntries ? undefined : "Delete task"}
  >
    <Trash2 className="w-3 h-3" />
  </Button>
</Tooltip>;
```

### Dependencies to Check

- Existing UI components in `src/components/ui/`
- Current tooltip patterns (if any)
- Radix UI or other UI library usage

## User Experience Considerations

1. **Visual Feedback**: Disabled button should be visually distinct
2. **Tooltip Timing**: Should appear quickly on hover for good UX
3. **Clear Messaging**: Tooltip text should be concise and helpful
4. **Consistency**: Should match existing disabled button patterns in the app

## Acceptance Criteria

- [ ] Delete button is disabled when task has time entries
- [ ] Tooltip appears on hover showing "Cannot delete task with time entries"
- [ ] Delete button remains enabled and functional for tasks without entries
- [ ] Disabled button has appropriate visual styling
- [ ] No console errors or warnings
- [ ] Behavior works across all task tracking types
- [ ] Accessible via keyboard navigation

## Notes

- The `hasTaskTimeEntries()` utility function already exists and can be reused
- This feature aligns with the existing pattern of preventing deletion of tasks with children
- Consider if the same logic should apply to the delete confirmation dialog
