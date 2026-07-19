import { apiFetch, ApiClientError } from './api';
import { getToken } from './auth-cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface AiQuota {
  plan: string;
  limit: number;
  used: number;
  remaining: number;
  unlimited?: boolean;
  configured: boolean;
}

export const getAiQuota = () => apiFetch<AiQuota>('/api/ai/quota');

export interface TutorTurn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * يبثّ رد المعلم الذكي رمزاً برمز — streams the tutor reply token-by-token.
 * يستدعي onToken لكل قطعة نص، ويعيد الحصة المتبقية.
 */
export async function streamTutor(
  problemId: string,
  body: {
    message: string;
    attemptsCount: number;
    history: TutorTurn[];
    image?: string;
    mediaType?: 'image/png' | 'image/jpeg';
    starterHintIndex?: number;
  },
  onToken: (chunk: string) => void,
): Promise<{ remaining: number | null }> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/problems/${problemId}/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError('RATE_LIMITED', j?.error?.message ?? 'تجاوزت حدّك اليومي');
  }
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError(j?.error?.code ?? 'AI_ERROR', j?.error?.message ?? 'تعذّر الاتصال بالمساعد');
  }

  const remaining = res.headers.get('X-AI-Remaining');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
  return { remaining: remaining != null ? Number(remaining) : null };
}

/**
 * يبثّ رد معلّم الدرس رمزاً برمز — streams the lesson-teacher reply token-by-token.
 * دردشة مقيّدة بدرس واحد. يعيد الحصة المتبقية.
 */
export async function streamLessonChat(
  lessonId: string,
  body: { message: string; history: TutorTurn[] },
  onToken: (chunk: string) => void,
): Promise<{ remaining: number | null }> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/lessons/${lessonId}/ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError('RATE_LIMITED', j?.error?.message ?? 'تجاوزت حدّك اليومي');
  }
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError(j?.error?.code ?? 'AI_ERROR', j?.error?.message ?? 'تعذّر الاتصال بالمساعد');
  }

  const remaining = res.headers.get('X-AI-Remaining');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
  return { remaining: remaining != null ? Number(remaining) : null };
}

/**
 * يبثّ حكم مصحّح الكود رمزاً برمز — streams the code-judge reply token-by-token.
 * يُستخدم لمسائل علوم الحاسوب (problem.language). يعيد الحصة المتبقية.
 */
export async function streamJudge(
  problemId: string,
  body: {
    code: string;
    history: TutorTurn[];
    hint?: boolean;
    image?: string;
    mediaType?: 'image/png' | 'image/jpeg';
  },
  onToken: (chunk: string) => void,
): Promise<{ remaining: number | null }> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/problems/${problemId}/judge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError('RATE_LIMITED', j?.error?.message ?? 'تجاوزت حدّك اليومي');
  }
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => null);
    throw new ApiClientError(j?.error?.code ?? 'AI_ERROR', j?.error?.message ?? 'تعذّر الاتصال بالمصحّح');
  }

  const remaining = res.headers.get('X-AI-Remaining');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
  return { remaining: remaining != null ? Number(remaining) : null };
}
