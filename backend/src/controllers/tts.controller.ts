import type { Request, Response } from 'express';
import { z } from 'zod';
import { synthesizeSpeech, isTtsConfigured } from '../services/tts';

const ttsSchema = z.object({
  text: z.string().trim().min(1, 'النص مطلوب').max(3000),
  voice: z.string().max(40).optional(), // تجاوز الصوت الافتراضي (للتجربة)
});

/** GET /api/tts/status — هل خدمة الصوت مهيأة (تستعمله الواجهة لإظهار زر الصوت). */
export function ttsStatus(_req: Request, res: Response) {
  res.json({ success: true, data: { configured: isTtsConfigured() } });
}

/** POST /api/tts — يعيد ملف MP3 لقراءة النص بالعربي. */
export async function synthesizeTts(req: Request, res: Response) {
  const { text, voice } = ttsSchema.parse(req.body);
  const audio = await synthesizeSpeech(text, voice);
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', String(audio.length));
  res.setHeader('Cache-Control', 'private, max-age=86400'); // يخزّنه المتصفح يوماً
  res.end(audio);
}
