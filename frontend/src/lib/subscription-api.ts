import { apiFetch } from './api';

export interface CurrentSubscription {
  plan: 'free' | 'basic' | 'premium';
  status: string;
  endsAt: string | null;
  aiDailyLimit: number;
  aiMonthlyLimit?: number;
  isTrial?: boolean;
  trialDaysLeft?: number;
}

export const getCurrentSubscription = () =>
  apiFetch<CurrentSubscription>('/api/subscriptions/current');
export const upgradePlan = (plan: 'basic' | 'premium') =>
  apiFetch<{ plan: string; mock?: boolean }>('/api/subscriptions/upgrade', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
/** يبدأ الدفع: يعيد { url } لتوجيه الطالب لـ PayPlus، أو { mock } إن لم يُضبط الدفع بعد. */
export const checkoutPlan = (plan: 'basic' | 'premium') =>
  apiFetch<{ url?: string; mock?: boolean; plan?: string }>('/api/subscriptions/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
export const cancelSubscription = () =>
  apiFetch('/api/subscriptions/cancel', { method: 'POST' });

// ---- admin ----
export interface AdminSub {
  id: string;
  plan: string;
  status: string;
  endsAt: string | null;
  effectivePlan: string;
  expired: boolean;
  isPaid: boolean;
  isTrial: boolean;
  student: { id: string; name: string; email: string };
}
export const getAdminSubscriptions = () =>
  apiFetch<{
    subscriptions: AdminSub[];
    monthlyRevenue: number;
    paying: number;
    trials: number;
    counts: Record<string, number>;
  }>('/api/admin/subscriptions');
export const setStudentPlan = (studentId: string, plan: string) =>
  apiFetch(`/api/admin/subscriptions/${studentId}`, {
    method: 'PUT',
    body: JSON.stringify({ plan }),
  });
