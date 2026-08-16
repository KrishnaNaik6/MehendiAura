/**
 * Client-Side WebP Converter & Image Compressor
 * Converts any image (JPEG, PNG, HEIC, WEBP) to high-quality compressed WebP format.
 */
export async function convertToWebP(
  file: File,
  quality = 0.85,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If browser doesn't support canvas or image conversion, fallback to original
    if (typeof window === "undefined" || !window.HTMLCanvasElement) {
      resolve(file);
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve(file); // Fallback to original on read error
    };

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Scale down proportionally if image exceeds max width or max height
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Smooth canvas rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Generate clean webp filename
          const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const webpFileName = `${originalName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.webp`;

          const webpFile = new File([blob], webpFileName, {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(webpFile);
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}
