# 🚀 Getting Started - Complete Setup Guide

## Step 1: Clone the Repository ✓ 
Already done! Code is at: https://github.com/Andu7789/My-travel-app

## Step 2: Install Dependencies ✓
```bash
cd My-travel-app
npm install
```

## Step 3: Set Up Supabase (CRITICAL NEXT STEP)

### 3.1 Create Free Supabase Account
1. Go to https://supabase.com
2. Sign up (free tier)
3. Create new project
4. Wait for provisioning (5-10 minutes)

### 3.2 Get API Credentials
1. Open your project dashboard
2. Go to **Settings → API**
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)

### 3.3 Create `.env.local` File
In your project root, create file `.env.local`:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Replace with YOUR actual credentials from step 3.2
- Never commit `.env.local` to GitHub (it's in .gitignore)
- These are public credentials for a personal project (no auth needed)

### 3.4 Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Create new query
3. Copy all content from `supabase/migrations/001_initial_schema.sql` 
4. Paste into the SQL editor
5. Click **Execute**
6. You should see: "executing query"

### 3.5 Create Storage Bucket
1. In Supabase dashboard, go to **Storage**
2. Click **Create new bucket**
3. Name it: `photos`
4. Enable **Public bucket** toggle
5. Click **Create bucket**

### 3.6 Configure Storage Permissions (RLS)
1. Open the `photos` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization, use SQL editor**
5. Paste this policy:
```sql
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');
```
6. Click **Review** → **Save policy**

---

## Step 4: Run Locally ✓
```bash
npm run dev
```
Open: http://localhost:5173

You should see:
- Left sidebar with "+ Add Trip" button
- Blue globe in center (placeholder)
- Upload area on the right

---

## Step 5: Test the App

### Create a Trip
1. Click "+ Add Trip" in sidebar
2. Fill in:
   - Trip Name: "Test Trip"
   - Start Date: Today
   - End Date: Tomorrow
3. Click "Create Trip"
4. Trip should appear in sidebar

### Test Upload (if you have geotagged photos)
1. Select the trip you just created
2. Drag a photo with GPS data into the upload area
3. Watch progress bar
4. Photo should upload → metadata saved to database
5. Later: Photo location will appear on map (when Cesium is implemented)

### Without GPS Data
Photos without GPS will show an error message asking for manual tagging (coming in Phase 5)

---

## Step 6: Deploy to GitHub Pages

When ready to share your app (after Phase 2+):
```bash
npm run build
npm run deploy
```

Your site will be live at:
**https://Andu7789.github.io/My-travel-app/**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Cannot find module '@supabase/supabase-js'"** | Run `npm install` |
| **"Supabase URL is undefined"** | Check `.env.local` file exists with correct credentials |
| **"Storage bucket 'photos' not found"** | Go to Supabase Storage, create bucket named `photos` |
| **"RLS policies prevent insert"** | Run SQL migrations in step 3.4 |
| **Photos won't upload** | Make sure `.env.local` has correct Supabase credentials |

---

## Project Structure Reference

```
My-travel-app/
├── src/
│   ├── components/           # React components
│   │   ├── Globe.tsx        # 3D globe (has placeholder, Cesium coming Phase 2)
│   │   ├── Sidebar.tsx      # Trip list
│   │   ├── PhotoUpload.tsx  # Upload form (drag-drop ready)
│   │   ├── PhotoGallery.tsx # Carousel modal (keyboard nav working)
│   │   └── MapControls.tsx  # Map controls
│   ├── lib/                  # Utility functions
│   │   ├── supabaseClient.ts   # ← Add Supabase credentials here
│   │   ├── exifExtractor.ts    # GPS extraction (ready)
│   │   └── imageCompression.ts # Image optimization (ready)
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   └── App.tsx              # Main component (state management)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # ← Run this in Supabase to create tables
├── .env.local               # ← Create this! Add your Supabase credentials
├── vite.config.ts           # GitHub Pages config (done)
└── package.json
```

---

## What's Next After Setup

Once Supabase is connected:
- **Phase 2**: Implement Cesium.js 3D globe rendering (map shows your photos!)
- **Phase 3**: Complete upload flow + EXIF extraction
- **Phase 4-8**: Additional features

---

## Need Help?

1. **GitHub Issues**: https://github.com/Andu7789/My-travel-app/issues
2. **Supabase Docs**: https://supabase.com/docs
3. **React Docs**: https://react.dev
4. **Vite Docs**: https://vite.dev

---

**Your travel photo app is ready to configure! 🚀**
