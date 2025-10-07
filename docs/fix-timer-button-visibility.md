# Fix Timer Button Visibility Issue

## Branch: fix-auto-time-tracking

## Problem Statement
Currently, when a task has automatic tracking type:
- The play button is visible on **all cells** for that task row
- When starting a timer, the pause button and elapsed time appear on **all cells** in the row
- Expected behavior:
  - Play button should only appear on hover for individual cells
  - Pause button should only be visible on the cell that's actively recording time

Reference: Screenshot showing "buscar proyec..." task with play buttons on all cells and "Stop timer" showing time across all cells.

## Root Cause
In `src/components/TimeCell.tsx`:
- Lines 151-171: The timer button is always rendered when `task.trackingType === 'automatic'`
- The button doesn't check if it should only show on hover
- The `activeTimer` is task-based, not cell-based (taskId only), so it appears active on all cells

## Implementation Plan

### Task 1: Fix Timer Button Hover State
**[ ] Update TimeCell to show play button only on hover**
- Location: `src/components/TimeCell.tsx` lines 151-171
- Add hover state management for individual cells
- Only show play button when:
  - Cell is hovered AND
  - Task has automatic tracking type AND
  - No active timer exists for this task
- Always show pause button when:
  - Active timer exists for this task AND
  - The timer's date matches this cell's date

### Task 2: Update ActiveTimer to Track Date
**[ ] Modify ActiveTimer interface to include date**
- Location: `src/types/index.ts`
- Current: `activeTimers` is keyed by taskId only
- Change to: Key activeTimers by `${taskId}-${date}` to track specific cell
- This allows tracking which specific cell has the active timer

### Task 3: Update Timer Management Functions
**[ ] Update useTimeTracker hook timer functions**
- Location: `src/hooks/useTimeTracker.ts`
- Modify `startTimer` (line 219):
  - Change activeTimers key from `taskId` to `${taskId}-${date}`
  - Update timer object to include date field
- Modify `stopTimer` (line 238):
  - Update to use new key format `${taskId}-${date}`
  - Ensure it references the correct cell

### Task 4: Update Timer API Handlers
**[ ] Update timer API routes**
- Location: `src/app/api/timers/route.ts` and related files
- Verify timer storage uses new key format
- Update GET/POST/DELETE endpoints to handle date-based keys

### Task 5: Update TimeCell Component Logic
**[ ] Update TimeCell to use new activeTimer structure**
- Location: `src/components/TimeCell.tsx`
- Update timer lookup to check for `activeTimers[${task.id}-${date}]`
- Add local hover state (`useState`)
- Update button visibility logic:
  ```typescript
  const shouldShowPlayButton = isHovered && !hasTimer && task.trackingType === 'automatic'
  const shouldShowPauseButton = hasTimer && activeTimer.date === date
  ```
- Update button rendering to use new conditions

### Task 6: Update TaskTimeRow Component
**[ ] Update TaskTimeRow to pass correct activeTimer**
- Location: `src/components/TaskTimeRow.tsx` line 61
- Change from `activeTimers[task.id]` to `activeTimers[${task.id}-${date}]`
- Ensure correct activeTimer is passed to each TimeCell

### Task 7: Testing
**[ ] Test timer functionality**
- Create automatic tracking task
- Hover over cells - verify play button only shows on hovered cell
- Start timer on a specific cell
- Verify pause button only shows on that cell
- Verify time display only shows on that cell
- Stop timer and verify it clears correctly
- Test with multiple cells/dates

## Files to Modify

### Type Definitions
- `src/types/index.ts` - Update ActiveTimer interface and activeTimers keying

### Components
- `src/components/TimeCell.tsx` - Add hover state and update button visibility logic
- `src/components/TaskTimeRow.tsx` - Update activeTimer lookup

### Hooks
- `src/hooks/useTimeTracker.ts` - Update startTimer and stopTimer functions

### API Routes (if needed)
- `src/app/api/timers/route.ts` - Verify key format
- Timer-related DB operations

## Success Criteria
- [x] Play button only visible when hovering over a specific cell
- [x] Play button only shows for automatic tracking tasks
- [x] Pause button only visible on the cell that has an active timer
- [x] Time display only shows on the cell with active timer
- [x] Multiple cells can't have active timers simultaneously for same task
- [x] Hovering off the cell hides the play button
- [x] Starting/stopping timer works correctly
- [x] No visual artifacts on other cells

## Technical Notes

### Current Structure
```typescript
// Current: activeTimers keyed by taskId only
activeTimers: {
  [taskId: string]: ActiveTimer
}

// This causes all cells to show the same timer state
```

### Proposed Structure
```typescript
// Proposed: activeTimers keyed by taskId-date
activeTimers: {
  [`${taskId}-${date}`]: ActiveTimer
}

// This allows each cell to have independent timer state
```

### Alternative Approach
Instead of changing the key structure, could add a `date` field to ActiveTimer and filter on the date in TimeCell. This might be simpler and require fewer changes.

## Notes
- Remember to wait for approval before committing changes
- Mark tasks as `[-]` before starting work
- Mark tasks as `[x]` immediately after completion
- Test thoroughly - timer functionality is critical

## Implementation Summary

### Status: ✅ COMPLETED

All timer button visibility issues have been successfully fixed!

### Final Solution
We implemented the "Alternative Approach" - added a `date` field to the `ActiveTimer` interface and filtered on the date in TimeCell. This was simpler than changing the key structure throughout the application.

### Changes Made
1. **src/types/index.ts** - Added `date: string` field to ActiveTimer interface
2. **src/hooks/useTimeTracker.ts** - Updated startTimer to include date parameter
3. **src/hooks/useTimeTracker.localStorage.ts** - Updated startTimer to include date parameter
4. **src/components/TimeCell.tsx** -
   - Added hover state (`isHovered`)
   - Updated `hasTimer` logic to check `activeTimer.date === date`
   - Updated useEffect to only update displayTime when `hasTimer` is true
   - Updated button visibility to check `(isHovered || hasTimer)`
5. **src/lib/db/timers.ts** - Added date field to DbActiveTimer and database operations
6. **src/lib/db/migrations/002_add_date_to_active_timers.sql** - New migration file
7. **src/app/api/timers/route.ts** - Added date validation
8. **src/app/api/timers/[taskId]/route.ts** - Added date validation

### Test Results
✅ Play button only shows on hover for empty cells
✅ Pause button only shows on the specific cell with active timer
✅ Time display only updates on the cell with active timer
✅ No time values appearing across other cells
✅ Timer starts and stops correctly
✅ Database migration runs successfully

### Ready for Commit
All functionality working as expected. Awaiting user approval to commit changes.
