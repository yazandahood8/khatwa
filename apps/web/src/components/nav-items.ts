import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  CreditCard,
  User,
  Database,
  Sparkles,
  BarChart3,
  Users,
} from 'lucide-react';
import type { NavItem } from '@/components/app-shell';

/** تنقّل الطالب — student navigation. */
export const studentNav: NavItem[] = [
  { href: '/dashboard', label: 'لوحتي', icon: LayoutDashboard },
  { href: '/courses', label: 'الدروس', icon: BookOpen },
  { href: '/progress', label: 'تقدّمي', icon: TrendingUp },
  { href: '/settings/subscription', label: 'الاشتراك', icon: CreditCard, section: 'الحساب' },
  { href: '/profile', label: 'ملفّي', icon: User, section: 'الحساب' },
];

/** تنقّل وليّ الأمر — parent navigation. */
export const parentNav: NavItem[] = [
  { href: '/parent/dashboard', label: 'متابعة الأبناء', icon: Users },
  { href: '/profile', label: 'ملفّي', icon: User, section: 'الحساب' },
];

/** اختر التنقّل المناسب للدور — pick nav by role (for shared pages). */
export function navForRole(role: string | undefined): NavItem[] {
  if (role === 'ADMIN') return adminNav();
  if (role === 'PARENT') return parentNav;
  return studentNav;
}

/** تنقّل الإدارة — admin navigation. `newMethods` drives the badge. */
export function adminNav(newMethods = 0): NavItem[] {
  return [
    { href: '/admin/dashboard', label: 'لوحة الإدارة', icon: LayoutDashboard },
    { href: '/admin/content', label: 'المحتوى', icon: Database },
    {
      href: '/admin/new-methods',
      label: 'الطرق الجديدة',
      icon: Sparkles,
      badge: newMethods || undefined,
    },
    { href: '/admin/subscriptions', label: 'الاشتراكات', icon: CreditCard },
    { href: '/admin/analytics', label: 'الإحصائيات', icon: BarChart3 },
  ];
}
