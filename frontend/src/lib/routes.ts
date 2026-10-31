import { UserRole } from '@khatwa/shared';

/** الوجهة الافتراضية لكل دور — default landing path per role. */
export function dashboardPathForRole(role: string | undefined): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.PARENT:
      return '/parent/dashboard';
    case UserRole.STUDENT:
    default:
      return '/dashboard';
  }
}
