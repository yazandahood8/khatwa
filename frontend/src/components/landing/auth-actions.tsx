'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { dashboardPathForRole } from '@/lib/routes';

/** أزرار الشريط العلوي: زر "لوحتي" لو مسجّل دخول، وإلا تسجيل الدخول + ابدأ مجاناً */
export function NavAuthActions() {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-9 w-28" aria-hidden />;

  if (user) {
    return (
      <Link href={dashboardPathForRole(user.role)}>
        <Button size="sm">لوحتي</Button>
      </Link>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="ghost" size="sm">
          تسجيل الدخول
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">ابدأ مجاناً</Button>
      </Link>
    </>
  );
}

/** زر الدعوة الرئيسي في البطل */
export function HeroCta() {
  const { user } = useAuth();

  return (
    <Link href={user ? dashboardPathForRole(user.role) : '/register'}>
      <Button size="lg">
        {user ? 'الذهاب للوحتي' : 'ابدأ مجاناً'} <ArrowLeft />
      </Button>
    </Link>
  );
}
