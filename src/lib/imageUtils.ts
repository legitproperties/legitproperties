import React from 'react';
import { Property } from '../types';

/**
 * Verified High-Resolution Real Estate Fallback Images
 * Curated for Nigerian luxury apartments, terraces, duplexes, and prime dry land.
 */
export const DEFAULT_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

export const FALLBACK_PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', // Luxury Modern Villa
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', // High-Rise Penthouse
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // Contemporary Living Room
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', // Designer Master Bedroom
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', // Gourmet Kitchen
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', // Pool & Patio Lounge
];

/**
 * Curated Presets for Quick Admin Testing / Direct Demo Showcase
 */
export const PRESET_LUXURY_GALLERIES = [
  {
    name: 'Ikoyi Luxury Penthouse',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Lekki Contemporary Duplex',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Victoria Island Designer Suite',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab32f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

/**
 * Normalizes any pasted image link into a direct, embeddable image URL.
 * Fixes common causes of rendering failures:
 * 1. Google Drive share links (e.g., /file/d/ID/view, open?id=ID) -> converted to direct lh3.googleusercontent.com/d/ID CDN stream
 * 2. Dropbox share links (e.g., ?dl=0) -> converted to ?raw=1 direct image stream
 * 3. Imgur page links (e.g., imgur.com/ID) -> converted to i.imgur.com/ID.jpg direct image
 * 4. Missing protocols (e.g. images.unsplash.com/...) -> prefixed with https://
 * 5. Accidental surrounding quotes, angle brackets, or trailing whitespace/newlines
 */
export function normalizeImageUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  let url = rawUrl.trim();

  // Strip leading and trailing quotes, brackets, or angle brackets
  url = url.replace(/^[<"'\s]+|[>"'\s]+$/g, '');

  if (!url) return '';

  // 1. Convert Google Drive Links
  // Match patterns:
  // - https://drive.google.com/file/d/FILE_ID/view...
  // - https://drive.google.com/open?id=FILE_ID...
  // - https://drive.google.com/uc?id=FILE_ID...
  const gDriveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (gDriveFileMatch && gDriveFileMatch[1]) {
    const fileId = gDriveFileMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  const gDriveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i);
  if (gDriveIdMatch && gDriveIdMatch[1]) {
    const fileId = gDriveIdMatch[1];
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  // 2. Convert Dropbox Links
  // Dropbox preview links have ?dl=0 or dl=0 in query params, which renders an HTML page instead of raw image bytes.
  // Converting to ?raw=1 directs Dropbox to serve the raw binary image stream.
  if (/dropbox\.com/i.test(url)) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    }
    if (!url.includes('raw=1')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}raw=1`;
    }
    return url;
  }

  // 3. Convert Imgur Page Links to Direct Image URLs
  const imgurMatch = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?$/i);
  if (imgurMatch && imgurMatch[1]) {
    // If not already an image extension, direct to i.imgur.com/ID.jpg
    if (!url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }
  }

  // 4. Convert Unsplash Web Page URLs to direct image CDN URLs
  const unsplashPageMatch = url.match(/^https?:\/\/(?:www\.)?unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/i);
  if (unsplashPageMatch && unsplashPageMatch[1]) {
    return `https://images.unsplash.com/photo-${unsplashPageMatch[1]}?auto=format&fit=crop&w=1200&q=80`;
  }

  // 5. Handle missing protocol (e.g. user pasted `images.unsplash.com/...` or `//domain.com/...`)
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (!/^https?:\/\//i.test(url) && !url.startsWith('data:') && !url.startsWith('blob:') && !url.startsWith('/')) {
    return `https://${url}`;
  }

  return url;
}

/**
 * Returns a human-friendly conversion notice if a link was converted.
 */
export function getLinkConversionNotice(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (/drive\.google\.com/i.test(trimmed)) {
    return 'Converted Google Drive link to direct image stream';
  }
  if (/dropbox\.com/i.test(trimmed) && trimmed.includes('dl=0')) {
    return 'Converted Dropbox link to raw image view';
  }
  if (/imgur\.com/i.test(trimmed) && !trimmed.includes('i.imgur.com')) {
    return 'Converted Imgur page to direct image';
  }
  return null;
}

/**
 * Robust image fallback error handler.
 * Prevents broken image icons and avoids infinite loops by detaching onError.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackIndex = 0
): void {
  const target = event.currentTarget;
  target.onerror = null; // Detach to avoid recursion if fallback fails
  const fallback = FALLBACK_PROPERTY_IMAGES[fallbackIndex % FALLBACK_PROPERTY_IMAGES.length] || DEFAULT_PROPERTY_IMAGE;
  target.src = fallback;
}

/**
 * Collects and normalizes all available images from a Property record.
 * Ensures the returned array is never empty and contains direct, embeddable URLs.
 */
export function getValidPropertyImages(property?: Partial<Property> | null): string[] {
  if (!property) return [DEFAULT_PROPERTY_IMAGE];

  const pool: string[] = [];

  // 1. Gather all sources
  if (Array.isArray(property.images)) {
    pool.push(...property.images);
  }
  if (Array.isArray(property.gallery_images)) {
    pool.push(...property.gallery_images);
  }
  if (property.property_image) {
    pool.push(property.property_image);
  }

  // 2. Normalize and filter
  const cleaned = pool
    .map((url) => normalizeImageUrl(url))
    .filter((url) => Boolean(url) && url.length > 5);

  // 3. Deduplicate
  const unique = Array.from(new Set(cleaned));

  // 4. Return unique or fallback
  return unique.length > 0 ? unique : [DEFAULT_PROPERTY_IMAGE];
}
