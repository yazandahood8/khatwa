'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  students: number;
  subjects: number;
  lessons: number;
  problems: number;
}

const CARDS: { key: keyof Stats; label: string; icon: string }[] = [
  { key: 'students', label: 'الطلاب', icon: '👥' },
  { key: 'subjects', label: 'المواد', icon: '📐' },
  { key: 'lessons', label: 'الدروس', icon: '🎬' },
  { key: 'problems', label: 'المسائل', icon: '✏️' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiFetch<Stats>('/api/admin/stats')
      .then(setStats)
      .catch(() => setStats({ students: 0, subjects: 0, lessons: 0, problems: 0 }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة الإدارة</h1>
        <Link href="/admin/content">
          <Button>إدارة المحتوى</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Card key={c.key}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base text-muted-foreground">
                <span>{c.icon}</span>
                {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats ? stats[c.key] : '—'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
