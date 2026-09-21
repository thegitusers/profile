const DEFAULT_MAX_DIMENSION = 1600;

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL("image/jpeg", quality);
}

// Resizes to a max dimension and re-encodes as JPEG, stepping quality down
// until the result fits under maxBytes. Keeps big phone photos usable
// without the user having to shrink them by hand first.
export async function compressImage(
  file: File,
  maxBytes: number,
  maxDimension: number = DEFAULT_MAX_DIMENSION,
): Promise<string> {
  const img = await fileToImage(file);

  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(img, 0, 0, width, height);

  let quality = 0.85;
  let dataUrl = canvasToDataUrl(canvas, quality);

  while (dataUrl.length > maxBytes * 1.37 && quality > 0.35) {
    quality -= 0.15;
    dataUrl = canvasToDataUrl(canvas, quality);
  }

  return dataUrl;
}
