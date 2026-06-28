/** أدوار المستخدمين — User roles */
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  PARENT = 'parent',
}

/** باقات الاشتراك — Subscription plans */
export enum SubscriptionPlan {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

/** حالة الاشتراك — Subscription status */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

/** مستوى صعوبة المسألة — Problem difficulty */
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/** أنواع إشعارات الأدمن — Admin notification types */
export enum AdminNotificationType {
  NEW_METHOD = 'new_method',
  NEW_STUDENT = 'new_student',
  PAYMENT = 'payment',
}

/**
 * حدود الأسئلة اليومية للذكاء الاصطناعي حسب الباقة — Daily AI question limits.
 * ملاحظة: المساعد يرد على كل خطوة تلقائياً، فالأرقام سخية عمداً (المسألة الواحدة ~5-8 أسئلة).
 * التكلفة ~$0.005 للسؤال، فالهامش يبقى مرتفعاً.
 */
export const AI_DAILY_LIMITS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 10,
  [SubscriptionPlan.BASIC]: 50,
  [SubscriptionPlan.PREMIUM]: 150,
};
