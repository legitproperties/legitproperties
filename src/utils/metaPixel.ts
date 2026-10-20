/**
 * Meta (Facebook) Pixel Utility
 * Pixel ID: 2563752007437386
 */

export const META_PIXEL_ID = '2563752007437386';

export type MetaPixelStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';

/**
 * Track standard Meta Pixel events
 */
export function trackMetaPixelEvent(
  eventName: MetaPixelStandardEvent | string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (params) {
      window.fbq('track', eventName, params);
    } else {
      window.fbq('track', eventName);
    }
  }
}

/**
 * Track custom Meta Pixel events
 */
export function trackMetaPixelCustomEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (params) {
      window.fbq('trackCustom', eventName, params);
    } else {
      window.fbq('trackCustom', eventName);
    }
  }
}
