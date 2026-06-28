'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { getNotificationCount } from '@/lib/admin-review-api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/admin/dashboard', label: 'لوحة الإدارة', icon: '📊' },
  { href: '/admin/content', label: 'المحتوى', icon: '📚' },
  { href: '/admin/new-methods', label: 'الطرق الجديدة', icon: '🆕', badge: true },
  { href: '/admin/subscriptions', label: 'الاشتراكات', icon: '💳' },
  { href: '/admin/analytics', label: 'الإحصائيات', icon: '📈' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    getNotificationCount()
      .then((c) => setNewCount(c.newMethods))
      .catch(() => {});
  }, [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* الشريط الجانبي — sidebar */}
      <aside className="hidden w-60 shrink-0 border-l bg-muted/30 p-4 sm:block">
        <Link href="/" className="mb-6 block text-xl font-bold">
          🎓 خطوة
        </Link>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent',
              )}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badge && newCount > 0 && (
                <span className="ms-auto rounded-full bg-red-500 px-2 text-xs text-white">
                  {newCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </aside>

      {/* المحتوى — content area */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-6 py-3">
          <span className="text-sm text-muted-foreground sm:hidden">🎓 خطوة — إدارة</span>
          <div className="flex items-center gap-3 ms-auto">
            {user && <span className="text-sm text-muted-foreground">{user.name} · مدير</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                router.push('/login');
              }}
            >
              خروج
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
