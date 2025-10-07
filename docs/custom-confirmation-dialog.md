# Custom Confirmation Dialog - Implementation Plan

**Branch:** `disable-root-delete`
**Date:** October 7, 2025

## Overview
Replace the native browser `window.confirm()` dialog (which shows "localhost:3000 says") with a custom, styled confirmation modal that provides a better user experience.

## Problem
The current implementation uses `window.confirm()` which:
- Displays "localhost:3000 says" in the dialog header
- Uses browser default styling (not customizable)
- Looks less professional and integrated with the app
- Cannot be styled to match the application theme

## Solution
Create a custom confirmation dialog component using React that:
- Has a clean, professional appearance
- Matches the application's design system
- Supports light/dark theme
- Shows only the relevant information without browser chrome
- Can be reused throughout the application

## Current Implementation
**File:** `src/components/TaskRow.tsx` (lines 69-76)
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

## Implementation Plan

### Task List

- [x] **1. Add shadcn/ui dialog component**
  - Use shadcn CLI to add the dialog component
  - This will add: Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
  - Component will be added to `src/components/ui/dialog.tsx`

- [x] **2. Create ConfirmDialog component**
  - Create new file: `src/components/ConfirmDialog.tsx`
  - Component should accept: title, message, onConfirm, onCancel, isOpen
  - Use red/destructive styling for delete actions
  - Include Cancel and Delete buttons with appropriate styling

- [x] **3. Add dialog state management to TaskRow**
  - Add state for dialog visibility: `const [showDeleteDialog, setShowDeleteDialog] = useState(false)`
  - Update handleDelete to open dialog instead of window.confirm
  - Add handleConfirmDelete to execute deletion and close dialog

- [x] **4. Integrate ConfirmDialog into TaskRow**
  - Import ConfirmDialog component
  - Render ConfirmDialog at end of component
  - Pass appropriate props (isOpen, task name, handlers)
  - Wire up onConfirm to call onDelete
  - Wire up onCancel to close dialog

- [x] **5. Test the implementation**
  - Test dialog opens when clicking delete
  - Test dialog closes when clicking Cancel
  - Test task is deleted when clicking Delete/Confirm
  - Test dialog styling matches app theme
  - Test dialog works for different tasks
  - Test ESC key closes dialog

- [x] **6. Build and verify**
  - Run build to check for TypeScript errors
  - Start dev server and manually test all scenarios
  - Verify no "localhost:3000 says" message appears
  - Verify dialog looks professional and matches app design

## Technical Details

### shadcn/ui Dialog Component
We'll use shadcn/ui's Dialog component which provides:
- Accessible dialog with proper ARIA attributes
- Built-in overlay/backdrop
- Keyboard navigation support (ESC to close)
- Focus management
- Portal rendering (appears above all content)

### Component Structure
```tsx
<ConfirmDialog
  isOpen={showDeleteDialog}
  title="Delete Task"
  message={`Are you sure you want to delete "${task.name}"? This action cannot be undone.`}
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleConfirmDelete}
  onCancel={() => setShowDeleteDialog(false)}
  variant="destructive"
/>
```

### Updated handleDelete Function
```tsx
const handleDelete = () => {
  setShowDeleteDialog(true);
};

const handleConfirmDelete = () => {
  onDelete(task.id);
  setShowDeleteDialog(false);
};
```

## Implementation Notes
- Using shadcn/ui for consistency with existing UI components
- Dialog will be portal-rendered to avoid z-index issues
- Red/destructive styling emphasizes the dangerous action
- Cancel button will be secondary, Delete button primary (red)
- Dialog will be keyboard accessible (Tab, ESC, Enter)

## Success Criteria
- ✅ No "localhost:3000 says" message in confirmation dialog
- ✅ Dialog has clean, professional appearance
- ✅ Dialog matches application theme (light/dark)
- ✅ Dialog is accessible (keyboard navigation, ARIA)
- ✅ Cancel button closes dialog without deleting
- ✅ Delete/Confirm button deletes the task
- ✅ ESC key closes dialog
- ✅ No TypeScript errors
- ✅ No regression in delete functionality

## Implementation Summary

**Status:** ✅ COMPLETED

### Changes Made

1. **Added shadcn/ui dialog component** (`src/components/ui/dialog.tsx`)
   - Installed via `npx shadcn@latest add dialog`
   - Provides accessible, styled dialog primitives

2. **Created ConfirmDialog component** (`src/components/ConfirmDialog.tsx`)
   - Reusable confirmation dialog wrapper
   - Props: isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant
   - Supports destructive variant for dangerous actions

3. **Updated TaskRow component** (`src/components/TaskRow.tsx`)
   - Added import for ConfirmDialog
   - Added state: `showDeleteDialog`
   - Updated `handleDelete` to open dialog instead of `window.confirm()`
   - Added `handleConfirmDelete` to execute deletion
   - Rendered ConfirmDialog with appropriate props

### Verification Results
- ✅ Build successful with no TypeScript errors
- ✅ Custom dialog displays without browser chrome
- ✅ Clean, centered modal with semi-transparent overlay
- ✅ Cancel button closes dialog and preserves task
- ✅ Delete button has destructive (red) styling
- ✅ Dialog is keyboard accessible
- ✅ Theme-aware styling matches application

### Files Modified/Created
- `src/components/ui/dialog.tsx` - Added (shadcn/ui)
- `src/components/ConfirmDialog.tsx` - Created
- `src/components/TaskRow.tsx` - Modified

## Related Files
- `src/components/TaskRow.tsx` - Component using the dialog
- `src/components/ui/dialog.tsx` - shadcn/ui dialog primitives (to be added)
- `src/components/ConfirmDialog.tsx` - Custom confirmation dialog (to be created)

## Design Considerations
- **Backdrop:** Semi-transparent dark overlay
- **Dialog:** Centered, white (light mode) / dark (dark mode)
- **Title:** Bold, clear "Delete Task" heading
- **Message:** Task name in quotes, warning about action
- **Buttons:**
  - Cancel: Secondary/ghost styling (left)
  - Delete: Destructive/red styling (right)
- **Animation:** Smooth fade-in/fade-out
- **Responsive:** Works on mobile and desktop

## Next Steps After Approval
1. Install shadcn dialog component
2. Create reusable ConfirmDialog component
3. Update TaskRow to use new dialog
4. Test thoroughly
5. Update disable-root-delete.md with new implementation details
