'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Bell, BookOpen, ChevronDown, PlayCircle, Search, LogOut, Settings, User } from 'lucide-react';
import { DashArt } from '@/components/dashboard-art';
import { useAuth } from '@/providers/auth-provider';
import { searchContent, type SearchResults } from '@/lib/content-api';
import { BrandMark } from '@/components/brand-mark';
import { cn } from '@/lib/utils';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  section?: string;
};

/** قائمة الحساب — account button (initial + arrow) opening profile and logout. */
function AccountMenu({ initials, name, onLogout }: { initials: string; name: string; onLogout: () => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="قائمة الحساب"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full bg-card p-1 pe-2 shadow-subtle transition-colors hover:bg-accent"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
          {initials}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute end-0 top-14 z-50 w-48 rounded-2xl bg-card p-2 shadow-float ring-1 ring-primary/10">
          <p className="truncate px-3 py-2 text-sm font-bold">{name}</p>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
          >
            <User className="h-4 w-4 text-primary" /> ملفّي
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4 text-primary" /> تسجيل الخروج
          </button>
        </div>
      )}
    </div>
  );
}

/** بحث الدروس والمواضيع — live search over existing lessons and topics. */
function HeaderSearch() {
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState<SearchResults | null>(null);
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const t = setTimeout(() => {
      searchContent(term)
        .then((r) => !cancelled && setResults(r))
        .catch(() => !cancelled && setResults({ lessons: [], topics: [] }));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const empty = results && results.lessons.length === 0 && results.topics.length === 0;
  const close = () => {
    setOpen(false);
    setQ('');
  };

  return (
    <div ref={boxRef} className="relative hidden max-w-md flex-1 items-center md:flex">
      <Search className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        placeholder="ابحث عن درس أو موضوع…"
        className="h-10 w-full rounded-full border-2 border-transparent bg-primary-light/70 pe-4 ps-10 text-xs outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/15"
      />
      {open && results && (
        <div className="absolute inset-x-0 top-12 z-50 max-h-80 overflow-y-auto rounded-2xl bg-card p-2 shadow-float ring-1 ring-primary/10">
          {empty && <p className="px-3 py-4 text-center text-sm text-muted-foreground">لا توجد نتائج</p>}
          {results.lessons.map((l) => (
            <Link
              key={l.id}
              href={`/lessons/${l.id}`}
              onClick={close}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
            >
              <PlayCircle className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{l.title}</span>
            </Link>
          ))}
          {results.topics.map((t) => (
            <Link
              key={t.id}
              href="/courses"
              onClick={close}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-accent"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-primary" />
              <span className="truncate">{t.nameAr}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const initials = (user?.name ?? '؟').trim().charAt(0);

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

  return (
    // flow-root: keeps the panel's top margin inside this wrapper so the blue strip above it isn't white.
    // The wrapper carries the blue gradient itself; the sidebar is transparent so strip and sidebar match.
    <div className="min-h-screen bg-secondary/50 lg:flow-root lg:gradient-primary">
      {/* الشريط الجانبي — flush blue sidebar (RIGHT in RTL), the white panel overlaps its left edge */}
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-[17rem] flex-col overflow-hidden py-6 pe-4 ps-8 text-sidebar-foreground lg:flex">
        {/* الشعار — logo */}
        <div className="mb-4 shrink-0 border-b border-white/20 px-2 pb-4">
          <Link href="/" aria-label="خطوة">
            <DashArt name="logo" className="mx-auto h-14" fallback={<BrandMark tone="ink" />} />
          </Link>
        </div>

        {/* التنقّل — nav */}
        <nav className="relative z-10 shrink-0 space-y-1">
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
                        ? 'bg-white/25 text-white shadow-subtle ring-1 ring-white/30'
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

        {/* the rocket is a fixed-size backdrop behind the menu; on short screens it fades so the links stay readable */}
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-0 flex justify-center transition-opacity [@media(max-height:940px)]:opacity-20">
          <DashArt name="sidebar-rocket" className="w-40 max-w-none" />
        </div>
        <div className="flex-1" />

        {/* تسجيل الخروج — logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="relative z-10 mt-3 flex shrink-0 items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-[15px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </aside>

      {/* المحتوى — white rounded panel overlapping the sidebar */}
      <div className="relative z-40 lg:mb-2 lg:ml-2 lg:mr-[15.5rem] lg:mt-2 lg:min-h-[calc(100vh-1rem)] lg:rounded-[2rem] lg:bg-background">
        {/* الشريط العلوي — top bar */}
        <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:rounded-t-[2rem]">
          <BrandMark className="text-lg lg:hidden" />
          {title && <h1 className="sr-only">{title}</h1>}

          <HeaderSearch />

          <div className="ms-auto flex items-center gap-3">
            <Link
              href="/progress"
              aria-label="الإشعارات"
              className="relative grid h-11 w-11 place-items-center rounded-full bg-card text-primary shadow-subtle transition-colors hover:bg-accent"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Link
              href="/settings/subscription"
              aria-label="الإعدادات"
              className="grid h-11 w-11 place-items-center rounded-full bg-card text-primary shadow-subtle transition-colors hover:bg-accent"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <AccountMenu initials={initials} name={user?.name ?? '—'} onLogout={handleLogout} />
          </div>
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
