'use client';

import { useRef, useState } from 'react';
import {
  getLessonUploadUrl,
  attachLessonVideo,
  getLessonPlayback,
  uploadToUrl,
  type Lesson,
} from '@/lib/content-api';
import { Button } from '@/components/ui/button';

export function LessonVideoUpload({
  lesson,
  onChange,
}: {
  lesson: Lesson;
  onChange: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('video/')) {
      setError('الملف يجب أن يكون فيديو');
      return;
    }
    try {
      setProgress(0);
      const { uploadUrl, key } = await getLessonUploadUrl(lesson.id, file.type, file.name);
      await uploadToUrl(uploadUrl, file, setProgress);
      await attachLessonVideo(lesson.id, key);
      setProgress(null);
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل الرفع');
      setProgress(null);
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function preview() {
    setError(null);
    try {
      const { url } = await getLessonPlayback(lesson.id);
      setPreviewUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر تحميل الفيديو');
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFile}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
        >
          {lesson.videoUrl ? '🎬 استبدال الفيديو' : '⬆️ رفع فيديو'}
        </Button>
        {lesson.videoUrl && !previewUrl && (
          <Button variant="ghost" size="sm" onClick={preview}>
            ▶️ معاينة
          </Button>
        )}
      </div>

      {progress !== null && (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">جارٍ الرفع… {progress}%</p>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {previewUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={previewUrl} controls className="mt-2 w-full max-w-md rounded-md" />
      )}
    </div>
  );
}
