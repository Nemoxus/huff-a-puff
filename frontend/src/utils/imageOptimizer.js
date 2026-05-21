/**
 * Injects Cloudinary optimization parameters (f_auto, q_auto) into a secure URL.
 * If the URL is not from Cloudinary, it returns the original URL safely.
 */
export function getOptimizedImageUrl(url) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  
  // Replace '/upload/' with '/upload/f_auto,q_auto/'
  return url.replace('/upload/', '/upload/f_auto,q_auto/');
}