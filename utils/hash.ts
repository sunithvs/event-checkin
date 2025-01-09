/**
 * Encodes an email address to be used in a QR code
 * @param email The email address to encode
 * @returns Base64 encoded string
 */
export function encodeEmail(email: string): string {
  return btoa(email.toLowerCase());
}

/**
 * Decodes an encoded email address from a QR code
 * @param encoded The encoded email string
 * @returns Decoded email address
 */
export function decodeEmail(encoded: string): string {
  try {
    return atob(encoded).toLowerCase();
  } catch (error) {
    throw new Error('Invalid encoded email');
  }
}
