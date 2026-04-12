# Troubleshooting: App Not Working

## Issue: App loads but can't create trips or upload photos

### Root Cause
The database has **RLS (Row Level Security) enabled** but only has **SELECT policies** - no INSERT/UPDATE/DELETE policies.

This means:
- ❌ Can't create trips
- ❌ Can't upload photos
- ✅ Can read existing data

### Fix: Add Write Policies (2 minutes)

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy the entire contents** of this file:
   ```
   supabase/migrations/002_add_write_policies.sql
   ```
3. **Paste into SQL Editor**
4. **Execute** (Run button)

That's it! The app will now work.

### What You'll See After
✅ "+ Add Trip" button works  
✅ Can upload photos  
✅ Photos appear in carousel  
✅ 3D globe shows all locations  

### If Still Not Working

Check browser console for errors (F12 → Console):

**Error: "Failed to fetch trips"**
- RLS policies might not have been applied
- Re-run `002_add_write_policies.sql`

**Error: "CORS error"**
- This is normal for local dev
- Check Supabase dashboard → Settings → API → CORS

**Error: "Storage bucket not found"**
- Go to Storage → verify "photos" bucket exists and is PUBLIC

### Questions?
See the main README.md or START_HERE.md
