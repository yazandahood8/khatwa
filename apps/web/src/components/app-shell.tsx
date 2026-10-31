'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Bell, Search, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { BrandMark } from '@/components/brand-mark';
import { cn } from '@/lib/utils';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  section?: string;
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'مدير',
  STUDENT: 'طالب',
  PARENT: 'وليّ أمر',
};

/**
 * الهيكل العام — RTL app shell: ink sidebar (graph-paper texture) on the RIGHT,
 * 64px paper top bar, mobile bottom tab bar. The active item carries the
 * red margin rule. Pass role-specific `nav`.
 */
export function AppShell({
  nav,
  title,
  children,
}: {
  nav: NavItem[];
  title?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  function handleLogout() {
    logout();
    router.push('/login');
  }

  // Group nav by section for the section labels
  const sections = React.useMemo(() => {
    const map = new Map<string, NavItem[]>();
    for (const item of nav) {
      const key = item.section ?? '';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries());
  }, [nav]);

  const initials = (user?.name ?? '؟').trim().charAt(0);

  return (
    <div className="min-h-screen bg-background">
      {/* الشريط الجانبي — sidebar (RIGHT in RTL) */}
      <aside className="gradient-primary fixed inset-y-0 right-0 z-40 hidden w-60 flex-col px-4 py-6 text-sidebar-foreground lg:flex">
        {/* الشعار — logo */}
        <div className="mb-6 border-b border-white/[0.1] px-2 pb-5">
          <BrandMark tone="ink" />
        </div>

        {/* التنقّل — nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
          {sections.map(([section, items]) => (
            <div key={section || 'main'}>
              {section && (
                <p className="mb-2 mt-6 flex items-center gap-2 px-3 text-[11px] font-semibold tracking-[0.08em] text-white/40">
                  {section}
                  <span className="h-px flex-1 bg-white/[0.1]" />
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium transition-colors duration-200',
                      active
                        ? 'bg-white/[0.08] text-white'
                        : 'text-white/60 hover:bg-white/[0.05] hover:text-white',
                    )}
                  >
                    {/* علامة الهامش — margin-rule marker on the active item */}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-y-2 start-0 w-[3px] rounded-sm bg-margin transition-transform duration-200 origin-center',
                        active ? 'scale-y-100' : 'scale-y-0',
                      )}
                    />
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-sm bg-highlight px-1.5 text-[11px] font-bold text-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* المستخدم — user footer */}
        <div className="mt-4 flex items-center gap-3 border-t border-white/[0.1] px-2 pt-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/20 font-display font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? '—'}</p>
            <p className="truncate text-xs text-white/45">{ROLE_LABEL[user?.role ?? ''] ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
            className="rounded-md p-1.5 text-white/55 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>

      {/* المحتوى — content (offset for sidebar in RTL) */}
      <div className="lg:mr-60">
        {/* الشريط العلوي — top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm sm:px-6">
          <BrandMark className="text-lg lg:hidden" />
          {title && (
            <h1 className="hidden items-center gap-3 font-display text-lg font-semibold lg:flex">
              <span aria-hidden className="h-5 w-[3px] rounded-sm bg-margin" />
              {title}
            </h1>
          )}

          <div className="relative ms-auto hidden max-w-xs flex-1 items-center md:flex">
            <Search className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="ابحث عن درس أو موضوع…"
              className="h-10 w-full rounded-md border-[1.5px] border-input bg-card pr-10 ps-4 text-sm outline-none transition-all focus:border-primary focus:ring-[3px] focus:ring-primary/15"
            />
          </div>

          <button
            aria-label="الإشعارات"
            className="relative ms-auto grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary md:ms-0"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-margin ring-2 ring-background" />
          </button>
          <Link
            href="/settings/subscription"
            aria-label="الإعدادات"
            className="grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <span className="grid h-9 w-9 place-items-center rounded-md border-[1.5px] border-foreground bg-card font-display text-sm font-bold text-foreground">
            {initials}
          </span>
        </header>

        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* شريط التنقّل السفلي — mobile bottom tab bar (max 5) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t-[1.5px] border-foreground/80 bg-card px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {/* علامة الخطوة الحالية — active tab tick */}
              <span
                aria-hidden
                className={cn(
                  'absolute -top-1.5 h-[3px] w-6 rounded-sm bg-margin transition-transform duration-200',
                  active ? 'scale-x-100' : 'scale-x-0',
                )}
              />
              <Icon className="h-5 w-5" />
              <span className={cn('truncate', active && 'font-semibold')}>{item.label}</span>
              {item.badge ? (
                <span className="absolute right-2 top-0 h-4 min-w-4 rounded-sm bg-highlight px-1 text-[10px] font-bold leading-4 text-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
