# 🚀 QUICK START - Get Running in 5 Minutes

## Step 1: Clone (Already Done! ✅)
You have the repo at: `c:\Users\Multiple Monitors\OneDrive\Documents\Coding\My-travel-app`

## Step 2: Install Dependencies (1 minute)
```bash
cd My-travel-app
npm install
```

## Step 3: Set Up Supabase (2 minutes)

### Create .env.local file:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**To get these values:**
1. Go to https://supabase.com and create free account
2. Create new project
3. Go to Settings → API
4. Copy "Project URL" and "anon public key"

## Step 4: Run Database Setup (1 minute)

In Supabase dashboard:
1. Go to SQL Editor
2. Create new query
3. Copy entire content of: `supabase/migrations/001_initial_schema.sql`
4. Paste into editor
5. Click Execute

Then create storage bucket:
1. Go to Storage
2. Create new bucket named: `photos`
3. Enable Public bucket
4. Done!

## Step 5: Start Development Server (< 1 minute)
```bash
npm run dev
```

Open: **http://localhost:5173/My-travel-app/**

You should see:
- ✅ Left sidebar with "+ Add Trip" button
- ✅ Blue gradient globe area in center (placeholder)
- ✅ Upload panel on right

## Test It Out

### Create a Test Trip:
1. Click "+ Add Trip" button
2. Fill in: Trip Name, Start Date, End Date
3. Click "Create Trip"
4. Trip appears in sidebar

### Upload a Photo:
1. Select trip from sidebar
2. Drag photo into upload area OR click to select
3. If photo has GPS data → Success! (next phase shows on map)
4. If no GPS → Manual tagging UI coming in Phase 5

## Deploy to GitHub Pages (When Ready)
```bash
npm run deploy
```

Your site will be live at: **https://Andu7789.github.io/My-travel-app/**

---

## File Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main app with state management |
| `src/components/` | 5 React components |
| `src/lib/` | Utilities (EXIF, compression, Supabase) |
| `supabase/migrations/001_initial_schema.sql` | Database setup |
| `.env.local` | Your Supabase credentials (create this!) |
| `package.json` | Dependencies and scripts |
| `vite.config.ts` | Build configuration |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Run `npm install` |
| "env not defined" | Create `.env.local` with Supabase keys |
| "Cannot connect to Supabase" | Check API keys are correct and project is running |
| Port 5173 in use | Run `npm run dev -- --port 3000` |
| Build fails | Run `npm run lint` to check for errors |

## Next Steps

- **Phase 2**: Cesium.js 3D globe integration (makes map interactive)
- **Phase 3**: Complete photo upload flow with all features
- **Phase 4+**: Additional features and polish

---

**You're all set! Your travel photo app is ready to go.** 🌍✈️📸
