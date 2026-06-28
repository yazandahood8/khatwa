'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserRole } from '@khatwa/shared';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';

const ROLE_LABEL: Record<string, string> = {
  [UserRole.ADMIN]: 'مدير',
  [UserRole.STUDENT]: 'طالب',
  [UserRole.PARENT]: 'ولي أمر',
};

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        🎓 خطوة
      </Link>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-muted-foreground">
            {user.name} · {ROLE_LABEL[user.role] ?? user.role}
          </span>
        )}
        <Link href="/profile">
          <Button variant="ghost" size="sm">
            الملف الشخصي
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          خروج
        </Button>
      </div>
    </header>
  );
}
