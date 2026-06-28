import { getToken } from './auth-cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

/** خطأ قادم من الـ API بحقوله — error carrying the API's code/message. */
export class ApiClientError extends Error {
  code: string;
  details?: unknown;
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

/**
 * يطلب الـ API ويعيد data أو يرمي ApiClientError برسالة عربية واضحة.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  let body: ApiEnvelope<T>;
  try {
    body = await res.json();
  } catch {
    throw new ApiClientError('NETWORK', 'تعذّر الاتصال بالخادم');
  }

  if (!res.ok || !body.success) {
    const err = body.error;
    throw new ApiClientError(err?.code ?? 'ERROR', err?.message ?? 'حدث خطأ', err?.details);
  }
  return body.data as T;
}
