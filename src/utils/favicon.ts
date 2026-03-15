/**
 * Get favicon URL for a given website URL
 * @param url - Website URL
 * @returns Favicon URL
 */
export function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
  } catch {
    return 'https://via.placeholder.com/64?text=?'
  }
}

/**
 * Get website title from URL for display
 * @param url - Website URL
 * @returns Formatted title
 */
export function getWebsiteTitle(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
