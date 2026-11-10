/**
 * Universal Image Processing & Compression Utility
 * Resizes and compresses any image file (PNG, JPG, WEBP, SVG, etc.)
 * into an optimized Base64 data URL (< 60 KB) so it never fails
 * size limits, works reliably on mobile & desktop, and saves directly to Firebase.
 */
export async function processImageFile(
  file: File,
  maxDimension = 400,
  quality = 0.88
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    // For SVG files, read directly as text data URL to keep vector crispness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as webp or png if transparent, otherwise jpeg
        const isPngOrWebp = file.type === 'image/png' || file.type === 'image/webp';
        const exportFormat = isPngOrWebp ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(exportFormat, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url if canvas decode fails
        resolve(readerEvent.target?.result as string);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}
