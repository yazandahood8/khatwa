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

/** حدود الأسئلة اليومية للذكاء الاصطناعي حسب الباقة — Daily AI question limits */
export const AI_DAILY_LIMITS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 3,
  [SubscriptionPlan.BASIC]: 10,
  [SubscriptionPlan.PREMIUM]: 30,
};
