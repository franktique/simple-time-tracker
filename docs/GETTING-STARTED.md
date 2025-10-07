# Getting Started with PostgreSQL Backend

## Quick Start Guide

Your time tracking app has been successfully migrated to use PostgreSQL! Follow these steps to get started.

## Prerequisites ✅

All prerequisites are already met:
- ✅ PostgreSQL installed and running
- ✅ Database `simple-tracker` created
- ✅ Database schema migrated
- ✅ Dependencies installed
- ✅ Environment variables configured

## Step 1: Verify Everything is Working

Test the database connection:
```bash
npm run db:test
```

Expected output:
```
✅ Database connection successful!
Current time: [timestamp]
Database name: simple-tracker
```

## Step 2: Start the Application

```bash
npm run dev
```

The app will be available at: http://localhost:3000

## Step 3: Migrate Existing Data (Optional)

If you had data in localStorage before:

1. **Open the migration tool:**
   - Navigate to: http://localhost:3000/scripts/migrate-localStorage-to-db.html

2. **Check your data:**
   - Click "Check LocalStorage Data"
   - Review what data will be migrated

3. **Migrate:**
   - Click "Migrate to Database"
   - Wait for success message

4. **Clean up:**
   - Click "Clear LocalStorage"
   - Refresh the main app

5. **Verify:**
   - All your tasks and time entries should be visible
   - Data is now stored in PostgreSQL

## Step 4: Use the Application

The application works exactly the same as before, but now:
- ✅ Data is stored in PostgreSQL
- ✅ Better performance with large datasets
- ✅ Foundation for multi-user features
- ✅ No browser storage limitations

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Test database connection
npm run db:test

# Run database migrations
npm run db:migrate
```

## API Endpoints

Your app now has a full REST API:

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

### Time Entries
- `GET /api/time-entries` - Get all entries
- `POST /api/time-entries` - Create/update entry
- `DELETE /api/time-entries/[id]` - Delete entry

### Timers
- `GET /api/timers` - Get active timers
- `POST /api/timers` - Start timer
- `PATCH /api/timers/[taskId]` - Update timer
- `DELETE /api/timers/[taskId]` - Stop timer

### Preferences
- `GET /api/preferences` - Get preferences
- `PATCH /api/preferences` - Update preferences

## Troubleshooting

### App won't start?
Check that PostgreSQL is running:
```bash
psql -l
```

### Can't connect to database?
Verify your `.env.local` file has:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simple-tracker
DB_USER=franktique
```

### Database errors?
Re-run migrations:
```bash
npm run db:migrate
```

### Want to see database content?
Connect to the database:
```bash
psql -d simple-tracker
```

Then run queries:
```sql
-- See all tasks
SELECT * FROM tasks;

-- See all time entries
SELECT * FROM time_entries;

-- See active timers
SELECT * FROM active_timers;

-- See preferences
SELECT * FROM user_preferences;
```

## What's Different?

### Before (localStorage)
- Data stored in browser only
- Limited to ~5-10MB
- Lost if browser data cleared
- No multi-device support

### After (PostgreSQL)
- Data stored in database
- Virtually unlimited storage
- Persistent and backed up
- Ready for multi-device access
- Can be deployed to production

## Next Features You Can Build

Now that you have a PostgreSQL backend, you can easily add:

1. **Authentication** - Multiple users with separate data
2. **Data Export** - Download reports as CSV/PDF
3. **Team Features** - Share tasks and time entries
4. **Advanced Reports** - Complex queries and analytics
5. **Mobile App** - Share the same API
6. **Backup/Restore** - Database-level backups
7. **API Access** - External integrations

## Documentation

For more details, see:
- `docs/add-storage.md` - Complete implementation plan
- `docs/MIGRATION.md` - Migration guide
- `docs/SUMMARY.md` - Implementation summary

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the migration documentation
3. Check database logs
4. Verify API responses in browser DevTools

---

**You're all set! Start tracking time with your new PostgreSQL-powered app! 🚀**
