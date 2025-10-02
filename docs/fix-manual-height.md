# Manual Height Adjustment Guide

This document explains how to manually adjust the heights of root category names and grid cells to maintain proper alignment in the time tracking interface.

## Overview

The time tracking interface consists of two main components that must maintain vertical alignment:
- **TaskSidebar**: Contains task categories and their names (left side)
- **TimeGrid**: Contains the calendar grid with time cells (right side)

## Component Height Structure

### TaskSidebar Heights
- **Activities header**: `h-12` (48px) - matches day names row
- **Totals row**: `h-6` (24px) - matches daily totals row
- **Task rows**: `h-8` (32px) - matches grid cell rows

### TimeGrid Heights
- **Day names/numbers row**: `h-12` (48px)
- **Daily totals row**: `h-6` (24px)
- **Grid cells**: `h-8` (32px)

## How to Adjust Heights

### Changing Root Category Height

To modify the height of root category names (like "ADMIN", "GOSPEL", etc.):

1. **File**: `src/components/TaskRow.tsx`
2. **Line**: 89
3. **Current**: `className="flex items-center gap-1 px-2 rounded-md transition-colors group h-8"`
4. **Change**: Modify `h-8` to your desired height (e.g., `h-10`, `h-12`)

```tsx
// Example: Increase category height to 40px
className="flex items-center gap-1 px-2 rounded-md transition-colors group h-10"
```

### Changing Grid Cell Height

To modify the height of the corresponding grid cells:

1. **File**: `src/components/TaskTimeRow.tsx`
2. **Line**: 49
3. **Current**: `className="w-10 h-8 border-r"`
4. **Change**: Modify `h-8` to match your TaskRow height

```tsx
// Example: Match the increased category height
className="w-10 h-10 border-r"
```

## Important Alignment Rules

### ⚠️ Critical Requirements

1. **Heights Must Match**: TaskRow and TaskTimeRow heights must be identical
2. **No Vertical Padding**: Avoid `py-*` classes on row containers as they add extra height
3. **Use Fixed Heights**: Always use `h-*` classes, not `min-h-*` or auto heights

### ✅ Correct Approach
```tsx
// TaskRow
className="flex items-center gap-1 px-2 rounded-md transition-colors group h-8"

// TaskTimeRow
className="w-10 h-8 border-r"
```

### ❌ Incorrect Approach
```tsx
// This will cause misalignment
className="flex items-center gap-1 py-1 px-2 rounded-md transition-colors group h-8"
//                                    ^^^^^ Extra vertical padding breaks alignment
```

## Common Height Options

| Tailwind Class | Height (px) | Use Case |
|---------------|-------------|-----------|
| `h-6` | 24px | Compact rows |
| `h-8` | 32px | Standard rows (current) |
| `h-10` | 40px | Comfortable rows |
| `h-12` | 48px | Large rows |

## Testing Alignment

After making changes:

1. **Start development server**: `npm run dev`
2. **Open browser**: Navigate to the application
3. **Visual check**: Verify that category names align exactly with their corresponding grid rows
4. **Check all levels**: Test both parent categories and child tasks

## Troubleshooting

### Categories appear taller than grid cells
- **Cause**: Extra padding or margins on TaskRow
- **Solution**: Remove `py-*` classes, ensure only `h-*` is used

### Grid cells appear taller than categories
- **Cause**: Heights don't match between components
- **Solution**: Ensure TaskRow and TaskTimeRow use identical `h-*` values

### Alignment breaks after changes
- **Cause**: One component height changed but not the other
- **Solution**: Update both TaskRow.tsx and TaskTimeRow.tsx with matching heights

## Related Files

- `src/components/TaskRow.tsx` - Task category heights
- `src/components/TaskTimeRow.tsx` - Grid cell heights
- `src/components/TaskSidebar.tsx` - Header row heights
- `src/components/TimeGrid.tsx` - Calendar header heights