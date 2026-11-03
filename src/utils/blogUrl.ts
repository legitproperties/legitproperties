import { BlogPost } from '../types';

export function getBlogPostSlug(post: { id?: string; slug?: string; title?: string }): string {
  if (post.slug && post.slug.trim().length > 0) {
    return post.slug.trim();
  }
  if (post.title && post.title.trim().length > 0) {
    const generated = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (generated.length > 2) {
      return generated;
    }
  }
  return post.id || 'article';
}

/**
 * Returns the shareable URL for a blog post.
 * Uses hash routing fallback to be resilient against static CDN 404s.
 */
export function getBlogUrl(post: { id?: string; slug?: string; title?: string }): string {
  const slug = getBlogPostSlug(post);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/blogs#${encodeURIComponent(slug)}`;
}

/**
 * Parses the current URL to check if a specific blog slug is requested.
 */
export function parseBlogSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const hash = window.location.hash || '';
    const pathname = window.location.pathname || '';
    const search = window.location.search || '';

    // 1. Hash match: #/blogs/my-slug or #/blog/my-slug
    const hashMatch = hash.match(/#\/?(?:blogs|blog)\/([^/?#]+)/i);
    if (hashMatch && hashMatch[1]) {
      return decodeURIComponent(hashMatch[1]);
    }

    // 2. Hash anchor on /blogs: /blogs#my-slug
    if (pathname.includes('/blogs') || pathname.includes('/blog')) {
      if (hash && hash.length > 1 && !hash.startsWith('#/')) {
        return decodeURIComponent(hash.replace(/^#/, ''));
      }
    }

    // 3. Query param: ?article=my-slug or ?post=my-slug
    const params = new URLSearchParams(search);
    const queryPost = params.get('article') || params.get('post') || params.get('blog');
    if (queryPost && queryPost.trim()) {
      return decodeURIComponent(queryPost.trim());
    }

    // 4. Path match: /blogs/my-slug or /blog/my-slug
    const pathMatch = pathname.match(/^\/(?:blogs|blog)\/([^/?#]+)/i);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }

    return null;
  } catch (err) {
    console.error('Error parsing blog slug from URL:', err);
    return null;
  }
}

/**
 * Copy blog post URL to clipboard.
 */
export async function copyBlogLinkToClipboard(post: { id?: string; slug?: string; title?: string }): Promise<boolean> {
  const url = getBlogUrl(post);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard writeText failed, trying fallback:', err);
  }

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
