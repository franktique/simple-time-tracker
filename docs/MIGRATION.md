# PostgreSQL Migration Guide

## Overview
This application has been migrated from localStorage to PostgreSQL database storage. This document explains how to set up and use the new system.

## Setup Instructions

### 1. Database Setup
The PostgreSQL database `simple-tracker` has already been created on your local instance.

### 2. Environment Variables
The `.env.local` file has been configured with your database connection details:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple-tracker
DB_USER=franktique
```

### 3. Database Schema
The database schema has been created with the following tables:
- `tasks` - Stores task hierarchy and metadata
- `time_entries` - Stores time tracking data
- `active_timers` - Stores currently running timers
- `user_preferences` - Stores user preferences

To recreate the schema if needed:
```bash
npm run db:migrate
```

### 4. Test Database Connection
```bash
npm run db:test
```

## Migrating Existing Data

If you have existing data in localStorage, follow these steps:

### Option 1: Using the Migration Tool (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the migration tool in your browser:
   ```
   http://localhost:3000/scripts/migrate-localStorage-to-db.html
   ```

3. Follow the on-screen instructions:
   - Click "Check LocalStorage Data" to see what data will be migrated
   - Click "Migrate to Database" to transfer the data
   - Click "Clear LocalStorage" after successful migration
   - Refresh the application

### Option 2: Manual Migration via API

You can also migrate data programmatically by sending a POST request to `/api/migrate`:

```javascript
const migrationData = {
  tasks: { /* your tasks */ },
  timeEntries: { /* your time entries */ },
  activeTimers: { /* your active timers */ },
  preferences: { /* your preferences */ }
};

fetch('/api/migrate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(migrationData)
});
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `GET /api/tasks/[id]` - Get a specific task
- `PATCH /api/tasks/[id]` - Update a task
- `DELETE /api/tasks/[id]` - Delete a task

### Time Entries
- `GET /api/time-entries` - Get all time entries
- `GET /api/time-entries?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get entries by date range
- `POST /api/time-entries` - Create/update a time entry
- `DELETE /api/time-entries/[id]` - Delete a time entry

### Timers
- `GET /api/timers` - Get all active timers
- `POST /api/timers` - Start a timer
- `PATCH /api/timers/[taskId]` - Update a timer
- `DELETE /api/timers/[taskId]` - Stop a timer

### Preferences
- `GET /api/preferences` - Get user preferences
- `PATCH /api/preferences` - Update preferences

## Architecture Changes

### Before (localStorage)
```
useTimeTracker Hook → StorageManager → localStorage
```

### After (PostgreSQL)
```
useTimeTracker Hook → API Client → Next.js API Routes → Database Services → PostgreSQL
```

## Files Added/Modified

### New Files
- `src/lib/db/connection.ts` - Database connection pool
- `src/lib/db/tasks.ts` - Task database operations
- `src/lib/db/timeEntries.ts` - Time entry database operations
- `src/lib/db/timers.ts` - Timer database operations
- `src/lib/db/preferences.ts` - Preferences database operations
- `src/lib/db/migrations/001_initial_schema.sql` - Database schema
- `src/lib/api-client.ts` - Frontend API client
- `src/app/api/tasks/route.ts` - Tasks API endpoints
- `src/app/api/tasks/[id]/route.ts` - Single task API endpoints
- `src/app/api/time-entries/route.ts` - Time entries API endpoints
- `src/app/api/time-entries/[id]/route.ts` - Single time entry API endpoints
- `src/app/api/timers/route.ts` - Timers API endpoints
- `src/app/api/timers/[taskId]/route.ts` - Single timer API endpoints
- `src/app/api/preferences/route.ts` - Preferences API endpoints
- `src/app/api/migrate/route.ts` - Migration API endpoint
- `scripts/test-db-connection.ts` - Database connection test
- `scripts/run-migrations.ts` - Migration runner
- `scripts/migrate-localStorage-to-db.html` - Migration UI tool

### Modified Files
- `src/hooks/useTimeTracker.ts` - Now uses API calls instead of localStorage
- `package.json` - Added database dependencies and scripts

### Backup Files
- `src/hooks/useTimeTracker.localStorage.ts` - Original localStorage implementation (backup)

## Development Commands

```bash
# Test database connection
npm run db:test

# Run migrations
npm run db:migrate

# Start development server
npm run dev

# Build for production
npm run build
```

## Troubleshooting

### Database Connection Issues
If you see "connection failed" errors:
1. Ensure PostgreSQL is running
2. Verify credentials in `.env.local`
3. Test connection: `npm run db:test`

### Migration Issues
If migration fails:
1. Check browser console for errors
2. Verify API is accessible
3. Check database logs
4. Ensure tables are created: `npm run db:migrate`

### API Errors
If you see API errors in the application:
1. Check browser DevTools Network tab
2. Check server logs in terminal
3. Verify database connection
4. Check API endpoint implementation

## Rollback

If you need to rollback to localStorage:
1. Restore the backup: `cp src/hooks/useTimeTracker.localStorage.ts src/hooks/useTimeTracker.ts`
2. Your data will still be in localStorage if you didn't clear it
3. The database will remain intact for future use

## Next Steps

After successful migration:
- ✅ All data is now persisted in PostgreSQL
- ✅ Data is accessible across devices (when deployed)
- ✅ Better performance for large datasets
- ✅ Ability to add authentication and multi-user support
- ✅ Can implement data backup and restore
- ✅ Can add advanced querying and reporting
