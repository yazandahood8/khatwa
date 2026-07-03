/**
 * ضغط صورة من الكاميرا إلى base64 (JPEG) ضمن حدّ الحجم — compress a camera photo to a
 * base64 JPEG string (no `data:` prefix) that fits the AI image cap (~4M base64 chars).
 *
 * يرسم الصورة على كانفاس بحدّ أقصى للضلع الأطول ثم يعيد الترميز بجودة متناقصة حتى يدخل
 * ضمن الحدّ — draws onto a canvas capped at `maxEdge`, then re-encodes at falling quality
 * until the base64 length is under `maxBytes`.
 */
export interface CompressResult {
  base64: string; // بدون بادئة data: — bare base64 payload
  mediaType: 'image/jpeg';
}

export async function compressImageToBase64(
  file: File,
  opts: { maxEdge?: number; quality?: number; maxBytes?: number } = {},
): Promise<CompressResult> {
  const maxEdge = opts.maxEdge ?? 1600;
  const maxBytes = opts.maxBytes ?? 3_900_000; // هامش تحت حدّ الخادم (4M)
  let quality = opts.quality ?? 0.85;

  const bitmap = await loadImage(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  let width = Math.max(1, Math.round(bitmap.width * scale));
  let height = Math.max(1, Math.round(bitmap.height * scale));

  for (let attempt = 0; attempt < 8; attempt++) {
    const base64 = drawToJpegBase64(bitmap, width, height, quality);
    if (base64.length <= maxBytes) {
      release(bitmap);
      return { base64, mediaType: 'image/jpeg' };
    }
    // ما زالت كبيرة: قلّل الجودة، ثم الأبعاد — shrink quality first, then dimensions.
    if (quality > 0.4) {
      quality -= 0.15;
    } else {
      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);
    }
  }

  // تسليم آخر محاولة حتى لو تجاوزت قليلاً (نادر) — best effort.
  const base64 = drawToJpegBase64(bitmap, width, height, quality);
  release(bitmap);
  return { base64, mediaType: 'image/jpeg' };
}

type Drawable = ImageBitmap | HTMLImageElement;

async function loadImage(file: File): Promise<Drawable> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file);
    } catch {
      // بعض المتصفحات تفشل مع HEIC وغيره — تراجع إلى <img>.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('تعذّر قراءة الصورة'));
      el.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawToJpegBase64(img: Drawable, width: number, height: number, quality: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; // خلفية بيضاء لأن JPEG لا يدعم الشفافية
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', quality).split(',')[1];
}

function release(img: Drawable) {
  if (typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap) img.close();
}
