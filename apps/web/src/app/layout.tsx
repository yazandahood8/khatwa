import type { Metadata } from 'next';
import { Baloo_Bhaijaan_2, Tajawal, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { ToastProvider } from '@/components/ui/toast';

// خط العناوين — display headings (bold, rounded, friendly)
const balooDisplay = Baloo_Bhaijaan_2({
  subsets: ['arabic', 'latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

// خط النصوص — body text
const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body-ar',
  display: 'swap',
});

// خط الرياضيات (LTR) — math & code
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'خطوة — منصة تعليمية تفاعلية',
  description: 'منصة تعليم ذكية للطلاب العرب في إسرائيل — دروس ومساعد ذكاء اصطناعي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${balooDisplay.variable} ${tajawal.variable} ${jetbrains.variable} font-body antialiased`}
      >
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
