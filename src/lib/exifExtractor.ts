import ExifReader from 'exifreader';
import type { ExifData } from '../types';

/**
 * Extract EXIF data from an image file
 * Returns GPS coordinates, date taken, and camera information
 */
export async function extractExifData(file: File): Promise<ExifData | null> {
  try {
    const tags = await ExifReader.load(file);

    const exifData: ExifData = {};

    // Extract GPS coordinates
    if (tags.GPSLatitude && tags.GPSLongitude) {
      const lat = (tags.GPSLatitude as any)?.computed || (tags.GPSLatitude as any)?.value;
      const lng = (tags.GPSLongitude as any)?.computed || (tags.GPSLongitude as any)?.value;
      
      if (lat && lng) {
        exifData.latitude = lat as number;
        exifData.longitude = lng as number;
      }

      if (tags.GPSAltitude) {
        const alt = (tags.GPSAltitude as any)?.computed || (tags.GPSAltitude as any)?.value;
        if (alt) {
          exifData.altitude = alt as number;
        }
      }
    }

    // Extract date taken
    if (tags.DateTimeOriginal) {
      exifData.dateTime = tags.DateTimeOriginal.description as string;
    } else if (tags.DateTime) {
      exifData.dateTime = tags.DateTime.description as string;
    }

    // Extract camera information
    if (tags.Model) {
      exifData.camera = tags.Model.description as string;
    }

    if (tags.LensModel) {
      exifData.model = tags.LensModel.description as string;
    }

    // Extract thumbnail if available
    if (tags.Thumbnail && tags.Thumbnail.base64) {
      exifData.thumbnail = `data:image/jpeg;base64,${tags.Thumbnail.base64}`;
    }

    return Object.keys(exifData).length > 0 ? exifData : null;
  } catch (error) {
    console.error('Error extracting EXIF data:', error);
    return null;
  }
}

/**
 * Check if an image has GPS data in EXIF
 */
export async function hasGPSData(file: File): Promise<boolean> {
  const exifData = await extractExifData(file);
  return !!(exifData?.latitude && exifData?.longitude);
}

/**
 * Format EXIF date to ISO string
 */
export function formatExifDate(exifDate: string | undefined): string | null {
  if (!exifDate) return null;

  try {
    // EXIF format: "2024:03:15 14:30:45"
    const regex = /^(\d{4}):(\d{2}):(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
    const match = exifDate.match(regex);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`;
    }
  } catch {
    console.warn('Could not parse EXIF date:', exifDate);
  }

  return null;
}
