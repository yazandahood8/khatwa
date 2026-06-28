import { NextResponse, type NextRequest } from 'next/server';
import { UserRole } from '@khatwa/shared';
import { dashboardPathForRole } from '@/lib/routes';

const TOKEN_COOKIE = 'khatwa_token';
const ROLE_COOKIE = 'khatwa_role';

// مسارات محمية حسب الدور — protected path prefixes per allowed role
const ALL_ROLES = [UserRole.ADMIN, UserRole.STUDENT, UserRole.PARENT];
const PROTECTED: { prefix: string; roles: UserRole[] }[] = [
  { prefix: '/admin', roles: [UserRole.ADMIN] },
  { prefix: '/parent', roles: [UserRole.PARENT] },
  { prefix: '/dashboard', roles: [UserRole.STUDENT] },
  { prefix: '/progress', roles: [UserRole.STUDENT] },
  { prefix: '/profile', roles: ALL_ROLES },
  { prefix: '/courses', roles: ALL_ROLES },
  { prefix: '/lessons', roles: ALL_ROLES },
  { prefix: '/problems', roles: ALL_ROLES },
  { prefix: '/settings', roles: ALL_ROLES },
];

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const role = req.cookies.get(ROLE_COOKIE)?.value as UserRole | undefined;
  const isLoggedIn = Boolean(token);

  // مستخدم مسجّل يحاول فتح صفحة دخول/تسجيل → وجّهه للوحته
  if (isLoggedIn && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL(dashboardPathForRole(role), req.url));
  }

  const rule = PROTECTED.find((r) => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();

  // غير مسجّل → صفحة الدخول مع callback
  if (!isLoggedIn) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // مسجّل لكن دوره لا يطابق → وجّهه للوحته الصحيحة
  if (role && !rule.roles.includes(role)) {
    return NextResponse.redirect(new URL(dashboardPathForRole(role), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/parent/:path*',
    '/dashboard/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/courses/:path*',
    '/lessons/:path*',
    '/problems/:path*',
    '/settings/:path*',
    ...AUTH_PAGES,
  ],
};
