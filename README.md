# 🌍 Travel Photo Web App

A web application to showcase travel photos on an interactive 3D globe. Upload photos, automatically extract GPS coordinates from EXIF data (or manually tag locations), and visualize your travels on a stunning globe with Cesium.js.

## Features

- 📍 **3D Interactive Globe** - Cesium.js for impressive visualization (Leaflet fallback)
- 📸 **Smart Photo Upload** - EXIF GPS auto-extraction + manual tagging fallback
- 🗺️ **Interactive Map** - Click to place photos, zoom/pan the globe
- 🏔️ **Trip Organization** - Group photos by trip with dates and descriptions
- 🎞️ **Photo Carousel** - Gallery modal with keyboard navigation (arrows, ESC)
- ☁️ **Cloud Storage** - Supabase (PostgreSQL + photo storage)
- 🚀 **GitHub Pages** - Deploy for free at your custom gh-pages URL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Map/Globe** | Cesium.js (3D) + Leaflet.js (2D) |
| **Photos** | ExifReader (extraction) + Canvas (compression) |
| **Backend** | Supabase (PostgreSQL + Storage) |
| **Styling** | Tailwind CSS |
| **Hosting** | GitHub Pages |

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Andu7789/My-travel-app.git
cd My-travel-app
npm install
```

### 2. Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) → Create free account
2. Create new project
3. Get API credentials (**Settings > API**):
   - Copy `Project URL` 
   - Copy `anon public` key
4. Run the database migration:
   - **SQL Editor** → Paste content from `supabase/migrations/001_initial_schema.sql` → Execute
5. Create photo storage bucket:
   - **Storage > Buckets** → New bucket → Name: `photos` → Make public
6. Create `.env.local`:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Locally

```bash
npm run dev
# Open http://localhost:5173
```

### 4. Deploy (One Command!)

```bash
npm run deploy
```

Your site lives at: `https://Andu7789.github.io/My-travel-app/`

## How to Use

### Upload Photos

1. **Create a trip**: Click "+ Add Trip" in left sidebar
2. **Select trip**: Click the trip name to activate
3. **Upload photos**: Drag-drop or click in upload area
4. **Automatic geotag**: If phone/camera had GPS enabled, photos auto-pin on map
5. **Manual fallback**: If no GPS → manual location tagging (coming Phase 5)

### View Photos

- **Click a pin** on the globe → Gallery modal opens
- **Keyboard navigation**: ← / → arrows, ESC to close
- **Thumbnails** at bottom for quick jump to any photo
- **Metadata displayed**: Date, camera, exact coordinates

### Manage Trips

- **Sidebar**: See all trips with photo counts
- **Filter**: Click trip to show only that trip's photos
- **Edit**: Trip dates and descriptions (coming soon)

## Project Architecture

```
My-travel-app/
├── src/
│   ├── components/
│   │   ├── Globe.tsx           # 3D globe visualization (Cesium)
│   │   ├── Sidebar.tsx         # Trip list + filters
│   │   ├── PhotoUpload.tsx     # Drag-drop upload form
│   │   ├── PhotoGallery.tsx    # Carousel modal (keyboard nav)
│   │   └── MapControls.tsx     # Reset, 3D/2D toggle, basemap
│   ├── lib/
│   │   ├── supabaseClient.ts   # Supabase queries + uploads
│   │   ├── exifExtractor.ts    # EXIF GPS + date extraction
│   │   └── imageCompression.ts # Image optimization
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # State management + layout
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind base styles
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
├── .env.local                  # API keys (create this)
├── vite.config.ts              # Vite + gh-pages config
├── tailwind.config.js          # Tailwind theming
├── postcss.config.js           # CSS processing
└── package.json
```

## Development Phases

| Phase | Status | What |
|-------|--------|------|
| 1 | ✅ Done | React + Vite + Supabase setup |
| 2 | 🔄 Next | Cesium.js 3D globe rendering |
| 3 | ⏳ Soon | Photo upload + EXIF extraction |
| 4 | ⏳ Soon | Database + storage integration |
| 5 | ⏳ Soon | Map pins + click handlers |
| 6 | ⏳ Soon | Gallery carousel polish |
| 7 | ⏳ Soon | Trip UI refinements |
| 8 | ⏳ Soon | Testing + GitHub Pages deploy |

## Environment Variables (.env.local)

```bash
# Required - Get from Supabase dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Optional - Cesium ion token for better imagery
VITE_CESIUM_ION_TOKEN=your-token-here

# Optional - API base URL
VITE_API_URL=http://localhost:5173
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Photos not showing GPS** | Check phone/camera had GPS on. Some devices strip EXIF. Manual tagging fallback coming. |
| **Supabase connection error** | Verify `.env.local` has correct URL + key. Check Supabase project is running. |
| **Build fails** | Run `npm install` → `npm run lint` to find TypeScript errors. |
| **npm install slow** | Try `npm install --legacy-peer-deps` |
| **Port 5173 in use** | Run `npm run dev -- --port 3000` for different port |

## Database Schema

### trips
- `id` (UUID) - Primary key
- `name` (text) - Trip name
- `start_date`, `end_date` (date) - Trip duration
- `description` (text) - Notes
- `created_at` (timestamp)

### photos
- `id` (UUID) - Primary key
- `trip_id` (UUID) - Foreign key to trips
- `url` (text) - Supabase Storage path
- `latitude`, `longitude` (numeric) - Coordinates
- `date_taken` (timestamp) - From EXIF or manual
- `camera_info` (text) - Camera model from EXIF
- `filename` (text) - Original filename
- `thumbnail_url` (text) - Compressed preview
- `exif_data` (jsonb) - Full EXIF metadata
- `uploaded_at` (timestamp)

### locations (optional, for clustering)
- `id` (UUID) - Primary key
- `latitude`, `longitude` (numeric) - Cluster center
- `address`, `country`, `region` (text) - Reverse geocoding
- `address_components` (jsonb) - Full location data

## Key Features Explained

### EXIF GPS Extraction
- Uses **ExifReader** library (supports JPEG, PNG, HEIC, WebP, GIF)
- Automatically detects latitude/longitude/altitude
- Handles GPS reference directions (N/S, E/W)
- Works in browser - no server-side processing needed

### Photo Compression
- Canvas API resizes to 1600x1600 max (configurable)
- JPEG quality 80% (adjustable)
- Reduces file size 70-90% while keeping quality
- Thumbnail generation for previews

### Cesium.js Globe
- 3D rotatable Earth with real satellite imagery
- Pan, zoom, rotate controls
- Multiple basemap options (satellite, street, topo)
- Entities for photo pins with click handlers
- Fallback to Leaflet.js (2D map) if needed

## Contributing

Found a bug? Have feature ideas?
1. Check [Issues](https://github.com/Andu7789/My-travel-app/issues)
2. Create a PR or issue with details

## License

MIT - Feel free to use! 

---

**Have travel photos to share?** Upload them and see your adventures on a beautiful 3D globe! 🌍✈️📸

**Questions?** Open an issue on GitHub!

Built with React, Cesium, and ❤️ for travel memories.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
