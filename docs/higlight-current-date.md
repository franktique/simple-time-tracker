# Highlight Current Date Feature Plan

## Branch
`higlight-current-date`

## Overview
Add a visual highlight to the current date column across all rows in the time tracking grid, similar to the highlight in the header that shows the current day with a blue background.

## Analysis
Currently, the app highlights the current date in the header (TimeGrid.tsx:44-54) with a blue background (`var(--color-orange-light, #dbeafe)` - which is actually blue despite the variable name) when `isToday` is true. We need to extend this highlighting to all the time entry cells in TaskTimeRow.tsx for the same date.

### Current Implementation
- **Header highlighting**: TimeGrid.tsx lines 48-54 apply blue background when `isToday` is true
- **Cell rendering**: TaskTimeRow.tsx renders individual cells with weekend highlighting (red background) but no current date highlighting
- **Date detection**: dateHelpers.ts:54 already detects if a date is today using the `isToday` flag in CalendarDay type

## Implementation Plan

### Todo List

- [x] Update TaskTimeRow component to detect current date
  - Add logic to identify which day is today in the current month
  - Pass `isToday` information to cell rendering logic

- [x] Add current date highlighting to TimeCell component
  - Modify cell background color to use blue highlight when `isToday` is true
  - Ensure highlight doesn't conflict with timer highlighting (active timer state)
  - Maintain weekend styling priority (weekends should remain red)
  - Add proper color transitions for hover states

- [x] Add current date highlighting to CheckmarkCell component
  - Apply same blue highlight for unique/habit tracking cells
  - Ensure highlighting works with checked/unchecked states
  - Maintain consistency with TimeCell styling

- [ ] Test the implementation
  - Verify current date highlights correctly across all task types (manual, automatic, unique, habit)
  - Test that highlighting works with active timers
  - Check that weekend styling is preserved
  - Verify visual consistency between header and cell highlighting
  - Test with different months (current month vs other months)
  - Ensure proper behavior when date changes (should update automatically)

## Technical Approach

### 1. TaskTimeRow Component Changes
- Already has access to `dayData.isToday` from the `days` array (line 48)
- Pass `isToday` prop to TimeCell and CheckmarkCell components

### 2. TimeCell Component Changes
- Add `isToday?: boolean` prop
- Update background color logic in the cell div (line 154-173)
- Priority order for background colors:
  1. Active timer (highest priority)
  2. Current date highlight
  3. Hover state
  4. Default transparent

### 3. CheckmarkCell Component Changes
- Add `isToday?: boolean` prop
- Update the cell wrapper background color
- Ensure blue highlight appears behind the checkmark

### 4. Color Consistency
- Use the same color variable as the header: `var(--color-orange-light, #dbeafe)` (which is blue #dbeafe)
- Ensure the highlight is visible in both light and dark modes
- Maintain proper contrast for readability

## Files to Modify

1. **src/components/TaskTimeRow.tsx**
   - Pass `isToday` prop to TimeCell (line 115)
   - Pass `isToday` prop to CheckmarkCell (line 92)

2. **src/components/TimeCell.tsx**
   - Add `isToday` to TimeCellProps interface
   - Update background color logic in cell div

3. **src/components/CheckmarkCell.tsx**
   - Add `isToday` to CheckmarkCellProps interface
   - Update cell wrapper styling

## Visual Design

The current date column should have:
- **Background color**: Same blue as header (`var(--color-orange-light, #dbeafe)` which is #dbeafe - light blue)
- **Span**: Full height of all task rows
- **Persistence**: The highlight remains even when scrolling vertically
- **Priority**: Weekend styling (red) should take precedence over current date highlighting

## Edge Cases to Consider

1. When the current date is a weekend - keep the red weekend styling
2. When there's an active timer on today's date - active timer styling takes precedence
3. When viewing a different month - no highlighting (current date not in view)
4. When the date changes at midnight - highlight should automatically update

## Success Criteria

- [ ] Current date column is highlighted with blue background across all rows
- [ ] Highlighting is consistent with header styling
- [ ] Weekend dates remain red (no blue highlight on weekends)
- [ ] Active timer cells keep their timer styling
- [ ] Hover states work correctly on highlighted cells
- [ ] Code is clean and maintainable
- [ ] No visual glitches or styling conflicts
