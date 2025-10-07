# PostgreSQL Migration Plan - Branch: add-storage

## Overview
Migrate the simple-time-tracking application from localStorage-based storage to PostgreSQL database with Next.js API routes.

## Current State Analysis
- **Storage Layer**: `src/utils/storage.ts` - Uses localStorage with debounced saves
- **Data Models**: Tasks, TimeEntries, ActiveTimers, UserPreferences (defined in `src/types/index.ts`)
- **Consumer**: `src/hooks/useTimeTracker.ts` - Manages app state and calls StorageManager
- **Framework**: Next.js 15 with App Router

## Goals
1. Set up local PostgreSQL database named `simple-tracker`
2. Create database schema for existing data models
3. Implement Next.js API routes for CRUD operations
4. Replace localStorage calls with API calls
5. Maintain backward compatibility during migration
6. Preserve existing functionality

## Implementation Plan

### Phase 1: Database Setup
- [x] Install PostgreSQL dependencies (`pg`, `@types/pg`)
- [x] Create database connection utility
- [x] Set up environment variables for database configuration
- [x] Test connection to local PostgreSQL instance

### Phase 2: Database Schema
- [x] Design database schema for:
  - `tasks` table (id, name, parent_id, tracking_type, is_expanded, order, created_at, updated_at)
  - `time_entries` table (id, task_id, date, minutes, is_active, start_time, created_at, updated_at)
  - `active_timers` table (id, task_id, start_time, elapsed_time, created_at, updated_at)
  - `user_preferences` table (id, theme, default_tracking_type, time_format, created_at, updated_at)
- [x] Create migration script to initialize database tables
- [x] Add indexes for performance (task relationships, date queries)

### Phase 3: API Routes Implementation
- [x] Create API route structure under `src/app/api/`
- [x] Implement Tasks API endpoints:
  - `POST /api/tasks` - Create task
  - `GET /api/tasks` - Get all tasks
  - `GET /api/tasks/[id]` - Get single task
  - `PATCH /api/tasks/[id]` - Update task
  - `DELETE /api/tasks/[id]` - Delete task
- [x] Implement Time Entries API endpoints:
  - `POST /api/time-entries` - Create/update time entry
  - `GET /api/time-entries` - Get time entries (with date filtering)
  - `DELETE /api/time-entries/[id]` - Delete time entry
- [x] Implement Active Timers API endpoints:
  - `POST /api/timers` - Start timer
  - `GET /api/timers` - Get active timers
  - `PATCH /api/timers/[taskId]` - Update timer
  - `DELETE /api/timers/[taskId]` - Stop timer
- [x] Implement Preferences API endpoints:
  - `GET /api/preferences` - Get user preferences
  - `PATCH /api/preferences` - Update preferences

### Phase 4: Database Layer
- [x] Create database service classes/functions:
  - `src/lib/db/tasks.ts` - Task database operations
  - `src/lib/db/timeEntries.ts` - TimeEntry database operations
  - `src/lib/db/timers.ts` - ActiveTimer database operations
  - `src/lib/db/preferences.ts` - UserPreferences database operations
- [x] Implement error handling and transaction support
- [x] Add data validation

### Phase 5: Frontend Migration
- [x] Create API client utility (`src/lib/api-client.ts`)
- [x] Update `useTimeTracker` hook to use API calls instead of localStorage
- [x] Replace StorageManager methods with API calls
- [x] Update state management to handle async operations
- [x] Add loading states and error handling

### Phase 6: Data Migration
- [x] Create migration utility to transfer localStorage data to PostgreSQL
- [x] Implement one-time migration script that:
  - Checks for existing localStorage data
  - Uploads data to database via API
  - Marks migration as complete
- [x] Add migration status check on app initialization

### Phase 7: Testing & Cleanup
- [x] Test all CRUD operations
- [x] Test hierarchical task relationships
- [x] Test timer functionality
- [x] Verify data integrity
- [x] Remove or deprecate `src/utils/storage.ts` (keep for backward compatibility if needed)
- [x] Update documentation

## Migration Complete! ✅

All phases have been completed successfully. The application now uses PostgreSQL instead of localStorage.

## Technical Decisions

### Database Schema Design
- Use UUID or auto-increment IDs for primary keys
- Store hierarchical task relationships using parent_id
- Store children as array in tasks table OR compute dynamically from parent_id
- Use timestamps for created_at/updated_at
- Index on task parent_id, date fields for time entries

### API Design
- RESTful API routes using Next.js Route Handlers
- JSON request/response format
- Standard HTTP status codes
- Error handling middleware

### Migration Strategy
- Keep StorageManager initially for fallback
- Progressive migration: DB-first, fallback to localStorage
- Eventually remove localStorage dependency

## Dependencies to Install
```json
{
  "pg": "^8.x",
  "@types/pg": "^8.x"
}
```

## Environment Variables
```env
DATABASE_URL=postgresql://localhost:5432/simple-tracker
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple-tracker
DB_USER=postgres
DB_PASSWORD=
```

## Files to Create
1. `src/lib/db/connection.ts` - Database connection pool
2. `src/lib/db/tasks.ts` - Task database operations
3. `src/lib/db/timeEntries.ts` - TimeEntry database operations
4. `src/lib/db/timers.ts` - Timer database operations
5. `src/lib/db/preferences.ts` - Preferences database operations
6. `src/lib/db/migrations/001_initial_schema.sql` - Initial schema
7. `src/app/api/tasks/route.ts` - Tasks collection endpoint
8. `src/app/api/tasks/[id]/route.ts` - Single task endpoint
9. `src/app/api/time-entries/route.ts` - Time entries endpoint
10. `src/app/api/time-entries/[id]/route.ts` - Single time entry endpoint
11. `src/app/api/timers/route.ts` - Timers collection endpoint
12. `src/app/api/timers/[taskId]/route.ts` - Single timer endpoint
13. `src/app/api/preferences/route.ts` - Preferences endpoint
14. `src/lib/api-client.ts` - Frontend API client
15. `scripts/migrate-data.ts` - Data migration script
16. `.env.local` - Environment configuration

## Files to Modify
1. `src/hooks/useTimeTracker.ts` - Replace localStorage with API calls
2. `package.json` - Add new dependencies
3. `.gitignore` - Add .env.local

## Rollback Plan
- Keep localStorage implementation intact during migration
- Feature flag to switch between localStorage and PostgreSQL
- Database backup before running migrations

## Success Criteria
- ✅ All existing features work with PostgreSQL backend
- ✅ Data persists across sessions via database
- ✅ No data loss during migration
- ✅ API endpoints properly secured and validated
- ✅ Error handling for network and database failures
- ✅ Performance matches or exceeds localStorage implementation
