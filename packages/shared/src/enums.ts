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
 * التكلفة ~$0.005 للسؤال. الباقة المدفوعة (بريميوم = 100₪) مسقوفة بـ 30/يوم حتى يبقى
 * حتى أكثر مستخدم كثيف رابحاً (~84₪+ صافي). 99% من الطلاب لا يبلغون هذا الحد.
 */
export const AI_DAILY_LIMITS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 10,
  [SubscriptionPlan.BASIC]: 30,
  [SubscriptionPlan.PREMIUM]: 30,
};

/**
 * حدود الأسئلة الشهرية الصارمة — Hard monthly AI caps (safety ceiling on top of the daily cap).
 * تحمي الهامش من الاستخدام المتواصل: بريميوم 500/شهر ⇒ حتى في أسوأ حالة التكلفة ~12.5₪
 * مقابل 100₪، أي هامش ≥ 84%. حدود free/basic هنا لا تُقيّد قبل الحد اليومي (daily×30).
 */
export const AI_MONTHLY_LIMITS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.FREE]: 300,
  [SubscriptionPlan.BASIC]: 500,
  [SubscriptionPlan.PREMIUM]: 500,
};
