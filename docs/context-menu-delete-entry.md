# Context Menu for Time Entry Deletion

## Feature Description
Implement a right-click context menu on time tracking cells that allows users to delete individual time entries for a specific task/date combination with confirmation.

## Branch Name
`feature/context-menu-delete-entry`

## Technical Analysis

### Current Architecture
- **TimeCell Component** (`src/components/TimeCell.tsx`): Handles cell interactions, editing, and timer display
- **useTimeTracker Hook** (`src/hooks/useTimeTracker.ts`): Contains `updateTimeEntry` function that can delete entries (when minutes <= 0)
- **Data Model**: Time entries are identified by `${taskId}-${date}` format
- **Existing Dialog**: `ConfirmDialog` component exists for confirmations

### Key Implementation Areas
1. **TimeCell.tsx**: Add right-click handler and context menu
2. **New Component**: Create `ContextMenu` component for reusability
3. **Delete Logic**: Use existing `updateTimeEntry(taskId, date, 0)` to delete
4. **Confirmation**: Use existing `ConfirmDialog` or create inline confirmation

## Implementation Plan

### Task Breakdown

- [ ] **Step 1: Create ContextMenu Component**
  - Create a new reusable `ContextMenu.tsx` component in `src/components/ui/`
  - Support positioning based on mouse coordinates
  - Handle click outside to close
  - Support customizable menu items
  - Add proper TypeScript types

- [ ] **Step 2: Add Context Menu to TimeCell**
  - Add `onContextMenu` event handler to TimeCell component
  - Prevent default browser context menu
  - Show context menu only when cell has time entry data (timeEntry exists)
  - Position menu at cursor location
  - Include "Delete Entry" option

- [ ] **Step 3: Implement Delete Confirmation**
  - Use existing `ConfirmDialog` component
  - Add state management for confirmation dialog in TimeCell
  - Set appropriate confirmation message (e.g., "Delete {time} for {task} on {date}?")
  - Wire up confirmation to delete action

- [ ] **Step 4: Wire Delete Action**
  - On confirmation, call `onUpdateTime(taskId, date, 0)` to delete entry
  - Ensure context menu closes after action
  - Add visual feedback during deletion

- [ ] **Step 5: Handle Edge Cases**
  - Ensure context menu only appears on leaf tasks (not parent tasks)
  - Ensure context menu only appears for current month cells
  - Don't show context menu when timer is active for that cell
  - Properly handle click outside to close menu
  - Ensure proper cleanup on component unmount

- [ ] **Step 6: Add Styling and Polish**
  - Match existing design system (CSS variables)
  - Add hover states for menu items
  - Add smooth transitions/animations
  - Ensure proper z-index layering
  - Test in both light and dark modes

- [ ] **Step 7: Testing**
  - Test right-click on cells with time entries
  - Test right-click on empty cells (should not show menu)
  - Test delete confirmation flow
  - Test click outside to close
  - Test with both manual and automatic tracking tasks
  - Test that deletion updates the UI correctly
  - Test edge cases (parent tasks, other month cells, active timers)

## Technical Decisions

### Context Menu Component API
```typescript
interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    danger?: boolean; // For delete actions
  }>;
}
```

### TimeCell State Additions
```typescript
const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
```

### Delete Function Flow
1. User right-clicks on cell with time entry
2. Context menu appears at cursor
3. User clicks "Delete Entry"
4. Confirmation dialog appears
5. User confirms
6. Call `onUpdateTime(taskId, date, 0)` (sets minutes to 0, which triggers deletion in the hook)
7. UI updates automatically through state management

## Files to Create
- `src/components/ui/ContextMenu.tsx` - Reusable context menu component

## Files to Modify
- `src/components/TimeCell.tsx` - Add context menu functionality
- Potentially add types to `src/types/index.ts` if needed

## Dependencies
- No new dependencies required
- Use existing `ConfirmDialog` component
- Use existing state management via `useTimeTracker` hook

## Testing Checklist
- [ ] Right-click shows context menu on cells with data
- [ ] Right-click does NOT show menu on empty cells
- [ ] Right-click does NOT show menu on parent task cells
- [ ] Right-click does NOT show menu on other month cells
- [ ] Right-click does NOT show menu when timer is active
- [ ] Delete confirmation dialog shows with correct information
- [ ] Delete confirmation "Cancel" closes dialog without deleting
- [ ] Delete confirmation "Delete" removes the entry
- [ ] UI updates immediately after deletion
- [ ] Click outside context menu closes it
- [ ] ESC key closes context menu (if implemented)
- [ ] Styling matches existing design system
- [ ] Works in both light and dark mode

## Notes
- Keep the implementation simple and focused
- Reuse existing components where possible
- Maintain consistency with existing UI patterns
- Ensure accessibility (keyboard navigation if time permits)
- The delete operation uses the existing `updateTimeEntry` function by setting minutes to 0
