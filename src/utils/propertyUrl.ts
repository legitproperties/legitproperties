import { Property } from '../types';

/**
 * Returns a URL-friendly identifier for the property (slug if available, otherwise id).
 */
export function getPropertySlug(property: { id: string; slug?: string; title?: string }): string {
  if (property.slug && property.slug.trim().length > 0) {
    return property.slug.trim();
  }
  if (property.title && property.title.trim().length > 0) {
    const generated = property.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (generated.length > 2) {
      return `${generated}-${property.id.slice(0, 8)}`;
    }
  }
  return property.id;
}

/**
 * Generates the unique, direct public URL for a property.
 * Example: https://legitproperties.com/property/ikoyi-luxury-waterfront-penthouse
 */
export function getPropertyUrl(property: { id: string; slug?: string; title?: string }): string {
  const slug = getPropertySlug(property);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/property/${encodeURIComponent(slug)}`;
}

/**
 * Generates the relative link for navigation and anchor tags.
 */
export function getPropertyRelativePath(property: { id: string; slug?: string; title?: string }): string {
  const slug = getPropertySlug(property);
  return `/property/${encodeURIComponent(slug)}`;
}

/**
 * Parses the current browser URL to find if a property is directly targeted.
 * Supports:
 * - Direct path: /property/:idOrSlug or /properties/:idOrSlug
 * - Hash routing: #/property/:idOrSlug or #property=:idOrSlug
 * - Query parameter: ?property=:idOrSlug or ?p=:idOrSlug
 */
export function parsePropertyIdentifierFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const pathname = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;

    // 1. Check Path: /property/{slug} or /properties/{slug}
    const pathMatch = pathname.match(/^\/(?:property|properties)\/([^/?#]+)/i);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }

    // 2. Check Hash: #/property/{slug} or #property/{slug}
    const hashMatch = hash.match(/#\/?(?:property|properties)\/([^/?#]+)/i);
    if (hashMatch && hashMatch[1]) {
      return decodeURIComponent(hashMatch[1]);
    }

    // 3. Check Query parameter: ?property={slug} or ?p={slug}
    const params = new URLSearchParams(search);
    const queryProperty = params.get('property') || params.get('prop') || params.get('p');
    if (queryProperty && queryProperty.trim()) {
      return decodeURIComponent(queryProperty.trim());
    }

    // 4. Check hash query: #...property={slug}
    if (hash.includes('property=') || hash.includes('p=')) {
      const hashParams = new URLSearchParams(hash.slice(hash.indexOf('?')));
      const hashQueryProp = hashParams.get('property') || hashParams.get('p');
      if (hashQueryProp) {
        return decodeURIComponent(hashQueryProp.trim());
      }
    }

    return null;
  } catch (err) {
    console.error('Error parsing property from URL:', err);
    return null;
  }
}

/**
 * Copies the unique property link to the clipboard.
 */
export async function copyPropertyLinkToClipboard(property: { id: string; slug?: string; title?: string }): Promise<boolean> {
  const url = getPropertyUrl(property);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard writeText failed, trying fallback:', err);
  }

  // Fallback for older browsers or restricted contexts
  try {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
