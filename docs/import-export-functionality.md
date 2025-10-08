# Import/Export Functionality Plan

**Branch:** `feature/import-export-data`
**Date:** 2025-10-08
**Objective:** Add the ability to export all tracking data as JSON and import data from a JSON file

## Overview

This feature will add two buttons at the top of the application:
1. **Export** - Downloads all application data (tasks, time entries, check entries, active timers, and user preferences) as a JSON file
2. **Import** - Allows users to select and import a JSON file to restore or merge data

## Data Structure

The exported JSON will contain the complete AppState:
```json
{
  "version": "1.0",
  "exportDate": "2025-10-08T10:30:00.000Z",
  "data": {
    "tasks": {},
    "timeEntries": {},
    "checkEntries": {},
    "activeTimers": {},
    "userPreferences": {}
  }
}
```

## Implementation Plan

### Phase 1: Backend API Endpoints
- [x] Create API route for bulk data export (`/api/export`)
  - Should fetch all data from database
  - Return JSON with version and timestamp
  - Located at: `src/app/api/export/route.ts`

- [x] Create API route for bulk data import (`/api/import`)
  - Validate incoming JSON structure
  - Option to replace or merge data (start with replace)
  - Clear existing data and insert new data
  - Located at: `src/app/api/import/route.ts`

### Phase 2: API Client Methods
- [x] Add export method to `src/lib/api-client.ts`
  - `exportAPI.getAll()` - fetch complete data export

- [x] Add import method to `src/lib/api-client.ts`
  - `importAPI.uploadData(data)` - send data to import endpoint

### Phase 3: UI Components
- [x] Create `ExportButton` component
  - Located at: `src/components/ExportButton.tsx`
  - Fetches data from export API
  - Creates downloadable JSON file
  - Filename format: `time-tracker-export-YYYY-MM-DD.json`

- [x] Create `ImportButton` component
  - Located at: `src/components/ImportButton.tsx`
  - Opens file picker for JSON files
  - Reads and validates file
  - Shows confirmation dialog before import
  - Calls import API with data
  - Reloads app after successful import

- [x] Update `Header` component
  - Add Export and Import buttons
  - Position: Top right area, near the theme toggle
  - Style: Consistent with existing UI

### Phase 4: Hook Integration
- [x] Add export/import methods to `useTimeTracker` hook
  - Not needed - Export/Import buttons are self-contained components that call APIs directly
  - Import triggers page reload which automatically reloads all data through existing useTimeTracker initialization

### Phase 5: Error Handling & Validation
- [x] Add JSON schema validation for import
  - Check version compatibility ✓
  - Validate data structure ✓
  - Show helpful error messages ✓

- [x] Add error boundaries for import failures
  - Handle corrupted JSON ✓
  - Handle incompatible versions ✓
  - Preserve existing data on failure ✓ (transaction rollback on error)

## File Changes Summary

### New Files
1. `src/app/api/export/route.ts` - Export API endpoint
2. `src/app/api/import/route.ts` - Import API endpoint
3. `src/components/ExportButton.tsx` - Export button component
4. `src/components/ImportButton.tsx` - Import button component

### Modified Files
1. `src/lib/api-client.ts` - Add export/import API methods
2. `src/components/Header.tsx` - Add Export/Import buttons
3. `src/hooks/useTimeTracker.ts` - Add export/import methods and data reload

## Testing Considerations (Manual Testing by User)

The user will manually test:
- Export functionality with existing data
- Download and verify JSON file structure
- Import the same file to verify data restoration
- Error handling with invalid JSON files
- Edge cases (empty database, large datasets)

## Notes

- No automatic testing will be implemented
- User will perform all manual testing
- No git commits will be made automatically
- Each task will be marked with `[-]` when in progress
- Each task will be marked with `[x]` when completed

## Implementation Complete

All tasks have been completed successfully. The import/export functionality is now fully implemented:

### What Was Built:
1. **Backend API Endpoints** - Export and import routes with validation and transaction support
2. **API Client Methods** - Type-safe export/import API methods
3. **UI Components** - ExportButton and ImportButton with proper error handling
4. **Header Integration** - Buttons positioned in top right, consistent with existing UI

### Key Features:
- ✅ Export all data (tasks, time entries, check entries, active timers, preferences) as JSON
- ✅ Import data from JSON file with validation
- ✅ Confirmation dialog before import with destructive action warning
- ✅ Transaction-based import ensures data integrity (rollback on failure)
- ✅ User-friendly file naming: `time-tracker-export-YYYY-MM-DD.json`
- ✅ Automatic page reload after successful import
- ✅ Error handling with helpful messages

### Ready for Testing:
The user can now manually test:
- Export functionality to download current data
- Import the same file to verify data restoration
- Error handling with invalid JSON files
- UI/UX of the new buttons in the header
