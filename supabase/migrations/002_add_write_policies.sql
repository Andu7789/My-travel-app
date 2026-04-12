-- Add INSERT and UPDATE policies for public write access
-- Run this in Supabase SQL Editor to enable full functionality

-- Trips table policies
CREATE POLICY "Allow public insert trips" ON public.trips
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update trips" ON public.trips
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete trips" ON public.trips
  FOR DELETE
  USING (true);

-- Photos table policies
CREATE POLICY "Allow public insert photos" ON public.photos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update photos" ON public.photos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete photos" ON public.photos
  FOR DELETE
  USING (true);

-- Locations table policies
CREATE POLICY "Allow public insert locations" ON public.locations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update locations" ON public.locations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete locations" ON public.locations
  FOR DELETE
  USING (true);
