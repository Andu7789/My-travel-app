-- Create trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  date_taken TIMESTAMP WITH TIME ZONE NOT NULL,
  camera_info TEXT,
  filename TEXT NOT NULL,
  thumbnail_url TEXT,
  exif_data JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_coords CHECK (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180)
);

-- Create locations table (for grouping/clustering)
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  address TEXT,
  country TEXT,
  region TEXT,
  address_components JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_coords CHECK (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_photos_trip_id ON public.photos(trip_id);
CREATE INDEX IF NOT EXISTS idx_photos_date_taken ON public.photos(date_taken);
CREATE INDEX IF NOT EXISTS idx_photos_coords ON public.photos(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON public.trips(start_date);
CREATE INDEX IF NOT EXISTS idx_locations_coords ON public.locations(latitude, longitude);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (personal use, no auth required)
CREATE POLICY "Allow public select trips" ON public.trips
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public select photos" ON public.photos
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public select locations" ON public.locations
  FOR SELECT
  USING (true);

-- Create storage bucket for photos (run manually in Supabase dashboard)
-- For now, document the setup:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create new bucket named "photos"
-- 3. Set bucket to public
-- 4. Add RLS policy for public read access
