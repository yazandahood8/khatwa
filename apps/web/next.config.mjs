/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // السماح باستيراد الحزمة المشتركة من الـ monorepo
  transpilePackages: ['@khatwa/shared'],
};

export default nextConfig;
