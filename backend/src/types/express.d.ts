import type { UserRole } from '@khatwa/shared';

/** توسيع نوع Request ليحمل المستخدم المصادَق — augment Express Request with auth user. */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
