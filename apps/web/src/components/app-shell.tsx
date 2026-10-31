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
    <div className="min-h-screen bg-secondary/50">
      {/* الشريط الجانبي — floating blue sidebar (RIGHT in RTL) */}
      <aside className="gradient-primary fixed inset-y-3 right-3 z-40 hidden w-60 flex-col overflow-hidden rounded-3xl px-4 py-6 text-sidebar-foreground shadow-float lg:flex">
        {/* الشعار — logo */}
        <div className="mb-6 border-b border-white/20 px-2 pb-5">
          <BrandMark tone="ink" />
        </div>

        {/* التنقّل — nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
          {sections.map(([section, items]) => (
            <div key={section || 'main'}>
              {section && (
                <p className="mb-2 mt-6 flex items-center gap-2 px-3 text-[11px] font-bold tracking-[0.08em] text-white/70">
                  {section}
                  <span className="h-px flex-1 bg-white/20" />
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
                      'group relative flex min-h-11 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-all duration-200',
                      active
                        ? 'bg-lime text-foreground shadow-[0_3px_0_0_hsl(var(--lime-dark))]'
                        : 'text-white/85 hover:bg-white/15 hover:text-white',
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1.5 text-[11px] font-bold text-foreground">
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
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/15 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white font-display text-lg font-bold text-primary">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.name ?? '—'}</p>
            <p className="truncate text-xs text-white/75">{ROLE_LABEL[user?.role ?? ''] ?? ''}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
            className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>

      {/* المحتوى — content (offset for sidebar in RTL) */}
      <div className="lg:mr-[16.5rem]">
        {/* الشريط العلوي — top bar */}
        <header className="sticky top-0 z-30 flex h-[4.25rem] items-center gap-3 bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <BrandMark className="text-lg lg:hidden" />
          {title && (
            <h1 className="hidden items-center gap-3 font-display text-xl font-extrabold lg:flex">
              <span aria-hidden className="h-3 w-3 rounded-full bg-lime ring-4 ring-lime/30" />
              {title}
            </h1>
          )}

          <div className="relative ms-auto hidden max-w-xs flex-1 items-center md:flex">
            <Search className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="ابحث عن درس أو موضوع…"
              className="h-11 w-full rounded-full border-2 border-transparent bg-card pe-4 ps-10 text-sm shadow-subtle outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/15"
            />
          </div>

          <button
            aria-label="الإشعارات"
            className="relative ms-auto grid h-11 w-11 place-items-center rounded-full bg-card text-muted-foreground shadow-subtle transition-colors hover:bg-accent hover:text-primary md:ms-0"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-margin ring-2 ring-card" />
          </button>
          <Link
            href="/settings/subscription"
            aria-label="الإعدادات"
            className="grid h-11 w-11 place-items-center rounded-full bg-card text-muted-foreground shadow-subtle transition-colors hover:bg-accent hover:text-primary"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground shadow-glow-primary">
            {initials}
          </span>
        </header>

        <main className="px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>

      {/* شريط التنقّل السفلي — mobile bottom tab bar (max 5) */}
      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-3xl bg-card px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))] pt-1.5 shadow-float ring-1 ring-primary/10 lg:hidden">
        {nav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1 text-[11px] font-semibold transition-all',
                active ? 'bg-primary text-primary-foreground shadow-glow-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
              {item.badge ? (
                <span className="absolute right-1 top-0 h-4 min-w-4 rounded-full bg-lime px-1 text-center text-[10px] font-bold leading-4 text-foreground">
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
