/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'vercel.app'],
  },
  // تحسينات للنشر
  poweredByHeader: false,
  compress: true,
  // إعدادات خاصة بـ Vercel
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
  // إعدادات البيئة
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // إعادة كتابة المسارات للـ API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  // إعدادات الأمان
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
}

export default nextConfig
