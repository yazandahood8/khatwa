/**
 * خطأ HTTP موحّد — Typed HTTP error.
 * يُلتقط في error.middleware ويُحوَّل لاستجابة JSON منظّمة.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'غير مصرّح') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'ممنوع') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(message = 'غير موجود') {
    return new ApiError(404, 'NOT_FOUND', message);
  }

  static internal(message = 'خطأ داخلي في الخادم') {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
