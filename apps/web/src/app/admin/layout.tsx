'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NAV = [
  { href: '/admin/dashboard', label: 'لوحة الإدارة', icon: '📊' },
  { href: '/admin/content', label: 'المحتوى', icon: '📚' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

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
