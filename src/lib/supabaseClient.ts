import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables not configured. Some features will not work.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to upload photo to Supabase Storage
export async function uploadPhotoToStorage(
  file: File,
  tripId: string,
  onProgress?: (progress: number) => void
): Promise<{ storagePath: string; publicUrl: string }> {
  const fileName = `${tripId}/${Date.now()}-${file.name}`;

  try {
    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    onProgress?.(100);

    return {
      storagePath: fileName,
      publicUrl: publicUrlData.publicUrl,
    };
  } catch (error) {
    console.error('Storage upload error:', error);
    throw error;
  }
}

// Helper function to fetch all photos
export async function fetchAllPhotos() {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('date_taken', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Fetch photos error:', error);
    return [];
  }
}

// Helper function to fetch trips
export async function fetchAllTrips() {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Fetch trips error:', error);
    return [];
  }
}

// Helper function to insert photo metadata
export async function insertPhotoMetadata(photoData: {
  trip_id: string;
  url: string;
  latitude: number;
  longitude: number;
  date_taken: string;
  camera_info?: string;
  filename: string;
  thumbnail_url?: string;
  exif_data?: Record<string, unknown>;
}) {
  try {
    const { data, error } = await supabase
      .from('photos')
      .insert([photoData])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Insert photo metadata error:', error);
    throw error;
  }
}

// Helper function to create trip
export async function createTrip(tripData: {
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .insert([tripData])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Create trip error:', error);
    throw error;
  }
}

// Helper function to update photo with manual location
export async function updatePhotoLocation(
  photoId: string,
  latitude: number,
  longitude: number
) {
  try {
    const { data, error } = await supabase
      .from('photos')
      .update({ latitude, longitude })
      .eq('id', photoId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Update photo location error:', error);
    throw error;
  }
}
