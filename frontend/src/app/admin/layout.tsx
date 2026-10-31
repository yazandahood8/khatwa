'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getNotificationCount } from '@/lib/admin-review-api';
import { AppShell } from '@/components/app-shell';
import { adminNav } from '@/components/nav-items';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    getNotificationCount()
      .then((c) => setNewCount(c.newMethods))
      .catch(() => {});
  }, [pathname]);

  return (
    <AppShell nav={adminNav(newCount)} title="لوحة الإدارة">
      {children}
    </AppShell>
  );
}
