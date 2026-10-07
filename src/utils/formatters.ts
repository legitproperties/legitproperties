import { CurrencyCode } from '../types';

export const USD_RATE = 1500;
export const GBP_RATE = 1950;

/**
 * Format an amount in USD ($) cleanly
 */
export const formatUsd = (usdAmount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(usdAmount);
};

/**
 * Format dual currency prices (Naira ₦ and US Dollars $)
 * If priceUsd is specified, uses that; otherwise converts priceNgn at USD_RATE.
 */
export const formatDualPrice = (
  priceNgn: number,
  priceUsd?: number | null,
  unitLabel: string = ''
): {
  ngnFormatted: string;
  usdFormatted: string;
  combined: string;
  compactNgn: string;
  compactUsd: string;
} => {
  const ngnVal = Number(priceNgn) || 0;
  const effectiveUsd = (priceUsd !== undefined && priceUsd !== null && priceUsd > 0)
    ? Number(priceUsd)
    : Math.round(ngnVal / USD_RATE);

  const ngnFormatted = `₦${ngnVal.toLocaleString('en-NG')}${unitLabel}`;
  const usdFormatted = `$${effectiveUsd.toLocaleString('en-US')}${unitLabel}`;
  const combined = `${ngnFormatted} (${usdFormatted})`;

  const compactNgn = formatCompactPrice(ngnVal, 'NGN');
  const compactUsd = effectiveUsd >= 1000000 
    ? `$${(effectiveUsd / 1000000).toFixed(1)}M` 
    : effectiveUsd >= 1000 
      ? `$${(effectiveUsd / 1000).toFixed(0)}K` 
      : `$${effectiveUsd}`;

  return {
    ngnFormatted,
    usdFormatted,
    combined,
    compactNgn,
    compactUsd
  };
};

export const formatCurrency = (
  amountNgn: number,
  currencyCode: CurrencyCode = 'NGN'
): string => {
  if (currencyCode === 'USD') {
    const usd = amountNgn / USD_RATE;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(usd);
  }

  if (currencyCode === 'GBP') {
    const gbp = amountNgn / GBP_RATE;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(gbp);
  }

  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amountNgn);
};

export const formatCompactPrice = (
  amountNgn: number,
  currencyCode: CurrencyCode = 'NGN'
): string => {
  if (currencyCode === 'USD') {
    const usd = amountNgn / USD_RATE;
    if (usd >= 1000000) return `$${(usd / 1000000).toFixed(2)}M`;
    if (usd >= 1000) return `$${(usd / 1000).toFixed(0)}K`;
    return `$${usd.toFixed(0)}`;
  }

  if (currencyCode === 'GBP') {
    const gbp = amountNgn / GBP_RATE;
    if (gbp >= 1000000) return `£${(gbp / 1000000).toFixed(2)}M`;
    if (gbp >= 1000) return `£${(gbp / 1000).toFixed(0)}K`;
    return `£${gbp.toFixed(0)}`;
  }

  if (amountNgn >= 1000000000) {
    return `₦${(amountNgn / 1000000000).toFixed(2)} Billion`;
  }
  if (amountNgn >= 1000000) {
    return `₦${(amountNgn / 1000000).toFixed(1)} Million`;
  }
  if (amountNgn >= 1000) {
    return `₦${(amountNgn / 1000).toFixed(0)}K`;
  }
  return `₦${amountNgn.toLocaleString('en-NG')}`;
};

export const createWhatsAppInquiryUrl = (
  propertyTitle: string,
  propertyId: string,
  priceFormatted: string,
  phone: string = '2348030001122'
): string => {
  const message = `Hello legitproperties.com.ng! I am interested in acquiring/verifying this property:\n\nProperty: ${propertyTitle}\nRef Code: ${propertyId}\nPrice: ${priceFormatted}\n\nPlease share the verified title documents and schedule a virtual or in-person site inspection.`;
  return `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
};
