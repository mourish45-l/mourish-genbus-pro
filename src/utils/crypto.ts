/**
 * Cryptographic and Business Utility Helpers
 * Real SHA-256 hashing via native Web Crypto API + Financial & Tax Calculation Utilities
 */

/**
 * Calculates cryptographic SHA-256 digest using native browser Web Crypto API
 * Returns standard 64-character hex string
 */
export async function calculateSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies if content matches its SHA-256 cryptographic fingerprint
 */
export async function verifySha256(text: string, expectedHash: string): Promise<boolean> {
  if (!expectedHash || expectedHash.length !== 64) return false;
  const computed = await calculateSha256(text);
  return computed.toLowerCase() === expectedHash.toLowerCase();
}

/**
 * Format currency in Indian Rupees standard (e.g. ₹1,50,000.00)
 */
export function formatINR(val: number): string {
  return '₹' + (Number(val) || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

/**
 * Format compact INR (e.g. ₹1.5L, ₹12K)
 */
export function formatCompactINR(val: number): string {
  const num = Number(val) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)} K`;
  return `₹${num.toFixed(0)}`;
}
