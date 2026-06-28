import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

// خط عربي — Arabic font
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'خطوة — منصة تعليمية تفاعلية',
  description: 'منصة تعليم ذكية للطلاب العرب في إسرائيل — دروس ومساعد ذكاء اصطناعي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
