import { put } from '@vercel/blob';

export interface UploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  uploadedAt: string;
}

export interface UploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  prefix?: string; // folder prefix
}

export async function uploadImage(
  file: File, 
  userId: string, 
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    prefix = ''
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit.`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop() || 'jpg';
  const folderPath = prefix ? `${prefix}/${userId}` : userId;
  const filename = `${folderPath}/${timestamp}-${randomString}.${extension}`;

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return {
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType || file.type,
      uploadedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error uploading image to Vercel Blob:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    // Note: Vercel Blob doesn't have a direct delete API in the client
    // You would need to use the Vercel Blob API with a server-side function
    // or use the Vercel dashboard to delete files manually
    console.warn('Delete functionality requires server-side implementation');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image');
  }
}

export function getImageUrl(filename: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BLOB_BASE_URL || '';
  return `${baseUrl}/${filename}`;
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`
    };
  }

  return { isValid: true };
}