/**
 * Travel Photo App Type Definitions
 */

export interface Photo {
  id: string;
  trip_id: string;
  url: string;
  latitude: number;
  longitude: number;
  date_taken: string;
  camera_info?: string;
  filename: string;
  uploaded_at: string;
  thumbnail_url?: string;
  exif_data?: Record<string, unknown>;
}

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  created_at: string;
  photo_count?: number;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  country?: string;
  region?: string;
  address_components?: Record<string, unknown>;
}

export interface PhotoPin {
  id: string;
  position: { lat: number; lng: number };
  photos: Photo[];
  location?: Location;
  clusterCount?: number;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface AppState {
  photos: Photo[];
  trips: Trip[];
  selectedTrip?: Trip;
  selectedPhoto?: Photo;
  selectedPin?: PhotoPin;
  uploadProgress: UploadProgress[];
  isLoading: boolean;
  error?: string;
}

export interface ExifData {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  dateTime?: string;
  camera?: string;
  model?: string;
  thumbnail?: string;
}
