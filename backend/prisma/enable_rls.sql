-- ============================================================================
-- إصلاح تنبيه Supabase الأمني: rls_disabled_in_public
-- ----------------------------------------------------------------------------
-- يُفعّل Row-Level Security على كل جداول مخطّط public.
-- التطبيق يستخدم Prisma فقط (بدور postgres الذي يتجاوز RLS)، فلن يتأثّر عمله.
-- بينما تُحجب واجهة PostgREST العامة (أدوار anon / authenticated) تماماً
-- لأنه لا توجد سياسات (policies) تسمح لها بأي صف.
--
-- كيفية التشغيل: Supabase Dashboard → SQL Editor → الصق ونفّذ (Run).
-- (يجب أولاً استئناف المشروع إن كان في وضع الإيقاف المؤقّت.)
--
-- ملاحظة: نستعمل ENABLE فقط (وليس FORCE)، حتى يبقى مالك الجدول/الدور
-- الذي يتّصل به Prisma قادراً على القراءة والكتابة دون قيود.
-- ============================================================================

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
    RAISE NOTICE 'RLS enabled on public.%', r.tablename;
  END LOOP;
END $$;

-- للتحقّق بعد التنفيذ: يجب أن تكون rowsecurity = true لكل الجداول.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
