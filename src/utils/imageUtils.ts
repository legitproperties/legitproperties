/**
 * Image normalization, link sanitization, and fallback utilities.
 * Ensures image links pasted from Postimages, Google Drive, Dropbox, Imgur,
 * Unsplash, Cloudinary, ImgBB, and other services render properly in <img> tags.
 */

export const DEFAULT_PROPERTY_IMAGE =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

/**
 * Curated high-resolution verified real estate images for luxury Lagos listings
 */
export const CURATED_PROPERTY_IMAGES = [
  {
    title: 'Modern Luxury Villa Exterior',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    category: 'Exterior'
  },
  {
    title: 'Grand Living Room & High Ceiling',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    category: 'Interior'
  },
  {
    title: 'Designer Chef Kitchen & Marble Island',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    category: 'Kitchen'
  },
  {
    title: 'Master Bedroom Suite & Balcony',
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    category: 'Bedroom'
  },
  {
    title: 'Private Infinity Pool & Lounge Deck',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    category: 'Outdoor'
  },
  {
    title: 'Prime Gated Estate Land Plot',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    category: 'Land'
  }
];

/**
 * Normalizes any pasted image link into a clean, direct-embeddable HTTP(S) URL.
 */
export function normalizeImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  let url = rawUrl.trim();

  // 1. Data URLs (e.g. data:image/jpeg;base64,...) are already direct image data
  if (url.startsWith('data:image/')) {
    return url;
  }

  // 2. Direct CDN pattern match inside pasted snippet (handles Postimages, ImgBB, Unsplash, Imgur, Cloudinary)
  // When users paste markdown or BBCode from Postimages, this extracts the direct i.postimg.cc link directly!
  const directCdnMatch = url.match(
    /(https?:\/\/(?:i\.postimg\.cc|i\.ibb\.co|i\.imgur\.com|images\.unsplash\.com|res\.cloudinary\.com|lh3\.googleusercontent\.com|dl\.dropboxusercontent\.com)[^\s"'()\]<>[\]]+)/i
  );
  if (directCdnMatch && directCdnMatch[1]) {
    url = directCdnMatch[1].trim();
  }

  // 3. Extract from Markdown: ![alt](url) or [alt](url)
  const mdMatch =
    url.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/i) ||
    url.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/i);
  if (mdMatch && mdMatch[1]) {
    url = mdMatch[1].trim();
  }

  // 4. Extract from BBCode: [img]url[/img]
  const bbMatch = url.match(/\[img\]\s*(https?:\/\/[^\s\]]+)\s*\[\/img\]/i);
  if (bbMatch && bbMatch[1]) {
    url = bbMatch[1].trim();
  }

  // 5. Extract from HTML: <img src="url" ... />
  const htmlMatch = url.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (htmlMatch && htmlMatch[1]) {
    url = htmlMatch[1].trim();
  }

  // 6. Remove wrapping quotes, angle brackets, parentheses, trailing punctuation
  url = url.replace(/^["'`<(\[]+|["'`>)\]]+$/g, '').trim();
  url = url.replace(/[,;]+$/g, '').trim();

  // 7. Handle Google Images search link (decode imgurl parameter)
  // e.g. https://www.google.com/imgres?imgurl=https%3A%2F%2F...
  if (url.includes('google.') && url.includes('imgurl=')) {
    try {
      const match = url.match(/[?&]imgurl=([^&]+)/i);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
          url = decoded;
        }
      }
    } catch {
      // ignore
    }
  }

  // 8. Add protocol if missing
  if (url.startsWith('//')) {
    url = 'https:' + url;
  } else if (!/^https?:\/\//i.test(url)) {
    // If user pasted starting with domain (e.g. i.postimg.cc/... or drive.google.com/...)
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\//.test(url)) {
      url = 'https://' + url;
    }
  }

  // 9. Handle Google Drive Share links
  // e.g., https://drive.google.com/file/d/1abcXYZ_123/view?usp=sharing
  // e.g., https://drive.google.com/open?id=1abcXYZ_123
  // e.g., https://drive.google.com/uc?id=1abcXYZ_123
  // e.g., https://drive.google.com/uc?export=view&id=1abcXYZ_123
  const gdriveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  const gdriveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]*&)*id=([a-zA-Z0-9_-]+)/i);
  const gdriveId = gdriveFileMatch?.[1] || gdriveIdMatch?.[1];
  if (gdriveId) {
    // drive.google.com/thumbnail serves direct high-res image across all devices without auth barriers
    return `https://drive.google.com/thumbnail?id=${gdriveId}&sz=w1600`;
  }

  // 10. Handle Dropbox links
  // e.g., https://www.dropbox.com/s/xyz/photo.jpg?dl=0 -> convert to dl.dropboxusercontent.com or raw=1
  if (/dropbox\.com/i.test(url)) {
    // Convert to dl.dropboxusercontent.com which serves CORS and raw image directly
    let cleanDropbox = url.replace(/www\.dropbox\.com/i, 'dl.dropboxusercontent.com');
    cleanDropbox = cleanDropbox.replace(/[?&]dl=[01]/i, '');
    cleanDropbox = cleanDropbox.replace(/[?&]raw=[01]/i, '');
    const sep = cleanDropbox.includes('?') ? '&' : '?';
    return `${cleanDropbox}${sep}raw=1`;
  }

  // 11. Handle Imgur page links: https://imgur.com/xyz -> https://i.imgur.com/xyz.jpg
  const imgurMatch = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/i);
  if (imgurMatch && imgurMatch[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  // 12. Handle Unsplash page link: https://unsplash.com/photos/xyz
  const unsplashMatch = url.match(/^https?:\/\/(?:www\.)?unsplash\.com\/photos\/([a-zA-Z0-9_-]+)$/i);
  if (unsplashMatch && unsplashMatch[1]) {
    return `https://images.unsplash.com/photo-${unsplashMatch[1]}?auto=format&fit=crop&w=1200&q=80`;
  }

  // 13. Handle GitHub blob link -> raw link
  // e.g. https://github.com/user/repo/blob/main/photo.jpg -> https://raw.githubusercontent.com/user/repo/main/photo.jpg
  if (url.includes('github.com') && url.includes('/blob/')) {
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  return url;
}

/**
 * Checks if a URL is a Postimages viewer page link (e.g. https://postimg.cc/8sYyXn1Z)
 * instead of the direct image link (https://i.postimg.cc/8sYyXn1Z/photo.jpg).
 */
export function isPostimagesViewerUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return /(?:postimg\.cc|postimages\.org\/image)\/([a-zA-Z0-9]+)/i.test(url) && !url.includes('i.postimg.cc');
}

/**
 * Extracts multiple image URLs from pasted text (e.g. multi-line or comma-separated lists).
 */
export function extractImageUrls(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  // Match all potential URL sequences in the text
  const urlRegex = /(?:https?:\/\/|www\.|i\.postimg\.cc|i\.ibb\.co)[^\s,"'<>()\[\]]+/gi;
  const matches = text.match(urlRegex) || [];

  if (matches.length > 0) {
    const list = matches.map(normalizeImageUrl).filter(Boolean);
    return Array.from(new Set(list));
  }

  // Fallback: split by newlines, commas, or spaces
  const parts = text.split(/[\r\n,;]+/).map((s) => s.trim()).filter(Boolean);
  const result = parts
    .map(normalizeImageUrl)
    .filter((u) => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/'));

  return Array.from(new Set(result));
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL or data URL.
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim();
  return clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:image/');
}

/**
 * Converts a browser File object to a base64 Data URL.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}
